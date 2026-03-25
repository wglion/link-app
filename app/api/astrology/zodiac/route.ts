import { NextRequest, NextResponse } from "next/server";

import {
  buildZodiacPageViewModel,
  type DivinationArchiveKind,
  type ZodiacRequestPayload,
} from "@/lib/astrology/zodiac";

function parseLimited(value: string | null) {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function parseProfileKind(value: string | null): DivinationArchiveKind | null {
  if (value === "self" || value === "other" || value === "guest") return value;
  return null;
}

function buildSuccessResponse(payload: ZodiacRequestPayload) {
  const result = buildZodiacPageViewModel(payload);

  if (!result) {
    return NextResponse.json(
      {
        success: false,
        error: "缺少有效的 birthDate，格式应为 YYYY-MM-DD。",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      signKey: result.signKey,
      viewModel: result.viewModel,
      template: result.rawData,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ZodiacRequestPayload;
    return buildSuccessResponse(body);
  } catch (error) {
    console.error("[api/astrology/zodiac][POST]", error);
    return NextResponse.json(
      {
        success: false,
        error: "请求体不是合法 JSON。",
      },
      { status: 400 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    return buildSuccessResponse({
      birthDate: searchParams.get("birthDate"),
      profileName: searchParams.get("profileName"),
      profileKind: parseProfileKind(searchParams.get("profileKind")),
      limited: parseLimited(searchParams.get("limited")),
    });
  } catch (error) {
    console.error("[api/astrology/zodiac][GET]", error);
    return NextResponse.json(
      {
        success: false,
        error: "无法解析查询参数。",
      },
      { status: 400 },
    );
  }
}
