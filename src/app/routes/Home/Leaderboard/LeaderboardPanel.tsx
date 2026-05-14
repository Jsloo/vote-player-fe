// LeaderboardPanel.tsx
import { useState } from "react";
import { Skeleton } from "@/app/components/Skeleton";
import LeaderboardCard, { type RankingEntry } from "./LeaderboardCard";
import HistoryCard, { type MatchHistoryEntry } from "../History/HistoryCard";
import styles from "./Panel.module.css";

interface LeaderboardPanelProps {
  currentUser: RankingEntry | null;
  topRankings: RankingEntry[];
  history?: MatchHistoryEntry[];
  visibleCount?: number;
  isLeaderboardLoading?: boolean;
  isHistoryLoading?: boolean;
}

const SKELETON_ROW_COUNT = 4;

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
        <div key={i} className={styles.itemRow}>
          <Skeleton width="100%" height={56} radius={12} />
        </div>
      ))}
    </>
  );
}

export default function LeaderboardPanel({
                                           currentUser,
                                           topRankings,
                                           history = [],
                                           visibleCount = 30,
                                           isLeaderboardLoading = false,
                                           isHistoryLoading = false,
                                         }: LeaderboardPanelProps) {
  const [tab, setTab] = useState<"leaderboard" | "history">("leaderboard");

  const ITEM_HEIGHT = 56;
  const innerMaxHeight = ITEM_HEIGHT * (visibleCount + 1);

  const hasLeaderboardData = !!currentUser || topRankings.length > 0;

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
            {isLeaderboardLoading && !hasLeaderboardData ? (
              <SkeletonRows />
            ) : !hasLeaderboardData ? (
              <div className={styles.empty}>No leaderboard yet</div>
            ) : (
              <>
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
              </>
            )}
          </div>
        ) : (
          <div className={styles.scrollArea} style={{ maxHeight: innerMaxHeight }}>
            {isHistoryLoading && history.length === 0 ? (
              <SkeletonRows />
            ) : history.length === 0 ? (
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