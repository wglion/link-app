export type DivinationArchiveKind = "self" | "other" | "guest";

export type ZodiacDimensionKey = "love" | "career" | "wealth" | "social";

export type ZodiacInsightBlock = {
  id: string;
  title: string;
  conclusion: string;
  supporting?: string;
  accent?: string;
};

export type ZodiacDeepTabKey = "sign" | "house";

export type ZodiacInsightDetailItem = {
  id: string;
  tab: ZodiacDeepTabKey;
  title: string;
  shortLabel: string;
  definition: string;
  summary: string;
  sections: Array<{ title: string; body: string }>;
  strengths: string[];
  blindspots: string[];
  aiQuestion: string;
  relatedQuestions: string[];
};

export type ZodiacInsightLibraryTab = {
  key: ZodiacDeepTabKey;
  label: string;
  title: string;
  body: string;
  items: ZodiacInsightDetailItem[];
};

export type ZodiacPageMockData = {
  basic: {
    sign: string;
    personaTitle: string;
    displayTitle: string;
    summary: string;
    tags: string[];
    sun?: string;
    moon?: string;
    rising?: string;
  };
  visualProfile: {
    headline: string;
    summary: string;
    dimensions: Array<{
      key: ZodiacDimensionKey;
      label: string;
      tag: string;
      score: number;
      summary: string;
    }>;
  };
  insightBlocks: ZodiacInsightBlock[];
  insightLibrary: {
    entryTitle: string;
    entryBody: string;
    tabs: ZodiacInsightLibraryTab[];
  };
  dailyTips: {
    advice: string;
    luckyFood?: string;
    luckyColor?: string;
    do?: string[];
    dont?: string[];
    rhythm?: string;
    relationHint?: string;
  };
  ai: {
    opener: string;
    previewQuestion: string;
    suggestedQuestions: string[];
    answer: string;
  };
};

export type ZodiacPageViewModel = {
  roleLabel: string;
  profileName: string;
  sign: string;
  heroTitle: string;
  heroSubtitle: string;
  heroSummary: string;
  heroTags: string[];
  comboText?: string;
  hintText?: string;
  dailyTitle: string;
  aiSummaryPrimary: string;
  quickAskQuestion: string;
  deepAskTitle: string;
  deepAskQuestions: string[];
  deepEntryTitle: string;
  deepEntryBody: string;
  deepEntryQuestion: string;
  insightLibrary: ZodiacPageMockData["insightLibrary"];
  hasFullProfile: boolean;
  isLimited: boolean;
  visualProfile: ZodiacPageMockData["visualProfile"];
  insightBlocks: ZodiacInsightBlock[];
  dailyTips: ZodiacPageMockData["dailyTips"];
  ai: ZodiacPageMockData["ai"];
};

export type ZodiacSignKey =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export type ZodiacRequestPayload = {
  birthDate?: string | null;
  profileName?: string | null;
  profileKind?: DivinationArchiveKind | null;
  limited?: boolean;
  archive?: {
    name?: string | null;
    kind?: DivinationArchiveKind | null;
    birthDate?: string | null;
  } | null;
};

type Seed = {
  sign: string;
  title: string;
  display: string;
  summary: string;
  tags: string[];
  combo: [string, string, string];
  visual: [string, string];
  dimensions: Record<ZodiacDimensionKey, [string, number, string]>;
  insight: {
    surface: string;
    inner: string;
    skill: string;
    trigger: string;
    match: string;
    growth: string;
    relation: string;
    core: string;
  };
  daily: {
    advice: string;
    luckyFood: string;
    luckyColor: string;
    do: string[];
    dont: string[];
    rhythm: string;
    relationHint: string;
  };
  ai: {
    opener: string;
    preview: string;
    answer: string;
  };
};

const dimensionLabels: Record<ZodiacDimensionKey, string> = {
  love: "爱情",
  career: "事业",
  wealth: "财富",
  social: "人际",
};

const seeds: Record<ZodiacSignKey, Seed> = {
  aries: { sign: "白羊座", title: "先锋点火者", display: "你会先把局面推起来。", summary: "擅长启动、破冰和推进。", tags: ["行动力", "带头感", "反应快", "推进力"], combo: ["白羊", "狮子", "射手"], visual: ["像火种一样先点亮方向。", "找到目标后会越做越有带动感。"], dimensions: { love: ["直球投入", 82, "喜欢明确回应。"], career: ["破局驱动", 91, "适合开新题、冲难题。"], wealth: ["行动变现", 73, "财富常来自执行和窗口。"], social: ["场域带动", 78, "容易成为发起者。"] }, insight: { surface: "直接、果断，不爱犹豫。", inner: "想确认自己真的在向前。", skill: "能先给出第一步。", trigger: "拖延和低效率最消耗你。", match: "狮子座、射手座更能接住你的节奏。", growth: "把爆发力升级成稳定带队力。", relation: "关系里重回应、重真实。", core: "先动起来，再在行动中校准。" }, daily: { advice: "先处理最关键的那件事。", luckyFood: "炙烤南瓜", luckyColor: "日曜橙", do: ["先完成最难推进的一步", "把期待说清楚"], dont: ["不要一急就替所有人做决定", "不要只追求速度"], rhythm: "适合先快后稳。", relationHint: "比证明自己更重要的是确认彼此同频。" }, ai: { opener: "你不是没耐心，而是太容易在低效率环境里失去热情。", preview: "我更适合主动型关系，还是稳定型关系？", answer: "你适合有回应感、节奏清楚的关系和合作环境。" } },
  taurus: { sign: "金牛座", title: "价值定锚者", display: "你更清楚什么值得长期投入。", summary: "擅长把节奏和安全感做厚。", tags: ["稳定感", "长期主义", "审美值", "耐久力"], combo: ["金牛", "巨蟹", "处女"], visual: ["像定盘石一样累积价值。", "方向值得时，你会越做越扎实。"], dimensions: { love: ["慢热深情", 84, "确认关系后很稳定。"], career: ["稳扎稳打", 81, "适合长期累积。"], wealth: ["持续聚财", 89, "对资源沉淀很敏感。"], social: ["边界清晰", 68, "圈子不大但很稳。"] }, insight: { surface: "沉稳、克制，不急着表态。", inner: "很在意投入是否真的值得。", skill: "能把资源和耐心做成成果。", trigger: "突然改变和催促最消耗你。", match: "处女座、摩羯座更能理解你的节奏。", growth: "把稳重升级成更主动的整合力。", relation: "关系里重踏实和可依赖。", core: "持续累积，把价值做厚。" }, daily: { advice: "把一件事做细做稳。", luckyFood: "芝士焗南瓜", luckyColor: "烟青金", do: ["优先处理长期价值高的事项", "把真实节奏说出来"], dont: ["不要硬改节奏", "不要总忍着不说累"], rhythm: "适合在熟悉框架里加深。", relationHint: "真正稳的关系，是知道彼此可以长期依靠。" }, ai: { opener: "你不是慢，而是很少把精力浪费在不值得的试探上。", preview: "我为什么总想先确认安全感再行动？", answer: "你的系统天然重视可持续感和稳定结构。" } },
  gemini: { sign: "双子座", title: "讯号连接者", display: "你更早听见环境里的变化。", summary: "擅长连接信息和人。", tags: ["沟通力", "反应快", "信息流", "连接感"], combo: ["双子", "天秤", "水瓶"], visual: ["像移动的信息枢纽。", "找到聚焦点后，变化会成为助力。"], dimensions: { love: ["会聊会懂", 76, "精神互动很重要。"], career: ["适应极快", 87, "适合信息密度高的场域。"], wealth: ["判断驱动", 71, "财富常来自敏感度。"], social: ["连接中心", 92, "很会让不同的人接上线。"] }, insight: { surface: "轻松、机灵，总能很快接话。", inner: "其实很在意被真正理解。", skill: "能把复杂内容翻译成好懂表达。", trigger: "重复和无效沟通会快速消耗你。", match: "天秤座、水瓶座更能跟上你的思维。", growth: "把分散兴趣收束成长线。", relation: "关系里需要语言流动和精神互动。", core: "连接和翻译，把变化变成理解。" }, daily: { advice: "先整理优先级，再分配注意力。", luckyFood: "薄荷酸奶", luckyColor: "雾蓝灰", do: ["把关键判断写下来", "先定主线再发散"], dont: ["不要被多线程聊天拖走", "不要跳过深想"], rhythm: "上午沟通，下午收束。", relationHint: "让关系变深的不是聊得多，而是重点也愿意说出来。" }, ai: { opener: "你不是注意力不够，而是入口太多。", preview: "我为什么总想很多，却迟迟不行动？", answer: "你能同时看到很多可能性，所以容易先卡在定线。" } },
  cancer: { sign: "巨蟹座", title: "情绪护城者", display: "你擅长在人和关系里建立稳定感。", summary: "柔软里的守护力很强。", tags: ["共情力", "守护感", "安全感", "细腻度"], combo: ["巨蟹", "双鱼", "金牛"], visual: ["更早感知关系里的温差。", "温柔是一种稳定关系的能力。"], dimensions: { love: ["投入很深", 90, "最在意可靠与被珍惜。"], career: ["稳中守成", 73, "适合长期投入型环境。"], wealth: ["安全优先", 69, "优先考虑风险和安心感。"], social: ["情绪雷达", 87, "先感到关系哪里失衡。"] }, insight: { surface: "温和、顾全大局。", inner: "很需要被信任和珍惜。", skill: "能照见别人没说出口的需求。", trigger: "冷处理和忽视会让你退回壳里。", match: "双鱼座、天蝎座更能接住你的深度。", growth: "把感受力变成边界。", relation: "关系里最重安全感和情绪在场。", core: "守护和承接，让关系重新有温度。" }, daily: { advice: "先照顾好自己的情绪容量。", luckyFood: "奶酪焗饭", luckyColor: "月雾白", do: ["先确认自己的边界", "温和但明确地表达需求"], dont: ["不要把所有人的情绪都揽过来", "不要把委屈拖太久"], rhythm: "适合先安放自己，再回应外界。", relationHint: "成熟关系是彼此都知道怎么接住你。" }, ai: { opener: "你的敏感更像高共情能力，而不是脆弱。", preview: "我为什么总在关系里先消耗自己？", answer: "你太容易先感知对方情绪，所以常把照顾别人放在前面。" } },
  leo: { sign: "狮子座", title: "光场带动者", display: "你需要确认自己真的在发光。", summary: "擅长点亮场域和他人。", tags: ["存在感", "领导力", "鼓舞力", "表达欲"], combo: ["狮子", "白羊", "天秤"], visual: ["天然带着中心感。", "主动创造舞台时最能发挥。"], dimensions: { love: ["浓烈表达", 83, "期待热度与回应。"], career: ["带队气场", 92, "适合站出来、带方向。"], wealth: ["资源吸附", 79, "曝光度常带来机会。"], social: ["中心能量", 89, "容易成为焦点。"] }, insight: { surface: "明亮、热情，总能带起温度。", inner: "很在意别人看见的是不是真实价值。", skill: "会点燃气氛，也能稳住全场。", trigger: "被忽视和敷衍会迅速让你冷掉。", match: "白羊座、射手座更能接住你的生命力。", growth: "把存在感升级成稳定影响力。", relation: "关系里重热度，也希望自己的用心被看见。", core: "照亮和鼓舞，让场域重新有光。" }, daily: { advice: "把你的观点说清楚。", luckyFood: "蜂蜜烤红薯", luckyColor: "琥珀金", do: ["主动提出真正想推动的事", "给值得的人明确鼓励"], dont: ["不要因为受挫就突然冷掉", "不要把面子放在真实需求前面"], rhythm: "先表达核心，再留空间观察反馈。", relationHint: "让你安心的关系，是既能欣赏你，也能诚实回应你。" }, ai: { opener: "你需要的不是掌声本身，而是被真实看见。", preview: "我为什么总在意别人有没有回应我？", answer: "因为你对投入和表达都很认真，所以自然在意有没有被接住。" } },
  virgo: { sign: "处女座", title: "系统校准者", display: "你在为一切建立更稳的秩序。", summary: "擅长梳理结构、校准细节。", tags: ["系统感", "细节力", "判断准", "执行稳"], combo: ["处女", "摩羯", "双子"], visual: ["像天然调频器。", "强项不是挑问题，而是让事情变顺。"], dimensions: { love: ["照顾细节", 78, "会通过实际细节表达在意。"], career: ["结构优化", 90, "适合梳流程、定标准。"], wealth: ["精细规划", 81, "善于通过规则保持稳定。"], social: ["谨慎筛选", 70, "重质量和可靠度。"] }, insight: { surface: "克制、清醒，很容易发现偏差。", inner: "真正想要的是可控、可落实。", skill: "能把复杂流程拆成步骤。", trigger: "混乱和返工会迅速消耗你。", match: "金牛座、摩羯座更能理解你的标准。", growth: "把高标准升级成更柔和的协作方式。", relation: "关系里常通过细节和靠谱表达爱。", core: "校准和整合，让系统回到更顺的位置。" }, daily: { advice: "先做结构整理，再进入执行。", luckyFood: "香草烤土豆", luckyColor: "鼠尾草绿", do: ["先排序再动手", "给自己和别人留出明确边界"], dont: ["不要把所有问题都揽成自己的责任", "不要因标准高而拖延开始"], rhythm: "上午规划，下午执行。", relationHint: "你最需要的是能一起把生活过顺的人。" }, ai: { opener: "你不是太挑剔，而是很难对失序视而不见。", preview: "我为什么总觉得还不够完善？", answer: "因为你的感知会优先捕捉偏差和漏洞。" } },
  libra: { sign: "天秤座", title: "关系调频者", display: "你擅长让关系回到更平衡的位置。", summary: "对互动品质和秩序很敏锐。", tags: ["平衡感", "关系力", "审美值", "协调力"], combo: ["天秤", "双子", "狮子"], visual: ["像关系里的调频器。", "更懂得看整体动态，而不是只看单点。"], dimensions: { love: ["互动对齐", 88, "在意交流感和尊重感。"], career: ["协同整合", 80, "适合跨人协作和提案判断。"], wealth: ["品质导向", 74, "会把钱花在体验和舒适上。"], social: ["关系桥梁", 90, "擅长帮助不同的人找到共识。"] }, insight: { surface: "温和、讲分寸，很少让局面难堪。", inner: "很在意公平，也怕关系失衡。", skill: "能在摇摆之间找到更优雅的解法。", trigger: "粗暴表达和长期单向付出最让你疲惫。", match: "双子座、水瓶座更能跟上你的互动节奏。", growth: "把照顾整体升级成明确表达自我。", relation: "关系里重尊重和互相回应。", core: "对齐与平衡，让互动重新顺起来。" }, daily: { advice: "优先处理最需要对齐的关系或合作。", luckyFood: "柠檬奶油意面", luckyColor: "云雾蓝", do: ["先说清楚真实立场", "把含糊点提前对齐"], dont: ["不要为了和气一直压着自己", "不要把决定拖成长期摇摆"], rhythm: "适合先对齐关系，再进入合作。", relationHint: "舒服的关系不是没有分歧，而是分歧也能被温和处理。" }, ai: { opener: "你不是优柔寡断，而是会同时看见多方感受和代价。", preview: "我为什么总想把所有关系都维持好？", answer: "因为你对关系场很敏锐，太容易先感到失衡。" } },
  scorpio: { sign: "天蝎座", title: "深层穿透者", display: "你太快看见了事情的深层结构。", summary: "擅长看本质和守住深层边界。", tags: ["洞察力", "边界感", "深度", "掌控力"], combo: ["天蝎", "巨蟹", "摩羯"], visual: ["像一束穿透光。", "谨慎不是防备本身，而是对真实要求高。"], dimensions: { love: ["深度绑定", 91, "投入后会非常深。"], career: ["本质判断", 85, "适合研究、策略、洞察型角色。"], wealth: ["资源掌控", 82, "更看重真正可掌控的价值。"], social: ["边界筛选", 72, "宁少勿滥。"] }, insight: { surface: "克制、有距离，不会轻易亮底牌。", inner: "非常在意真实，也怕深度被轻慢。", skill: "能在复杂局面里看见根因。", trigger: "背叛、含糊和不真诚最容易触发你。", match: "巨蟹座、双鱼座更能接住你的深度。", growth: "把控制感升级成信任能力。", relation: "关系里重忠诚、重真实。", core: "穿透与重组，看见真相后再重新排列。" }, daily: { advice: "先相信你的直觉，但关键判断留一层验证。", luckyFood: "黑芝麻慕斯", luckyColor: "深海蓝", do: ["把核心问题先问清楚", "把精力投向真正重要的人和事"], dont: ["不要因为敏锐就提前下结论", "不要把脆弱都藏成沉默"], rhythm: "适合留出独处时段处理关键判断。", relationHint: "你最需要的是既有深度又有稳定感的信任关系。" }, ai: { opener: "你不是多疑，而是对真实和边界的要求很高。", preview: "我为什么总想确认别人到底靠不靠谱？", answer: "确认可信度，是你进入深层连接前必须完成的安全校验。" } },
  sagittarius: { sign: "射手座", title: "远景开拓者", display: "你会把眼前的事连接到更大的方向感。", summary: "重自由、真诚和探索。", tags: ["自由感", "远景感", "直率", "开拓力"], combo: ["射手", "水瓶", "白羊"], visual: ["像天然的扩张器。", "只要空间足够，你会很有感染力。"], dimensions: { love: ["坦率热情", 77, "需要自由，也需要真诚互动。"], career: ["方向开拓", 88, "适合探索、传播、教育。"], wealth: ["机会感强", 75, "常跟眼界和流动有关。"], social: ["开放感染", 86, "容易把氛围带得更开阔。"] }, insight: { surface: "轻快、直接，不喜欢被过度限制。", inner: "真正想守住的是自由和真诚。", skill: "能把人从困局里带到更大的视角。", trigger: "被束缚和被控制会让你很快抽离。", match: "白羊座、狮子座更能理解你的速度。", growth: "把热情和远景落到持续执行。", relation: "关系里要有空间、有真话。", core: "拓展和点亮可能性。" }, daily: { advice: "先确认大方向，再决定哪些事值得投入。", luckyFood: "香料烤菠萝", luckyColor: "晨光橙", do: ["把注意力留给真正想去的方向", "用更诚实的方式表达感受"], dont: ["不要为了轻松答应不想做的事", "不要只开头不收尾"], rhythm: "先看远景、再定步骤。", relationHint: "让你安心的关系，是给你自由还愿意同行。" }, ai: { opener: "你不是坐不住，而是需要更真实、更有空间的方向感。", preview: "我为什么总想往更远的地方走？", answer: "你的能量天生会向外扩张，太窄的环境会让你本能地想离开。" } },
  capricorn: { sign: "摩羯座", title: "结构掌舵者", display: "你擅长搭结构、扛责任、看长期结果。", summary: "真正的优势是把不确定局面做成稳定成果。", tags: ["责任感", "耐压度", "结果感", "长期布局"], combo: ["摩羯", "摩羯", "金牛"], visual: ["擅长把目标拆成结构。", "越是长期局，越能体现你的成事力。"], dimensions: { love: ["慢热守护", 71, "承诺后会很负责。"], career: ["结果导向", 94, "适合长期建设和统筹落地。"], wealth: ["长期布局", 88, "更擅长持续积累。"], social: ["边界明确", 74, "重视规则和可靠度。"] }, insight: { surface: "克制、稳，不会轻易把想法说满。", inner: "很在意结果，也怕把重要的事做得不够好。", skill: "能搭结构、定节奏，把长期目标变现实。", trigger: "失控、低标准和反复失信最消耗你。", match: "金牛座、处女座更能理解你的长期主义。", growth: "学会在稳定之外表达感受。", relation: "关系里重靠谱、重兑现。", core: "结构化成事，把时间变成成果。" }, daily: { advice: "优先处理最重要的长期事项。", luckyFood: "黑芝麻糯米团", luckyColor: "岩层灰金", do: ["先推进长期价值最高的项目", "把责任边界说得更明确"], dont: ["不要一个人默默扛到极限", "不要把情绪完全藏起来"], rhythm: "先定结构、再分步骤推进。", relationHint: "最适合你的关系，是彼此都能把承诺落地。" }, ai: { opener: "你不是太严肃，而是很早就学会先为结果负责。", preview: "我为什么总想很多，却始终放不松？", answer: "只要关键结构还没稳住，你就很难真正松下来。" } },
  aquarius: { sign: "水瓶座", title: "规则重构者", display: "你总会先从更高处看整体结构。", summary: "擅长独立思考和重组规则。", tags: ["独立感", "前瞻性", "抽离力", "创新性"], combo: ["水瓶", "双子", "射手"], visual: ["像系统外的观察者。", "只要给你空间，就会很快拿出新解法。"], dimensions: { love: ["精神并肩", 74, "需要空间，也需要价值观同频。"], career: ["创新重构", 89, "适合产品、策略、系统设计。"], wealth: ["未来导向", 76, "更容易被长期趋势吸引。"], social: ["圈层连接", 85, "擅长连接兴趣相投的人。"] }, insight: { surface: "理性、特别，有时带一点距离感。", inner: "最珍惜的是判断自由和价值观理解。", skill: "能从旧系统外找到新组织方式。", trigger: "被强行同化或控制会让你迅速抽离。", match: "双子座、天秤座更能接住你的空间需求。", growth: "把抽离感升级成更温和的连接能力。", relation: "关系里需要边界、独立和精神同行。", core: "重构，把旧规则升级成更适合未来的样子。" }, daily: { advice: "先看整体趋势，再决定哪些事值得深投。", luckyFood: "青柠气泡冻", luckyColor: "极光蓝", do: ["为重要问题保留独立判断", "把新想法落成最小实验"], dont: ["不要因想保持独立就拒绝连接", "不要只停在概念层"], rhythm: "适合先独处梳理，再进入协作。", relationHint: "你最舒服的关系，是既尊重差异又能在核心价值上同行。" }, ai: { opener: "你不是冷，而是习惯先从系统层面理解一切。", preview: "我为什么总会下意识和别人保持一点距离？", answer: "距离感往往是你保护判断自由和内在节奏的方式。" } },
  pisces: { sign: "双鱼座", title: "感应编织者", display: "你擅长感知那些别人还没说出口的流动。", summary: "真正的优势是感受力与疗愈感。", tags: ["感受力", "想象力", "柔软度", "共鸣感"], combo: ["双鱼", "巨蟹", "天秤"], visual: ["像高感知接收器。", "有边界时，你的柔软会变成很强的理解力。"], dimensions: { love: ["深度共鸣", 89, "最在意心灵被理解。"], career: ["灵感流动", 75, "适合创作、陪伴、疗愈类场域。"], wealth: ["感受驱动", 67, "更需要边界和规划来稳住现实。"], social: ["氛围共感", 88, "很容易先感到情绪流向。"] }, insight: { surface: "温柔、安静，有时像在别的频率里。", inner: "非常需要被理解，也怕感受没有容身之处。", skill: "能先感到别人没说出口的情绪。", trigger: "边界混乱和情绪噪音最容易让你疲惫。", match: "巨蟹座、天蝎座更能理解你的敏感与深情。", growth: "把感受力放进更清晰的边界里。", relation: "关系里重心灵连接和氛围感。", core: "共鸣与编织，让情绪和意义重新被看见。" }, daily: { advice: "先保护好自己的感受边界。", luckyFood: "蜂蜜牛奶布丁", luckyColor: "海盐青", do: ["给自己留一段安静时间", "把真实感受写下来或说出来"], dont: ["不要把别人的情绪全装进自己身体里", "不要在模糊里过度答应"], rhythm: "适合慢启动，先稳住内在。", relationHint: "适合你的关系，是允许你的柔软被认真对待。" }, ai: { opener: "你不是太敏感，而是对情绪和气氛的接收能力本来就很高。", preview: "我为什么总会先感受到别人的情绪？", answer: "你常常在对方开口前就已经感到变化，所以更需要清晰边界保护自己。" } },
};

function safeText(value?: string | null) {
  const text = String(value ?? "").trim();
  if (!text || text.includes("?") || text.includes("�")) return "";
  return text;
}

function getMonthDay(dateText?: string | null) {
  const [year, month, day] = String(dateText ?? "").split("-").map(Number);
  if (!year || !month || !day) return null;
  return { month, day };
}

export function getZodiacSignKey(dateText?: string | null): ZodiacSignKey | null {
  const parsed = getMonthDay(dateText);
  if (!parsed) return null;
  const md = parsed.month * 100 + parsed.day;
  if (md >= 321 && md <= 419) return "aries";
  if (md >= 420 && md <= 520) return "taurus";
  if (md >= 521 && md <= 620) return "gemini";
  if (md >= 621 && md <= 722) return "cancer";
  if (md >= 723 && md <= 822) return "leo";
  if (md >= 823 && md <= 922) return "virgo";
  if (md >= 923 && md <= 1023) return "libra";
  if (md >= 1024 && md <= 1122) return "scorpio";
  if (md >= 1123 && md <= 1221) return "sagittarius";
  if (md >= 1222 || md <= 119) return "capricorn";
  if (md <= 218) return "aquarius";
  return "pisces";
}

function buildProfileName(kind: DivinationArchiveKind, name?: string | null) {
  const clean = safeText(name);
  if (clean) return clean;
  if (kind === "guest") return "体验档案";
  if (kind === "other") return "对方档案";
  return "我的档案";
}

function buildRoleLabel(kind: DivinationArchiveKind) {
  if (kind === "guest") return "体验模式";
  if (kind === "other") return "当前查看对象";
  return "我的档案";
}

function buildInsightBlocks(seed: Seed): ZodiacInsightBlock[] {
  return [
    { id: "surface", title: "表层气质", conclusion: seed.insight.surface, supporting: "这是别人第一眼最容易感受到的部分。", accent: "#E5B7A7" },
    { id: "inner", title: "内在驱动", conclusion: seed.insight.inner, supporting: "这通常是你真正做选择时的底层原因。", accent: "#9CC7E6" },
    { id: "skill", title: "优势能力", conclusion: seed.insight.skill, supporting: "这是你自然会发挥出来的强项。", accent: "#C9B06D" },
    { id: "trigger", title: "高频触发", conclusion: seed.insight.trigger, supporting: "这些场景最容易让你的情绪被点亮。", accent: "#9FD7C5" },
    { id: "match", title: "适配关系", conclusion: seed.insight.match, supporting: "更合拍的人，通常会接住你的节奏。", accent: "#C2A7D8" },
    { id: "growth", title: "成长方向", conclusion: seed.insight.growth, supporting: "这部分越被练出来，你的优势越稳定。", accent: "#E8C277" },
    { id: "relation_style", title: "关系风格", conclusion: seed.insight.relation, supporting: "这描述了你进入关系时最自然的方式。", accent: "#8DC9C6" },
    { id: "energy_core", title: "能量核心", conclusion: seed.insight.core, supporting: "记住这句话，通常就抓住了你的底色。", accent: "#D8D0A8" },
  ];
}

function buildSignItems(seed: Seed): ZodiacInsightDetailItem[] {
  return [
    {
      id: "sign-expression",
      tab: "sign",
      title: `${seed.sign}的表达方式`,
      shortLabel: "表达",
      definition: "别人首先感受到的，是你如何进入关系和场域。",
      summary: seed.insight.surface,
      sections: [
        { title: "外在呈现", body: seed.insight.surface },
        { title: "深层动力", body: seed.insight.inner },
        { title: "实际建议", body: `在重要场景里，优先让别人看见你的真实节奏。${seed.daily.rhythm}` },
      ],
      strengths: [seed.insight.skill, "表达风格和人格底色的一致度很高。"],
      blindspots: [seed.insight.trigger, "压力上来时，容易先回到旧的防御方式。"],
      aiQuestion: `我该怎样更自然地表达我的${seed.sign}特质？`,
      relatedQuestions: ["别人最容易误解我的地方是什么？", "我怎样在关系里表达得更真实？"],
    },
    {
      id: "sign-relationship",
      tab: "sign",
      title: `${seed.sign}的关系风格`,
      shortLabel: "关系",
      definition: "你在亲密关系和重要合作里，会自然使用的互动方式。",
      summary: seed.insight.relation,
      sections: [
        { title: "互动模式", body: seed.insight.relation },
        { title: "适配关系", body: seed.insight.match },
        { title: "关系提醒", body: seed.daily.relationHint },
      ],
      strengths: [seed.daily.relationHint, "你很清楚什么样的相处方式让自己安心。"],
      blindspots: ["长期得不到回应时，容易进入自我保护。", seed.insight.trigger],
      aiQuestion: "我更适合什么样的亲密关系节奏？",
      relatedQuestions: ["我在关系里最容易重复的模式是什么？", "什么样的人更能接住我？"],
    },
    {
      id: "sign-growth",
      tab: "sign",
      title: `${seed.sign}的成长课题`,
      shortLabel: "成长",
      definition: "当天赋走向长期发展时，你最值得持续练习的方向。",
      summary: seed.insight.growth,
      sections: [
        { title: "当前优势", body: seed.insight.skill },
        { title: "进阶方向", body: seed.insight.growth },
        { title: "行动建议", body: seed.daily.advice },
      ],
      strengths: [seed.insight.skill, "只要持续练习，你的天赋很容易形成壁垒。"],
      blindspots: ["如果只靠惯性天赋，不做升级，后期容易遇到天花板。"],
      aiQuestion: "我现在最该优先升级哪一项能力？",
      relatedQuestions: ["我的优势怎样变成长期竞争力？", "我该补哪块短板才能更稳？"],
    },
    {
      id: "sign-trigger",
      tab: "sign",
      title: `${seed.sign}的压力触发`,
      shortLabel: "触发",
      definition: "这部分会决定你在压力和失衡时最容易怎么反应。",
      summary: seed.insight.trigger,
      sections: [
        { title: "常见触发点", body: seed.insight.trigger },
        { title: "背后原因", body: `这些触发点往往和你的核心需求有关：${seed.insight.core}` },
        { title: "缓冲建议", body: seed.daily.rhythm },
      ],
      strengths: ["你对风险和不适的感知通常会更早。"],
      blindspots: [seed.insight.trigger, "如果不先停下来，容易在惯性里过度防御。"],
      aiQuestion: "我最近最容易被什么类型的场景触发？",
      relatedQuestions: ["我怎样在压力里更快恢复？", "为什么某些人会特别容易触发我？"],
    },
  ];
}

function buildHouseItems(seed: Seed): ZodiacInsightDetailItem[] {
  const entries: Array<[string, string, ZodiacDimensionKey, string]> = [
    ["house-love", "爱", "love", "爱情主题"],
    ["house-career", "业", "career", "事业主题"],
    ["house-wealth", "财", "wealth", "财富主题"],
    ["house-social", "际", "social", "人际主题"],
  ];

  return entries.map(([id, shortLabel, key, title]) => {
    const [tag, score, summary] = seed.dimensions[key];
    const label = dimensionLabels[key];
    return {
      id,
      tab: "house",
      title: `${seed.sign}${title}`,
      shortLabel,
      definition: `${label}维度里，你最容易显现出的默认节奏。`,
      summary,
      sections: [
        { title: "主题特征", body: `${label}维度中，你的关键词是「${tag}」。${summary}` },
        { title: "潜在优势", body: `当这个主题被正向激活时，你更容易发挥：${seed.insight.skill}` },
        { title: "现实建议", body: `把${label}里的选择拉回你的核心能量：${seed.insight.core}` },
      ],
      strengths: [`${label}维度得分为 ${score}，说明这一领域是显著主题。`, summary],
      blindspots: [`如果${label}节奏失衡，你会放大这些触发点：${seed.insight.trigger}`, "分数高也意味着更值得被有意识经营。"],
      aiQuestion: `我的${label}主题，接下来最值得调整什么？`,
      relatedQuestions: [`这组配置对我的${label}选择意味着什么？`, `我怎样把${label}主题过得更顺？`],
    };
  });
}

function buildMockData(seed: Seed): ZodiacPageMockData {
  const [sun, moon, rising] = seed.combo;

  return {
    basic: {
      sign: seed.sign,
      personaTitle: seed.title,
      displayTitle: seed.display,
      summary: seed.summary,
      tags: seed.tags,
      sun,
      moon,
      rising,
    },
    visualProfile: {
      headline: seed.visual[0],
      summary: seed.visual[1],
      dimensions: (Object.keys(seed.dimensions) as ZodiacDimensionKey[]).map((key) => {
        const [tag, score, summary] = seed.dimensions[key];
        return { key, label: dimensionLabels[key], tag, score, summary };
      }),
    },
    insightBlocks: buildInsightBlocks(seed),
    insightLibrary: {
      entryTitle: "继续拆开看你的星座人格结构",
      entryBody: "从星座维度看人格底色，从生活主题维度看这些能量更容易落在哪些场景里。",
      tabs: [
        {
          key: "sign",
          label: "星座",
          title: `从${seed.sign}维度看你`,
          body: `这里会把${seed.sign}的核心人格底色拆开，帮助你快速记住自己的主要驱动力、关系方式和成长方向。`,
          items: buildSignItems(seed),
        },
        {
          key: "house",
          label: "宫位",
          title: "从生活主题维度看能量落点",
          body: "这里先用爱情、事业、财富、人际四个高频主题，帮助你理解这些星座特质更容易在哪些现实场景里发力。",
          items: buildHouseItems(seed),
        },
      ],
    },
    dailyTips: {
      advice: seed.daily.advice,
      luckyFood: seed.daily.luckyFood,
      luckyColor: seed.daily.luckyColor,
      do: seed.daily.do,
      dont: seed.daily.dont,
      rhythm: seed.daily.rhythm,
      relationHint: seed.daily.relationHint,
    },
    ai: {
      opener: seed.ai.opener,
      previewQuestion: seed.ai.preview,
      suggestedQuestions: [
        seed.ai.preview,
        `我在关系里最容易重复的${seed.sign}模式是什么？`,
        `这组${seed.sign}配置对事业选择意味着什么？`,
        "我最近最该优先调整的状态是什么？",
      ],
      answer: seed.ai.answer,
    },
  };
}

function applyLimitedMode(data: ZodiacPageMockData, limited: boolean): ZodiacPageMockData {
  if (!limited) return data;

  return {
    ...data,
    insightLibrary: {
      ...data.insightLibrary,
      tabs: data.insightLibrary.tabs.map((tab) => ({ ...tab, items: tab.items.slice(0, 3) })),
    },
    dailyTips: {
      advice: data.dailyTips.advice,
      luckyFood: data.dailyTips.luckyFood,
      luckyColor: data.dailyTips.luckyColor,
    },
    ai: {
      ...data.ai,
      suggestedQuestions: data.ai.suggestedQuestions.slice(0, 2),
    },
  };
}

export function buildZodiacPageViewModel(payload: ZodiacRequestPayload): {
  signKey: ZodiacSignKey;
  rawData: ZodiacPageMockData;
  viewModel: ZodiacPageViewModel;
} | null {
  const profileKind = payload.archive?.kind ?? payload.profileKind ?? "self";
  const profileName = payload.archive?.name ?? payload.profileName;
  const birthDate = payload.archive?.birthDate ?? payload.birthDate;
  const limited = Boolean(payload.limited);
  const signKey = getZodiacSignKey(birthDate);

  if (!signKey) return null;

  const seed = seeds[signKey];
  const rawData = buildMockData(seed);
  const data = applyLimitedMode(rawData, limited);
  const resolvedProfileName = buildProfileName(profileKind, profileName);
  const comboText = limited ? undefined : `太阳 ${seed.combo[0]} · 月亮 ${seed.combo[1]} · 上升 ${seed.combo[2]}`;
  const deepAskQuestions = data.ai.suggestedQuestions;

  return {
    signKey,
    rawData,
    viewModel: {
      roleLabel: buildRoleLabel(profileKind),
      profileName: resolvedProfileName,
      sign: seed.sign,
      heroTitle: seed.title,
      heroSubtitle: `${seed.sign} · ${seed.display}`,
      heroSummary: seed.summary,
      heroTags: seed.tags,
      comboText,
      hintText: limited ? "登录或切换到本人档案后，可继续解锁完整的星座结果与 AI 深读。" : undefined,
      dailyTitle: `${resolvedProfileName}的今日提醒`,
      aiSummaryPrimary: comboText ?? seed.sign,
      quickAskQuestion: seed.ai.preview,
      deepAskTitle: "你还可以继续追问",
      deepAskQuestions,
      deepEntryTitle: data.insightLibrary.entryTitle,
      deepEntryBody: data.insightLibrary.entryBody,
      deepEntryQuestion: deepAskQuestions[0] ?? seed.ai.preview,
      insightLibrary: data.insightLibrary,
      hasFullProfile: !limited,
      isLimited: limited,
      visualProfile: data.visualProfile,
      insightBlocks: data.insightBlocks,
      dailyTips: data.dailyTips,
      ai: data.ai,
    },
  };
}
