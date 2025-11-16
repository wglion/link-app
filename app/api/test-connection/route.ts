import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // 测试连接
    const { error } = await supabase
      .from('energy_data')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        error: '数据库连接失败',
        details: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase连接成功',
      database: {
        accessible: true,
        test_query_passed: true
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '服务器错误',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}