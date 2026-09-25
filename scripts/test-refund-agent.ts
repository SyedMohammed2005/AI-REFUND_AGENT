import "dotenv/config";

import { runRefundAgent } from "../server/agent/refund-agent";

async function main() {
  const result = await runRefundAgent({
    email: "manish.gupta@example.com",
    orderNumber: "ORD-1015",
    reason: "Customer requested a refund",
  });

  console.log("\n===== REFUND AGENT RESULT =====\n");

  console.log("Success:", result.success);
  console.log("Status:", result.status);
  console.log("Message:", result.message);
  console.log("Session ID:", result.sessionId);

  console.log("\n===== EXECUTION STEPS =====\n");

  for (const step of result.steps) {
    console.log(
      `[${step.status}] ${step.tool} - ${step.details}`,
    );
  }
}

main()
  .catch((error) => {
    console.error("\nRefund agent test failed:");
    console.error(error);
    process.exit(1);
  });