// LeaderboardCard.tsx
import leopardImg from "@/assets/image/leopard-avatar.png";
import eagleImg from "@/assets/image/eagle-avatar.png";
import medal1 from "@/assets/image/gold.png";
import medal2 from "@/assets/image/silver.png";
import medal3 from "@/assets/image/bronze.png";
import mascotBorder from "@/assets/image/gold-border.png";
import styles from "./index.module.css";

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

// 主题映射 — 决定用哪几个 class
function getThemeClasses(rank: number, isCurrentUser?: boolean) {
  if (rank === 1) {
    return {
      bg: styles.themeRank1,
      username: styles.usernameRank1,
      pointLabel: styles.pointLabelRank1,
    };
  }
  if (rank === 2) {
    return {
      bg: styles.themeRank2,
      username: styles.usernameRank2,
      pointLabel: styles.pointLabelRank2,
    };
  }
  if (rank === 3) {
    return {
      bg: styles.themeRank3,
      username: styles.usernameRank3,
      pointLabel: styles.pointLabelRank3,
    };
  }
  if (isCurrentUser) {
    return {
      bg: styles.themeDefault,
      username: styles.usernameCurrentUser,
      pointLabel: styles.pointLabelCurrentUser,
    };
  }
  return {
    bg: styles.themeDefault,
    username: styles.usernameDefault,
    pointLabel: styles.pointLabelDefault,
  };
}

export default function LeaderboardCard({ entry, isCurrentUser }: LeaderboardCardProps) {
  const { username, totalPoints, currentStreak, rank } = entry;

  const theme = getThemeClasses(rank, isCurrentUser);
  const showMascot = rank >= 1 && rank <= 3;
  const useMedal = rank >= 1 && rank <= 3;

  const cardClass = `${styles.card} ${theme.bg} ${isCurrentUser ? styles.cardCurrentUser : ""}`;

  const renderRank = () => {
    if (useMedal) return <Medal rank={rank} />;
    const label = rank === 0 ? "—" : `${rank}th`;
    return <div className={styles.rankPill}>{label}</div>;
  };

  return (
    <div className={cardClass}>
      {renderRank()}

      {/* Mascot */}
      {showMascot && (
        <div
          className={styles.mascotWrap}
          style={{ backgroundImage: `url(${mascotBorder})` }}
        >
          <img
            src={rank === 1 ? leopardImg : eagleImg}
            alt="mascot"
            className={styles.mascotImg}
          />
        </div>
      )}

      {/* Username */}
      <div className={`${styles.username} ${theme.username}`}>
        {maskUsername(username)}
      </div>

      {/* Streak */}
      <div className={styles.streakPill}>
        Streak X{currentStreak || 1}
      </div>

      {/* Point */}
      <div className={styles.pointWrap}>
        <div className={`${styles.pointLabel} ${theme.pointLabel}`}>Point</div>
        <div className={styles.pointPill}>
          <CoinIcon />
          <span className={styles.pointValue}>{totalPoints.toLocaleString()}</span>
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
      className={styles.medal}
    />
  );
}

function CoinIcon() {
  return <div className={styles.coin} />;
}

function maskUsername(username: string): string {
  if (username.length <= 4) return username;
  const start = username.slice(0, 2);
  const end = username.slice(-4);
  return `${start}**${end}`;
}