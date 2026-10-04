import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  strokeWidth?: number | string;
}

/**
 * Enterprise Cyber SOC Security Crest / Hardened Aegis Shield
 * Replaces generic Lucide ShieldAlert / Shield
 */
export const ShieldAlert: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Hardened angular hexagonal armor plate */}
    <path d="M12 2L3.5 5.5v6.2c0 5.4 3.6 10.3 8.5 11.8 4.9-1.5 8.5-6.4 8.5-11.8V5.5L12 2z" />
    {/* Technical telemetry core with alert notch */}
    <line x1="12" y1="8" x2="12" y2="13" />
    <circle cx="12" cy="16.5" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

export const Shield: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 2L3.5 5.5v6.2c0 5.4 3.6 10.3 8.5 11.8 4.9-1.5 8.5-6.4 8.5-11.8V5.5L12 2z" />
    <path d="M12 22V6.5" opacity="0.6" strokeDasharray="2 2" />
  </svg>
);

export const ShieldCheck: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 2L3.5 5.5v6.2c0 5.4 3.6 10.3 8.5 11.8 4.9-1.5 8.5-6.4 8.5-11.8V5.5L12 2z" />
    <polyline points="9 11.5 11.2 13.8 15.5 9.5" />
  </svg>
);

/**
 * Automated Playbook / Circuit Orchestration Pipeline
 * Replaces generic Lucide Zap
 */
export const Zap: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Clean cyber automation conduit */}
    <rect x="2" y="10" width="4" height="4" rx="0.5" />
    <line x1="6" y1="12" x2="10" y2="12" />
    <polygon points="10,6 18,12 10,18" fill="currentColor" fillOpacity="0.2" />
    <polyline points="10 6 18 12 10 18 10 6" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <rect x="20" y="10" width="2" height="4" rx="0.5" fill="currentColor" />
  </svg>
);

/**
 * Adversary Strike Target Reticle
 * Replaces generic cartoon Lucide Flame
 */
export const Flame: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Precision tactical radar strike crosshair */}
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" strokeDasharray="3 2" />
    <line x1="12" y1="1" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="1" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="23" y2="12" />
    <circle cx="12" cy="12" r="1.25" fill="currentColor" />
  </svg>
);

/**
 * Mission Control Executive Dashboard Console
 * Replaces generic Lucide LayoutDashboard
 */
export const LayoutDashboard: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Precision CAD grid display */}
    <rect x="3" y="3" width="8" height="6" rx="1" />
    <rect x="13" y="3" width="8" height="10" rx="1" />
    <rect x="3" y="11" width="8" height="10" rx="1" />
    <rect x="13" y="15" width="8" height="6" rx="1" />
    <line x1="5.5" y1="6" x2="8.5" y2="6" strokeWidth="1.2" />
    <line x1="5.5" y1="16" x2="8.5" y2="16" strokeWidth="1.2" />
  </svg>
);

/**
 * Raw Telemetry Command Matrix / Wire Terminal
 * Replaces generic Lucide Terminal
 */
export const Terminal: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="2.5" y="3.5" width="19" height="17" rx="1.5" />
    <polyline points="6.5 8.5 10 12 6.5 15.5" />
    <line x1="12" y1="16" x2="16.5" y2="16" strokeWidth="2" />
  </svg>
);

/**
 * MITRE ATT&CK Matrix Grid
 * Replaces generic Lucide Grid
 */
export const Grid: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* 3-column tactical kill-chain matrix */}
    <rect x="3" y="3" width="5" height="18" rx="0.75" />
    <rect x="9.5" y="3" width="5" height="18" rx="0.75" />
    <rect x="16" y="3" width="5" height="18" rx="0.75" />
    <line x1="3" y1="8" x2="8" y2="8" />
    <line x1="9.5" y1="12" x2="14.5" y2="12" />
    <line x1="16" y1="9" x2="21" y2="9" />
    <line x1="16" y1="15" x2="21" y2="15" />
  </svg>
);

/**
 * Sigma Detection Rules / Correlation Code Brackets
 * Replaces generic Lucide Code
 */
export const Code: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Detection logic operator glyph */}
    <polyline points="7.5 7 2.5 12 7.5 17" />
    <polyline points="16.5 7 21.5 12 16.5 17" />
    <line x1="14" y1="4.5" x2="10" y2="19.5" />
  </svg>
);

/**
 * Real-Time Telemetry Radio Stream / Wire Broadcast
 * Replaces generic Lucide Radio
 */
export const Radio: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    <path d="M16.5 7.5a6.5 6.5 0 0 1 0 9" />
    <path d="M7.5 16.5a6.5 6.5 0 0 1 0-9" />
    <path d="M19.5 4.5a11 11 0 0 1 0 15" />
    <path d="M4.5 19.5a11 11 0 0 1 0-15" />
  </svg>
);

/**
 * Ingestion Pipeline Pause
 * Replaces generic Lucide Pause
 */
export const Pause: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" fillOpacity="0.4" />
    <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" fillOpacity="0.4" />
  </svg>
);

/**
 * DirectQuery Telemetry Sync / Refresh
 * Replaces generic Lucide RotateCcw
 */
export const RotateCcw: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M3 12a9 9 0 1 0 2.6-6.4L1 10" />
    <polyline points="1 4 1 10 7 10" />
  </svg>
);

/**
 * Signal Slicer / Ingress Filter Gate
 * Replaces generic Lucide Filter
 */
export const Filter: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Enterprise technical signal filter */}
    <polygon points="3 4 21 4 14 13 14 20 10 18 10 13 3 4" />
  </svg>
);

/**
 * Audio Alarm Active Chime
 * Replaces generic Lucide Volume2
 */
export const Volume2: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
  </svg>
);

/**
 * Audio Alarm Muted
 * Replaces generic Lucide VolumeX
 */
export const VolumeX: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="22" y1="9" x2="16" y2="15" />
    <line x1="16" y1="9" x2="22" y2="15" />
  </svg>
);

/**
 * Enterprise Host Chassis / Rackmount Server Node
 * Replaces generic Lucide Server
 */
export const Server: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="2" y="3" width="20" height="7" rx="1" />
    <rect x="2" y="14" width="20" height="7" rx="1" />
    <circle cx="6" cy="6.5" r="0.75" fill="currentColor" />
    <circle cx="9" cy="6.5" r="0.75" fill="currentColor" />
    <circle cx="6" cy="17.5" r="0.75" fill="currentColor" />
    <circle cx="9" cy="17.5" r="0.75" fill="currentColor" />
    <line x1="14" y1="6.5" x2="18.5" y2="6.5" />
    <line x1="14" y1="17.5" x2="18.5" y2="17.5" />
  </svg>
);

/**
 * Forensic Optical Telemetry Loupe / Inspector Search
 * Replaces generic Lucide Search
 */
export const Search: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="10.5" cy="10.5" r="7.5" />
    <line x1="16" y1="16" x2="21.5" y2="21.5" strokeWidth={strokeWidth} />
    {/* Micro reticle in lens */}
    <circle cx="10.5" cy="10.5" r="1.5" fill="currentColor" opacity="0.4" />
  </svg>
);

/**
 * Hardened SOAR Quarantine Lock
 * Replaces generic Lucide Lock
 */
export const Lock: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="3.5" y="11" width="17" height="11" rx="1.5" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * Confirmed Remediated Action / Verification
 * Replaces generic Lucide CheckCircle2
 */
export const CheckCircle2: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="9.5" />
    <polyline points="8 12 11 15 16 9" />
  </svg>
);

/**
 * Real-Time ECG Ingestion Pulse
 * Replaces generic Lucide Activity
 */
export const Activity: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polyline points="2 12 6 12 9 4 14 20 17 10 20 12 22 12" />
  </svg>
);

/**
 * Security Incident Play / Execute Action
 * Replaces generic Lucide Play
 */
export const Play: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polygon points="6 4 20 12 6 20 6 4" fill="currentColor" fillOpacity="0.25" />
  </svg>
);

/**
 * Threat Severity Alert Triangle
 * Replaces generic Lucide AlertTriangle
 */
export const AlertTriangle: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 2.5L1.5 20.5h21L12 2.5z" />
    <line x1="12" y1="9" x2="12" y2="14" />
    <circle cx="12" cy="17.5" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Technical Modal Close / Dismiss
 * Replaces generic Lucide X
 */
export const X: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * Technical Add / Insert Rule
 * Replaces generic Lucide Plus
 */
export const Plus: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/**
 * Data Payload Export
 * Replaces generic Lucide Download
 */
export const Download: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

/**
 * Raw Payload Copy / Buffer
 * Replaces generic Lucide Copy
 */
export const Copy: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="8" y="8" width="13" height="13" rx="1.5" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

/**
 * Checkmark
 * Replaces generic Lucide Check
 */
export const Check: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * Navigation Chevron Icons
 * Replaces generic Lucide ChevronRight, ChevronLeft, ChevronDown
 */
export const ChevronRight: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const ChevronLeft: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const ChevronDown: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/**
 * Directional Arrow Glyphs
 */
export const ArrowRight: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const ArrowLeft: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const ArrowDown: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

export const ArrowUpRight: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

/**
 * World Ingress Coordinates / Geolocation
 * Replaces generic Lucide Globe & Languages
 */
export const Globe: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="9.5" />
    <line x1="2.5" y1="12" x2="21.5" y2="12" />
    <path d="M12 2.5a14 14 0 0 1 0 19" />
    <path d="M12 2.5a14 14 0 0 0 0 19" />
  </svg>
);

export const Languages: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M4 5h7" />
    <path d="M9 3v2c0 4-2.5 7-5 8.5" />
    <path d="M5 8c1.5 2 3.5 3.5 6 4" />
    <path d="M14 19l4-9 4 9" />
    <path d="M15.5 16h5" />
  </svg>
);

/**
 * Theme Spectrum Calibration Swatch
 * Replaces generic Lucide Palette
 */
export const Palette: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="9" x2="9" y2="21" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
    <circle cx="12" cy="6" r="1" fill="currentColor" />
    <circle cx="18" cy="6" r="1" fill="currentColor" />
  </svg>
);

/**
 * Viewport Spotlight / Expanded Focus
 * Replaces generic Lucide Focus, Maximize2, Minimize2
 */
export const Focus: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M4 8V4h4" />
    <path d="M16 4h4v4" />
    <path d="M4 16v4h4" />
    <path d="M20 16v4h-4" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

export const Maximize2: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

export const Minimize2: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

export const MoreHorizontal: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    <circle cx="5" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * Telemetry Timeline Chronometer
 * Replaces generic Lucide Clock
 */
export const Clock: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="9.5" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/**
 * Analyst Notes / Incident Log File
 * Replaces generic Lucide FileText
 */
export const FileText: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

/**
 * Identity & Access User Token
 * Replaces generic Lucide User
 */
export const User: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

/**
 * Multi-Vector Data Stack
 * Replaces generic Lucide Layers
 */
export const Layers: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 12 12 17 22 12" />
    <polyline points="2 17 12 22 22 17" />
  </svg>
);

/**
 * Ingress Origin Ranking Histogram
 * Replaces generic Lucide BarChart3
 */
export const BarChart3: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="18" y1="20" x2="18" y2="4" strokeWidth="2.5" />
    <line x1="12" y1="20" x2="12" y2="10" strokeWidth="2.5" />
    <line x1="6" y1="20" x2="6" y2="14" strokeWidth="2.5" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

/**
 * Technical System Info
 * Replaces generic Lucide Info
 */
export const Info: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="9.5" />
    <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2" />
    <circle cx="12" cy="8" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Zoom In Viewport Fit
 * Replaces generic Lucide ZoomIn
 */
export const ZoomIn: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

/**
 * Selection Checkboxes
 * Replaces generic Lucide CheckSquare and Square
 */
export const CheckSquare: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="1.5" />
    <polyline points="7 12 10.5 15.5 17 9" />
  </svg>
);

export const Square: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="1.5" />
  </svg>
);

/**
 * Multi-Attribute Slicers
 * Replaces generic Lucide SlidersHorizontal
 */
export const SlidersHorizontal: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="4" y1="6" x2="14" y2="6" />
    <line x1="18" y1="6" x2="20" y2="6" />
    <circle cx="16" cy="6" r="2" />
    <line x1="4" y1="12" x2="8" y2="12" />
    <line x1="12" y1="12" x2="20" y2="12" />
    <circle cx="10" cy="12" r="2" />
    <line x1="4" y1="18" x2="16" y2="18" />
    <line x1="20" y1="18" x2="20" y2="18" />
    <circle cx="18" cy="18" r="2" />
  </svg>
);

/**
 * Column Sort Order
 * Replaces generic Lucide ArrowUpDown
 */
export const ArrowUpDown: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M7 20V4M3 8l4-4 4 4M17 4v16m4-4l-4 4-4-4" />
  </svg>
);

/**
 * External Navigation Link
 * Replaces generic Lucide ExternalLink
 */
export const ExternalLink: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/**
 * Revoke IAM Identity Token / User Quarantine
 * Replaces generic Lucide UserX
 */
export const UserX: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="18" y1="8" x2="23" y2="13" />
    <line x1="23" y1="8" x2="18" y2="13" />
  </svg>
);

/**
 * Enterprise Network Topology / Ingress Gateway
 */
export const Network: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="9" y="2" width="6" height="6" rx="1" />
    <rect x="2" y="16" width="6" height="6" rx="1" />
    <rect x="16" y="16" width="6" height="6" rx="1" />
    <path d="M5 16v-4h14v4" />
    <line x1="12" y1="8" x2="12" y2="12" />
  </svg>
);

/**
 * Cryptographic Credential / Key
 */
export const Key: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="7.5" cy="15.5" r="4.5" />
    <path d="M21 2l-9.6 9.6" />
    <path d="M15.5 7.5l3 3" />
    <path d="M18.5 4.5l2 2" />
  </svg>
);

/**
 * Tactical Reticle / Crosshair
 */
export const Crosshair: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

/**
 * Share / LinkedIn Export Node
 */
export const Share2: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

/**
 * Endpoint Processor / Microarchitecture
 */
export const Cpu: React.FC<IconProps> = ({ size = 16, strokeWidth = 1.75, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);
