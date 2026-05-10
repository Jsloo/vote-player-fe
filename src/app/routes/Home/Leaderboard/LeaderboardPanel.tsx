// LeaderboardPanel.tsx
import { useState } from "react";
import LeaderboardCard, { type RankingEntry } from "./LeaderboardCard";
import HistoryCard, { type MatchHistoryEntry } from "../History/HistoryCard";
import styles from "./Panel.module.css";

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

  const ITEM_HEIGHT = 56;
  const innerMaxHeight = ITEM_HEIGHT * (visibleCount + 1);

  return (
    <div className={styles.root}>
      <div className={styles.tabsWrap}>
        <button
          className={`${styles.tabBtn} ${tab === "leaderboard" ? styles.tabBtnActive : ""}`}
          onClick={() => setTab("leaderboard")}
        >
          Leaderboard
        </button>
        <button
          className={`${styles.tabBtn} ${tab === "history" ? styles.tabBtnActive : ""}`}
          onClick={() => setTab("history")}
        >
          History
        </button>
      </div>

      <div className={styles.panel}>
        {tab === "leaderboard" ? (
          <div className={styles.scrollArea} style={{ maxHeight: innerMaxHeight }}>
            {currentUser && (
              <div className={styles.stickyWrap}>
                <LeaderboardCard entry={currentUser} isCurrentUser />
              </div>
            )}
            {topRankings.map((entry) => (
              <div key={entry.playerId} className={styles.itemRow}>
                <LeaderboardCard entry={entry} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.scrollArea} style={{ maxHeight: innerMaxHeight }}>
            {history.length === 0 ? (
              <div className={styles.empty}>No history yet</div>
            ) : (
              history.map((entry) => (
                <div key={entry.matchId} className={styles.itemRow}>
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