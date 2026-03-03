import { NextRequest, NextResponse } from 'next/server';
import * as Astronomy from 'astronomy-engine';
import { DateTime } from 'luxon';

// 定义计算行星位置的通用函数
const getPlanetPositions = (time: Astronomy.Time) => {
  const planets: Record<string, number> = {};
  const bodyNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'] as const;

  bodyNames.forEach(name => {
    const vector = Astronomy.GeoVector(Astronomy.Body[name], time, true);
    const ecl = Astronomy.Ecliptic(vector);
    planets[name] = parseFloat(((ecl.elon + 360) % 360).toFixed(4));
  });
  return planets;
};

// 计算上升点和中天的通用函数
const getAngles = (time: Astronomy.Time, lat: number, lng: number) => {
  const st = Astronomy.SiderealTime(time);
  const ramc = (st * 15 + lng + 360) % 360;
  const eps = 23.43929; 
  const r_eps = eps * Math.PI / 180;
  const r_ramc = ramc * Math.PI / 180;
  const r_lat = lat * Math.PI / 180;

  let mc = Math.atan2(Math.sin(r_ramc), Math.cos(r_ramc) * Math.cos(r_eps)) * 180 / Math.PI;
  mc = (mc + 360) % 360;

  const asc = Math.atan2(Math.cos(r_ramc), -(Math.sin(r_ramc) * Math.cos(r_eps) + Math.tan(r_lat) * Math.sin(r_eps))) * 180 / Math.PI;
  const ascFinal = (asc + 360) % 360;

  return { asc: ascFinal, mc };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type = 'natal', // natal (本命), transit (行运), secondary (次限), tertiary (三限)
      birth,         // { date, time, lat, lng, timezone }
      target         // { date, time, lat, lng, timezone } - 仅推运/行运需要
    } = body;

    // 1. 初始化本命时间
    const birthDt = DateTime.fromISO(`${birth.date}T${birth.time}`, { zone: birth.timezone || 'Asia/Shanghai' });
    const birthTime = Astronomy.MakeTime(birthDt.toJSDate());
    
    // 2. 准备返回结果
    let result: any = { type };

    // --- 核心计算逻辑 ---
    
    // A. 永远计算本命数据 (作为内盘)
    const natalPlanets = getPlanetPositions(birthTime);
    const natalAngles = getAngles(birthTime, parseFloat(birth.lat), parseFloat(birth.lng));
    
    result.inner = {
      planets: natalPlanets,
      cusps: Array.from({ length: 12 }, (_, i) => parseFloat(((natalAngles.asc + i * 30) % 360).toFixed(4))),
      ascendant: parseFloat(natalAngles.asc.toFixed(4)),
      mc: parseFloat(natalAngles.mc.toFixed(4))
    };

    // B. 如果不是纯本命盘，计算外盘数据
    if (type !== 'natal' && target) {
      const targetDt = DateTime.fromISO(`${target.date}T${target.time}`, { zone: target.timezone || 'Asia/Shanghai' });
      let calcTime: Astronomy.Time;

      const diffInDays = targetDt.diff(birthDt, 'days').days;

      if (type === 'transit') {
        // 行运：直接使用目标时间
        calcTime = Astronomy.MakeTime(targetDt.toJSDate());
      } else if (type === 'secondary') {
        // 次限：1天 = 1年 (365.2425天)
        const progressedDate = birthDt.plus({ days: diffInDays / 365.2425 });
        calcTime = Astronomy.MakeTime(progressedDate.toJSDate());
      } else if (type === 'tertiary') {
        // 三限：1天 = 1恒星月 (27.32158天)
        const progressedDate = birthDt.plus({ days: diffInDays / 27.32158 });
        calcTime = Astronomy.MakeTime(progressedDate.toJSDate());
      } else {
        calcTime = Astronomy.MakeTime(targetDt.toJSDate());
      }

      result.outer = {
        planets: getPlanetPositions(calcTime)
      };
    }

    return NextResponse.json({ status: "success", data: result });

  } catch (error: any) {
    console.error('Calculation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}