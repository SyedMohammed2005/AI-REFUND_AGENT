import { NextRequest, NextResponse } from "next/server";
import { runRefundAgent } from "../../../server/agent/refund-agent";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, orderNumber, reason } = body;

    if (!email || !orderNumber || !reason) {
      return NextResponse.json(
        {
          success: false,
          message:
            "email, orderNumber, and reason are required.",
        },
        { status: 400 },
      );
    }

    const result = await runRefundAgent({
      email,
      orderNumber,
      reason,
    });

    return NextResponse.json(result, {
      status: result.success ? 200 : 422,
    });
  } catch (error) {
    console.error("Refund API error:", error);

    return NextResponse.json(
      {
        success: false,
        status: "ERROR",
        message:
          "An unexpected error occurred while processing the refund.",
      },
      { status: 500 },
    );
  }
}