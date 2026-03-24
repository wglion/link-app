import {
  STEM_WUXING,
  BRANCH_WUXING,
  HIDDEN_STEMS,
  BRANCH_CONFLICTS,
  BRANCH_COMBINES,
  STAGE_MAP,
  TIANYI_GUIREN,
  KONGWANG_MAP,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES
} from './constants';

// 判断天干阴阳
function isYangStem(stem: string): boolean {
  return ['甲', '丙', '戊', '庚', '壬'].includes(stem);
}

// 五行生克关系
function getWuxingRelation(from: string, to: string): string {
  const relations: Record<string, Record<string, string>> = {
    '木': { '木': '同', '火': '生', '土': '克', '金': '被克', '水': '被生' },
    '火': { '火': '同', '土': '生', '金': '克', '水': '被克', '木': '被生' },
    '土': { '土': '同', '金': '生', '水': '克', '木': '被克', '火': '被生' },
    '金': { '金': '同', '水': '生', '木': '克', '火': '被克', '土': '被生' },
    '水': { '水': '同', '木': '生', '火': '克', '土': '被克', '金': '被生' }
  };
  return relations[from]?.[to] || '同';
}

// 计算十神
export function calculateShiShen(dayMaster: string, target: string): string {
  const dayWuxing = STEM_WUXING[dayMaster];
  const targetWuxing = STEM_WUXING[target];

  if (!dayWuxing || !targetWuxing) return '';

  const relation = getWuxingRelation(dayWuxing, targetWuxing);
  const yinyang = isYangStem(dayMaster) === isYangStem(target) ? '阳' : '阴';

  const shiShenMap: Record<string, Record<string, string>> = {
    '同': { '阳': '比肩', '阴': '劫财' },
    '生': { '阳': '食神', '阴': '伤官' },
    '克': { '阳': '偏财', '阴': '正财' },
    '被克': { '阳': '七杀', '阴': '正官' },
    '被生': { '阳': '偏印', '阴': '正印' }
  };

  return shiShenMap[relation]?.[yinyang] || '';
}

// 获取藏干
export function getHiddenStems(branch: string): string[] {
  const stems = HIDDEN_STEMS[branch] || [];
  return stems.map(stem => `${stem}·${STEM_WUXING[stem]}`);
}

// 计算空亡
export function calculateKongWang(dayPillar: string): string {
  const stem = dayPillar[0] as any;
  const branch = dayPillar[1] as any;

  const stemIndex = HEAVENLY_STEMS.indexOf(stem);
  const branchIndex = EARTHLY_BRANCHES.indexOf(branch);

  if (stemIndex === -1 || branchIndex === -1) return '';

  const xunStart = stemIndex - (branchIndex % 10);
  const xunKey = `${HEAVENLY_STEMS[(xunStart + 10) % 10]}${EARTHLY_BRANCHES[branchIndex % 12]}`;

  return KONGWANG_MAP[xunKey] || '';
}

// 计算十二长生
export function calculateShiErChangSheng(dayMaster: string, branch: string): string {
  return STAGE_MAP[dayMaster]?.[branch] || '';
}

// 计算神煞
export function calculateShenSha(yearStem: string, dayStem: string, branches: string[]): string[] {
  const shensha: string[] = [];

  const tianyiList = TIANYI_GUIREN[dayStem] || [];
  branches.forEach(branch => {
    if (tianyiList.includes(branch)) {
      shensha.push('天乙贵人');
    }
  });

  return [...new Set(shensha)];
}

// 分析地支关系
export function analyzeBranchRelations(branches: string[]): string {
  const relations: string[] = [];

  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const b1 = branches[i];
      const b2 = branches[j];

      if (BRANCH_CONFLICTS[b1] === b2) {
        relations.push(`${b1}${b2}相冲`);
      }
      if (BRANCH_COMBINES[b1] === b2) {
        relations.push(`${b1}${b2}相合`);
      }
    }
  }

  return relations.join('，') || '无特殊关系';
}

// 分析五行状态
export function analyzeWuxingState(bazi: { year: string; month: string; day: string; time: string }): Array<{ label: string; element: string }> {
  const wuxingCount: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

  [bazi.year, bazi.month, bazi.day, bazi.time].forEach(pillar => {
    const stem = pillar[0];
    const branch = pillar[1];
    wuxingCount[STEM_WUXING[stem]]++;
    wuxingCount[BRANCH_WUXING[branch]]++;
  });

  const sorted = Object.entries(wuxingCount).sort((a, b) => b[1] - a[1]);
  const states = ['旺', '相', '休', '囚', '死'];

  return sorted.slice(0, 2).map((entry, index) => ({
    label: `${entry[0]}${states[index]}`,
    element: entry[0]
  }));
}
