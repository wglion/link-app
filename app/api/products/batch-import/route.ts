import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST /api/products/batch-import - 批量导入产品
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
    const { products } = body;

    // 验证数据格式
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({
        success: false,
        error: '请提供有效的产品数据数组'
      }, { status: 400 });
    }

    if (products.length > 1000) {
      return NextResponse.json({
        success: false,
        error: '单次导入数量不能超过1000条'
      }, { status: 400 });
    }

    // 验证必填字段
    const invalidProducts = products.filter(p => !p.chip_id || !p.sn_code);
    if (invalidProducts.length > 0) {
      return NextResponse.json({
        success: false,
        error: `发现${invalidProducts.length}条数据缺少芯片ID或SN码`
      }, { status: 400 });
    }

    // 检查重复数据
    const chipIds = products.map(p => p.chip_id);
    const snCodes = products.map(p => p.sn_code);
    
    const { data: existingProducts } = await supabase
      .from('product_tracking')
      .select('chip_id, sn_code')
      .or(`chip_id.in.(${chipIds.join(',')}),sn_code.in.(${snCodes.join(',')})`);

    if (existingProducts && existingProducts.length > 0) {
      const existingChipIds = existingProducts.map(p => p.chip_id);
      const existingSnCodes = existingProducts.map(p => p.sn_code);
      
      return NextResponse.json({
        success: false,
        error: '发现重复数据',
        details: {
          duplicate_chip_ids: existingChipIds,
          duplicate_sn_codes: existingSnCodes
        }
      }, { status: 409 });
    }

    // 批量插入数据
    const productsToInsert = products.map(product => ({
      ...product,
      operator_id: user.id,
      anti_fake_code: product.anti_fake_code || generateAntiFakeCode(),
      status: product.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('product_tracking')
      .insert(productsToInsert)
      .select();

    if (error) {
      return NextResponse.json({
        success: false,
        error: '批量导入失败',
        details: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        imported_count: data.length,
        products: data
      },
      message: `成功导入${data.length}条产品数据`
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
