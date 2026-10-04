export type LogSeverity = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface GeoLocation {
  country: string;
  countryCode: string;
  city: string;
  asn: string;
}

export interface LogEntry {
  id: string;
  timestamp: string; // ISO format
  level: LogSeverity;
  source: 'AWS CloudTrail' | 'Kubernetes Audit' | 'Linux Syslog' | 'Windows Security' | 'Okta SSO' | 'Cloudflare WAF' | 'Zeek Network' | 'CrowdStrike EDR' | 'Suricata IDS';
  eventId: string;
  eventName: string;
  eventNameAr?: string;
  host: string;
  user: string;
  sourceIp: string;
  destIp?: string;
  geoIp?: GeoLocation;
  mitreTechniqueId?: string;
  mitreTactic?: string;
  mitreTacticAr?: string;
  signature?: string;
  signatureAr?: string;
  rawPayload: Record<string, unknown>;
}

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'NEW' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  phase: 'INITIAL_ACCESS' | 'EXECUTION' | 'LATERAL_MOVEMENT' | 'DETECTION' | 'CONTAINMENT';
}

export interface IncidentAlert {
  id: string;
  title: string;
  titleAr?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  timestamp: string;
  detectionRuleId: string;
  mitreTactic: string;
  mitreTacticAr?: string;
  mitreTechnique: string;
  mitreTechniqueName: string;
  mitreTechniqueNameAr?: string;
  confidenceScore: number; // 0-100
  affectedHost: string;
  affectedUser: string;
  attackerIp: string;
  attackerGeo?: GeoLocation;
  summary: string;
  summaryAr?: string;
  recommendedPlaybookId: string;
  timeline: IncidentTimelineEvent[];
  correlatedLogIds: string[];
  responseActionsTaken: string[];
  assignedTo?: string;
  assignedToAr?: string;
  notes: string[];
  notesAr?: string[];
}

export interface DetectionRule {
  id: string;
  name: string;
  nameAr?: string;
  severity: IncidentSeverity;
  mitreTechnique: string;
  mitreTactic: string;
  mitreTacticAr?: string;
  query: string;
  threshold: number;
  timeWindowSeconds: number;
  enabled: boolean;
  triggeredCount: number;
  automatedPlaybookId?: string;
  description: string;
  descriptionAr?: string;
  tags: string[];
}

export type PlaybookActionType = 
  | 'BLOCK_IP'
  | 'ISOLATE_HOST'
  | 'REVOKE_USER_TOKENS'
  | 'KILL_PROCESS'
  | 'ROTATE_CREDENTIALS'
  | 'SNAPSHOT_MEMORY'
  | 'NOTIFY_PAGERDUTY'
  | 'ENFORCE_FIREWALL_RULE';

export interface PlaybookStep {
  id: string;
  name: string;
  nameAr?: string;
  actionType: PlaybookActionType;
  targetDescription: string;
  targetDescriptionAr?: string;
  timeoutSeconds: number;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  outputMessage?: string;
  outputMessageAr?: string;
}

export interface Playbook {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  triggerType: 'AUTOMATIC_ON_CRITICAL' | 'AUTOMATIC_ON_HIGH' | 'MANUAL_TRIAGE';
  steps: PlaybookStep[];
  lastRunTimestamp?: string;
  runsCount: number;
  targetScope: string;
  targetScopeAr?: string;
}

export interface ResponseAuditRecord {
  id: string;
  timestamp: string;
  incidentId: string;
  incidentTitle: string;
  incidentTitleAr?: string;
  playbookName: string;
  playbookNameAr?: string;
  executedBy: 'AUTOMATED_ENGINE' | 'SOC_ANALYST';
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  actionsSummary: string;
  actionsSummaryAr?: string;
  affectedEntities: string[];
  canRollback: boolean;
  rolledBack?: boolean;
}

export interface AttackScenario {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  tactic: string;
  tacticAr?: string;
  targetHost: string;
  attackerIp: string;
  targetUser: string;
  mitreId: string;
  expectedPlaybookId: string;
}
