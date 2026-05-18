// HistoryCard.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import voteRibbon from "@/assets/image/vote-ribbon.png";
import { translationKey } from "@/i18n/constants";
import { translateRemoteLabel } from "@/app/utils/translateRemoteLabel";
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

const resultKeyMap = {
  WIN: translationKey.HISTORY_RESULT_WIN,
  LOSS: translationKey.HISTORY_RESULT_LOSS,
  PENDING: translationKey.HISTORY_RESULT_PENDING,
  DRAW: translationKey.HISTORY_RESULT_DRAW,
} as const;

const resultDefaultMap = {
  WIN: "WIN",
  LOSS: "LOSS",
  PENDING: "PENDING",
  DRAW: "DRAW",
} as const;

export default function HistoryCard({ entry }: HistoryCardProps) {
  const { t } = useTranslation();
  const { firstTeam, matchName, matchTitle, secondTeam, votedTeam, result, based, strike, total } = entry;
  const resultLabel = t(resultKeyMap[result], { defaultValue: resultDefaultMap[result] });

  return (
    <div className={styles.cardWrap}>
      <div
        className={styles.banner}
        style={{ backgroundImage: `url(${historyBanner})` }}
      >
        <span className={styles.bannerText}>{translateRemoteLabel(t, matchName)} · {translateRemoteLabel(t, matchTitle)}</span>
      </div>
      <div className={styles.card}>
        <div className={styles.leftSide}>
          <div className={styles.teamCol}>
            <FlagWithRibbon
              flagUrl={firstTeam.flagUrl}
              alt={firstTeam.name}
              voted={votedTeam === "first"}
              voteRibbonAlt={t(translationKey.COMMON_VOTE_RIBBON, { defaultValue: "VOTE" })}
            />
            <span className={styles.teamName}>{translateRemoteLabel(t, firstTeam.name)}</span>
          </div>

          <span className={styles.vs}>{t(translationKey.COMMON_VS, { defaultValue: "VS" })}</span>

          <div className={styles.teamCol}>
            <FlagWithRibbon
              flagUrl={secondTeam.flagUrl}
              alt={secondTeam.name}
              voted={votedTeam === "second"}
              voteRibbonAlt={t(translationKey.COMMON_VOTE_RIBBON, { defaultValue: "VOTE" })}
            />
            <span className={styles.teamName}>{translateRemoteLabel(t, secondTeam.name)}</span>
          </div>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.statsRow}>
            <div className={`${styles.result} ${resultClassMap[result]}`}>
              — {resultLabel} —
            </div>

            <Stat
              value={based}
              label={t(translationKey.HISTORY_BASED, { defaultValue: "Based" })}
            />
            <Operator>×</Operator>
            <Stat
              value={strike}
              label={t(translationKey.HISTORY_STRIKE, { defaultValue: "Strike" })}
            />
            <Operator>=</Operator>
            <Stat
              value={total}
              label={t(translationKey.HISTORY_TOTAL, { defaultValue: "Total" })}
              highlight
            />
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
                          voteRibbonAlt,
                        }: {
  flagUrl: string;
  alt: string;
  voted: boolean;
  voteRibbonAlt: string;
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
        <img src={voteRibbon} alt={voteRibbonAlt} className={styles.ribbon} />
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
        <span className={`${styles.statValue}`}>
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