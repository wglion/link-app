import { NextRequest, NextResponse } from 'next/server';
import * as Astronomy from 'astronomy-engine';
import { DateTime } from 'luxon';

// 修复：移除显式的 Astronomy.Time 类型，让 TS 自动推断，避免构建报错
const getPlanetPositions = (time: any) => {
  const planets: Record<string, number> = {};
  const bodyNames = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'] as const;

  bodyNames.forEach(name => {
    // 使用库内置枚举访问
    const vector = Astronomy.GeoVector(Astronomy.Body[name], time, true);
    const ecl = Astronomy.Ecliptic(vector);
    planets[name] = parseFloat(((ecl.elon + 360) % 360).toFixed(4));
  });
  return planets;
};

// 修复：参数类型设为 any 以兼容生产环境编译
const getAngles = (time: any, lat: number, lng: number) => {
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
      type = 'natal', 
      birth,         
      target         
    } = body;

    if (!birth || !birth.date || !birth.time || !birth.lat || !birth.lng) {
      return NextResponse.json({ error: "Missing birth data" }, { status: 400 });
    }

    // 1. 本命时间初始化
    const birthDt = DateTime.fromISO(`${birth.date}T${birth.time}`, { zone: birth.timezone || 'Asia/Shanghai' });
    const birthTime = Astronomy.MakeTime(birthDt.toJSDate());
    
    let result: any = { type };

    // 2. 计算本命数据 (内盘)
    const natalPlanets = getPlanetPositions(birthTime);
    const natalAngles = getAngles(birthTime, parseFloat(birth.lat), parseFloat(birth.lng));
    
    result.inner = {
      planets: natalPlanets,
      cusps: Array.from({ length: 12 }, (_, i) => parseFloat(((natalAngles.asc + i * 30) % 360).toFixed(4))),
      ascendant: parseFloat(natalAngles.asc.toFixed(4)),
      mc: parseFloat(natalAngles.mc.toFixed(4))
    };

    // 3. 处理推运/行运逻辑
    if (type !== 'natal' && target) {
      const targetDt = DateTime.fromISO(`${target.date}T${target.time}`, { zone: target.timezone || 'Asia/Shanghai' });
      let calcTime;

      const diffInDays = targetDt.diff(birthDt, 'days').days;

      if (type === 'secondary') {
        // 次限盘计算：1天 = 1回归年
        const progressedDate = birthDt.plus({ days: diffInDays / 365.24219 });
        calcTime = Astronomy.MakeTime(progressedDate.toJSDate());
      } else if (type === 'tertiary') {
        // 三限盘计算：1天 = 1恒星月
        const progressedDate = birthDt.plus({ days: diffInDays / 27.32158 });
        calcTime = Astronomy.MakeTime(progressedDate.toJSDate());
      } else {
        // 行运盘计算：直接用目标时间
        calcTime = Astronomy.MakeTime(targetDt.toJSDate());
      }

      result.outer = {
        planets: getPlanetPositions(calcTime)
      };
    }

    return NextResponse.json({ status: "success", data: result });

  } catch (error: any) {
    console.error('Build-safe Calculation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}