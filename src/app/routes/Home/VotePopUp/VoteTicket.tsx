import { useState } from "react";
import { createPortal } from "react-dom";
import bgImage from '@/assets/image/vote-bg.png';
import blueImg from '@/assets/image/blue-bg-vote.png';
import flagBorder from '@/assets/image/vote-logo-border.png';
import checkIcon from '@/assets/image/checkIcon.png';
import voteRibbon from '@/assets/image/vote-ribbon.png';
import styles from './index.module.css';
import dayjs from 'dayjs';

export interface MatchVoteData {
  matchId: number;
  matchName: string;
  matchTime: string;
  firstTeam: { teamId: number; name: string; flagUrl: string; };
  secondTeam: { teamId: number; name: string; flagUrl: string; };
}

interface MatchVotePopupProps {
  match: MatchVoteData;
  onConfirm: (matchId: number, selectedTeam: "first" | "second") => void;
  onBack: () => void;
}

export default function MatchVotePopup({ match, onConfirm, onBack }: MatchVotePopupProps) {
  const [selected, setSelected] = useState<"first" | "second" | null>(null);
  const [voted, setVoted] = useState(false);
  const formattedTime = dayjs(match.matchTime).format('D MMM, h:mm a');

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(match.matchId, selected);
    setVoted(true);
  };

  const handleClose = () => {
    setVoted(false);
    setSelected(null);
    onBack();
  };

  const votedTeam = selected === "first" ? match.firstTeam : match.secondTeam;

  return createPortal(
    <div className={styles.overlay}>
      <div
        className={styles.card}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <button className={styles.backBtn} onClick={onBack}>&#8592;</button>

        <div className={styles.bannerText}>
          <div className={styles.bannerTitle}>WORLDCUP YOUR TEAM</div>
          <div className={styles.bannerSubtitle}>
            {voted
              ? "Thank you for your vote!"
              : "Please Review Your Ticket Details Before Confirming."}
          </div>
        </div>

        <div className={styles.body}>
          <div
            className={`${styles.ticket} ${voted ? styles.ticketVoted : ''}`}
            style={{ backgroundImage: `url(${blueImg})` }}
          >
            <div className={`${styles.ticketHeader} ${voted ? styles.ticketHeaderVoted : ''}`}>
              <div className={styles.matchName}>{match.matchName}</div>
              <div className={styles.matchTime}>{formattedTime}</div>
            </div>

            {!voted ? (
              // ── 投票前 ──
              <div className={styles.teams}>
                <button
                  className={styles.teamBtn}
                  onClick={() => setSelected("first")}
                >
                  <span className={styles.sideLabel}>Home</span>
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
                  <span className={styles.teamName}>{match.firstTeam.name}</span>
                  <div
                    className={`${styles.checkbox} ${selected === "first" ? styles.checkboxChecked : ""}`}
                    style={{
                      backgroundImage: selected === "first" ? `url(${checkIcon})` : "none",
                    }}
                  />
                </button>

                <div className={styles.vs}>VS</div>

                <button
                  className={styles.teamBtn}
                  onClick={() => setSelected("second")}
                >
                  <span className={styles.sideLabel}>Away</span>
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
                  <span className={styles.teamName}>{match.secondTeam.name}</span>
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
                  <img src={voteRibbon} alt="VOTE" className={styles.ribbon} />
                </div>
                <div className={styles.votedTeamName}>{votedTeam.name}</div>
                <div className={styles.votedSuccess}>Voted Successfully</div>
              </div>
            )}
          </div>

          {!voted ? (
            <button
              className={`${styles.confirmBtn} ${selected ? styles.confirmBtnActive : ""}`}
              onClick={handleConfirm}
              disabled={!selected}
            >
              CONFIRM TICKET
            </button>
          ) : (
            <button className={styles.closeBtn} onClick={handleClose}>
              CLOSE
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}