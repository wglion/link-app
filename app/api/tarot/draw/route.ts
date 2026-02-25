import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// 创建API客户端 - 支持Bearer Token认证
async function createApiClient(request: NextRequest) {
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

// POST: 抽取塔罗牌
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
    const { count = 1 } = body;

    // 验证参数
    if (!Number.isInteger(count) || count < 1 || count > 10) {
      return NextResponse.json(
        { error: '无效的抽取数量', valid_range: '1-10' },
        { status: 400 }
      );
    }

    // 查询所有塔罗牌
    const { data: cards, error } = await supabase
      .from('tarot_data')
      .select('*');

    if (error) {
      return NextResponse.json(
        { error: '获取塔罗牌数据失败', details: error.message },
        { status: 500 }
      );
    }

    if (!cards || cards.length === 0) {
      return NextResponse.json(
        { error: '没有找到塔罗牌数据' },
        { status: 404 }
      );
    }

    // 随机抽取指定数量的牌
    const drawnCards = [];
    const availableCards = [...cards];
    
    for (let i = 0; i < Math.min(count, availableCards.length); i++) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const card = availableCards.splice(randomIndex, 1)[0];
      
      // 随机决定正逆位
      const isReversed = Math.random() < 0.5;
      const meaning = isReversed ? card.meaning_rev : card.meaning_up;
      
      drawnCards.push({
        id: card.id,
        name: card.name,
        name_short: card.name_short,
        value: card.value,
        value_int: card.value_int,
        suit: card.suit,
        type: card.type,
        meaning: meaning,
        is_reversed: isReversed,
        description: card.desc
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        cards: drawnCards,
        total_drawn: drawnCards.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { error: '服务器错误', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}