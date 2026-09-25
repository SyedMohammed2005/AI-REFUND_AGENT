"use client";

import { FormEvent, useState } from "react";

type Step = {
  tool: string;
  status: string;
  details: string;
};

type RefundResult = {
  success: boolean;
  status: string;
  message: string;
  sessionId?: string;
  refund?: {
    id: string;
    orderId: string;
    amount: string;
    status: string;
  };
  steps?: Step[];
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [reason, setReason] = useState("Customer requested a refund");
  const [result, setResult] = useState<RefundResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitRefund(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          orderNumber,
          reason,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch {
      setResult({
        success: false,
        status: "ERROR",
        message: "Unable to connect to the refund agent.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="mb-2 text-sm font-medium text-cyan-400">
            AI CUSTOMER SUPPORT
          </div>

          <h1 className="text-4xl font-bold">
            Refund Agent
          </h1>

          <p className="mt-2 text-slate-400">
            Policy-aware e-commerce refund automation with observable
            tool execution.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h2 className="text-xl font-semibold">
              Request a Refund
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Enter the customer and order information.
            </p>

            <form
              onSubmit={submitRefund}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Customer Email
                </label>

                <input
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="customer@example.com"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Order Number
                </label>

                <input
                  value={orderNumber}
                  onChange={(event) =>
                    setOrderNumber(event.target.value)
                  }
                  placeholder="ORD-1006"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Reason
                </label>

                <textarea
                  value={reason}
                  onChange={(event) =>
                    setReason(event.target.value)
                  }
                  rows={3}
                  required
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Agent Processing..." : "Request Refund"}
              </button>
            </form>

            <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950 p-4">
              <div className="text-sm font-semibold">
                Demo Cases
              </div>

              <div className="mt-3 space-y-2 text-sm text-slate-400">
                <div>
                  ✅ Successful: ORD-1006
                </div>
                <div>
                  ❌ Already refunded: ORD-1001
                </div>
                <div>
                  ❌ Expired: ORD-1002
                </div>
                <div>
                  ❌ Non-refundable: ORD-1004
                </div>
                <div>
                  ❌ Cancelled: ORD-1005
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Agent Execution
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Observable tool execution
                </p>
              </div>

              {result && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    result.success
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {result.status}
                </span>
              )}
            </div>

            {!result ? (
              <div className="flex min-h-[420px] items-center justify-center text-center text-slate-500">
                <div>
                  <div className="text-4xl">🤖</div>
                  <p className="mt-3">
                    Submit a refund request to see the agent workflow.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <div
                  className={`rounded-lg border p-4 ${
                    result.success
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-red-500/20 bg-red-500/5"
                  }`}
                >
                  <div className="font-semibold">
                    {result.message}
                  </div>

                  {result.refund && (
                    <div className="mt-2 text-sm text-slate-300">
                      Refund amount: ₹{result.refund.amount}
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  {result.steps?.map((step, index) => (
                    <div
                      key={`${step.tool}-${index}`}
                      className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-cyan-400">
                          {step.tool}
                        </span>

                        <span
                          className={`text-xs font-semibold ${
                            step.status === "SUCCESS"
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-400">
                        {step.details}
                      </p>
                    </div>
                  ))}
                </div>

                {result.sessionId && (
                  <div className="mt-6 text-xs text-slate-500">
                    Session: {result.sessionId}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}