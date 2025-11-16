import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// 纯API接口 - 只支持Bearer Token认证
async function createApiClient(request: NextRequest) {
  // 从Authorization头获取Bearer Token
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('缺少Bearer Token');
  }
  
  const token = authHeader.substring(7);
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  );
}

// GET: 获取今日能量数据
export async function GET(request: NextRequest) {
  try {
    const supabase = await createApiClient(request);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '未授权访问', details: 'Bearer Token无效或已过期' },
        { status: 401 }
      );
    }

    // 获取今日日期范围
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 查询今日能量数据
    const { data, error } = await supabase
      .from('energy_data')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: '获取数据失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
      today: today.toISOString().split('T')[0],
      user_id: user.id
    });

  } catch (error) {
    return NextResponse.json(
      { error: '服务器错误', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

// POST: 创建或更新今日能量数据
export async function POST(request: NextRequest) {
  try {
    const supabase = await createApiClient(request);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '未授权访问', details: 'Bearer Token无效或已过期' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { energy_value, energy_type, description } = body;

    if (!energy_value || !energy_type) {
      return NextResponse.json(
        { error: '缺少必填字段', required: ['energy_value', 'energy_type'] },
        { status: 400 }
      );
    }

    // 验证能量类型
    const validTypes = ['physical', 'mental', 'emotional'];
    if (!validTypes.includes(energy_type)) {
      return NextResponse.json(
        { error: '无效的能量类型', valid_types: validTypes },
        { status: 400 }
      );
    }

    // 检查今日是否已有该类型能量数据
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: existingData } = await supabase
      .from('energy_data')
      .select('id')
      .eq('user_id', user.id)
      .eq('energy_type', energy_type)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString())
      .single();

    let result;
    if (existingData) {
      // 更新现有数据
      const { data, error } = await supabase
        .from('energy_data')
        .update({
          energy_value,
          description: description || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id)
        .select()
        .single();

      result = { data, error, action: 'updated' };
    } else {
      // 创建新数据
      const { data, error } = await supabase
        .from('energy_data')
        .insert({
          user_id: user.id,
          energy_value,
          energy_type,
          description: description || null
        })
        .select()
        .single();

      result = { data, error, action: 'created' };
    }

    if (result.error) {
      return NextResponse.json(
        { error: '操作失败', details: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action: result.action,
      data: result.data,
      user_id: user.id
    });

  } catch (error) {
    return NextResponse.json(
      { error: '服务器错误', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}