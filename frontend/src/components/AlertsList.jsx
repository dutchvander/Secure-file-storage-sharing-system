import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import {
  FiShield,
  FiAlertTriangle,
  FiFileText,
  FiUser,
  FiGlobe,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiTerminal,
  FiPaperclip,
  FiLock,
  FiServer,
  FiActivity
} from "react-icons/fi";

/* ═══════════════════════════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════════════════════════ */
const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.4), inset 0 0 4px rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.7);
  }
  50% {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.8), inset 0 0 10px rgba(239, 68, 68, 0.4);
    border-color: rgba(239, 68, 68, 1);
  }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const textBeep = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

/* ═══════════════════════════════════════════════════════════════
   STYLED COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
const SOCContainer = styled.div`
  background: #0a0e1a;
  color: #e2e8f0;
  border-radius: 16px;
  border: 1px solid #1f2937;
  padding: 24px;
  font-family: "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #ef4444, #10b981);
  }
`;

const GridHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #1f2937;
`;

const ConsoleTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #38bdf8;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  svg {
    filter: drop-shadow(0 0 6px #38bdf8);
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid rgba(16, 185, 129, 0.25);
`;

const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
  animation: ${textBeep} 1.5s infinite ease-in-out;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  svg {
    font-size: 48px;
    color: #3b82f6;
    opacity: 0.4;
    filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.3));
  }

  p {
    margin: 0;
    font-size: 15px;
    font-weight: 500;
  }
`;

const IncidentCard = styled.div`
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 12px;
  margin-bottom: 14px;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    border-color: ${props => props.$glowColor};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 12px ${props => props.$glowColor}1b;
  }

  /* Left threat level stripe */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: ${props => props.$stripeColor};
    box-shadow: 0 0 10px ${props => props.$stripeColor};
  }

  /* Critical state pulse animation */
  ${props => props.$severity === "critical" && css`
    animation: ${pulseGlow} 3s infinite ease-in-out;
  `}
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(17, 24, 39, 0.4);
  border-bottom: 1px solid rgba(31, 41, 55, 0.5);
  flex-wrap: wrap;
  gap: 10px;
`;

const ThreatInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ThreatType = styled.span`
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-weight: 700;
  font-size: 13.5px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  letter-spacing: -0.2px;
`;

const ThreatLevelBadge = styled.span`
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: 100px;
  background: ${props => props.$bgColor};
  color: ${props => props.$textColor};
  border: 1px solid ${props => props.$borderColor};
  text-transform: uppercase;
  box-shadow: 0 0 8px ${props => props.$glowColor}33;
`;

const CardMain = styled.div`
  padding: 16px 20px;
`;

const ThreatMessage = styled.p`
  margin: 0 0 14px 0;
  font-size: 14.5px;
  color: #cbd5e1;
  line-height: 1.5;
  font-weight: 500;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  align-items: center;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12.5px;
  color: #94a3b8;

  svg {
    color: #64748b;
    font-size: 14px;
    flex-shrink: 0;
  }
`;

const MonospaceText = styled.span`
  font-family: "JetBrains Mono", "Fira Code", monospace;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(56, 189, 248, 0.15);
  font-size: 12px;
`;

/* Attacker Section */
const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const UserAvatar = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.$bg || "#475569"};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #cbd5e1;
  font-size: 12px;
`;

const UserRole = styled.span`
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 1px 5px;
  border-radius: 4px;
  letter-spacing: 0.04em;
  
  ${props => props.$role === "admin" && css`
    background: rgba(239, 68, 68, 0.15);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.25);
  `}

  ${props => props.$role === "professor" && css`
    background: rgba(245, 158, 11, 0.15);
    color: #fde047;
    border: 1px solid rgba(245, 158, 11, 0.25);
  `}

  ${props => props.$role === "student" && css`
    background: rgba(14, 165, 233, 0.15);
    color: #7dd3fc;
    border: 1px solid rgba(14, 165, 233, 0.25);
  `}
`;

/* Blocked File Visual Asset Container */
const FileAssetBlock = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(239, 68, 68, 0.05);
  border: 1.5px dashed rgba(239, 68, 68, 0.25);
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 12.5px;
  color: #fca5a5;
  width: fit-content;
  max-width: 100%;
  animation: ${slideDown} 0.2s ease-out;

  svg {
    color: #ef4444;
    font-size: 16px;
    filter: drop-shadow(0 0 3px rgba(239, 68, 68, 0.5));
    flex-shrink: 0;
  }
`;

const MalwareSignature = styled.span`
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-weight: 700;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: auto;
  font-size: 11px;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.2);
`;

const ChevronWrap = styled.div`
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;

  ${IncidentCard}:hover & {
    color: #e2e8f0;
  }
`;

/* ═══════════════════════════════════════════════════════════════
   TERMINAL EXPANSION COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const DetailsShell = styled.div`
  max-height: ${props => (props.$isOpen ? "600px" : "0")};
  opacity: ${props => (props.$isOpen ? "1" : "0")};
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  background: #090d16;
  border-top: 1px solid #1f2937;
`;

const TerminalContainer = styled.div`
  padding: 16px 20px;
  font-family: "JetBrains Mono", "Fira Code", "Courier New", monospace;
  font-size: 12px;
`;

const TerminalBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #475569;
`;

const TerminalTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  svg {
    color: #ef4444;
  }
`;

const TerminalActions = styled.div`
  display: flex;
  gap: 6px;
  
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #334155;
    
    &:nth-child(1) { background-color: #ef4444; }
    &:nth-child(2) { background-color: #eab308; }
    &:nth-child(3) { background-color: #22c55e; }
  }
`;

const LogShell = styled.pre`
  margin: 0;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 14px;
  color: #a7f3d0;
  overflow-x: auto;
  line-height: 1.6;
  font-size: 11.5px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.6);

  &::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 3px;
  }
`;

const ShellHighlight = styled.span`
  color: #38bdf8;
  font-weight: 600;
`;

const ShellDanger = styled.span`
  color: #fb7185;
`;

/* ═══════════════════════════════════════════════════════════════
   MAP COLOR SYSTEM FOR SEVERITY
   ═══════════════════════════════════════════════════════════════ */
const severityStyle = {
  critical: {
    stripe: "#ef4444",
    glow: "#ef4444",
    bg: "rgba(239, 68, 68, 0.12)",
    text: "#fca5a5",
    border: "rgba(239, 68, 68, 0.3)",
    label: "Critical Threat"
  },
  high: {
    stripe: "#dc2626",
    glow: "#dc2626",
    bg: "rgba(220, 38, 38, 0.12)",
    text: "#fca5a5",
    border: "rgba(220, 38, 38, 0.3)",
    label: "High Severity"
  },
  medium: {
    stripe: "#f59e0b",
    glow: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)",
    text: "#fde047",
    border: "rgba(245, 158, 11, 0.25)",
    label: "Medium Alert"
  },
  low: {
    stripe: "#10b981",
    glow: "#10b981",
    bg: "rgba(16, 185, 129, 0.08)",
    text: "#a7f3d0",
    border: "rgba(16, 185, 129, 0.2)",
    label: "Low Risk"
  }
};

const getRelativeTime = (dateString) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  } catch (e) {
    return dateString;
  }
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function AlertsList({ alerts }) {
  const [expandedIds, setExpandedIds] = useState({});

  const toggleExpand = (id, e) => {
    // Avoid expanding if user clicks inside pre or a link
    if (e.target.closest("pre") || e.target.closest("button") || e.target.closest("a")) {
      return;
    }
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!alerts || !alerts.length) {
    return (
      <SOCContainer>
        <GridHeader>
          <ConsoleTitle>
            <FiShield size={18} />
            Security Incident Log
          </ConsoleTitle>
          <StatusIndicator>
            <LiveDot />
            MONITORING ACTIVE
          </StatusIndicator>
        </GridHeader>
        <EmptyState>
          <FiShield />
          <p>Zero active security exceptions. System integrity verified.</p>
        </EmptyState>
      </SOCContainer>
    );
  }

  return (
    <SOCContainer>
      <GridHeader>
        <ConsoleTitle>
          <FiActivity size={18} style={{ color: "#ef4444" }} />
          Security Incident Feed
        </ConsoleTitle>
        <StatusIndicator>
          <LiveDot />
          LIVE NETWORK TELEMETRY
        </StatusIndicator>
      </GridHeader>

      <div>
        {alerts.map((alert) => {
          const style = severityStyle[alert.severity] || severityStyle.medium;
          const isOpen = !!expandedIds[alert.id];
          const hasFile = !!alert.file_name;

          // Color for avatar based on name initials
          let avatarColor = "#475569";
          let userInitials = "EXT";
          if (alert.user) {
            userInitials = alert.user.name.split(" ").map(n => n[0]).join("").slice(0, 2);
            // Deterministic background color
            const colors = ["#4f46e5", "#0891b2", "#0d9488", "#b45309", "#be123c"];
            const sumChars = alert.user.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
            avatarColor = colors[sumChars % colors.length];
          }

          return (
            <IncidentCard
              key={alert.id}
              onClick={(e) => toggleExpand(alert.id, e)}
              $stripeColor={style.stripe}
              $glowColor={style.glow}
              $severity={alert.severity}
            >
              {/* TOP HEADER ROW */}
              <CardTop>
                <ThreatInfo>
                  <ThreatType>{alert.type}</ThreatType>
                  <ThreatLevelBadge
                    $bgColor={style.bg}
                    $textColor={style.text}
                    $borderColor={style.border}
                    $glowColor={style.glow}
                  >
                    {style.label}
                  </ThreatLevelBadge>
                </ThreatInfo>
                <ChevronWrap>
                  {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                </ChevronWrap>
              </CardTop>

              {/* CARD BODY */}
              <CardMain>
                <ThreatMessage>{alert.message}</ThreatMessage>

                {/* FILE DECORATIVE TAG */}
                {hasFile && (
                  <FileAssetBlock>
                    <FiPaperclip />
                    <span>File Blocked: <strong>{alert.file_name}</strong></span>
                    {alert.malware_signature && (
                      <MalwareSignature>{alert.malware_signature}</MalwareSignature>
                    )}
                  </FileAssetBlock>
                )}

                {/* METADATA FOOTER GRID */}
                <MetaGrid style={{ marginTop: hasFile ? 16 : 8 }}>
                  {/* IP */}
                  <MetaItem>
                    <FiGlobe />
                    <MonospaceText>{alert.ip || "UNKNOWN_IP"}</MonospaceText>
                  </MetaItem>

                  {/* USER BADGE */}
                  <MetaItem>
                    <FiUser />
                    {alert.user ? (
                      <UserBadge>
                        <UserAvatar $bg={avatarColor}>{userInitials}</UserAvatar>
                        <UserName>{alert.user.name}</UserName>
                        <UserRole $role={alert.user.role}>{alert.user.role}</UserRole>
                      </UserBadge>
                    ) : (
                      <span style={{ fontStyle: "italic", fontSize: "11.5px", color: "#64748b" }}>
                        Anonymous Threat
                      </span>
                    )}
                  </MetaItem>

                  {/* TIMESTAMP */}
                  <MetaItem title={`Absolute Time: ${new Date(alert.created_at).toLocaleString()}`}>
                    <FiClock />
                    <span>{getRelativeTime(alert.created_at)}</span>
                  </MetaItem>
                </MetaGrid>
              </CardMain>

              {/* TERMINAL EXPANSABLE SHELL */}
              <DetailsShell $isOpen={isOpen}>
                <TerminalContainer>
                  <TerminalBar>
                    <TerminalTitle>
                      <FiTerminal size={12} />
                      TECHNICAL INCIDENT METADATA
                    </TerminalTitle>
                    <TerminalActions>
                      <span />
                      <span />
                      <span />
                    </TerminalActions>
                  </TerminalBar>

                  <LogShell>
                    {alert.source_table === "attack_logs" ? (
                      <>
                        <ShellHighlight>{"$ cat /var/log/secure_files/waf_block_" + alert.db_id + ".json"}</ShellHighlight>
                        {"\n"}{"{\n"}
                        {`  "timestamp": `}<ShellHighlight>{`"${alert.created_at}"`}</ShellHighlight>{`,\n`}
                        {`  "event_id": "${alert.id}",\n`}
                        {`  "threat_class": "${alert.type}",\n`}
                        {`  "severity_rating": "${alert.severity.toUpperCase()}",\n`}
                        {`  "source_ip": `}<ShellHighlight>{`"${alert.ip}"`}</ShellHighlight>{`,\n`}
                        {`  "http_method": "${alert.details?.method || "N/A"}",\n`}
                        {`  "request_url": `}<ShellHighlight>{`"${alert.details?.url || "N/A"}"`}</ShellHighlight>{`,\n`}
                        {`  "user_agent": "${alert.details?.user_agent || "N/A"}",\n`}
                        {`  "waf_signature_match": "${alert.details?.source || "rules"}",\n`}
                        {`  "threat_score": `}<ShellDanger>{alert.details?.score || 0}</ShellDanger>{`,\n`}
                        {`  "action_taken": `}<ShellDanger>{`"${alert.details?.status || "blocked"}"`}</ShellDanger>{`,\n`}
                        {`  "raw_payload": `}{alert.details?.payload ? JSON.stringify(alert.details.payload, null, 2).split("\n").map((line, idx) => idx === 0 ? line : "  " + line).join("\n") : "null"}{"\n"}
                        {"}"}
                      </>
                    ) : (
                      <>
                        <ShellHighlight>{"$ cat /var/log/secure_files/alert_block_" + alert.db_id + ".json"}</ShellHighlight>
                        {"\n"}{"{\n"}
                        {`  "timestamp": `}<ShellHighlight>{`"${alert.created_at}"`}</ShellHighlight>{`,\n`}
                        {`  "event_id": "${alert.id}",\n`}
                        {`  "alert_type": "${alert.type}",\n`}
                        {`  "severity_rating": "${alert.severity.toUpperCase()}",\n`}
                        {`  "source_ip": `}<ShellHighlight>{`"${alert.ip || "N/A"}"`}</ShellHighlight>{`,\n`}
                        {`  "message": "${alert.message}",\n`}
                        {`  "context_meta": `}{alert.details?.context ? JSON.stringify(alert.details.context, null, 2).split("\n").map((line, idx) => idx === 0 ? line : "  " + line).join("\n") : "null"}{"\n"}
                        {"}"}
                      </>
                    )}
                  </LogShell>
                </TerminalContainer>
              </DetailsShell>
            </IncidentCard>
          );
        })}
      </div>
    </SOCContainer>
  );
}