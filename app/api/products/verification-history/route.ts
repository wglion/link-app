import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/products/[id]/verification-history - 获取产品验证历史
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // 验证分页参数
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json({
        success: false,
        error: '无效的分页参数'
      }, { status: 400 });
    }

    // 计算偏移量
    const offset = (page - 1) * limit;

    // 查询验证历史
    const { data, error, count } = await supabase
      .from('product_verification_history')
      .select('*', { count: 'exact' })
      .eq('product_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({
        success: false,
        error: '查询验证历史失败',
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
