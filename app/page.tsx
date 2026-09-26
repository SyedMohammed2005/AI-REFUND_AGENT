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

const demoCases = [
  {
    order: "ORD-1006",
    label: "Successful",
    description: "Eligible refund",
    type: "success",
    email: "neha.kapoor@example.com",
  },
  {
    order: "ORD-1001",
    label: "Already refunded",
    description: "Refund already processed",
    type: "danger",
    email: "aarav.sharma@example.com",
  },
  {
    order: "ORD-1002",
    label: "Expired",
    description: "30-day window expired",
    type: "danger",
    email: "priya.reddy@example.com",
  },
  {
    order: "ORD-1004",
    label: "Non-refundable",
    description: "Item is not refundable",
    type: "danger",
    email: "ananya.rao@example.com",
  },
  {
    order: "ORD-1005",
    label: "Cancelled",
    description: "Order was cancelled",
    type: "danger",
    email: "vikram.singh@example.com",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [reason, setReason] = useState(
    "Customer requested a refund",
  );
  const [result, setResult] = useState<RefundResult | null>(
    null,
  );
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
        message:
          "Unable to connect to the refund agent.",
      });
    } finally {
      setLoading(false);
    }
  }

  function selectDemoCase(
    demo: (typeof demoCases)[number],
  ) {
    setEmail(demo.email);
    setOrderNumber(demo.order);
    setReason("Customer requested a refund");
    setResult(null);
  }

  return (
    <main className="app">
      {/* Top navigation */}
      <nav className="navbar">
        <div className="nav-inner">
          <div className="brand">
            <div className="brand-mark">
              <span />
              <span />
            </div>

            <span className="brand-name">
              RefundFlow
            </span>

            <span className="brand-divider" />

            <span className="brand-section">
              Refund Agent
            </span>
          </div>

          <div className="nav-status">
            <span className="online-dot" />
            <span>Agent Online</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              AI CUSTOMER SUPPORT
            </div>

            <h1>
              Refunds handled
              <br />
              <span>with intelligence.</span>
            </h1>

            <p>
              A policy-aware AI support agent that verifies
              customer data, checks refund eligibility, and
              processes approved refunds using real backend
              tools.
            </p>

            <div className="feature-row">
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div>
                  <strong>Policy-aware</strong>
                  <span>Rules are verified</span>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">↯</div>
                <div>
                  <strong>Tool-driven</strong>
                  <span>Real database actions</span>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">◉</div>
                <div>
                  <strong>Observable</strong>
                  <span>Execution is tracked</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Companion */}
          <div className="companion-area">
            <div className="speech-bubble">
              <span>How can I help?</span>
            </div>

            <div className="companion-shadow" />

            <div className="companion">
              <div className="antenna">
                <span />
              </div>

              <div className="head">
                <div className="face">
                  <div className="eye left-eye">
                    <span />
                  </div>

                  <div className="eye right-eye">
                    <span />
                  </div>

                  <div className="smile" />
                </div>

                <div className="side-light left" />
                <div className="side-light right" />
              </div>

              <div className="body">
                <div className="chest">
                  <div className="chest-dot" />
                </div>

                <div className="arm left-arm" />
                <div className="arm right-arm" />
              </div>
            </div>

            <div className="companion-caption">
              <span className="status-dot" />
              AI support assistant
            </div>
          </div>
        </div>
      </section>

      {/* Main workspace */}
      <section className="workspace">
        <div className="workspace-grid">
          {/* Request card */}
          <div>
            <section className="card request-card">
              <div className="card-heading">
                <div className="heading-icon blue">
                  <span>↗</span>
                </div>

                <div>
                  <h2>Request a refund</h2>
                  <p>
                    Provide the customer and order details
                    below.
                  </p>
                </div>
              </div>

              <form
                onSubmit={submitRefund}
                className="refund-form"
              >
                <div className="field">
                  <label>Customer email</label>

                  <div className="input-wrapper">
                    <span className="input-icon">
                      @
                    </span>

                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="customer@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Order number</label>

                  <div className="input-wrapper">
                    <span className="input-icon">
                      #
                    </span>

                    <input
                      value={orderNumber}
                      onChange={(event) =>
                        setOrderNumber(event.target.value)
                      }
                      placeholder="ORD-1006"
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Refund reason</label>

                  <textarea
                    value={reason}
                    onChange={(event) =>
                      setReason(event.target.value)
                    }
                    rows={4}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="submit-button"
                >
                  {loading ? (
                    <>
                      <span className="button-spinner" />
                      Agent is working...
                    </>
                  ) : (
                    <>
                      <span>↗</span>
                      Request refund
                    </>
                  )}
                </button>
              </form>

              <div className="form-footer">
                <span>🔒 Secure processing</span>
                <span>•</span>
                <span>Policy verified</span>
                <span>•</span>
                <span>Powered by Gemini</span>
              </div>
            </section>

            {/* Demo cases */}
            <section className="card demo-card">
              <div className="demo-heading">
                <div>
                  <h2>Try a demo case</h2>
                  <p>
                    Select a scenario to quickly test the
                    agent.
                  </p>
                </div>

                <span className="demo-label">
                  5 scenarios
                </span>
              </div>

              <div className="demo-list">
                {demoCases.map((demo) => (
                  <button
                    key={demo.order}
                    type="button"
                    onClick={() =>
                      selectDemoCase(demo)
                    }
                    className="demo-item"
                  >
                    <div
                      className={`demo-status ${demo.type}`}
                    >
                      {demo.type === "success"
                        ? "✓"
                        : "×"}
                    </div>

                    <div className="demo-info">
                      <strong>{demo.order}</strong>
                      <span>{demo.description}</span>
                    </div>

                    <span
                      className={`demo-pill ${demo.type}`}
                    >
                      {demo.label}
                    </span>

                    <span className="demo-arrow">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Execution card */}
          <section className="card execution-card">
            <div className="execution-heading">
              <div className="card-heading">
                <div className="heading-icon purple">
                  <span>✦</span>
                </div>

                <div>
                  <h2>Agent execution</h2>
                  <p>
                    See how the AI processes your request.
                  </p>
                </div>
              </div>

              {result && (
                <span
                  className={`result-badge ${
                    result.success
                      ? "completed"
                      : "denied"
                  }`}
                >
                  <span />
                  {result.status}
                </span>
              )}
            </div>

            {!result && !loading ? (
              <div className="empty-execution">
                <div className="mini-companion">
                  <div className="mini-face">
                    <span />
                    <span />
                    <i />
                  </div>
                </div>

                <h3>Your AI assistant is ready</h3>

                <p>
                  Submit a refund request and watch the
                  agent verify the customer, inspect the
                  order, and apply the refund policy.
                </p>

                <div className="ready-status">
                  <span />
                  Waiting for request
                </div>
              </div>
            ) : loading ? (
              <div className="processing-state">
                <div className="processing-orb">
                  <div className="processing-eye" />
                  <div className="processing-eye" />
                </div>

                <h3>Agent is processing</h3>

                <p>
                  Checking customer details and refund
                  policy...
                </p>

                <div className="processing-line">
                  <span />
                </div>
              </div>
            ) : (
              <div className="execution-content">
                <div
                  className={`result-message ${
                    result?.success
                      ? "success-message"
                      : "denied-message"
                  }`}
                >
                  <div className="result-icon">
                    {result?.success ? "✓" : "!"}
                  </div>

                  <div>
                    <strong>
                      {result?.success
                        ? "Refund request processed"
                        : "Refund request denied"}
                    </strong>

                    <p>{result?.message}</p>
                  </div>
                </div>

                {result?.refund && (
                  <div className="refund-summary">
                    <div>
                      <span>Refund amount</span>
                      <strong>
                        ₹{result.refund.amount}
                      </strong>
                    </div>

                    <div>
                      <span>Order</span>
                      <strong>
                        {result.refund.orderId}
                      </strong>
                    </div>

                    <div>
                      <span>Status</span>
                      <strong>
                        {result.refund.status}
                      </strong>
                    </div>
                  </div>
                )}

                <div className="steps-heading">
                  <div>
                    <h3>Execution steps</h3>
                    <p>
                      Observable tool activity from this
                      request.
                    </p>
                  </div>

                  {result?.steps && (
                    <span>
                      {result.steps.filter(
                        (step) =>
                          step.status === "SUCCESS",
                      ).length}{" "}
                      successful
                    </span>
                  )}
                </div>

                <div className="steps">
                  {result?.steps?.map((step, index) => (
                    <div
                      key={`${step.tool}-${index}`}
                      className="step"
                    >
                      <div
                        className={`step-icon ${
                          step.status === "SUCCESS"
                            ? "success-step"
                            : "failed-step"
                        }`}
                      >
                        {step.status === "SUCCESS"
                          ? "✓"
                          : "!"}
                      </div>

                      <div className="step-main">
                        <div className="step-title">
                          <strong>
                            {step.tool}
                          </strong>

                          <span
                            className={
                              step.status ===
                              "SUCCESS"
                                ? "success-text"
                                : "failed-text"
                            }
                          >
                            {step.status}
                          </span>
                        </div>

                        <p>{step.details}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {result?.sessionId && (
                  <div className="session-box">
                    <div>
                      <span>Execution session</span>
                      <strong>
                        {result.sessionId}
                      </strong>
                    </div>

                    <a
                      href={`/admin?sessionId=${encodeURIComponent(
                        result.sessionId,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open monitor →
                    </a>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </section>

      <footer className="footer">
        <span>RefundFlow AI</span>
        <span>Policy-aware customer support automation</span>
      </footer>

      <style jsx>{`
        .app {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 80% 8%,
              rgba(219, 234, 254, 0.75),
              transparent 30%
            ),
            #f6f8fb;
          color: #172033;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        /* NAVBAR */

        .navbar {
          height: 66px;
          background: rgba(255, 255, 255, 0.9);
          border-bottom: 1px solid #e4e7ec;
          backdrop-filter: blur(12px);
        }

        .nav-inner {
          width: min(1240px, calc(100% - 40px));
          height: 100%;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .brand-mark {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
        }

        .brand-mark span {
          width: 4px;
          height: 11px;
          border-radius: 3px;
          background: white;
        }

        .brand-mark span:last-child {
          height: 16px;
          opacity: 0.75;
        }

        .brand-name {
          color: #101828;
          font-size: 15px;
          font-weight: 750;
          letter-spacing: -0.01em;
        }

        .brand-divider {
          width: 1px;
          height: 20px;
          background: #d0d5dd;
          margin: 0 4px;
        }

        .brand-section {
          color: #667085;
          font-size: 13px;
        }

        .nav-status {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 11px;
          border-radius: 999px;
          background: #ecfdf3;
          color: #067647;
          font-size: 12px;
          font-weight: 650;
        }

        .online-dot,
        .status-dot,
        .ready-status span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #12b76a;
        }

        /* HERO */

        .hero {
          border-bottom: 1px solid #e4e7ec;
          background:
            linear-gradient(
              115deg,
              #ffffff 0%,
              #f7faff 55%,
              #eef5ff 100%
            );
          overflow: hidden;
        }

        .hero-inner {
          width: min(1240px, calc(100% - 40px));
          min-height: 350px;
          margin: auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
        }

        .hero-copy {
          padding: 54px 0;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 10px;
          font-weight: 750;
          letter-spacing: 0.08em;
        }

        .eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3b82f6;
        }

        .hero h1 {
          margin: 17px 0 0;
          color: #101828;
          font-size: clamp(38px, 4vw, 54px);
          line-height: 1.06;
          letter-spacing: -0.045em;
          font-weight: 760;
        }

        .hero h1 span {
          color: #2563eb;
        }

        .hero-copy > p {
          max-width: 590px;
          margin: 17px 0 0;
          color: #667085;
          font-size: 15px;
          line-height: 1.7;
        }

        .feature-row {
          display: flex;
          gap: 28px;
          margin-top: 27px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .feature-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          background: #eaf2ff;
          color: #2563eb;
          font-size: 13px;
          font-weight: 800;
        }

        .feature div:last-child {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .feature strong {
          color: #344054;
          font-size: 11px;
        }

        .feature span {
          color: #98a2b3;
          font-size: 10px;
        }

        /* AI COMPANION */

        .companion-area {
          position: relative;
          min-height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .speech-bubble {
          position: absolute;
          top: 44px;
          left: 12%;
          padding: 10px 15px;
          background: white;
          border: 1px solid #dbe4f0;
          border-radius: 13px 13px 13px 4px;
          box-shadow: 0 7px 20px rgba(16, 24, 40, 0.08);
          color: #344054;
          font-size: 11px;
          font-weight: 650;
          animation: bubbleFloat 4s ease-in-out infinite;
        }

        .companion {
          position: relative;
          width: 190px;
          height: 225px;
          margin-top: 25px;
          animation: companionFloat 4s ease-in-out infinite;
        }

        .antenna {
          position: absolute;
          z-index: 1;
          top: 0;
          left: 50%;
          width: 3px;
          height: 31px;
          transform: translateX(-50%);
          background: #94a3b8;
        }

        .antenna span {
          position: absolute;
          top: -7px;
          left: 50%;
          width: 13px;
          height: 13px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: #60a5fa;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.55);
        }

        .head {
          position: absolute;
          top: 25px;
          left: 18px;
          width: 154px;
          height: 112px;
          border-radius: 39px;
          background: linear-gradient(
            145deg,
            #ffffff,
            #e8eef7
          );
          border: 1px solid #d5deeb;
          box-shadow:
            0 16px 35px rgba(30, 64, 175, 0.12),
            inset 0 1px 0 white;
        }

        .face {
          position: absolute;
          inset: 13px;
          border-radius: 30px;
          background: #162238;
          box-shadow:
            inset 0 3px 12px rgba(0, 0, 0, 0.3),
            0 0 0 1px #223451;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 27px;
        }

        .eye {
          position: relative;
          width: 20px;
          height: 27px;
          border-radius: 50%;
          background: #79b6ff;
          box-shadow:
            0 0 13px rgba(96, 165, 250, 0.9),
            inset 0 0 6px white;
          animation: blink 5s infinite;
        }

        .eye span {
          position: absolute;
          top: 4px;
          left: 5px;
          width: 6px;
          height: 7px;
          border-radius: 50%;
          background: white;
          opacity: 0.85;
        }

        .smile {
          position: absolute;
          bottom: 17px;
          left: 50%;
          width: 25px;
          height: 10px;
          transform: translateX(-50%);
          border-bottom: 2px solid #76b7ff;
          border-radius: 50%;
        }

        .side-light {
          position: absolute;
          top: 45px;
          width: 8px;
          height: 24px;
          border-radius: 5px;
          background: #93c5fd;
        }

        .side-light.left {
          left: -5px;
        }

        .side-light.right {
          right: -5px;
        }

        .body {
          position: absolute;
          top: 128px;
          left: 44px;
          width: 102px;
          height: 82px;
          border-radius: 27px 27px 34px 34px;
          background: linear-gradient(
            145deg,
            #f8fafc,
            #dbe5f1
          );
          border: 1px solid #ccd7e5;
        }

        .chest {
          position: absolute;
          top: 20px;
          left: 50%;
          width: 43px;
          height: 31px;
          transform: translateX(-50%);
          border-radius: 11px;
          background: #e9f2ff;
          border: 1px solid #c9dcf7;
          display: grid;
          place-items: center;
        }

        .chest-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #3b82f6;
          box-shadow: 0 0 9px rgba(59, 130, 246, 0.7);
          animation: pulse 2s infinite;
        }

        .arm {
          position: absolute;
          top: 13px;
          width: 17px;
          height: 57px;
          border-radius: 12px;
          background: #d7e2ef;
          border: 1px solid #c5d2e2;
        }

        .left-arm {
          left: -13px;
          transform: rotate(13deg);
        }

        .right-arm {
          right: -13px;
          transform: rotate(-13deg);
        }

        .companion-shadow {
          position: absolute;
          bottom: 36px;
          width: 170px;
          height: 18px;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.1);
          filter: blur(7px);
          animation: shadowPulse 4s ease-in-out infinite;
        }

        .companion-caption {
          position: absolute;
          bottom: 16px;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #667085;
          font-size: 10px;
          font-weight: 600;
        }

        /* WORKSPACE */

        .workspace {
          width: min(1240px, calc(100% - 40px));
          margin: 28px auto 0;
        }

        .workspace-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          gap: 20px;
          align-items: start;
        }

        .card {
          background: white;
          border: 1px solid #e4e7ec;
          border-radius: 14px;
          box-shadow: 0 4px 15px rgba(16, 24, 40, 0.045);
        }

        .request-card {
          padding: 24px;
        }

        .card-heading {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .heading-icon {
          width: 35px;
          height: 35px;
          flex: 0 0 35px;
          border-radius: 9px;
          display: grid;
          place-items: center;
          font-size: 16px;
          font-weight: 800;
        }

        .heading-icon.blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .heading-icon.purple {
          background: #f4f3ff;
          color: #6941c6;
        }

        .card-heading h2 {
          margin: 0;
          color: #1d2939;
          font-size: 16px;
          font-weight: 700;
        }

        .card-heading p {
          margin: 3px 0 0;
          color: #98a2b3;
          font-size: 11px;
        }

        .refund-form {
          margin-top: 23px;
        }

        .field {
          margin-bottom: 16px;
        }

        .field label {
          display: block;
          margin-bottom: 7px;
          color: #344054;
          font-size: 12px;
          font-weight: 650;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          top: 50%;
          left: 13px;
          transform: translateY(-50%);
          color: #98a2b3;
          font-size: 13px;
          font-weight: 700;
        }

        .input-wrapper input,
        .field textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d0d5dd;
          border-radius: 8px;
          background: #fff;
          color: #1d2939;
          outline: none;
          font-family: inherit;
          font-size: 13px;
          transition:
            border 0.15s,
            box-shadow 0.15s;
        }

        .input-wrapper input {
          height: 43px;
          padding: 0 13px 0 37px;
        }

        .field textarea {
          resize: vertical;
          min-height: 90px;
          padding: 12px 13px;
          line-height: 1.5;
        }

        .input-wrapper input:focus,
        .field textarea:focus {
          border-color: #84a9f5;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .input-wrapper input::placeholder,
        .field textarea::placeholder {
          color: #b0b7c3;
        }

        .submit-button {
          width: 100%;
          height: 44px;
          border: 0;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition:
            background 0.15s,
            transform 0.15s;
        }

        .submit-button:hover:not(:disabled) {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .submit-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .button-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .form-footer {
          margin-top: 14px;
          display: flex;
          justify-content: center;
          gap: 7px;
          color: #98a2b3;
          font-size: 9px;
        }

        /* DEMO */

        .demo-card {
          margin-top: 16px;
          padding: 20px;
        }

        .demo-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .demo-heading h2 {
          margin: 0;
          color: #344054;
          font-size: 14px;
        }

        .demo-heading p {
          margin: 3px 0 0;
          color: #98a2b3;
          font-size: 10px;
        }

        .demo-label {
          padding: 5px 8px;
          border-radius: 999px;
          background: #f2f4f7;
          color: #667085;
          font-size: 9px;
          font-weight: 650;
        }

        .demo-list {
          margin-top: 13px;
          display: grid;
          gap: 6px;
        }

        .demo-item {
          width: 100%;
          border: 1px solid #eaecf0;
          border-radius: 8px;
          background: #fff;
          padding: 9px 10px;
          display: flex;
          align-items: center;
          gap: 9px;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition:
            background 0.15s,
            border 0.15s,
            transform 0.15s;
        }

        .demo-item:hover {
          background: #f9fafb;
          border-color: #cfd8e5;
          transform: translateX(2px);
        }

        .demo-status {
          width: 22px;
          height: 22px;
          flex: 0 0 22px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 800;
        }

        .demo-status.success {
          background: #ecfdf3;
          color: #067647;
        }

        .demo-status.danger {
          background: #fef3f2;
          color: #d92d20;
        }

        .demo-info {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .demo-info strong {
          color: #344054;
          font-size: 11px;
        }

        .demo-info span {
          color: #98a2b3;
          font-size: 9px;
        }

        .demo-pill {
          padding: 4px 7px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 700;
          white-space: nowrap;
        }

        .demo-pill.success {
          background: #ecfdf3;
          color: #067647;
        }

        .demo-pill.danger {
          background: #fef3f2;
          color: #b42318;
        }

        .demo-arrow {
          color: #98a2b3;
          font-size: 12px;
        }

        /* EXECUTION */

        .execution-card {
          min-height: 520px;
          padding: 24px;
        }

        .execution-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        .result-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 750;
        }

        .result-badge span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .result-badge.completed {
          background: #ecfdf3;
          color: #067647;
        }

        .result-badge.completed span {
          background: #12b76a;
        }

        .result-badge.denied {
          background: #fef3f2;
          color: #b42318;
        }

        .result-badge.denied span {
          background: #f04438;
        }

        .empty-execution {
          min-height: 410px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 25px;
        }

        .mini-companion {
          width: 72px;
          height: 72px;
          border-radius: 22px;
          background: #eef5ff;
          border: 1px solid #dbe7f7;
          display: grid;
          place-items: center;
          margin-bottom: 17px;
        }

        .mini-face {
          width: 50px;
          height: 36px;
          border-radius: 13px;
          background: #17243a;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          position: relative;
        }

        .mini-face span {
          width: 7px;
          height: 10px;
          border-radius: 50%;
          background: #70b2ff;
          box-shadow: 0 0 7px rgba(96, 165, 250, 0.8);
          animation: blink 5s infinite;
        }

        .mini-face i {
          position: absolute;
          bottom: 6px;
          left: 50%;
          width: 11px;
          height: 5px;
          transform: translateX(-50%);
          border-bottom: 1px solid #70b2ff;
          border-radius: 50%;
        }

        .empty-execution h3,
        .processing-state h3 {
          margin: 0;
          color: #344054;
          font-size: 14px;
        }

        .empty-execution > p,
        .processing-state > p {
          max-width: 350px;
          margin: 7px 0 15px;
          color: #98a2b3;
          font-size: 11px;
          line-height: 1.6;
        }

        .ready-status {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #667085;
          font-size: 10px;
          font-weight: 600;
        }

        /* PROCESSING */

        .processing-state {
          min-height: 410px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .processing-orb {
          width: 76px;
          height: 76px;
          margin-bottom: 18px;
          border-radius: 24px;
          background: #eef5ff;
          border: 1px solid #dbe7f7;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          animation: processingPulse 1.8s infinite;
        }

        .processing-eye {
          width: 9px;
          height: 17px;
          border-radius: 50%;
          background: #3b82f6;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
          animation: blink 2.4s infinite;
        }

        .processing-line {
          width: 190px;
          height: 4px;
          border-radius: 999px;
          background: #edf0f4;
          overflow: hidden;
        }

        .processing-line span {
          display: block;
          width: 45%;
          height: 100%;
          border-radius: inherit;
          background: #3b82f6;
          animation: progress 1.4s infinite ease-in-out;
        }

        /* RESULT */

        .execution-content {
          margin-top: 21px;
        }

        .result-message {
          display: flex;
          gap: 11px;
          padding: 15px;
          border-radius: 9px;
          border: 1px solid;
        }

        .success-message {
          background: #f0fdf7;
          border-color: #d1fadf;
        }

        .denied-message {
          background: #fff7f6;
          border-color: #fee4e2;
        }

        .result-icon {
          width: 27px;
          height: 27px;
          flex: 0 0 27px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 12px;
          font-weight: 800;
        }

        .success-message .result-icon {
          background: #12b76a;
          color: white;
        }

        .denied-message .result-icon {
          background: #f04438;
          color: white;
        }

        .result-message strong {
          display: block;
          color: #344054;
          font-size: 12px;
        }

        .result-message p {
          margin: 4px 0 0;
          color: #667085;
          font-size: 11px;
          line-height: 1.55;
        }

        .refund-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          margin-top: 13px;
          padding: 13px;
          border: 1px solid #eaecf0;
          border-radius: 8px;
          background: #f9fafb;
        }

        .refund-summary > div {
          padding: 0 12px;
          border-right: 1px solid #eaecf0;
        }

        .refund-summary > div:first-child {
          padding-left: 0;
        }

        .refund-summary > div:last-child {
          border-right: 0;
        }

        .refund-summary span {
          display: block;
          color: #98a2b3;
          font-size: 9px;
          margin-bottom: 4px;
        }

        .refund-summary strong {
          color: #344054;
          font-size: 12px;
        }

        .steps-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 22px;
          margin-bottom: 9px;
        }

        .steps-heading h3 {
          margin: 0;
          color: #344054;
          font-size: 12px;
        }

        .steps-heading p {
          margin: 3px 0 0;
          color: #98a2b3;
          font-size: 9px;
        }

        .steps-heading > span {
          padding: 5px 8px;
          border-radius: 999px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 9px;
          font-weight: 650;
        }

        .steps {
          display: grid;
          gap: 6px;
        }

        .step {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 11px;
          border: 1px solid #eaecf0;
          border-radius: 8px;
          background: white;
        }

        .step-icon {
          width: 23px;
          height: 23px;
          flex: 0 0 23px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          font-size: 10px;
          font-weight: 800;
        }

        .success-step {
          background: #ecfdf3;
          color: #067647;
        }

        .failed-step {
          background: #fef3f2;
          color: #b42318;
        }

        .step-main {
          flex: 1;
          min-width: 0;
        }

        .step-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .step-title strong {
          color: #344054;
          font-family:
            "SFMono-Regular",
            Consolas,
            monospace;
          font-size: 11px;
        }

        .success-text {
          color: #067647;
          font-size: 9px;
          font-weight: 750;
        }

        .failed-text {
          color: #b42318;
          font-size: 9px;
          font-weight: 750;
        }

        .step p {
          margin: 3px 0 0;
          color: #98a2b3;
          font-size: 9px;
        }

        .session-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 12px;
          padding: 11px 12px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #eaecf0;
        }

        .session-box div {
          min-width: 0;
        }

        .session-box span {
          display: block;
          color: #98a2b3;
          font-size: 8px;
          margin-bottom: 3px;
        }

        .session-box strong {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #667085;
          font-family:
            "SFMono-Regular",
            Consolas,
            monospace;
          font-size: 9px;
          font-weight: 500;
        }

        .session-box a {
          color: #2563eb;
          font-size: 9px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
        }

        .session-box a:hover {
          text-decoration: underline;
        }

        /* FOOTER */

        .footer {
          width: min(1240px, calc(100% - 40px));
          margin: 30px auto 0;
          padding: 20px 0 35px;
          border-top: 1px solid #e4e7ec;
          display: flex;
          justify-content: space-between;
          color: #98a2b3;
          font-size: 10px;
        }

        .footer span:first-child {
          color: #667085;
          font-weight: 700;
        }

        /* ANIMATIONS */

        @keyframes blink {
          0%,
          42%,
          46%,
          100% {
            transform: scaleY(1);
          }

          44% {
            transform: scaleY(0.08);
          }
        }

        @keyframes companionFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes bubbleFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes shadowPulse {
          0%,
          100% {
            transform: scaleX(1);
            opacity: 0.7;
          }

          50% {
            transform: scaleX(0.82);
            opacity: 0.4;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0.45;
          }
        }

        @keyframes processingPulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.05);
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-110%);
          }

          100% {
            transform: translateX(330%);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .hero-inner {
            grid-template-columns: 1fr;
          }

          .hero-copy {
            padding-bottom: 20px;
          }

          .companion-area {
            min-height: 290px;
          }

          .workspace-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .navbar {
            height: 58px;
          }

          .nav-inner,
          .hero-inner,
          .workspace,
          .footer {
            width: min(100% - 28px, 1240px);
          }

          .brand-section,
          .brand-divider {
            display: none;
          }

          .nav-status {
            padding: 6px 8px;
            font-size: 10px;
          }

          .hero-copy {
            padding: 36px 0 10px;
          }

          .hero h1 {
            font-size: 38px;
          }

          .hero-copy > p {
            font-size: 13px;
          }

          .feature-row {
            flex-direction: column;
            gap: 10px;
          }

          .companion-area {
            min-height: 255px;
          }

          .companion {
            transform: scale(0.82);
            margin-top: 10px;
          }

          .speech-bubble {
            top: 25px;
            left: 12%;
          }

          .request-card,
          .execution-card {
            padding: 18px;
          }

          .form-footer {
            flex-wrap: wrap;
          }

          .refund-summary {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .refund-summary > div,
          .refund-summary > div:first-child {
            padding: 0;
            border-right: 0;
          }

          .footer {
            flex-direction: column;
            gap: 5px;
          }
        }
      `}</style>
    </main>
  );
}
