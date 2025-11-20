import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/* 
GET  /api/products/ids?id=xxx        查单个产品详情
PUT  /api/products/ids?id=xxx        更新单个产品
*/
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: '缺少 id 参数' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('product_tracking')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: '产品不存在' }, { status: 404 });
    }

    // 浏览量 +1
    await supabase
      .from('product_tracking')
      .update({ verification_count: (data.verification_count || 0) + 1 })
      .eq('id', id);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, error: '服务器错误', details: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: '缺少 id 参数' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
      return NextResponse.json({ success: false, error: '未授权访问' }, { status: 401 });
    }

    const body = await request.json();
    const { product_name, product_model, batch_number, status, metadata } = body;

    const { data, error } = await supabase
      .from('product_tracking')
      .update({
        product_name,
        product_model,
        batch_number,
        status,
        metadata,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: '更新失败', details: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ success: false, error: '产品不存在' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data, message: '产品更新成功' });
  } catch (err) {
    return NextResponse.json({ success: false, error: '服务器错误', details: (err as Error).message }, { status: 500 });
  }
}