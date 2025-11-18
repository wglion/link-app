import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const id = params.id;

    // 获取灵语详情
    const { data, error } = await supabase
      .from('lingyu_data')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: '灵语不存在'
        }, { status: 404 });
      }
      return NextResponse.json({
        success: false,
        error: '查询失败',
        details: error.message
      }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({
        success: false,
        error: '灵语不存在'
      }, { status: 404 });
    }

    // 增加浏览量
    await supabase
      .from('lingyu_data')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '服务器错误',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}