import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/products - 获取产品列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const chipId = searchParams.get('chip_id');
    const snCode = searchParams.get('sn_code');
    const batchNumber = searchParams.get('batch_number');
    const status = searchParams.get('status');

    // 验证分页参数
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json({
        success: false,
        error: '无效的分页参数'
      }, { status: 400 });
    }

    const supabase = await createClient();
    
    // 计算偏移量
    const offset = (page - 1) * limit;

    // 构建查询
    let query = supabase
      .from('product_tracking')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 添加筛选条件
    if (chipId) {
      query = query.eq('chip_id', chipId);
    }
    if (snCode) {
      query = query.eq('sn_code', snCode);
    }
    if (batchNumber) {
      query = query.eq('batch_number', batchNumber);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({
        success: false,
        error: '查询失败',
        details: error.message
      }, { status: 500 });
    }

    // 计算总页数
    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '服务器错误',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

// POST /api/products - 创建新产品
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 验证用户身份
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: '未授权访问'
      }, { status: 401 });
    }

    const body = await request.json();
    const {
      chip_id,
      sn_code,
      qr_code,
      product_name,
      product_model,
      batch_number,
      manufacture_date,
      factory_location,
      production_line,
      anti_fake_code,
      metadata
    } = body;

    // 验证必填字段
    if (!chip_id || !sn_code) {
      return NextResponse.json({
        success: false,
        error: '芯片ID和SN码为必填字段'
      }, { status: 400 });
    }

    // 验证芯片ID和SN码的唯一性
    const { data: existingProduct } = await supabase
      .from('product_tracking')
      .select('id')
      .or(`chip_id.eq.${chip_id},sn_code.eq.${sn_code}`)
      .single();

    if (existingProduct) {
      return NextResponse.json({
        success: false,
        error: '芯片ID或SN码已存在'
      }, { status: 409 });
    }

    // 生成防伪码（如果不提供）
    const finalAntiFakeCode = anti_fake_code || generateAntiFakeCode();

    // 创建产品记录
    const { data, error } = await supabase
      .from('product_tracking')
      .insert({
        chip_id,
        sn_code,
        qr_code,
        product_name,
        product_model,
        batch_number,
        manufacture_date,
        factory_location,
        production_line,
        operator_id: user.id,
        anti_fake_code: finalAntiFakeCode,
        metadata,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: '创建产品失败',
        details: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data,
      message: '产品创建成功'
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '服务器错误',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

// 生成防伪码函数
function generateAntiFakeCode(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 8);
  return `AF${timestamp}${random}`.toUpperCase();
}