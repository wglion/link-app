import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // 获取所有分类
    const { data, error } = await supabase
      .from('lingyu_data')
      .select('category')
      .not('category', 'is', null)
      .order('category', { ascending: true });

    if (error) {
      return NextResponse.json({
        success: false,
        error: '查询失败',
        details: error.message
      }, { status: 500 });
    }

    // 统计每个分类的数量
    const categoryCount: { [key: string]: number } = {};
    data?.forEach(item => {
      if (item.category) {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      }
    });

    // 转换为数组格式
    const categories = Object.entries(categoryCount).map(([name, count]) => ({
      name,
      count
    }));

    return NextResponse.json({
      success: true,
      data: categories
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '服务器错误',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}