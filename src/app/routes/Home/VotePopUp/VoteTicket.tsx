import React, { useState } from "react";
import { createPortal } from "react-dom";
import bgImage from '@/assets/image/vote-bg.png';
import blueImg from '@/assets/image/blue-bg-vote.png';
import flagBorder from '@/assets/image/vote-logo-border.png';
import checkIcon from '@/assets/image/checkIcon.png';
import voteRibbon from '@/assets/image/vote-ribbon.png';

export interface MatchVoteData {
  matchId: number;
  matchName: string;
  matchTime: string;
  firstTeam: { teamId: number; name: string; flagUrl: string; };
  secondTeam: { teamId: numebr; name: string; flagUrl: string; };
}

interface MatchVotePopupProps {
  match: MatchVoteData;
  onConfirm: (matchId: number, selectedTeam: "first" | "second") => void;
  onBack: () => void;
}

export default function MatchVotePopup({ match, onConfirm, onBack }: MatchVotePopupProps) {
  const [selected, setSelected] = useState<"first" | "second" | null>(null);
  const [voted, setVoted] = useState(false);

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

  // ── Styles ──
  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 16,
  };

  const card: React.CSSProperties = {
    width: 360,
    height: 560,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "top center",
    backgroundRepeat: "no-repeat",
  };

  const backBtn: React.CSSProperties = {
    position: "absolute",
    top: 12,
    left: 14,
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.2)",
    color: "white",
    fontSize: 18,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  };

  const bannerText: React.CSSProperties = {
    textAlign: "center",
    padding: "14px 16px 0",
  };

  const body: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "12px 16px 20px",
  };

  const ticket: React.CSSProperties = {
    width: "80%",
    backgroundImage: `url(${blueImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: 20,
    padding: 16,
    color: "white",
    boxSizing: "border-box",
  };

  const teams: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  };

  const teamBtn = (_isSelected: boolean): React.CSSProperties => ({
    flex: 1,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "white",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  });

  const flagCircle = (isSelected: boolean): React.CSSProperties => ({
    width: 90,
    height: 90,
    backgroundImage: `url(${flagBorder})`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    filter: isSelected ? "drop-shadow(0 0 8px #facc15)" : "none",
  });

  const flagImg: React.CSSProperties = {
    width: 78,
    height: 78,
    objectFit: "cover",
    borderRadius: "50%",
  };

  const checkbox = (isChecked: boolean): React.CSSProperties => ({
    width: 24,
    height: 24,
    borderRadius: 5,
    background: isChecked ? "#ef4444" : "rgba(255,255,255,0.12)",
    border: isChecked ? "2px solid #ef4444" : "2px solid rgba(255,255,255,0.3)",
    backgroundImage: isChecked ? `url(${checkIcon})` : "none",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "14px",
  });

  const confirmBtn: React.CSSProperties = {
    width: "80%",
    marginTop: 16,
    padding: 14,
    borderRadius: 40,
    border: "none",
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 1.2,
    background: selected ? "#1a5bbf" : "#ccc5b5",
    color: selected ? "white" : "#8a7f70",
    cursor: selected ? "pointer" : "not-allowed",
    boxShadow: selected ? "0 4px 12px rgba(26,91,191,0.4)" : "none",
  };

  const closeBtn: React.CSSProperties = {
    width: "80%",
    marginTop: 16,
    padding: 14,
    borderRadius: 40,
    border: "none",
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 1.2,
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(220,38,38,0.4)",
  };

  // ── Voted state styles ──
  const votedFlagWrap: React.CSSProperties = {
    position: "relative",
    width: 130,
    height: 130,
    margin: "12px auto 8px",
  };

  const votedFlagCircle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    backgroundImage: `url(${flagBorder})`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const votedFlagImg: React.CSSProperties = {
    width: 112,
    height: 112,
    objectFit: "cover",
    borderRadius: "50%",
  };

  const ribbon: React.CSSProperties = {
    position: "absolute",
    top: -6,
    right: -8,
    width: 70,
    height: "auto",
    transform: "rotate(15deg)",
    pointerEvents: "none",
  };

  return createPortal(
    <div style={overlay}>
      <div style={card}>
        <button style={backBtn} onClick={onBack}>&#8592;</button>

        <div style={bannerText}>
          <div style={{ color: "white", fontSize: 16, fontWeight: 700, letterSpacing: 0.5, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
            WORLDCUP YOUR TEAM
          </div>
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, marginTop: 3, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
            {voted ? "Thank you for your vote!" : "Please Review Your Ticket Details Before Confirming."}
          </div>
        </div>

        <div style={body}>
          <div style={ticket}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#93c5fd" }}>{match.matchName}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{match.matchTime}</div>
            </div>

            {!voted ? (
              // ── 投票前 ──
              <div style={teams}>
                <button style={teamBtn(selected === "first")} onClick={() => setSelected("first")}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Home</span>
                  <div style={flagCircle(selected === "first")}>
                    <img src={match.firstTeam.flagUrl} alt={match.firstTeam.name} style={flagImg} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{match.firstTeam.name}</span>
                  <div style={checkbox(selected === "first")} />
                </button>

                <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.75)", flexShrink: 0 }}>VS</div>

                <button style={teamBtn(selected === "second")} onClick={() => setSelected("second")}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Away</span>
                  <div style={flagCircle(selected === "second")}>
                    <img src={match.secondTeam.flagUrl} alt={match.secondTeam.name} style={flagImg} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{match.secondTeam.name}</span>
                  <div style={checkbox(selected === "second")} />
                </button>
              </div>
            ) : (
              // ── 投票后 ──
              <div style={{ textAlign: "center" }}>
                <div style={votedFlagWrap}>
                  <div style={votedFlagCircle}>
                    <img src={votedTeam.flagUrl} alt={votedTeam.name} style={votedFlagImg} />
                  </div>
                  <img src={voteRibbon} alt="VOTE" style={ribbon} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{votedTeam.name}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
                  Voted Successfully
                </div>
              </div>
            )}
          </div>

          {!voted ? (
            <button style={confirmBtn} onClick={handleConfirm} disabled={!selected}>
              CONFIRM TICKET
            </button>
          ) : (
            <button style={closeBtn} onClick={handleClose}>
              CLOSE
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}