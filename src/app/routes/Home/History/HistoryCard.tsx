// HistoryCard.tsx
import React from "react";
import voteRibbon from "@/assets/image/vote-ribbon.png";
import logoBorder from "@/assets/image/vote-logo-border.png";

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

export default function HistoryCard({ entry }: HistoryCardProps) {
  const { firstTeam, secondTeam, votedTeam, result, based, strike, total } = entry;

  const resultColor = {
    WIN: "#facc15",
    LOSE: "#ef4444",
    PENDING: "#9ca3af",
  }[result];

  return (
    <div style={{
      background: "linear-gradient(180deg, #7dd3fc 0%, #38bdf8 100%)",
      borderRadius: 16,
      padding: "8px 10px",
      display: "flex",
      alignItems: "center",
      gap: 8,
      boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
      color: "white",
      width: "100%",
      boxSizing: "border-box",
      position: "relative",
    }}>

      {/* ── 左侧：国旗 + VS ── */}
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <FlagWithRibbon flagUrl={firstTeam.flagUrl} alt={firstTeam.name} voted={votedTeam === "first"} />
          <span style={{ fontSize: 9, fontWeight: 700 }}>{firstTeam.name}</span>
        </div>

        {/* 大 VS — 红色斜体 */}
        <span style={{
          fontSize: 14,
          fontWeight: 900,
          color: "#dc2626",
          margin: "0 4px",
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          zIndex: 3,
          marginTop: -10,
          fontStyle: "italic",
        }}>
          VS
        </span>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <FlagWithRibbon flagUrl={secondTeam.flagUrl} alt={secondTeam.name} voted={votedTeam === "second"} />
          <span style={{ fontSize: 9, fontWeight: 700 }}>{secondTeam.name}</span>
        </div>
      </div>

      {/* ── 右侧：数据行 ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 4,
        }}>
          <div style={{
            fontSize: 13,
            fontWeight: 900,
            color: resultColor,
            whiteSpace: "nowrap",
            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            paddingBottom: 12,
          }}>
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
  );
}

// ── 国旗（用边框图）+ VOTE 飘带 ──
function FlagWithRibbon({ flagUrl, alt, voted }: { flagUrl: string; alt: string; voted: boolean }) {
  return (
    <div style={{ position: "relative" }}>

      {/* 蓝色圆环边框 */}
      <div style={{
        width: 36,
        height: 36,
        backgroundImage: `url(${logoBorder})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <img
          src={flagUrl}
          alt={alt}
          style={{
            width: 26,
            height: 26,
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* VOTE 飘带 */}
      {voted && (
        <img
          src={voteRibbon}
          alt="VOTE"
          style={{
            position: "absolute",
            top: -6,
            right: -8,
            width: 26,
            height: "auto",
            transform: "rotate(15deg)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

// ── 数据胶囊 ──
function Stat({ value, label, highlight }: { value: number; label: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div style={{
        background: highlight
          ? "linear-gradient(180deg, #fde047, #facc15)"
          : "linear-gradient(180deg, #dbeafe, #93c5fd)",
        borderRadius: 10,
        padding: "2px 8px",
        minWidth: 32,
        textAlign: "center",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.15)",
      }}>
        <span style={{
          fontSize: 13,
          fontWeight: 900,
          color: highlight ? "#7c2d12" : "#1e3a8a",
        }}>
          {value}
        </span>
      </div>
      <span style={{ fontSize: 9, opacity: 0.9, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

// ── 运算符 ──
function Operator({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 14,
      fontWeight: 800,
      color: "rgba(255,255,255,0.8)",
      paddingBottom: 12,
    }}>
      {children}
    </span>
  );
}