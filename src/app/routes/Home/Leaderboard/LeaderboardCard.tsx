// LeaderboardCard.tsx
import React from "react";
import leopardImg from "@/assets/image/leopard-avatar.png";
import eagleImg from "@/assets/image/eagle-avatar.png";
import medal1 from "@/assets/image/gold.png";
import medal2 from "@/assets/image/silver.png";
import medal3 from "@/assets/image/bronze.png";
import mascotBorder from "@/assets/image/gold-border.png";

// ── 后端返回的数据结构 ──
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
  const showMascot = rank >= 1 && rank <= 3 && !isCurrentUser;
  const useMedal = rank >= 1 && rank <= 3 && !isCurrentUser;

  const card: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 14px 4px 0",
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

  // ── Rank 标签 ──
  const renderRank = () => {
    if (useMedal) return <Medal rank={rank} />;
    const label = rank === 0 ? "—" : `${rank}th`;
    return (
      <div style={{
        background: "linear-gradient(180deg, #93c5fd, #3b82f6)",
        color: "white",
        fontWeight: 800,
        fontSize: 14,
        padding: "5px 0",            // ← 左右 0
        borderRadius: 12,
        width: 60,                    // ← 固定宽度
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

      {/* 吉祥物头像（仅前3名） */}
      {showMascot && (
        <div style={{
          width: 40,                  // ← 从 40 → 50
          height: 40,                 // ← 从 40 → 50
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
              width: 48,                // ← 从 48 → 56
              height: 48,
              objectFit: "contain",
              borderRadius: "50%",
            }}
          />
        </div>
      )}

      {/* 用户名 */}
      <div style={{
        flex: 1,
        fontSize: 14,
        fontWeight: 700,
        color: theme.usernameColor,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        marginLeft: 4,
      }}>
        {maskUsername(username)}
      </div>

      {/* Streak 蓝色胶囊 — 固定宽度 */}
      <div style={{
        background: "linear-gradient(180deg, #3b82f6, #1d4ed8)",
        color: "white",
        fontWeight: 800,
        fontSize: 12,
        borderRadius: 14,
        width: 80,                    // ← 固定宽度
        textAlign: "center",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.2)",
        flexShrink: 0,
      }}>
        Streak X{currentStreak || 1}
      </div>

      {/* Point — 胶囊 + 上方 label，固定宽度 */}
      <div style={{
        position: "relative",
        flexShrink: 0,
        marginLeft: 4,
        width: 90,                    // ← 固定宽度
      }}>
        {/* "Point" 标签浮在上方 */}
        <div style={{
          position: "absolute",
          top: -15,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 9,
          color: theme.pointLabelColor,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}>
          Point
        </div>

        {/* 蓝色胶囊 */}
        <div style={{
          background: "linear-gradient(180deg, #93c5fd, #3b82f6)",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",    // ← 内容居中
          gap: 4,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.15)",
          width: "100%",
        }}>
          <CoinIcon />
          <span style={{
            fontSize: 13,
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

// ── 奖牌组件（用图片）──
function Medal({ rank }: { rank: number }) {
  const medalImages: Record<number, string> = { 1: medal1, 2: medal2, 3: medal3 };
  return (
    <img
      src={medalImages[rank]}
      alt={`Rank ${rank}`}
      style={{
        width: 80,                  // 放大
        height: 100,                 // 比卡片高
        objectFit: "contain",
        flexShrink: 0,
        margin: "-40px -20px -40px -10px",
      }}
    />
  );
}

// ── 金币图标 ──
function CoinIcon() {
  return (
    <div style={{
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: "radial-gradient(circle at 30% 30%, #fde68a, #f59e0b 70%, #b45309)",
      boxShadow: "inset 0 -2px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.2)",
      flexShrink: 0,
    }} />
  );
}

// ── username 加掩码 ──
function maskUsername(username: string): string {
  if (username.length <= 4) return username;
  const start = username.slice(0, 2);
  const end = username.slice(-4);
  return `${start}**${end}`;
}

// ── 主题（卡片背景色 + 文字色） ──
function getTheme(rank: number, isCurrentUser?: boolean) {
  if (isCurrentUser) {
    return {
      background: "white",
      usernameColor: "#1e3a8a",
      pointLabelColor: "#3b82f6",
      pointValueColor: "#1e3a8a",
    };
  }
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
  // rank 4+ 或 rank 0 — 白色背景
  return {
    background: "white",
    usernameColor: "#1e40af",
    pointLabelColor: "#3b82f6",
    pointValueColor: "#1e3a8a",
  };
}