import { NextRequest, NextResponse } from "next/server";

import {
  MBTI_QUESTIONS,
  MBTI_STAGES,
  buildDimensionCards,
  buildMbtiVisualModel,
  buildPortraitBlocks,
  calculateMbtiResult,
  getMbtiPreviewPayload,
} from "@/lib/personality/mbti";

type MbtiCalculateRequest = {
  answers?: Record<string, number> | null;
  testedAt?: string | null;
};

function normalizeAnswers(raw?: Record<string, number> | null) {
  const normalized: Record<number, number> = {};

  for (const [key, value] of Object.entries(raw ?? {})) {
    const questionId = Number(key);
    const score = Number(value);

    if (!Number.isInteger(questionId) || !Number.isFinite(score)) continue;
    normalized[questionId] = Math.max(1, Math.min(5, Math.round(score)));
  }

  return normalized;
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      module: "mbti",
      version: "1.0",
      meta: {
        questionCount: MBTI_QUESTIONS.length,
        stageCount: MBTI_STAGES.length,
        estimatedMinutes: 2,
      },
      stages: MBTI_STAGES,
      questions: MBTI_QUESTIONS,
      preview: getMbtiPreviewPayload(),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MbtiCalculateRequest;
    const answers = normalizeAnswers(body.answers);
    const answeredCount = Object.keys(answers).length;

    if (!answeredCount) {
      return NextResponse.json(
        {
          success: false,
          error: "至少需要提交一条 MBTI 作答数据。",
        },
        { status: 400 },
      );
    }

    const testedAt = body.testedAt && body.testedAt.trim() ? body.testedAt : new Date().toISOString();
    const result = calculateMbtiResult(answers, testedAt);

    return NextResponse.json({
      success: true,
      data: {
        module: "mbti",
        version: "1.0",
        answeredCount,
        totalQuestions: MBTI_QUESTIONS.length,
        result,
        dimensionCards: buildDimensionCards(result),
        portraitBlocks: buildPortraitBlocks(result),
        visualModel: buildMbtiVisualModel(result),
      },
    });
  } catch (error) {
    console.error("[api/mbti][POST]", error);
    return NextResponse.json(
      {
        success: false,
        error: "请求体不是合法 JSON。",
      },
      { status: 400 },
    );
  }
}
