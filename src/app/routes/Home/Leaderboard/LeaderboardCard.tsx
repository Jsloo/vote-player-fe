// LeaderboardCard.tsx
import leopardImg from "@/assets/image/leopard-avatar.png";
import eagleImg from "@/assets/image/eagle-avatar.png";
import medal1 from "@/assets/image/gold.png";
import medal2 from "@/assets/image/silver.png";
import medal3 from "@/assets/image/bronze.png";
import coinImg from "@/assets/image/coin.png";
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

type SizeVariant = 'large' | 'medium' | 'small';

function getSize(rank: number, isCurrentUser?: boolean): SizeVariant {
  if (isCurrentUser) return 'large';
  if (rank >= 1 && rank <= 3) return 'medium';
  return 'small';
}

function getSizeClasses(size: SizeVariant) {
  if (size === 'large') {
    return {
      card: styles.cardLarge,
      rankPill: styles.rankPillLarge,
      medal: '',
      username: styles.usernameLarge,
      streakPill: styles.streakPillLarge,
      pointWrap: styles.pointWrapLarge,
      pointLabel: styles.pointLabelLarge,
      pointValue: styles.pointValueLarge,
      coin: styles.coinLarge,
    };
  }
  if (size === 'medium') {
    return {
      card: styles.cardMedium,
      rankPill: '',
      medal: '',
      username: styles.usernameMedium,
      streakPill: styles.streakPillMedium,
      pointWrap: styles.pointWrapMedium,
      pointLabel: styles.pointLabelMedium,
      pointValue: styles.pointValueMedium,
      coin: '',
    };
  }
  return {
    card: styles.cardSmall,
    rankPill: styles.rankPillSmall,
    medal: styles.medalSmall,
    username: styles.usernameSmall,
    streakPill: styles.streakPillSmall,
    pointWrap: styles.pointWrapSmall,
    pointLabel: styles.pointLabelSmall,
    pointValue: styles.pointValueSmall,
    coin: styles.coinSmall,
  };
}

function getThemeClasses(rank: number, isCurrentUser?: boolean) {
  if (rank === 1) {
    return {
      bg: styles.themeRank1,
      username: styles.usernameRank1,
      pointLabel: styles.pointLabelRank1,
      pointPill: styles.pointPillRank1,
    };
  }
  if (rank === 2) {
    return {
      bg: styles.themeRank2,
      username: styles.usernameRank2,
      pointLabel: styles.pointLabelRank2,
      pointPill: styles.pointPillRank2,
    };
  }
  if (rank === 3) {
    return {
      bg: styles.themeRank3,
      username: styles.usernameRank3,
      pointLabel: styles.pointLabelRank3,
      pointPill: styles.pointPillRank3,
    };
  }
  if (isCurrentUser) {
    return {
      bg: styles.themeDefault,
      username: styles.usernameCurrentUser,
      pointLabel: styles.pointLabelCurrentUser,
      pointPill: styles.pointPillCurrentUser,
    };
  }
  return {
    bg: styles.themeDefault,
    username: styles.usernameDefault,
    pointLabel: styles.pointLabelDefault,
    pointPill: styles.pointPillDefault,
  };
}

function getStreakColor(streak: number): string {
  if (streak <= 5) return '#0800FF';
  if (streak <= 10) return '#ED21B0';
  return '#FF0000';
}

function formatPoints(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M';
  return n.toLocaleString();
}

export default function LeaderboardCard({ entry, isCurrentUser }: LeaderboardCardProps) {
  const { username, totalPoints, currentStreak, rank } = entry;

  const theme = getThemeClasses(rank, isCurrentUser);
  const size = getSize(rank, isCurrentUser);
  const sz = getSizeClasses(size);

  const showMascot = rank >= 1 && rank <= 3;
  const useMedal = rank >= 1 && rank <= 3;

  const cardClass = `${styles.card} ${sz.card} ${theme.bg} ${isCurrentUser ? styles.cardCurrentUser : ""}`;

  const renderRank = () => {
    if (useMedal) return <Medal rank={rank} extraClass={sz.medal} />;
    const label = rank === 0 ? "—" : `${rank}th`;
    return (
      <div className={`${styles.rankWrap} ${sz.rankWrap}`}>
        {isCurrentUser && (
          <div className={`${styles.yourRankLabel} ${sz.yourRankLabel}`}>
            Your Rank
          </div>
        )}
        <div className={`${styles.rankPill} ${sz.rankPill}`}>
          {label}
        </div>
      </div>
    );
  };

  return (
    <div className={cardClass}>
      {renderRank()}

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

      <div className={`${styles.username} ${sz.username} ${theme.username}`}>
        {username}
      </div>

      {currentStreak > 0 && (
        <div
          className={`${styles.streakPill} ${sz.streakPill}`}
          style={{ backgroundColor: getStreakColor(currentStreak) }}
        >
          {`Streak X${currentStreak}`}
        </div>
      )}

      <div className={`${styles.pointWrap} ${sz.pointWrap}`}>
        <div className={`${styles.pointLabel} ${sz.pointLabel} ${theme.pointLabel}`}>
          Point
        </div>
        <div className={`${styles.pointPill} ${theme.pointPill}`}>
          <CoinIcon extraClass={sz.coin} />
          <span className={`${styles.pointValue} ${sz.pointValue}`}>
            {formatPoints(totalPoints)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Medal({ rank, extraClass }: { rank: number; extraClass?: string }) {
  const medalImages: Record<number, string> = { 1: medal1, 2: medal2, 3: medal3 };
  return (
    <img
      src={medalImages[rank]}
      alt={`Rank ${rank}`}
      className={`${styles.medal} ${extraClass ?? ''}`}
    />
  );
}

function CoinIcon({ extraClass }: { extraClass?: string }) {
  return <img src={coinImg} alt="coin" className={`${styles.coin} ${extraClass ?? ''}`} />;
}