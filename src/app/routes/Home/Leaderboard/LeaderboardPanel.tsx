// LeaderboardPanel.tsx
import React, { useState } from "react";
import LeaderboardCard, { type RankingEntry } from "./LeaderboardCard";
import HistoryCard, { type MatchHistoryEntry } from "../History/HistoryCard";

interface LeaderboardPanelProps {
  currentUser: RankingEntry | null;
  topRankings: RankingEntry[];
  history?: MatchHistoryEntry[];
  visibleCount?: number;
}

export default function LeaderboardPanel({
                                           currentUser,
                                           topRankings,
                                           history = [],
                                           visibleCount = 30,
                                         }: LeaderboardPanelProps) {
  const [tab, setTab] = useState<"leaderboard" | "history">("leaderboard");

  const tabsWrap: React.CSSProperties = {
    display: "flex",
    gap: 4,
    paddingLeft: 8,
    position: "relative",
    zIndex: 2,
  };

  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: "10px 24px",
    fontSize: 15,
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    background: active ? "#3b9bdc" : "rgba(180,210,235,0.7)",
    color: active ? "white" : "#5a8aac",
    boxShadow: active ? "0 -2px 6px rgba(0,0,0,0.1)" : "none",
    marginBottom: active ? -2 : 0,
  });

  const ITEM_HEIGHT = 56;
  const innerMaxHeight = ITEM_HEIGHT * (visibleCount + 1);

  const panel: React.CSSProperties = {
    background: "linear-gradient(180deg, #3b9bdc 0%, #2581c2 100%)",
    borderRadius: 18,
    borderTopLeftRadius: 0,
    padding: "12px 10px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
  };

  const scrollArea: React.CSSProperties = {
    maxHeight: innerMaxHeight,
    overflowY: "auto",
    display: "block",
    width: "100%",
    overscrollBehavior: "contain",
  };

  const stickyWrap: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "linear-gradient(180deg, #3b9bdc 0%, #3b9bdc 100%)",
    paddingBottom: 6,
    marginLeft: -10,         // ← 左边溢出 10px
    marginRight: -10,        // ← 右边溢出 10px
    paddingLeft: 10,         // ← 内部留出空间
    paddingRight: 10,
  };

  return (
    <div style={{ padding: 12 }}>
      <div style={tabsWrap}>
        <button style={tabBtn(tab === "leaderboard")} onClick={() => setTab("leaderboard")}>
          Leaderboard
        </button>
        <button style={tabBtn(tab === "history")} onClick={() => setTab("history")}>
          History
        </button>
      </div>

      <div style={panel}>
        {tab === "leaderboard" ? (
          <div style={scrollArea}>
            {currentUser &&
            <div style={stickyWrap}>
              <LeaderboardCard entry={currentUser} isCurrentUser />
            </div>
            }
            {topRankings.map((entry) => (
              <div key={entry.playerId} style={{ marginBottom: 6 }}>
                <LeaderboardCard entry={entry} />
              </div>
            ))}
          </div>
        ) : (
          // ── History tab ──
          <div style={scrollArea}>
            {history.length === 0 ? (
              <div style={{ color: "white", textAlign: "center", padding: 30 }}>
                No history yet
              </div>
            ) : (
              history.map((entry) => (
                <div key={entry.matchId} style={{ marginBottom: 6 }}>
                  <HistoryCard entry={entry} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}