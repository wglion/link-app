import { Lunar, Solar } from 'lunar-typescript';
import { NextRequest, NextResponse } from 'next/server';

// 八字计算接口
export async function POST(request: NextRequest) {
  try {
    const { birthDate, birthTime, gender } = await request.json();
    
    if (!birthDate || !birthTime) {
      return NextResponse.json(
        { error: '请提供出生日期和出生时间' },
        { status: 400 }
      );
    }

    // 解析日期和时间
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);
    
    // 创建阳历对象
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
    
    // 转换为阴历
    const lunar = solar.getLunar();
    
    // 获取八字
    const yearGanZhi = lunar.getYearInGanZhi();
    const monthGanZhi = lunar.getMonthInGanZhi();
    const dayGanZhi = lunar.getDayInGanZhi();
    const timeGanZhi = lunar.getTimeInGanZhi();
    
    // // 获取五行
    // const yearWuXing = lunar.getYearWuXing();
    // const monthWuXing = lunar.getMonthWuXing();
    // const dayWuXing = lunar.getDayWuXing();
    // const timeWuXing = lunar.getTimeWuXing();
    
    // 获取生肖
    const yearShengXiao = lunar.getYearShengXiao();
    
    // 获取星座
    const xingZuo = solar.getXingZuo();
    
    return NextResponse.json({
      success: true,
      data: {
        // 基本信息
        solar: {
          year: solar.getYear(),
          month: solar.getMonth(),
          day: solar.getDay(),
          hour: solar.getHour(),
          minute: solar.getMinute()
        },
        lunar: {
          year: lunar.getYear(),
          month: lunar.getMonth(),
          day: lunar.getDay(),
          hour: lunar.getHour(),
          minute: lunar.getMinute()
        },
        // 八字
        bazi: {
          year: yearGanZhi,
          month: monthGanZhi,
          day: dayGanZhi,
          time: timeGanZhi,
          complete: `${yearGanZhi} ${monthGanZhi} ${dayGanZhi} ${timeGanZhi}`
        },
        // 五行
        // wuxing: {
        //   year: yearWuXing,
        //   month: monthWuXing,
        //   day: dayWuXing,
        //   time: timeWuXing
        // },
        // 生肖和星座
        shengxiao: yearShengXiao,
        xingzuo: xingZuo,
        // 纳音
        nayin: {
          year: lunar.getYearNaYin(),
          month: lunar.getMonthNaYin(),
          day: lunar.getDayNaYin(),
          time: lunar.getTimeNaYin()
        },
        // 节气
        jieqi: {
          prev: lunar.getPrevJieQi(),
          next: lunar.getNextJieQi()
        }
      }
    });
    
  } catch (error) {
    console.error('八字计算错误:', error);
    return NextResponse.json(
      { error: '八字计算失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

// GET: 获取当前时间的八字（用于测试）
export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const solar = Solar.fromDate(now);
    const lunar = solar.getLunar();
    
    return NextResponse.json({
      success: true,
      data: {
        currentTime: now.toISOString(),
        bazi: {
          year: lunar.getYearInGanZhi(),
          month: lunar.getMonthInGanZhi(),
          day: lunar.getDayInGanZhi(),
          time: lunar.getTimeInGanZhi()
        }
      }
    });
    
  } catch (error) {
    console.error('获取当前八字错误:', error);
    return NextResponse.json(
      { error: '获取当前八字失败' },
      { status: 500 }
    );
  }
}