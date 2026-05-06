import { useEffect, useState } from "react";
import api from "../api/client";
import "./dashboard.css";

const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

function StatusBadge({ value, type }: { value: string; type: "prayer" | "routine" }) {
  if (!value) return <span className="partner-status none">–</span>;

  if (type === "routine") {
    return value === "done"
      ? <span className="partner-status done">✓ Done</span>
      : <span className="partner-status pending">✗ Missed</span>;
  }

  const labels: Record<string, string> = {
    on_time: "On Time", late: "Late", missed: "Missed",
  };
  return <span className={`partner-status ${value}`}>{labels[value] || value}</span>;
}

export default function PartnerDashboard() {
  const [tab, setTab]   = useState<"prayers" | "routines">("prayers");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get("/partner/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) {
    return (
      <div className="dash-loading">
        <span>❤️</span> Loading partner data…
      </div>
    );
  }

  const myUserId       = data.prayers[0]?.user_id;
  const myPrayers      = data.prayers.find((p: any) => p.user_id === myUserId);
  const partnerPrayers = data.prayers.find((p: any) => p.user_id !== myUserId);
  const routineNames   = [...new Set(data.routines.map((r: any) => r.routine_name))] as string[];

  // Badge counts for tab labels
  const myOnTime    = PRAYERS.filter(p => myPrayers?.[p] === "on_time").length;
  const myDoneCount = data.routines.filter((r: any) => r.user_id === myUserId && r.status).length;

  return (
    <div className="dash-page">

      {/* Top bar */}
      <div className="dash-topbar">
        <div className="dash-topbar-title"><span>❤️</span> Partner Dashboard</div>
        <div className="dash-topbar-date">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
      </div>

      <div className="dash-content">
        <div className="dash-card">

          {/* ── Tab bar ── */}
          <div className="tab-bar">
            <button
              className={`tab-btn ${tab === "prayers" ? "tab-active" : ""}`}
              onClick={() => setTab("prayers")}
            >
              <span>🤲</span> Prayers
              {tab === "prayers" && (
                <span className="tab-badge">{myOnTime}/{PRAYERS.length}</span>
              )}
            </button>
            <button
              className={`tab-btn ${tab === "routines" ? "tab-active" : ""}`}
              onClick={() => setTab("routines")}
            >
              <span>✅</span> Routines
              {tab === "routines" && (
                <span className="tab-badge">{myDoneCount}/{routineNames.length}</span>
              )}
            </button>
          </div>

          <div className="dash-card-body">

            {/* ══ PRAYERS TAB ══ */}
            {tab === "prayers" && (
              <>
                <div className="partner-table-head">
                  <div>Prayer</div>
                  <div className="col-center">You</div>
                  <div className="col-right">Partner</div>
                </div>

                {PRAYERS.map((p) => (
                  <div key={p} className="partner-row">
                    <div className="col-name">{p}</div>
                    <div className="col-center">
                      <StatusBadge value={myPrayers?.[p] || ""} type="prayer" />
                    </div>
                    <div className="col-right">
                      <StatusBadge value={partnerPrayers?.[p] || ""} type="prayer" />
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ══ ROUTINES TAB ══ */}
            {tab === "routines" && (
              <>
                {/* ── My Routines ── */}
                <div className="section-divider">
                  <span className="section-divider-label">🙋 My Routines</span>
                </div>

                {(() => {
                  const myRoutines = data.routines.filter((r: any) => r.user_id === myUserId);
                  return myRoutines.length > 0 ? myRoutines.map((r: any) => (
                    <div key={r.id} className="routine-section-row">
                      <div className="routine-section-name">{r.routine_name}</div>
                      <StatusBadge value={r.status ? "done" : "missed"} type="routine" />
                    </div>
                  )) : (
                    <div className="routine-empty" style={{ padding: "12px 0" }}>
                      <div className="empty-icon" style={{ fontSize: 20 }}>📋</div>
                      No routines added yet.
                    </div>
                  );
                })()}

                {/* ── Partner's Routines ── */}
                <div className="section-divider" style={{ marginTop: 16 }}>
                  <span className="section-divider-label">❤️ Partner's Routines</span>
                </div>

                {(() => {
                  const partnerRoutines = data.routines.filter((r: any) => r.user_id !== myUserId);
                  return partnerRoutines.length > 0 ? partnerRoutines.map((r: any) => (
                    <div key={r.id} className="routine-section-row">
                      <div className="routine-section-name">{r.routine_name}</div>
                      <StatusBadge value={r.status ? "done" : "missed"} type="routine" />
                    </div>
                  )) : (
                    <div className="routine-empty" style={{ padding: "12px 0" }}>
                      <div className="empty-icon" style={{ fontSize: 20 }}>📋</div>
                      Partner hasn't added routines yet.
                    </div>
                  );
                })()}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
