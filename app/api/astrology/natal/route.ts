import { NextRequest, NextResponse } from 'next/server';
import * as Astronomy from 'astronomy-engine';
import { DateTime } from 'luxon';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, lat, lng, timezone = 'Asia/Shanghai' } = body;

    // 1. 时间初始化
    const dt = DateTime.fromISO(`${birthDate}T${birthTime}`, { zone: timezone });
    const time = Astronomy.MakeTime(dt.toJSDate()); 
    
    // 2. 统一计算逻辑：使用 GeoVector 计算所有星体的地心经度
    // 这是最稳健的方法，避开了 SunPosition/MoonPosition 等特定导出
    const planets: Record<string, number> = {};
    const bodyNames = [
      'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
    ] as const;

    bodyNames.forEach(name => {
      // 获取地心矢量 (GeoVector)
      // 参数 1: 星体枚举; 参数 2: 时间; 参数 3: 是否修正光行差 (true 为占星常用)
      const vector = Astronomy.GeoVector(Astronomy.Body[name], time, true);
      // 将矢量转换为黄道坐标 (Ecliptic)
      const ecl = Astronomy.Ecliptic(vector);
      // 确保度数在 0-360 之间
      planets[name] = parseFloat(((ecl.elon + 360) % 360).toFixed(4));
    });

    // 3. 计算宫位基础 (恒星时)
    const st = Astronomy.SiderealTime(time); 
    const lonNum = parseFloat(lng);
    const latNum = parseFloat(lat);
    const ramc = (st * 15 + lonNum + 360) % 360;

    // 4. 计算上升点 (Ascendant) 和 中天 (MC)
    const eps = 23.43929; 
    const r_eps = eps * Math.PI / 180;
    const r_ramc = ramc * Math.PI / 180;
    const r_lat = latNum * Math.PI / 180;

    // MC 几何计算
    let mc = Math.atan2(Math.sin(r_ramc), Math.cos(r_ramc) * Math.cos(r_eps)) * 180 / Math.PI;
    mc = (mc + 360) % 360;

    // ASC 几何计算
    const asc = Math.atan2(Math.cos(r_ramc), -(Math.sin(r_ramc) * Math.cos(r_eps) + Math.tan(r_lat) * Math.sin(r_eps))) * 180 / Math.PI;
    const ascFinal = (asc + 360) % 360;

    // 5. 组装数据并返回
    return NextResponse.json({
      planets, 
      cusps: Array.from({ length: 12 }, (_, i) => parseFloat(((ascFinal + i * 30) % 360).toFixed(4))),
      ascendant: parseFloat(ascFinal.toFixed(4)),
      mc: parseFloat(mc.toFixed(4)),
      status: "success"
    });

  } catch (error: any) {
    console.error('Final Solution Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}