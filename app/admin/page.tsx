"use client";

import { useEffect, useMemo, useState } from "react";

type AgentLog = {
  id: string;
  sessionId: string;
  customerId: string | null;
  orderId: string | null;
  event: string;
  toolName: string | null;
  status: "STARTED" | "SUCCESS" | "FAILED";
  details: Record<string, unknown> | null;
  createdAt: string;
};

export default function AdminPage() {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [live, setLive] = useState(true);

  async function loadLogs(
    currentSessionId?: string,
    showLoading = true,
  ) {
    if (showLoading) {
      setLoading(true);
    }

    setError("");

    try {
      const query = currentSessionId
        ? `?sessionId=${encodeURIComponent(currentSessionId)}`
        : "";

      const response = await fetch(
        `/api/agent-logs${query}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load agent logs.",
        );
      }

      setLogs(data.logs ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load agent logs.",
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  /*
   * Read ?sessionId=... from the URL.
   */
  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search,
    );

    const urlSessionId = params.get("sessionId");

    if (urlSessionId) {
      setSessionId(urlSessionId);
      loadLogs(urlSessionId);
    } else {
      loadLogs();
    }
  }, []);

  /*
   * Poll the database every 2 seconds.
   */
  useEffect(() => {
    if (!live) {
      return;
    }

    const interval = window.setInterval(() => {
      loadLogs(sessionId.trim() || undefined, false);
    }, 2000);

    return () => {
      window.clearInterval(interval);
    };
  }, [sessionId, live]);

  const statistics = useMemo(() => {
    return {
      total: logs.length,

      successful: logs.filter(
        (log) => log.status === "SUCCESS",
      ).length,

      failed: logs.filter(
        (log) => log.status === "FAILED",
      ).length,

      tools: new Set(
        logs
          .map((log) => log.toolName)
          .filter(Boolean),
      ).size,
    };
  }, [logs]);

  function handleSessionSearch(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    const value = sessionId.trim();

    if (value) {
      window.history.replaceState(
        null,
        "",
        `/admin?sessionId=${encodeURIComponent(value)}`,
      );

      loadLogs(value);
    } else {
      window.history.replaceState(
        null,
        "",
        "/admin",
      );

      loadLogs();
    }
  }

  function showAllLogs() {
    setSessionId("");

    window.history.replaceState(
      null,
      "",
      "/admin",
    );

    loadLogs();
  }

  function formatDate(value: string) {
    return new Date(value).toLocaleString();
  }

  function getStatusClass(
    status: AgentLog["status"],
  ) {
    if (status === "SUCCESS") {
      return "status-success";
    }

    if (status === "FAILED") {
      return "status-failed";
    }

    return "status-started";
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        {/* Header */}
        <header className="page-header">
          <div>
            <div className="eyebrow">
              CUSTOMER SUPPORT OPERATIONS
            </div>

            <h1>Agent Monitor</h1>

            <p>
              Monitor refund-agent execution, tool
              activity, and processing events.
            </p>
          </div>

          <div className="header-actions">
            <div
              className={`monitor-status ${
                live ? "monitor-live" : "monitor-paused"
              }`}
            >
              <span />
              {live ? "Live monitoring" : "Monitoring paused"}
            </div>

            <button
              className="refresh-button"
              onClick={() =>
                loadLogs(
                  sessionId.trim() || undefined,
                )
              }
              disabled={loading}
            >
              {loading
                ? "Refreshing..."
                : "Refresh logs"}
            </button>
          </div>
        </header>

        {/* Session Search */}
        <section className="search-card">
          <div>
            <h2>Execution session</h2>

            <p>
              Filter the activity stream using a
              refund-agent session ID.
            </p>
          </div>

          <form
            className="search-form"
            onSubmit={handleSessionSearch}
          >
            <input
              value={sessionId}
              onChange={(event) =>
                setSessionId(event.target.value)
              }
              placeholder="Enter session ID"
            />

            <button type="submit">
              View session
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={showAllLogs}
            >
              All logs
            </button>
          </form>
        </section>

        {/* Current Session */}
        {sessionId && (
          <div className="session-banner">
            <div>
              <span>Viewing session</span>
              <strong>{sessionId}</strong>
            </div>

            <button
              onClick={() => setLive((value) => !value)}
            >
              {live ? "Pause live updates" : "Resume live updates"}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-banner">
            <strong>Unable to load logs.</strong>
            <span>{error}</span>
          </div>
        )}

        {/* Stats */}
        <section className="stats-grid">
          <div className="stat-card">
            <span>Total events</span>
            <strong>{statistics.total}</strong>
          </div>

          <div className="stat-card">
            <span>Successful events</span>
            <strong>{statistics.successful}</strong>
          </div>

          <div className="stat-card">
            <span>Failed events</span>
            <strong>{statistics.failed}</strong>
          </div>

          <div className="stat-card">
            <span>Tools used</span>
            <strong>{statistics.tools}</strong>
          </div>
        </section>

        {/* Execution Timeline */}
        <section className="logs-card">
          <div className="logs-header">
            <div>
              <h2>Execution activity</h2>

              <p>
                Observable agent events from the refund
                processing workflow.
              </p>
            </div>

            <span className="live-indicator">
              <span className={live ? "active-dot" : ""} />
              {live ? "Monitoring" : "Paused"}
            </span>
          </div>

          {logs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⌁</div>

              <h3>No execution logs found</h3>

              <p>
                Process a refund request and return here
                to monitor the agent activity.
              </p>
            </div>
          ) : (
            <div className="timeline">
              {logs.map((log, index) => (
                <div
                  className="timeline-item"
                  key={log.id}
                >
                  <div className="timeline-marker">
                    <span
                      className={
                        log.status === "FAILED"
                          ? "marker-failed"
                          : log.status === "SUCCESS"
                            ? "marker-success"
                            : "marker-started"
                      }
                    />

                    {index !== logs.length - 1 && (
                      <div className="timeline-line" />
                    )}
                  </div>

                  <div className="log-content">
                    <div className="log-top">
                      <div>
                        <div className="log-title">
                          {log.toolName ||
                            log.event
                              .replaceAll("_", " ")
                              .toLowerCase()}
                        </div>

                        <div className="log-event">
                          {log.event.replaceAll(
                            "_",
                            " ",
                          )}
                        </div>
                      </div>

                      <span
                        className={`status-badge ${getStatusClass(
                          log.status,
                        )}`}
                      >
                        {log.status}
                      </span>
                    </div>

                    <div className="log-meta">
                      <span>
                        {formatDate(log.createdAt)}
                      </span>

                      {log.customerId && (
                        <span>
                          Customer: {log.customerId}
                        </span>
                      )}

                      {log.orderId && (
                        <span>
                          Order: {log.orderId}
                        </span>
                      )}
                    </div>

                    {log.details && (
                      <div className="details-box">
                        {Object.entries(
                          log.details,
                        ).map(([key, value]) => (
                          <div
                            className="detail-row"
                            key={key}
                          >
                            <span>{key}</span>

                            <strong>
                              {typeof value ===
                              "object"
                                ? JSON.stringify(value)
                                : String(value)}
                            </strong>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #f5f7fa;
          color: #172033;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          padding: 40px 24px 64px;
        }

        .admin-shell {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
        }

        .eyebrow {
          color: #667085;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          margin-bottom: 9px;
        }

        h1 {
          margin: 0;
          color: #111827;
          font-size: 34px;
          line-height: 1.15;
          letter-spacing: -0.025em;
          font-weight: 700;
        }

        .page-header p {
          margin: 9px 0 0;
          color: #667085;
          font-size: 15px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .monitor-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 12px;
          border-radius: 8px;
          border: 1px solid #eaecf0;
          background: #fff;
          font-size: 11px;
          font-weight: 600;
        }

        .monitor-status span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .monitor-live {
          color: #067647;
        }

        .monitor-live span {
          background: #12b76a;
          box-shadow: 0 0 0 3px #ecfdf3;
        }

        .monitor-paused {
          color: #667085;
        }

        .monitor-paused span {
          background: #98a2b3;
        }

        .refresh-button,
        .search-form button {
          border: 0;
          border-radius: 8px;
          background: #1d4ed8;
          color: white;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .refresh-button:hover,
        .search-form button:hover {
          background: #1e40af;
        }

        .refresh-button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .search-card,
        .logs-card,
        .stat-card {
          background: #ffffff;
          border: 1px solid #e4e7ec;
          box-shadow: 0 2px 8px rgba(16, 24, 40, 0.04);
        }

        .search-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          padding: 22px;
          border-radius: 12px;
          margin-bottom: 12px;
        }

        .search-card h2,
        .logs-header h2 {
          margin: 0;
          color: #1d2939;
          font-size: 16px;
          font-weight: 650;
        }

        .search-card p,
        .logs-header p {
          margin: 5px 0 0;
          color: #667085;
          font-size: 13px;
        }

        .search-form {
          display: flex;
          gap: 8px;
          min-width: min(520px, 100%);
        }

        .search-form input {
          min-width: 280px;
          flex: 1;
          height: 40px;
          border: 1px solid #d0d5dd;
          border-radius: 8px;
          padding: 0 12px;
          outline: none;
          color: #1d2939;
          background: #fff;
          font-size: 13px;
        }

        .search-form input:focus {
          border-color: #84a9f5;
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.08);
        }

        .secondary-button {
          background: #ffffff !important;
          color: #344054 !important;
          border: 1px solid #d0d5dd !important;
        }

        .secondary-button:hover {
          background: #f9fafb !important;
        }

        .session-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
          padding: 13px 16px;
          border: 1px solid #dbe7ff;
          border-radius: 9px;
          background: #f8fbff;
        }

        .session-banner span {
          display: block;
          margin-bottom: 3px;
          color: #667085;
          font-size: 10px;
        }

        .session-banner strong {
          color: #344054;
          font-family:
            "SFMono-Regular",
            Consolas,
            monospace;
          font-size: 11px;
          font-weight: 500;
          word-break: break-all;
        }

        .session-banner button {
          border: 1px solid #d0d5dd;
          border-radius: 7px;
          background: white;
          color: #475467;
          padding: 7px 10px;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .error-banner {
          display: flex;
          gap: 8px;
          padding: 13px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #fecdca;
          background: #fef3f2;
          color: #b42318;
          font-size: 13px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .stat-card {
          border-radius: 10px;
          padding: 18px 20px;
        }

        .stat-card span {
          display: block;
          color: #667085;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 7px;
        }

        .stat-card strong {
          color: #101828;
          font-size: 25px;
          line-height: 1;
          font-weight: 700;
        }

        .logs-card {
          border-radius: 12px;
          overflow: hidden;
        }

        .logs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 22px;
          border-bottom: 1px solid #eaecf0;
        }

        .live-indicator {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #475467;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .live-indicator > span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #98a2b3;
        }

        .live-indicator > span.active-dot {
          background: #12b76a;
        }

        .timeline {
          padding: 8px 22px 26px;
        }

        .timeline-item {
          display: flex;
          gap: 16px;
        }

        .timeline-marker {
          position: relative;
          width: 12px;
          flex: 0 0 12px;
          display: flex;
          justify-content: center;
        }

        .timeline-marker > span {
          width: 9px;
          height: 9px;
          margin-top: 24px;
          border-radius: 50%;
          border: 2px solid;
          z-index: 1;
        }

        .marker-success {
          background: #12b76a;
          border-color: #d1fadf;
        }

        .marker-failed {
          background: #f04438;
          border-color: #fee4e2;
        }

        .marker-started {
          background: #3b82f6;
          border-color: #dbe7ff;
        }

        .timeline-line {
          position: absolute;
          top: 33px;
          bottom: -12px;
          width: 1px;
          background: #e4e7ec;
        }

        .log-content {
          flex: 1;
          padding: 18px 0;
          border-bottom: 1px solid #f0f2f5;
        }

        .timeline-item:last-child .log-content {
          border-bottom: 0;
        }

        .log-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .log-title {
          color: #1d2939;
          font-size: 14px;
          font-weight: 650;
          text-transform: capitalize;
        }

        .log-event {
          margin-top: 3px;
          color: #98a2b3;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .status-badge {
          border-radius: 999px;
          padding: 4px 9px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .status-success {
          color: #067647;
          background: #ecfdf3;
        }

        .status-failed {
          color: #b42318;
          background: #fef3f2;
        }

        .status-started {
          color: #175cd3;
          background: #eff8ff;
        }

        .log-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 9px;
          color: #667085;
          font-size: 11px;
        }

        .details-box {
          margin-top: 12px;
          border: 1px solid #eaecf0;
          border-radius: 7px;
          background: #f9fafb;
          padding: 9px 11px;
        }

        .detail-row {
          display: flex;
          gap: 14px;
          padding: 3px 0;
          font-size: 11px;
        }

        .detail-row span {
          color: #98a2b3;
          min-width: 70px;
        }

        .detail-row strong {
          color: #475467;
          font-weight: 500;
          word-break: break-word;
        }

        .empty-state {
          text-align: center;
          padding: 72px 24px;
        }

        .empty-icon {
          width: 42px;
          height: 42px;
          margin: 0 auto 14px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #f2f4f7;
          color: #667085;
          font-size: 24px;
        }

        .empty-state h3 {
          margin: 0;
          color: #344054;
          font-size: 15px;
        }

        .empty-state p {
          max-width: 430px;
          margin: 7px auto 0;
          color: #98a2b3;
          font-size: 13px;
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .page-header,
          .search-card {
            align-items: stretch;
            flex-direction: column;
          }

          .header-actions {
            justify-content: space-between;
          }

          .search-form {
            min-width: 0;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .admin-page {
            padding: 24px 14px 40px;
          }

          h1 {
            font-size: 28px;
          }

          .header-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .search-form {
            flex-direction: column;
          }

          .search-form input {
            min-width: 0;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .session-banner {
            align-items: stretch;
            flex-direction: column;
          }

          .log-top {
            align-items: flex-start;
          }

          .log-meta {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}
      </style>
    </main>
  );
}