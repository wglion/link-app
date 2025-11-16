import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { 
          error: '缺少必填字段', 
          required: ['email', 'password']
        },
        { status: 400 }
      );
    }

    // 使用Supabase进行登录
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { 
          error: '登录失败', 
          details: error.message
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        user: data.user,
        session: data.session
      }
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: '服务器错误', 
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}