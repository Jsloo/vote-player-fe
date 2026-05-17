import { useState } from "react";
import { createPortal } from "react-dom";
import bgImage from '@/assets/image/vote-bg.png';
import blueImg from '@/assets/image/blue-bg-vote.png';
import flagBorder from '@/assets/image/vote-logo-border.png';
import checkIcon from '@/assets/image/checkIcon.png';
import voteRibbon from '@/assets/image/vote-ribbon.png';
import styles from './index.module.css';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translationKey } from '@/i18n/constants'
import { translateRemoteLabel } from '@/app/utils/translateRemoteLabel';

export interface MatchVoteData {
  matchId: number;
  matchName: string;
  titleName: string;
  matchTime: string;
  firstTeam: { teamId: number; name: string; flagUrl: string; };
  secondTeam: { teamId: number; name: string; flagUrl: string; };
}

interface MatchVotePopupProps {
  match: MatchVoteData;
  // async：成功时 resolve，失败时 throw Error（Error.message 用于 UI 显示）
  // 可选地，Error 上可以挂 `code` 字段（来自后端 ErrorCode）做精细化处理
  onConfirm: (matchId: number, selectedTeam: "first" | "second") => Promise<void>;
  onBack: () => void;
}

// 把后端错误码映射成更友好的用户提示（可选）
function getUserFriendlyError(err: any): string {
  const code = err?.code as string | undefined;
  const message = err?.message as string | undefined;

  switch (code) {
    case '14020':  // ALREADY_VOTED
      return "You've already voted for this match";
    case '20002':  // INSUFFICIENT_TICKET_BALANCE
      return "Not enough tickets, please get more before voting";
    case '14019':  // MATCH_ALREADY_EXPIRED
      return "This match has already ended";
    case '14001':  // MATCH_NOT_FOUND
      return "Match not found, please refresh the page";
    case '20001':  // MATCH_TEAM_NOT_FOUND
      return "Team not found, please refresh the page";
    default:
      return message ?? 'Vote failed, please try again';
  }
}

export default function MatchVotePopup({ match, onConfirm, onBack }: MatchVotePopupProps) {
  const [selected, setSelected] = useState<"first" | "second" | null>(null);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const formattedTime = dayjs(match.matchTime).format('D MMM, h:mm a');

  const handleConfirm = async () => {
    if (!selected || loading) return;

    setLoading(true);
    setError(null);

    try {
      await onConfirm(match.matchId, selected);
      setVoted(true);
    } catch (err: any) {
      setError(getUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  // 用户点击其他 team：清除错误，允许重选
  const handleSelectTeam = (team: "first" | "second") => {
    if (loading) return;
    setSelected(team);
    if (error) setError(null);
  };

  const handleBack = () => {
    if (loading) return;  // 投票请求中不允许关闭
    onBack();
  };

  const handleClose = () => {
    setVoted(false);
    setSelected(null);
    setError(null);
    onBack();
  };

  const handleDismissError = () => {
    setError(null);
  };

  const votedTeam = selected === "first" ? match.firstTeam : match.secondTeam;

  return createPortal(
    <div className={styles.overlay}>
      <div
        className={styles.card}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <button
          className={styles.backBtn}
          onClick={handleBack}
          disabled={loading}
        >
          &#8592;
        </button>

        {/* 错误提示 */}
        {error && !voted && (
          <div className={styles.errorMessage} role="alert">
            <span className={styles.errorIcon}>⚠</span>
            <span className={styles.errorText}>{error}</span>
            <button
              className={styles.errorClose}
              onClick={handleDismissError}
              type="button"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}


        <div className={styles.bannerText}>
          <div className={styles.bannerTitle}>{t(translationKey.VOTE_POPUP_TITLE, { defaultValue: 'WORLDCUP YOUR TEAM' })}</div>
          <div className={styles.bannerSubtitle}>
            {voted
              ? t(translationKey.VOTE_POPUP_SUBTITLE_THANKS, {
                defaultValue: 'Thank you for your vote!',
              })
              : t(translationKey.VOTE_POPUP_SUBTITLE_REVIEW, {
                defaultValue: 'Please Review Your Ticket Details Before Confirming.',
              })}
          </div>
        </div>

        <div className={styles.body}>
          <div
            className={`${styles.ticket} ${voted ? styles.ticketVoted : ''}`}
            style={{ backgroundImage: `url(${blueImg})` }}
          >
            <div className={`${styles.ticketHeader}`}>
              <div className={styles.matchName}>{translateRemoteLabel(t, match.matchName)}.{translateRemoteLabel(t, match.titleName)}</div>
              <div className={styles.matchTime}>{formattedTime}</div>
            </div>

            {!voted ? (
              // ── 投票前 ──
              <div className={styles.teams}>
                <button
                  className={styles.teamBtn}
                  onClick={() => handleSelectTeam("first")}
                  disabled={loading}
                  type="button"
                >
                  <span className={styles.sideLabel}>
                    {t(translationKey.COMMON_HOME_SIDE, { defaultValue: 'Home' })}
                  </span>
                  <div
                    className={`${styles.flagCircle} ${selected === "first" ? styles.flagCircleSelected : ""}`}
                    style={{ backgroundImage: `url(${flagBorder})` }}
                  >
                    <img
                      src={match.firstTeam.flagUrl}
                      alt={match.firstTeam.name}
                      className={styles.flagImg}
                    />
                  </div>
                  <span className={styles.teamName}>{translateRemoteLabel(t, match.firstTeam.name)}</span>
                  <div
                    className={`${styles.checkbox} ${selected === "first" ? styles.checkboxChecked : ""}`}
                    style={{
                      backgroundImage: selected === "first" ? `url(${checkIcon})` : "none",
                    }}
                  />
                </button>

                <div className={styles.vs}>
                  {t(translationKey.COMMON_VS, { defaultValue: 'VS' })}
                </div>

                <button
                  className={styles.teamBtn}
                  onClick={() => handleSelectTeam("second")}
                  disabled={loading}
                  type="button"
                >
                  <span className={styles.sideLabel}>
                    {t(translationKey.COMMON_AWAY_SIDE, { defaultValue: 'Away' })}
                  </span>
                  <div
                    className={`${styles.flagCircle} ${selected === "second" ? styles.flagCircleSelected : ""}`}
                    style={{ backgroundImage: `url(${flagBorder})` }}
                  >
                    <img
                      src={match.secondTeam.flagUrl}
                      alt={match.secondTeam.name}
                      className={styles.flagImg}
                    />
                  </div>
                  <span className={styles.teamName}> {translateRemoteLabel(t, match.secondTeam.name)}</span>
                  <div
                    className={`${styles.checkbox} ${selected === "second" ? styles.checkboxChecked : ""}`}
                    style={{
                      backgroundImage: selected === "second" ? `url(${checkIcon})` : "none",
                    }}
                  />
                </button>
              </div>
            ) : (
              // ── 投票后 ──
              <div className={styles.votedWrap}>
                <div className={styles.votedFlagWrap}>
                  <div
                    className={styles.votedFlagCircle}
                    style={{ backgroundImage: `url(${flagBorder})` }}
                  >
                    <img
                      src={votedTeam.flagUrl}
                      alt={votedTeam.name}
                      className={styles.votedFlagImg}
                    />
                  </div>
                  <img
                    src={voteRibbon}
                    alt={t(translationKey.COMMON_VOTE_RIBBON, { defaultValue: 'VOTE' })}
                    className={styles.ribbon}
                  />
                </div>
                <div className={styles.votedTeamName}>{translateRemoteLabel(t, votedTeam.name)}</div>
                <div className={styles.votedSuccess}>{t(translationKey.VOTE_POPUP_VOTED_SUCCESS, { defaultValue: 'Voted Successfully' })}</div>
              </div>
            )}
          </div>

          {!voted ? (
            <button
              className={`${styles.confirmBtn} ${selected && !loading ? styles.confirmBtnActive : ""}`}
              onClick={handleConfirm}
              disabled={!selected || loading}
              type="button"
            >
              {loading
                ? t(translationKey.VOTE_POPUP_PROCESSING, { defaultValue: 'PROCESSING...' })
                : t(translationKey.VOTE_POPUP_CONFIRM, { defaultValue: 'CONFIRM TICKET' })}
            </button>
          ) : (
            <button
              className={styles.closeBtn}
              onClick={handleClose}
              type="button"
            >
              {t(translationKey.VOTE_POPUP_CLOSE, { defaultValue: 'CLOSE' })}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}