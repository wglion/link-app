import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const body = await request.json();
    const { email, password, username } = body;

    if (!email || !password) {
      return NextResponse.json(
        { 
          error: '缺少必填字段', 
          required: ['email', 'password']
        },
        { status: 400 }
      );
    }

    // 使用Supabase进行注册
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0]
        }
      }
    });

    if (error) {
      return NextResponse.json(
        { 
          error: '注册失败', 
          details: error.message
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '注册成功',
      data: {
        user: data.user
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