import { useEffect, useState } from "react";
import api from "../api/client";
import "./dashboard.css";

const PRAYERS = [
  { key: "fajr",    icon: "🌙", time: "Fajr"    },
  { key: "dhuhr",   icon: "☀️",  time: "Dhuhr"   },
  { key: "asr",     icon: "🌤️", time: "Asr"     },
  { key: "maghrib", icon: "🌅", time: "Maghrib"  },
  { key: "isha",    icon: "⭐",  time: "Isha"    },
] as const;

type PrayerKey = typeof PRAYERS[number]["key"];
type Status = "on_time" | "late" | "missed" | "";

function statusLabel(s: Status) {
  if (s === "on_time") return "Prayed on time ✓";
  if (s === "late")    return "Prayed late";
  if (s === "missed")  return "Missed";
  return "Not recorded yet";
}

export default function Dashboard() {
  const [tab, setTab]               = useState<"prayers" | "routines">("prayers");
  const [prayers, setPrayers]       = useState<Record<PrayerKey, Status>>({} as any);
  const [routines, setRoutines]     = useState<any[]>([]);
  const [newRoutine, setNewRoutine] = useState("");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const fetchData = async () => {
    const [prayerRes, routineRes] = await Promise.all([
      api.get("/prayers/today"),
      api.get("/routines"),
    ]);
    setPrayers(prayerRes.data);
    setRoutines(routineRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const updatePrayer = async (prayer: string, status: string) => {
    await api.put("/prayers/update", { prayer, status });
    fetchData();
  };

  const toggleRoutine = async (id: number) => {
    await api.put("/routines/toggle", { routine_id: id });
    fetchData();
  };

  const addRoutine = async () => {
    if (!newRoutine.trim()) return;
    await api.post("/routines", { title: newRoutine });
    setNewRoutine("");
    fetchData();
  };

  const onTimeCount = PRAYERS.filter(p => prayers[p.key] === "on_time").length;
  const lateCount   = PRAYERS.filter(p => prayers[p.key] === "late").length;
  const missedCount = PRAYERS.filter(p => prayers[p.key] === "missed").length;
  const doneCount   = routines.filter(r => r.status).length;
  const pendingCount = routines.filter(r => !r.status).length;

  return (
    <div className="dash-page">

      {/* Top bar */}
      <div className="dash-topbar">
        <div className="dash-topbar-title"><span>🕌</span> Daily Tracker</div>
        <div className="dash-topbar-date">{today}</div>
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
                <span className="tab-badge">
                  {onTimeCount}/{PRAYERS.length}
                </span>
              )}
            </button>
            <button
              className={`tab-btn ${tab === "routines" ? "tab-active" : ""}`}
              onClick={() => setTab("routines")}
            >
              <span>✅</span> Routines
              {tab === "routines" && (
                <span className="tab-badge">{doneCount}/{routines.length}</span>
              )}
            </button>
          </div>

          <div className="dash-card-body">

            {/* ══ PRAYERS TAB ══ */}
            {tab === "prayers" && (
              <>
                {/* Summary chips */}
                <div className="prayer-summary">
                  <div className="psummary-chip chip-ontime">
                    <span className="chip-count">{onTimeCount}</span> On Time
                  </div>
                  <div className="psummary-chip chip-late">
                    <span className="chip-count">{lateCount}</span> Late
                  </div>
                  <div className="psummary-chip chip-missed">
                    <span className="chip-count">{missedCount}</span> Missed
                  </div>
                </div>

                <div className="prayer-grid">
                  {PRAYERS.map(({ key, icon, time }) => {
                    const status = prayers[key] || "";
                    return (
                      <div key={key} className={`prayer-item status-${status || "none"}`}>
                        <div className="prayer-icon-cell">
                          <span className="p-icon">{icon}</span>
                          <span className="p-time">{time.toUpperCase()}</span>
                        </div>
                        <div className="prayer-info">
                          <div className="p-name">{time}</div>
                          <div className={`p-status-text ${status || "none"}`}>
                            {statusLabel(status as Status)}
                          </div>
                        </div>
                        <div className="prayer-actions">
                          <button className="pbtn pbtn-ontime" onClick={() => updatePrayer(key, "on_time")}>On Time</button>
                          <button className="pbtn pbtn-late"   onClick={() => updatePrayer(key, "late")}>Late</button>
                          <button className="pbtn pbtn-missed" onClick={() => updatePrayer(key, "missed")}>Missed</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ══ ROUTINES TAB ══ */}
            {tab === "routines" && (
              <>
                {/* Summary chips */}
                <div className="prayer-summary">
                  <div className="psummary-chip chip-ontime">
                    <span className="chip-count">{doneCount}</span> Done
                  </div>
                  <div className="psummary-chip chip-missed">
                    <span className="chip-count">{pendingCount}</span> Pending
                  </div>
                </div>

                <div className="routine-add-row">
                  <input
                    className="routine-input"
                    placeholder="Add a new routine…"
                    value={newRoutine}
                    onChange={(e) => setNewRoutine(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addRoutine()}
                  />
                  <button className="routine-add-btn" onClick={addRoutine}>+ Add</button>
                </div>

                <div className="routine-list">
                  {routines.map((r) => (
                    <div
                      key={r.id}
                      className={`routine-item ${r.status ? "done-item" : ""}`}
                      onClick={() => toggleRoutine(r.id)}
                    >
                      <div className="routine-checkbox">{r.status ? "✓" : ""}</div>
                      <div className="routine-item-info">
                        <div className="routine-item-title">{r.title ?? r.routine_name}</div>
                        <div className="routine-item-sub">
                          {r.status ? "Completed today" : "Tap to mark done"}
                        </div>
                      </div>
                      <span className={`routine-badge ${r.status ? "done" : "pending"}`}>
                        {r.status ? "Done" : "Pending"}
                      </span>
                    </div>
                  ))}

                  {routines.length === 0 && (
                    <div className="routine-empty">
                      <div className="empty-icon">📋</div>
                      No routines yet — add one above!
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
