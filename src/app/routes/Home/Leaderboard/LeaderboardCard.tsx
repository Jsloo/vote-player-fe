// LeaderboardCard.tsx
import React from "react";
import leopardImg from "@/assets/image/leopard-avatar.png";
import eagleImg from "@/assets/image/eagle-avatar.png";
import medal1 from "@/assets/image/gold.png";
import medal2 from "@/assets/image/silver.png";
import medal3 from "@/assets/image/bronze.png";
import mascotBorder from "@/assets/image/gold-border.png";

export interface RankingEntry {
  playerId: number;
  username: string;
  totalPoints: number;
  currentStreak: number;
  rank: number;
}

interface LeaderboardCardProps {
  entry: RankingEntry;
  isCurrentUser?: boolean;
}

export default function LeaderboardCard({ entry, isCurrentUser }: LeaderboardCardProps) {
  const { username, totalPoints, currentStreak, rank } = entry;

  const theme = getTheme(rank, isCurrentUser);
  const showMascot = rank >= 1 && rank <= 3;
  const useMedal = rank >= 1 && rank <= 3;

  const card: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px 4px 0",         // ← 右边 padding 14 → 10
    borderRadius: 14,
    background: theme.background,
    border: isCurrentUser ? "3px solid #facc15" : "none",
    boxShadow: isCurrentUser
      ? "0 4px 14px rgba(250,204,21,0.4)"
      : "0 3px 8px rgba(0,0,0,0.15)",
    width: "100%",
    boxSizing: "border-box",
    minHeight: 48,
    overflow: "hidden",
  };

  const renderRank = () => {
    if (useMedal) return <Medal rank={rank} />;
    const label = rank === 0 ? "—" : `${rank}th`;
    return (
      <div style={{
        background: "linear-gradient(180deg, #93c5fd, #3b82f6)",
        color: "white",
        fontWeight: 800,
        fontSize: 13,                    // ← 14 → 13
        padding: "5px 0",
        borderRadius: 12,
        width: 52,                        // ← 60 → 52
        textAlign: "center",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.15)",
        flexShrink: 0,
      }}>
        {label}
      </div>
    );
  };

  return (
    <div style={card}>
      {renderRank()}

      {/* 吉祥物 */}
      {showMascot && (
        <div style={{
          width: 36,                     // ← 40 → 36
          height: 36,
          backgroundImage: `url(${mascotBorder})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <img
            src={rank === 1 ? leopardImg : eagleImg}
            alt="mascot"
            style={{
              width: 42,                  // ← 48 → 42
              height: 42,
              objectFit: "contain",
              borderRadius: "50%",
            }}
          />
        </div>
      )}

      {/* 用户名 */}
      <div style={{
        flex: 1,
        fontSize: 13,                     // ← 14 → 13
        fontWeight: 700,
        color: theme.usernameColor,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        marginLeft: 4,
      }}>
        {maskUsername(username)}
      </div>

      {/* Streak 胶囊 — 缩小 */}
      <div style={{
        background: "linear-gradient(180deg, #3b82f6, #1d4ed8)",
        color: "white",
        fontWeight: 800,
        fontSize: 11,                     // ← 12 → 11
        borderRadius: 12,                  // ← 14 → 12
        width: 64,                         // ← 80 → 64
        padding: "3px 0",                  // ← 加点上下 padding
        textAlign: "center",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.2)",
        flexShrink: 0,
      }}>
        Streak X{currentStreak || 1}
      </div>

      {/* Point 胶囊 — 缩小 */}
      <div style={{
        position: "relative",
        flexShrink: 0,
        marginLeft: 4,
        width: 70,                         // ← 90 → 70
      }}>
        <div style={{
          position: "absolute",
          top: -13,                        // ← 略调
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 9,
          color: theme.pointLabelColor,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}>
          Point
        </div>

        <div style={{
          background: "linear-gradient(180deg, #93c5fd, #3b82f6)",
          borderRadius: 12,                // ← 14 → 12
          padding: "3px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,                           // ← 4 → 3
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.15)",
          width: "100%",
        }}>
          <CoinIcon />
          <span style={{
            fontSize: 12,                   // ← 13 → 12
            fontWeight: 800,
            color: "white",
          }}>
            {totalPoints.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function Medal({ rank }: { rank: number }) {
  const medalImages: Record<number, string> = { 1: medal1, 2: medal2, 3: medal3 };
  return (
    <img
      src={medalImages[rank]}
      alt={`Rank ${rank}`}
      style={{
        width: 70,                         // ← 80 → 70
        height: 90,                         // ← 100 → 90
        objectFit: "contain",
        flexShrink: 0,
        margin: "-30px -16px -30px -8px",  // ← 调小 margin
      }}
    />
  );
}

function CoinIcon() {
  return (
    <div style={{
      width: 16,                            // ← 18 → 16
      height: 16,
      borderRadius: "50%",
      background: "radial-gradient(circle at 30% 30%, #fde68a, #f59e0b 70%, #b45309)",
      boxShadow: "inset 0 -2px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.2)",
      flexShrink: 0,
    }} />
  );
}

function maskUsername(username: string): string {
  if (username.length <= 4) return username;
  const start = username.slice(0, 2);
  const end = username.slice(-4);
  return `${start}**${end}`;
}

function getTheme(rank: number, isCurrentUser?: boolean) {
  if (rank === 1) {
    return {
      background: "linear-gradient(180deg, #fef3c7, #fbbf24)",
      usernameColor: "#a16207",
      pointLabelColor: "#a16207",
      pointValueColor: "#78350f",
    };
  }
  if (rank === 2) {
    return {
      background: "linear-gradient(180deg, #e0f2fe, #7dd3fc)",
      usernameColor: "#0c4a6e",
      pointLabelColor: "#0369a1",
      pointValueColor: "#0c4a6e",
    };
  }
  if (rank === 3) {
    return {
      background: "linear-gradient(180deg, #fed7aa, #fb923c)",
      usernameColor: "#7c2d12",
      pointLabelColor: "#9a3412",
      pointValueColor: "#7c2d12",
    };
  }
  if (isCurrentUser) {
    return {
      background: "white",
      usernameColor: "#1e3a8a",
      pointLabelColor: "#3b82f6",
      pointValueColor: "#1e3a8a",
    };
  }
  return {
    background: "white",
    usernameColor: "#1e40af",
    pointLabelColor: "#3b82f6",
    pointValueColor: "#1e3a8a",
  };
}