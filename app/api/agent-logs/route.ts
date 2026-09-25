import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("sessionId");

    const logs = await prisma.agentLog.findMany({
      where: sessionId ? { sessionId } : undefined,
      orderBy: {
        createdAt: "asc",
      },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error("Agent logs error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load agent logs.",
      },
      { status: 500 },
    );
  }
}