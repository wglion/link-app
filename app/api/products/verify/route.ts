import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST /api/products/verify - 验证产品真伪
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    const body = await request.json();
    const { 
      chip_id, 
      sn_code, 
      anti_fake_code,
      verification_method = 'api',
      location,
      device_info,
      notes
    } = body;

    // 验证必填字段（至少提供一个）
    if (!chip_id && !sn_code && !anti_fake_code) {
      return NextResponse.json({
        success: false,
        error: '请提供芯片ID、SN码或防伪码中的至少一个'
      }, { status: 400 });
    }

    // 构建查询条件
    let query = supabase.from('product_tracking').select('*');
    
    if (chip_id) {
      query = query.eq('chip_id', chip_id);
    } else if (sn_code) {
      query = query.eq('sn_code', sn_code);
    } else if (anti_fake_code) {
      query = query.eq('anti_fake_code', anti_fake_code);
    }

    const { data: product, error } = await query.single();

    if (error || !product) {
      // 记录验证失败历史
      await supabase.from('product_verification_history').insert({
        verification_method,
        location,
        device_info,
        verification_result: false,
        notes: `验证失败: ${notes || '产品不存在'}`
      });

      return NextResponse.json({
        success: false,
        error: '产品不存在或验证信息错误',
        verified: false
      }, { status: 404 });
    }

    // 检查产品状态
    if (product.status !== 'active') {
      await supabase.from('product_verification_history').insert({
        product_id: product.id,
        verification_method,
        location,
        device_info,
        verification_result: false,
        notes: `验证失败: 产品状态为${product.status}`
      });

      return NextResponse.json({
        success: false,
        error: `产品状态异常: ${product.status}`,
        verified: false,
        status: product.status
      }, { status: 400 });
    }

    // 更新验证次数和最后验证时间
    const { data: updatedProduct, error: updateError } = await supabase
      .from('product_tracking')
      .update({
        verification_count: (product.verification_count || 0) + 1,
        last_verified_at: new Date().toISOString()
      })
      .eq('id', product.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({
        success: false,
        error: '更新验证信息失败',
        details: updateError.message
      }, { status: 500 });
    }

    // 记录验证成功历史
    await supabase.from('product_verification_history').insert({
      product_id: product.id,
      verification_method,
      location,
      device_info: device_info || {},
      verification_result: true,
      notes: notes || '验证成功'
    });

    return NextResponse.json({
      success: true,
      verified: true,
      data: {
        id: updatedProduct.id,
        chip_id: updatedProduct.chip_id,
        sn_code: updatedProduct.sn_code,
        product_name: updatedProduct.product_name,
        product_model: updatedProduct.product_model,
        batch_number: updatedProduct.batch_number,
        manufacture_date: updatedProduct.manufacture_date,
        factory_location: updatedProduct.factory_location,
        anti_fake_code: updatedProduct.anti_fake_code,
        verification_count: updatedProduct.verification_count,
        last_verified_at: updatedProduct.last_verified_at,
        status: updatedProduct.status
      },
      message: '产品验证成功'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '服务器错误',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
