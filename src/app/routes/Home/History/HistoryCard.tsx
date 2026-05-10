// HistoryCard.tsx
import React from "react";
import voteRibbon from "@/assets/image/vote-ribbon.png";
import logoBorder from "@/assets/image/vote-logo-border.png";
import historyBanner from "@/assets/image/history-banner.png";
import styles from "./index.module.css";

export interface MatchHistoryEntry {
  matchId: number;
  matchName: string;
  matchTitle: string;
  firstTeam: { name: string; flagUrl: string; };
  secondTeam: { name: string; flagUrl: string; };
  votedTeam: "first" | "second";
  result: "WIN" | "LOSS" | "PENDING" | "DRAW";
  based: number;
  strike: number;
  total: number;
}

interface HistoryCardProps {
  entry: MatchHistoryEntry;
}

const resultClassMap: Record<MatchHistoryEntry["result"], string> = {
  WIN: styles.resultWin,
  LOSS: styles.resultLoss,
  PENDING: styles.resultPending,
  DRAW: styles.resultDraw,
};

export default function HistoryCard({ entry }: HistoryCardProps) {
  const { firstTeam, matchName, matchTitle, secondTeam, votedTeam, result, based, strike, total } = entry;

  return (
    <div className={styles.cardWrap}>
      <div
        className={styles.banner}
        style={{ backgroundImage: `url(${historyBanner})` }}
      >
        <span className={styles.bannerText}>{matchName} · {matchTitle}</span>
      </div>
      <div className={styles.card}>
        <div className={styles.leftSide}>
          <div className={styles.teamCol}>
            <FlagWithRibbon
              flagUrl={firstTeam.flagUrl}
              alt={firstTeam.name}
              voted={votedTeam === "first"}
            />
            <span className={styles.teamName}>{firstTeam.name}</span>
          </div>

          <span className={styles.vs}>VS</span>

          <div className={styles.teamCol}>
            <FlagWithRibbon
              flagUrl={secondTeam.flagUrl}
              alt={secondTeam.name}
              voted={votedTeam === "second"}
            />
            <span className={styles.teamName}>{secondTeam.name}</span>
          </div>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.statsRow}>
            <div className={`${styles.result} ${resultClassMap[result]}`}>
              — {result} —
            </div>

            <Stat value={based} label="Based" />
            <Operator>×</Operator>
            <Stat value={strike} label="Strike" />
            <Operator>=</Operator>
            <Stat value={total} label="Total" highlight />
          </div>
        </div>
      </div>
    </div>
  );
}

function FlagWithRibbon({
                          flagUrl,
                          alt,
                          voted,
                        }: {
  flagUrl: string;
  alt: string;
  voted: boolean;
}) {
  return (
    <div className={styles.flagWrap}>
      <div
        className={styles.flagBorder}
        style={{ backgroundImage: `url(${logoBorder})` }}    // 图片 url 还是用 inline
      >
        <img src={flagUrl} alt={alt} className={styles.flagImg} />
      </div>

      {voted && (
        <img src={voteRibbon} alt="VOTE" className={styles.ribbon} />
      )}
    </div>
  );
}

function Stat({
                value,
                label,
                highlight,
              }: {
  value: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className={styles.stat}>
      <div className={`${styles.statPill} ${highlight ? styles.statPillHighlight : ""}`}>
        <span className={`${styles.statValue} ${highlight ? styles.statValueHighlight : ""}`}>
          {value}
        </span>
      </div>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function Operator({ children }: { children: React.ReactNode }) {
  return <span className={styles.operator}>{children}</span>;
}