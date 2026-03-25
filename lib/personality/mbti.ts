export type MbtiAxis = "EI" | "SN" | "TF" | "JP";

export type MbtiQuestion = {
  id: number;
  axis: MbtiAxis;
  stageKey: "energy" | "perception" | "decision" | "rhythm";
  prompt: string;
  hint: string;
  leftLabel: string;
  rightLabel: string;
};

export type MbtiResult = {
  type: string;
  nickname: string;
  subtitle: string;
  summary: string;
  testedAt: string;
  percentages: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  scores: {
    EI: number;
    SN: number;
    TF: number;
    JP: number;
  };
};

export type MbtiDimensionCard = {
  axis: MbtiAxis;
  title: string;
  leftCode: string;
  rightCode: string;
  leftTitle: string;
  rightTitle: string;
  leftPercent: number;
  rightPercent: number;
  dominantCode: string;
  summary: string;
};

export type MbtiPortraitBlock = {
  title: string;
  body: string;
};

export type MbtiVisualAxis = {
  key: MbtiAxis;
  leftCode: string;
  rightCode: string;
  leftLabel: string;
  rightLabel: string;
  dominantCode: string;
  dominantPercent: number;
  leftPercent: number;
  rightPercent: number;
  insight: string;
};

export type MbtiRealityTabKey = "career" | "intimacy" | "social";

export type MbtiRealityTab = {
  key: MbtiRealityTabKey;
  title: string;
  summary: string;
  bullets: Array<{
    title: string;
    text: string;
  }>;
};

export type MbtiQuadrantItem = {
  key: string;
  label: string;
  description: string;
  position:
    | "topLeft"
    | "topRight"
    | "rightTop"
    | "rightBottom"
    | "bottomRight"
    | "bottomLeft"
    | "leftBottom"
    | "leftTop";
};

export type MbtiFriendMapItem = {
  title: string;
  type: string;
  note: string;
};

export type MbtiMatchHint = {
  title: string;
  type: string;
  detail: string;
};

export type MbtiVisualModel = {
  type: string;
  title: string;
  codename: string;
  keywords: string[];
  heroSummary: string;
  conclusion: string;
  sigil: string;
  animalLabel: string;
  axes: MbtiVisualAxis[];
  realityTabs: MbtiRealityTab[];
  quadrants: MbtiQuadrantItem[];
  mirrorLine: string;
  mirrorPrompt: string;
  friendMap: MbtiFriendMapItem[];
  matches: MbtiMatchHint[];
  shareText: string;
};

type MbtiTypeProfile = {
  title: string;
  codename: string;
  keywords: string[];
  heroSummary: string;
  conclusion: string;
  sigil: string;
  animalLabel: string;
  realityTabs: MbtiRealityTab[];
  quadrants: MbtiQuadrantItem[];
  mirrorLine: string;
  mirrorPrompt: string;
  friendMap: MbtiFriendMapItem[];
  matches: MbtiMatchHint[];
};

const TYPE_LABELS: Record<string, { nickname: string; subtitle: string }> = {
  INTJ: { nickname: "建筑师", subtitle: "战略视角、独立判断、长期框架" },
  INTP: { nickname: "逻辑学家", subtitle: "原理探索、概念拆解、开放思考" },
  ENTJ: { nickname: "指挥官", subtitle: "目标驱动、结构推进、掌控全局" },
  ENTP: { nickname: "辩论家", subtitle: "点子丰富、快速联想、挑战常规" },
  INFJ: { nickname: "倡导者", subtitle: "洞察人心、价值导向、安静影响力" },
  INFP: { nickname: "调停者", subtitle: "理想感、真实感、情绪与意义并行" },
  ENFJ: { nickname: "主人公", subtitle: "情感连接、组织带动、关系感知" },
  ENFP: { nickname: "竞选者", subtitle: "热情表达、可能性驱动、创造连接" },
  ISTJ: { nickname: "物流师", subtitle: "秩序感、责任心、稳定执行" },
  ISFJ: { nickname: "守卫者", subtitle: "照顾细节、体贴稳定、低调可靠" },
  ESTJ: { nickname: "总经理", subtitle: "现实推进、规则意识、执行效率" },
  ESFJ: { nickname: "执政官", subtitle: "关系组织、照顾他人、外向协调" },
  ISTP: { nickname: "鉴赏家", subtitle: "冷静观察、动手拆解、即时应对" },
  ISFP: { nickname: "探险家", subtitle: "感受真实、柔和表达、审美直觉" },
  ESTP: { nickname: "企业家", subtitle: "行动敏捷、临场应变、现实反馈" },
  ESFP: { nickname: "表演者", subtitle: "情境感强、热情外放、体验优先" },
};

const AXIS_META = {
  EI: { title: "表达与能量", leftCode: "E", rightCode: "I", leftTitle: "外向", rightTitle: "内向" },
  SN: { title: "感知与信息", leftCode: "S", rightCode: "N", leftTitle: "实感", rightTitle: "直觉" },
  TF: { title: "判断与决策", leftCode: "T", rightCode: "F", leftTitle: "思维", rightTitle: "情感" },
  JP: { title: "行动与节奏", leftCode: "J", rightCode: "P", leftTitle: "判断", rightTitle: "感知" },
} as const;

export const MBTI_STAGES = [
  { key: "energy", title: "表达方式", subtitle: "识别你如何进入关系与输出能量" },
  { key: "perception", title: "感知方式", subtitle: "识别你如何接收信息与理解世界" },
  { key: "decision", title: "决策方式", subtitle: "识别你如何做判断与处理分歧" },
  { key: "rhythm", title: "行动节奏", subtitle: "识别你如何安排结构、推进与收束" },
] as const;

export const MBTI_QUESTIONS: MbtiQuestion[] = [
  { id: 1, axis: "EI", stageKey: "energy", prompt: "在新的社交场合里，我通常更像是……", hint: "选择更接近长期状态的一边。", leftLabel: "主动打开话题", rightLabel: "先观察氛围再进入" },
  { id: 2, axis: "EI", stageKey: "energy", prompt: "当一天结束后，我更容易通过什么恢复状态？", hint: "想想你真正恢复能量的方式。", leftLabel: "和人聊聊会更快复活", rightLabel: "独处一会儿才会回神" },
  { id: 3, axis: "EI", stageKey: "energy", prompt: "当我有想法时，我更常见的状态是……", hint: "这题看的是思考和表达的顺序。", leftLabel: "边说边想清楚", rightLabel: "先想明白再表达" },
  { id: 4, axis: "EI", stageKey: "energy", prompt: "在团队中，我更容易扮演的角色是……", hint: "只看自然倾向，不看能力强弱。", leftLabel: "参与者或带动者", rightLabel: "观察者或深思者" },
  { id: 5, axis: "EI", stageKey: "energy", prompt: "面对陌生关系时，我通常会……", hint: "按第一反应回答。", leftLabel: "先建立连接", rightLabel: "先保留边界" },
  { id: 6, axis: "EI", stageKey: "energy", prompt: "当我兴奋或有灵感时，我更想……", hint: "这会反映你的能量外放程度。", leftLabel: "立刻和别人分享", rightLabel: "先自己消化沉淀" },

  { id: 7, axis: "SN", stageKey: "perception", prompt: "面对一个新任务时，我更先关注……", hint: "想想你更习惯先抓哪层信息。", leftLabel: "现实条件与可执行细节", rightLabel: "潜在方向与整体可能" },
  { id: 8, axis: "SN", stageKey: "perception", prompt: "别人描述事情时，我更容易记住……", hint: "这不是记忆力测试，而是注意力偏好。", leftLabel: "具体事实与过程", rightLabel: "核心意义与趋势" },
  { id: 9, axis: "SN", stageKey: "perception", prompt: "我通常更信任哪种信息？", hint: "想想你做判断时更依赖什么。", leftLabel: "亲眼看到和验证过的东西", rightLabel: "直觉线索和潜在关联" },
  { id: 10, axis: "SN", stageKey: "perception", prompt: "在理解一个人时，我更容易从哪里切入？", hint: "这题看的是你理解他人的方式。", leftLabel: "对方做了什么、说了什么", rightLabel: "对方背后的动机和模式" },
  { id: 11, axis: "SN", stageKey: "perception", prompt: "当我学习新内容时，我更偏好……", hint: "选更高频、更自然的习惯。", leftLabel: "有例子、有步骤、能落地", rightLabel: "有框架、有概念、能发散" },
  { id: 12, axis: "SN", stageKey: "perception", prompt: "我更常被哪类话题吸引？", hint: "不考虑职业，只看自然兴趣。", leftLabel: "具体经验和现实应用", rightLabel: "未来想象和抽象问题" },

  { id: 13, axis: "TF", stageKey: "decision", prompt: "当我要做决定时，我更先看……", hint: "不是绝对二选一，而是优先顺序。", leftLabel: "逻辑是否成立", rightLabel: "人是否能够承受" },
  { id: 14, axis: "TF", stageKey: "decision", prompt: "面对分歧时，我更自然的处理方式是……", hint: "想想你在真实冲突里的默认动作。", leftLabel: "指出问题、对齐标准", rightLabel: "照顾关系、缓和感受" },
  { id: 15, axis: "TF", stageKey: "decision", prompt: "别人向我求建议时，我通常会……", hint: "选你第一时间会做的事。", leftLabel: "帮助分析更合理的方案", rightLabel: "先接住情绪和处境" },
  { id: 16, axis: "TF", stageKey: "decision", prompt: "我更看重他人的哪一面？", hint: "这是你判断他人的偏好标准。", leftLabel: "能力、原则、判断力", rightLabel: "真诚、善意、体贴度" },
  { id: 17, axis: "TF", stageKey: "decision", prompt: "当我不同意一件事时，我更常会……", hint: "选更接近你的惯性。", leftLabel: "直接指出不合理的地方", rightLabel: "先考虑怎么说才不伤人" },
  { id: 18, axis: "TF", stageKey: "decision", prompt: "在重要合作里，我更依赖……", hint: "只看优先顺序。", leftLabel: "明确规则与职责", rightLabel: "彼此默契与信任" },

  { id: 19, axis: "JP", stageKey: "rhythm", prompt: "安排一周节奏时，我更喜欢……", hint: "这题看你和结构的关系。", leftLabel: "提前排好重点和顺序", rightLabel: "保留弹性，边走边看" },
  { id: 20, axis: "JP", stageKey: "rhythm", prompt: "面对变化时，我的第一反应更像……", hint: "按更真实的惯性回答。", leftLabel: "先稳住计划和边界", rightLabel: "先适应，再重新安排" },
  { id: 21, axis: "JP", stageKey: "rhythm", prompt: "做项目时，我更舒服的状态是……", hint: "选长期更舒服的方式。", leftLabel: "节点明确、逐步推进", rightLabel: "方向明确、过程灵活" },
  { id: 22, axis: "JP", stageKey: "rhythm", prompt: "对于待办事项，我更容易……", hint: "看你的默认工作节奏。", leftLabel: "想尽快收尾完成", rightLabel: "先留空间继续调整" },
  { id: 23, axis: "JP", stageKey: "rhythm", prompt: "如果事情还没定下来，我通常会……", hint: "选最自然的心理反应。", leftLabel: "想尽快做个决定", rightLabel: "想再看看还有什么可能" },
  { id: 24, axis: "JP", stageKey: "rhythm", prompt: "相比结果与过程，我更重视……", hint: "这题帮助判断你的收束方式。", leftLabel: "明确完成和收口", rightLabel: "探索过程和自由度" },
];

const BASE_QUADRANTS: MbtiQuadrantItem[] = [
  { key: "repel-attract", label: "相斥相吸", description: "你会被和自己节奏不同的人吸引，也会先观察这段关系值不值得靠近。", position: "topLeft" },
  { key: "light", label: "彼此的光", description: "真正适合你的关系，往往能看见你的节奏，也能让你做回自己。", position: "topRight" },
  { key: "friend-foe", label: "亦敌亦友", description: "最会挑战你的人，通常也最容易逼你长出新的边界和表达。", position: "rightTop" },
  { key: "soul-clash", label: "灵魂碰撞", description: "强烈、鲜明、带着推力的人，会让你又想靠近又想后退。", position: "rightBottom" },
  { key: "muse", label: "天赋缪斯", description: "真正点亮你的人，常常既理解你的敏感，也能把你往前推。", position: "bottomRight" },
  { key: "common-new", label: "常见常新", description: "越熟的人，越容易被你看见新的层次和新的关系面向。", position: "bottomLeft" },
  { key: "mind-mate", label: "精神拍档", description: "能听懂你潜台词、又不会逼你立刻表态的人，最容易和你走远。", position: "leftBottom" },
  { key: "fellow", label: "同路旅人", description: "价值观稳定、方向一致的人，最容易和你形成长期关系。", position: "leftTop" },
];

const FALLBACK_RESULT: MbtiResult = {
  type: "INFP",
  nickname: "调停者",
  subtitle: "理想感、真实感、情绪与意义并行",
  summary: "你更容易从内在价值和真实感受出发，在关系与表达之间寻找平衡。",
  testedAt: new Date().toISOString(),
  percentages: { E: 24, I: 76, S: 36, N: 64, T: 41, F: 59, J: 30, P: 70 },
  scores: { EI: 3, SN: -2, TF: -1, JP: -3 },
};

const INFP_PROFILE: MbtiTypeProfile = {
  title: "调停者",
  codename: "能量漫游者",
  keywords: ["理想", "真实", "共情"],
  heroSummary: "理想感、真实感、情绪洞察并行的内在旅人。",
  conclusion: "你不是慢，只是会先确认一切是否真的值得投入。",
  sigil: "鹤",
  animalLabel: "鹤系图腾",
  realityTabs: [
    {
      key: "career",
      title: "职业发展",
      summary: "你适合有意义感，也有表达空间的工作。",
      bullets: [
        { title: "你的工作优势", text: "能看见情绪脉络，也能为一个想法守住最真实的内核。" },
        { title: "适合的协作方式", text: "先有信任和方向，再进入深度共创，你会越来越稳定。" },
        { title: "容易内耗的点", text: "价值不认同、节奏太硬、表达太冷，会快速消耗你。" },
        { title: "成长建议", text: "别只守住理想，也要把理想拆成能落地的小动作。" },
      ],
    },
    {
      key: "intimacy",
      title: "亲密关系",
      summary: "慢热，但投入以后很深。",
      bullets: [
        { title: "情感表达方式", text: "不一定高频表达，但会用细节和持续陪伴说明在乎。" },
        { title: "安全感需求", text: "需要被尊重节奏，也需要真诚和稳定感。" },
        { title: "容易被误解的地方", text: "你以为自己在克制，别人可能只感受到你在后退。" },
        { title: "更适合的相处节奏", text: "给彼此空间，也给彼此回应，关系会更长久。" },
      ],
    },
    {
      key: "social",
      title: "人际交往",
      summary: "外表安静，内里其实很会感受人。",
      bullets: [
        { title: "你在人群中的状态", text: "先看氛围，再决定自己要不要真正打开。" },
        { title: "建立信任的方式", text: "不是热闹，而是真诚、稳定和被理解的感觉。" },
        { title: "你容易吸引什么样的人", text: "容易吸引想靠近温柔、也想探索你深度的人。" },
        { title: "你在人际中要注意什么", text: "别总等别人猜到你，适时说出来会轻松很多。" },
      ],
    },
  ],
  quadrants: [
    { ...BASE_QUADRANTS[0], description: "你会被热烈直接的人吸引，但也会先确认对方会不会压过你的节奏。" },
    { ...BASE_QUADRANTS[1], description: "能理解你的安静，又不催你表态的人，最容易成为彼此的光。" },
    { ...BASE_QUADRANTS[2], description: "那些会直接指出问题的人，最初刺痛你，后来却可能帮你长大。" },
    { ...BASE_QUADRANTS[3], description: "行动力很强的人，会逼你重新校准边界、亲密和投入感。" },
    { ...BASE_QUADRANTS[4], description: "真正点亮你的人，往往既柔软又清醒，既共情也会拉你落地。" },
    { ...BASE_QUADRANTS[5], description: "你会在熟人身上不断发现新的层次，因为你一直在感受细微变化。" },
    { ...BASE_QUADRANTS[6], description: "能听懂你的沉默、也懂得给空间的人，就是你的精神拍档。" },
    { ...BASE_QUADRANTS[7], description: "价值观稳定的人，最容易陪你从想象走向长久的现实。" },
  ],
  mirrorLine: "你以为自己只是克制，别人有时会觉得你不容易靠近。",
  mirrorPrompt: "发给几个朋友做轻问题，回收一份你的外在人格镜像。",
  friendMap: [
    { title: "最近互动人格", type: "ENFP", note: "总能把你从脑内世界轻轻拉出来。" },
    { title: "最默契人格", type: "INFJ", note: "不需要说很满，也能读懂彼此重点。" },
    { title: "最有张力人格", type: "ENTJ", note: "会被推着成长，也会被推着表达。" },
    { title: "朋友分布高频", type: "ISFP", note: "温柔、细腻、有审美的人很容易靠近你。" },
  ],
  matches: [
    { title: "精神拍档", type: "INFJ", detail: "你们都重视深度和意义，沟通不吵但很深。" },
    { title: "灵魂碰撞", type: "ENTP", detail: "对方会带来新鲜刺激，也会逼你离开舒适区。" },
    { title: "容易误解", type: "ESTJ", detail: "你想保留感受，对方更想尽快推进结果。" },
  ],
};

const INTJ_PROFILE: MbtiTypeProfile = {
  title: "建筑师",
  codename: "秩序观测者",
  keywords: ["冷静", "结构", "远见"],
  heroSummary: "先看结构，再决定是否投入的清醒规划者。",
  conclusion: "你不是冷，只是习惯先确认逻辑、边界和方向。",
  sigil: "鹰",
  animalLabel: "鹰系图腾",
  realityTabs: [
    {
      key: "career",
      title: "职业发展",
      summary: "你适合有判断权、节奏清晰的事情。",
      bullets: [
        { title: "你的工作优势", text: "能从混乱里看出结构，也能把长期路径提前搭好。" },
        { title: "适合的协作方式", text: "目标明确、分工清晰、彼此专业，会让你发挥最好。" },
        { title: "容易内耗的点", text: "重复解释、低效沟通和无边界合作会迅速耗掉耐心。" },
        { title: "成长建议", text: "别等到完全确定再动，先走一步也能帮你收集真实反馈。" },
      ],
    },
    {
      key: "intimacy",
      title: "亲密关系",
      summary: "不轻易靠近，但一旦认定就很稳定。",
      bullets: [
        { title: "情感表达方式", text: "你更常用行动、承担和一致性表达在乎。" },
        { title: "安全感需求", text: "需要理性沟通、边界清晰，也需要被尊重独处空间。" },
        { title: "容易被误解的地方", text: "你觉得自己在认真，别人可能先感受到的是距离。" },
        { title: "更适合的相处节奏", text: "给彼此自主空间，再给稳定回应，关系最舒服。" },
      ],
    },
    {
      key: "social",
      title: "人际交往",
      summary: "外在克制，内里有一套很稳定的判断系统。",
      bullets: [
        { title: "你在人群中的状态", text: "会先判断场面值不值得投入，再决定要不要发声。" },
        { title: "建立信任的方式", text: "可靠、专业、少废话，比热情更能打动你。" },
        { title: "你容易吸引什么样的人", text: "容易吸引欣赏你判断力、也想被你带节奏的人。" },
        { title: "你在人际中要注意什么", text: "适当把想法说得更柔和一点，会减少很多无效误会。" },
      ],
    },
  ],
  quadrants: [
    { ...BASE_QUADRANTS[0], description: "你会被打破惯性的人吸引，但会先确认边界和可信度。" },
    { ...BASE_QUADRANTS[1], description: "能读懂你的思考深度、又不抢你节奏的人，就是彼此的光。" },
    { ...BASE_QUADRANTS[2], description: "最敢和你正面辩论的人，既让你不适，也最容易激发新思考。" },
    { ...BASE_QUADRANTS[3], description: "热烈直接的人，会让你重新校准亲密、控制和开放程度。" },
    { ...BASE_QUADRANTS[4], description: "真正点亮你的人，通常既独立清醒，也保留柔软和温度。" },
    { ...BASE_QUADRANTS[5], description: "熟悉的人身上，你总能持续发现新的方法和新的模式。" },
    { ...BASE_QUADRANTS[6], description: "真正舒服的关系不喧闹，但能持续对齐判断和方向。" },
    { ...BASE_QUADRANTS[7], description: "长期同行的人，往往也有稳定价值观和清晰目标。" },
  ],
  mirrorLine: "你以为自己只是专注，别人先感受到的可能是距离和锋利。",
  mirrorPrompt: "发给朋友做几道轻问题，看看他们更常从哪一面理解你。",
  friendMap: [
    { title: "最近互动人格", type: "ENTP", note: "会不断抛出新角度，逼你刷新判断。" },
    { title: "最默契人格", type: "ISTJ", note: "节奏稳定、做事靠谱，很容易达成一致。" },
    { title: "最有张力人格", type: "ENFP", note: "会让你离开控制感，也会带来新的活力。" },
    { title: "朋友分布高频", type: "INTP", note: "和会思考的人，你更容易建立长期连接。" },
  ],
  matches: [
    { title: "精神拍档", type: "ISTJ", detail: "价值观和执行感都很稳，合作非常顺。" },
    { title: "灵魂碰撞", type: "ENFP", detail: "对方会带来温度、变化和你原本没打算打开的部分。" },
    { title: "容易误解", type: "ESFJ", detail: "你重逻辑和边界，对方更重情绪与关系反馈。" },
  ],
};

const PROFILE_MAP: Record<string, MbtiTypeProfile> = {
  INFP: INFP_PROFILE,
  INTJ: INTJ_PROFILE,
};

function buildDefaultProfile(type: string): MbtiTypeProfile {
  const label = TYPE_LABELS[type] ?? { nickname: "人格档案", subtitle: "你的偏好结构已经生成" };
  const keywordMap: Record<string, string> = {
    I: "内敛",
    E: "外放",
    S: "现实",
    N: "想象",
    T: "理性",
    F: "共情",
    J: "秩序",
    P: "灵活",
  };
  const keywords = type
    .split("")
    .map((letter) => keywordMap[letter] ?? letter)
    .slice(0, 3);

  return {
    title: label.nickname,
    codename: `${type} 人格档案`,
    keywords,
    heroSummary: label.subtitle,
    conclusion: "你的类型已经形成，接下来重点是把偏好转化成更稳定的表达和关系方式。",
    sigil: "✦",
    animalLabel: `${type} 型人格图腾`,
    realityTabs: [
      {
        key: "career",
        title: "职业发展",
        summary: "你的职业偏好，通常会沿着认知方式和节奏习惯展开。",
        bullets: [
          { title: "天然优势", text: "更容易在自己偏好的认知区间里稳定输出。" },
          { title: "协作建议", text: "找到和你节奏匹配的人，会明显减少内耗。" },
          { title: "高压提醒", text: "当环境长期违背你的偏好时，效率和状态都会下降。" },
          { title: "成长方向", text: "把偏好练成能力，比给自己贴标签更有价值。" },
        ],
      },
      {
        key: "intimacy",
        title: "亲密关系",
        summary: "你在关系里最在意的，往往就是你最需要被看见的部分。",
        bullets: [
          { title: "表达方式", text: "你会通过最自然的沟通与陪伴方式表达在乎。" },
          { title: "安全感需求", text: "被理解、被尊重、被对齐节奏，是关系里的关键。 " },
          { title: "常见误解", text: "别人常常只能看到你的外层，未必立刻读懂你的重点。" },
          { title: "关系建议", text: "越重要的关系，越值得把真实需求讲清楚。" },
        ],
      },
      {
        key: "social",
        title: "人际交往",
        summary: "你会吸引和自己频率相近的人，也会被互补型的人推动成长。",
        bullets: [
          { title: "群体状态", text: "你会按自己的节奏决定什么时候进入和退出人群。" },
          { title: "信任建立", text: "信任不是一次形成的，而是靠连续反馈累积出来的。" },
          { title: "吸引的人", text: "你会吸引既欣赏你、又想更了解你的人。" },
          { title: "互动建议", text: "关系里最怕误读，适当说明会让互动更轻松。" },
        ],
      },
    ],
    quadrants: BASE_QUADRANTS,
    mirrorLine: "别人看到的你，往往和你以为自己呈现出来的样子并不完全一样。",
    mirrorPrompt: "找几个熟悉你的人做轻量反馈，会更容易看见外在印象。",
    friendMap: [
      { title: "最近互动人格", type: "ENFP", note: "带来不同节奏和新的互动方式。" },
      { title: "最默契人格", type: "INFJ", note: "容易在价值观和沟通深度上快速对齐。" },
      { title: "最有张力人格", type: "ENTP", note: "会打破惯性，也会推动新的思考。" },
      { title: "朋友分布高频", type: "ISFJ", note: "温和、可靠的人更容易留在你身边。" },
    ],
    matches: [
      { title: "精神拍档", type: "INFJ", detail: "容易在意义感和沟通深度上对齐。" },
      { title: "灵魂碰撞", type: "ENTP", detail: "会带来高张力的新鲜感，也会推动你变化。" },
      { title: "容易误解", type: "ESTJ", detail: "推进事情的方式不同，容易误读彼此意图。" },
    ],
  };
}

function buildTypeSummary(type: string) {
  const map: Record<string, string> = {
    I: "你更常从内在整理与独处中恢复能量。",
    E: "你更容易在互动与表达中激活自己。",
    S: "你倾向先从现实细节和确定信息建立判断。",
    N: "你倾向先捕捉趋势、意义与潜在可能。",
    T: "你做决定时会优先校准逻辑与原则。",
    F: "你做决定时会优先校准关系与感受。",
    J: "你更喜欢明确节奏、结构和收束感。",
    P: "你更喜欢保留弹性、探索和流动空间。",
  };
  return `${map[type[0]]} ${map[type[1]]} ${map[type[2]]} ${map[type[3]]}`;
}

function calcAxisResult(axis: MbtiAxis, answers: Record<number, number>) {
  const axisQuestions = MBTI_QUESTIONS.filter((item) => item.axis === axis);
  const score = axisQuestions.reduce((sum, item) => sum + ((answers[item.id] ?? 3) - 3), 0);
  const maxAbs = axisQuestions.length * 2;
  const normalized = Math.max(-maxAbs, Math.min(maxAbs, score));
  const rightPercent = Math.round(((normalized + maxAbs) / (maxAbs * 2)) * 100);
  const leftPercent = 100 - rightPercent;

  return {
    score: normalized,
    leftPercent,
    rightPercent,
  };
}

export function calculateMbtiResult(answers: Record<number, number>, testedAt = new Date().toISOString()): MbtiResult {
  const EI = calcAxisResult("EI", answers);
  const SN = calcAxisResult("SN", answers);
  const TF = calcAxisResult("TF", answers);
  const JP = calcAxisResult("JP", answers);

  const type =
    `${EI.leftPercent >= EI.rightPercent ? "E" : "I"}` +
    `${SN.leftPercent >= SN.rightPercent ? "S" : "N"}` +
    `${TF.leftPercent >= TF.rightPercent ? "T" : "F"}` +
    `${JP.leftPercent >= JP.rightPercent ? "J" : "P"}`;

  const profile = TYPE_LABELS[type] ?? {
    nickname: "人格画像",
    subtitle: "你的偏好结构已经生成",
  };

  return {
    type,
    nickname: profile.nickname,
    subtitle: profile.subtitle,
    summary: buildTypeSummary(type),
    testedAt,
    percentages: {
      E: EI.leftPercent,
      I: EI.rightPercent,
      S: SN.leftPercent,
      N: SN.rightPercent,
      T: TF.leftPercent,
      F: TF.rightPercent,
      J: JP.leftPercent,
      P: JP.rightPercent,
    },
    scores: {
      EI: EI.score,
      SN: SN.score,
      TF: TF.score,
      JP: JP.score,
    },
  };
}

export function buildDimensionCards(result: MbtiResult): MbtiDimensionCard[] {
  const percentages = result.percentages;
  return (["EI", "SN", "TF", "JP"] as MbtiAxis[]).map((axis) => {
    const meta = AXIS_META[axis];
    const leftPercent = percentages[meta.leftCode as keyof MbtiResult["percentages"]] as number;
    const rightPercent = percentages[meta.rightCode as keyof MbtiResult["percentages"]] as number;
    const dominantCode = leftPercent >= rightPercent ? meta.leftCode : meta.rightCode;
    const summary =
      axis === "EI"
        ? dominantCode === "E"
          ? "你更容易把想法放到互动中验证，通过表达获得推进感。"
          : "你更容易先在内在完成整理，再决定是否对外表达。"
        : axis === "SN"
          ? dominantCode === "S"
            ? "你更信任具体信息、现实条件与可落地的判断。"
            : "你更容易看见趋势、隐含模式与未来可能。"
          : axis === "TF"
            ? dominantCode === "T"
              ? "你更先校准逻辑、标准和是否合理。"
              : "你更先校准关系、价值和人的承受感。"
            : dominantCode === "J"
              ? "你更喜欢明确节奏、计划与收束后的确定感。"
              : "你更喜欢保留弹性、探索空间与过程中的调整自由。";

    return {
      axis,
      title: meta.title,
      leftCode: meta.leftCode,
      rightCode: meta.rightCode,
      leftTitle: meta.leftTitle,
      rightTitle: meta.rightTitle,
      leftPercent,
      rightPercent,
      dominantCode,
      summary,
    };
  });
}

export function buildPortraitBlocks(result: MbtiResult): MbtiPortraitBlock[] {
  const type = result.type;

  return [
    {
      title: "表达方式",
      body: type.includes("E")
        ? "你通常更愿意先把自己放进关系和场景里，通过交流确认方向。你的表达更容易在互动中成形。"
        : "你通常更愿意先在内心整理，再把成型的内容交给外部世界。你的表达需要更稳的边界和更高质量的回应。",
    },
    {
      title: "决策倾向",
      body: type.includes("T")
        ? "你会优先看判断是否合理、结构是否清晰，适合做框架搭建、问题拆解和原则校准。"
        : "你会优先看人是否能被照顾、关系是否能继续承受，适合做关系协调、情绪感知和价值判断。",
    },
    {
      title: "关系风格",
      body: type.includes("I")
        ? "你在关系中更重视深度、质量和被真正理解的感觉。你不一定表达很多，但很在意连接是否真实。"
        : "你在关系中更重视互动感、回应速度和情绪流动。你往往通过交流建立亲近，而不是等待对方先靠近。",
    },
    {
      title: "压力反应",
      body: type.includes("J")
        ? "当结构失控、计划反复变化时，你更容易紧绷。明确节奏、边界和优先级，会帮助你恢复稳定。"
        : "当空间被压缩、选择被过早收束时，你更容易感到受限。给自己留一点探索空间，会更容易重新启动。",
    },
  ];
}

function buildAxes(result: MbtiResult): MbtiVisualAxis[] {
  const p = result.percentages;
  return [
    {
      key: "EI",
      leftCode: "E",
      rightCode: "I",
      leftLabel: "外向",
      rightLabel: "内向",
      dominantCode: p.E >= p.I ? "E" : "I",
      dominantPercent: Math.max(p.E, p.I),
      leftPercent: p.E,
      rightPercent: p.I,
      insight: p.E >= p.I ? "你更容易在互动里热起来" : "你更容易在独处里回血",
    },
    {
      key: "SN",
      leftCode: "S",
      rightCode: "N",
      leftLabel: "实感",
      rightLabel: "直觉",
      dominantCode: p.S >= p.N ? "S" : "N",
      dominantPercent: Math.max(p.S, p.N),
      leftPercent: p.S,
      rightPercent: p.N,
      insight: p.S >= p.N ? "你更先抓住现实细节" : "你更先看到趋势和可能",
    },
    {
      key: "TF",
      leftCode: "T",
      rightCode: "F",
      leftLabel: "思维",
      rightLabel: "情感",
      dominantCode: p.T >= p.F ? "T" : "F",
      dominantPercent: Math.max(p.T, p.F),
      leftPercent: p.T,
      rightPercent: p.F,
      insight: p.T >= p.F ? "你做决定时更先校准逻辑" : "你做决定时更先校准感受",
    },
    {
      key: "JP",
      leftCode: "J",
      rightCode: "P",
      leftLabel: "判断",
      rightLabel: "感知",
      dominantCode: p.J >= p.P ? "J" : "P",
      dominantPercent: Math.max(p.J, p.P),
      leftPercent: p.J,
      rightPercent: p.P,
      insight: p.J >= p.P ? "你偏好明确推进和收束" : "你偏好留白、弹性和探索",
    },
  ];
}

function pickProfile(type: string) {
  return PROFILE_MAP[type] ?? buildDefaultProfile(type);
}

export function buildMbtiVisualModel(result?: MbtiResult | null): MbtiVisualModel {
  const source = result ?? FALLBACK_RESULT;
  const profile = pickProfile(source.type);
  const keywords = source.subtitle
    .split(/[、，,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);

  return {
    type: source.type,
    title: source.nickname || profile.title,
    codename: profile.codename,
    keywords: keywords.length ? keywords : profile.keywords,
    heroSummary: source.summary || profile.heroSummary,
    conclusion: profile.conclusion,
    sigil: profile.sigil,
    animalLabel: profile.animalLabel,
    axes: buildAxes(source),
    realityTabs: profile.realityTabs,
    quadrants: profile.quadrants,
    mirrorLine: profile.mirrorLine,
    mirrorPrompt: profile.mirrorPrompt,
    friendMap: profile.friendMap,
    matches: profile.matches,
    shareText: `我的 LingChain 人格档案是 ${source.type} · ${source.nickname || profile.title} · ${profile.codename}`,
  };
}

export function getMbtiPreviewModel() {
  return buildMbtiVisualModel(FALLBACK_RESULT);
}

export function getMbtiPreviewPayload() {
  return {
    result: FALLBACK_RESULT,
    dimensionCards: buildDimensionCards(FALLBACK_RESULT),
    portraitBlocks: buildPortraitBlocks(FALLBACK_RESULT),
    visualModel: getMbtiPreviewModel(),
  };
}

export function getStageByIndex(index: number) {
  const question = MBTI_QUESTIONS[index];
  return MBTI_STAGES.find((item) => item.key === question?.stageKey) ?? MBTI_STAGES[0];
}
