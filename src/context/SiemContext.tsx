import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  AttackScenario, 
  DetectionRule, 
  IncidentAlert, 
  IncidentSeverity, 
  IncidentStatus, 
  LogEntry, 
  Playbook, 
  ResponseAuditRecord 
} from '../types/siem';
import { 
  INITIAL_INCIDENTS, 
  INITIAL_LOGS, 
  INITIAL_PLAYBOOKS, 
  INITIAL_RULES 
} from '../data/mockData';
import { PowerBiThemeId, THEMES } from '../types/theme';
import { Language, TRANSLATIONS, TranslationKey } from '../i18n/translations';

export type PowerBiPage = 'overview' | 'incidents' | 'mitre' | 'logs' | 'playbooks' | 'rules';

interface SiemStats {
  ingestionRateEPS: number;
  activeIncidents: number;
  criticalAlerts: number;
  mttdSeconds: number;
  mttrMinutes: number;
  autoContainmentRate: number;
  totalLogsCount: number;
}

interface SiemContextType {
  logs: LogEntry[];
  incidents: IncidentAlert[];
  rules: DetectionRule[];
  playbooks: Playbook[];
  auditRecords: ResponseAuditRecord[];
  isStreaming: boolean;
  streamSpeed: 1 | 2 | 5;
  soundEnabled: boolean;
  pbiPage: PowerBiPage;
  setPbiPage: (page: PowerBiPage) => void;
  selectedIncident: IncidentAlert | null;
  selectedLog: LogEntry | null;
  activeExecutingPlaybook: { playbookId: string; currentStepIndex: number; logs: string[] } | null;
  blockedIps: Set<string>;
  isolatedHosts: Set<string>;
  revokedUsers: Set<string>;
  stats: SiemStats;
  lastRefreshedAt: number;
  isRefreshing: boolean;
  refreshData: () => void;
  
  // Power BI Cross-filtering & Visual states
  crossFilterSeverity: IncidentSeverity | null;
  setCrossFilterSeverity: (sev: IncidentSeverity | null) => void;
  crossFilterSource: string | null;
  setCrossFilterSource: (src: string | null) => void;
  crossFilterStatus: IncidentStatus | null;
  setCrossFilterStatus: (st: IncidentStatus | null) => void;
  resetAllCrossFilters: () => void;
  isFilterPaneOpen: boolean;
  setIsFilterPaneOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  focusedVisualId: string | null;
  setFocusedVisualId: (id: string | null) => void;
  theme: PowerBiThemeId;
  setTheme: (theme: PowerBiThemeId) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRtl: boolean;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;

  // Actions
  toggleStreaming: () => void;
  setStreamSpeed: (speed: 1 | 2 | 5) => void;
  toggleSound: () => void;
  setSelectedIncident: (incident: IncidentAlert | null) => void;
  setSelectedLog: (log: LogEntry | null) => void;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus) => void;
  assignIncident: (incidentId: string, assignee: string) => void;
  addIncidentNote: (incidentId: string, note: string) => void;
  executePlaybook: (playbookId: string, incidentId?: string, isAuto?: boolean) => Promise<boolean>;
  rollbackAction: (auditId: string) => void;
  quickBlockIp: (ip: string, reason: string) => void;
  quickIsolateHost: (host: string, reason: string) => void;
  quickRevokeUser: (user: string, reason: string) => void;
  toggleRule: (ruleId: string) => void;
  addRule: (rule: Omit<DetectionRule, 'id' | 'triggeredCount'>) => void;
  simulateAttack: (scenario: AttackScenario) => void;
  exportLogsJson: () => void;
  exportLogsCsv: () => void;
}

const SiemContext = createContext<SiemContextType | undefined>(undefined);

// Web Audio chime generator for real-time alert notifications
let audioCtxInstance: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtxInstance) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return null;
      audioCtxInstance = new AudioContextClass();
    }
    if (audioCtxInstance.state === 'suspended') {
      audioCtxInstance.resume();
    }
    return audioCtxInstance;
  } catch {
    return null;
  }
}

function playAlertChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // E6 chirp

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch {
    // Audio context may require prior user interaction
  }
}

const EVENT_TEMPLATES = [
  { source: 'AWS CloudTrail', name: 'DescribeInstances API Call', level: 'INFO', user: 'terraform-svc', host: 'aws:ec2::eu-west-1' },
  { source: 'AWS CloudTrail', name: 'GetSecretValue from SecretsManager', level: 'INFO', user: 'backend-api-role', host: 'aws:secrets::eu-west-1' },
  { source: 'Linux Syslog', name: 'cron.daily job executed successfully', level: 'INFO', user: 'root', host: 'prod-app-node-04' },
  { source: 'Linux Syslog', name: 'sudo session opened for devops.alex', level: 'INFO', user: 'alex.m', host: 'bastion-host-01' },
  { source: 'Windows Security', name: 'Special privileges assigned to new logon (4672)', level: 'INFO', user: 'svc_deploy', host: 'dc02.corp.internal' },
  { source: 'Cloudflare WAF', name: 'HTTP Request Passed Bot Management', level: 'INFO', user: 'anonymous', host: 'enterprise-app.com' },
  { source: 'Cloudflare WAF', name: 'Rate limit rule triggered: /graphql query burst', level: 'WARN', user: 'anonymous', host: 'api.enterprise-app.com' },
  { source: 'Okta SSO', name: 'User single sign-on authentication successful', level: 'INFO', user: 'elena.rostova@enterprise.com', host: 'okta.auth' },
  { source: 'Zeek Network', name: 'Outbound TLS 1.3 Handshake completed', level: 'INFO', user: 'netdaemon', host: 'switch-core-01' },
  { source: 'Kubernetes Audit', name: 'ConfigMap updated in production namespace', level: 'INFO', user: 'argocd-server', host: 'k8s-master-01' },
  { source: 'CrowdStrike EDR', name: 'Process execution tree validated (clean reputation)', level: 'INFO', user: 'node', host: 'prod-worker-08' }
];

const STREAM_GEO_LOCATIONS = [
  { country: 'Netherlands', countryCode: 'NL', city: 'Amsterdam', asn: 'AS200052 (Tor Relay)', sourceIp: '185.220.101.5', tactic: 'Command & Control', technique: 'T1071.001' },
  { country: 'Russia', countryCode: 'RU', city: 'Moscow', asn: 'AS44050 (Hosting Solutions)', sourceIp: '194.26.29.112', tactic: 'Credential Access', technique: 'T1110.001' },
  { country: 'China', countryCode: 'CN', city: 'Beijing', asn: 'AS4808 (China Telecom)', sourceIp: '114.114.114.114', tactic: 'Initial Access', technique: 'T1190' },
  { country: 'Germany', countryCode: 'DE', city: 'Frankfurt', asn: 'AS24940 (Hetzner Online)', sourceIp: '198.51.100.44', tactic: 'Initial Access', technique: 'T1078.004' },
  { country: 'Bulgaria', countryCode: 'BG', city: 'Sofia', asn: 'AS58061 (DataWeb Global)', sourceIp: '45.154.255.89', tactic: 'Initial Access', technique: 'T1190' },
  { country: 'United States', countryCode: 'US', city: 'Silicon Valley', asn: 'AS15169 (Enterprise Cloud Core)', sourceIp: '10.14.2.80', tactic: 'Execution', technique: 'T1059.001' },
  { country: 'United Kingdom', countryCode: 'GB', city: 'London', asn: 'AS16276 (OVH SAS)', sourceIp: '51.89.144.20', tactic: 'Exfiltration', technique: 'T1048.003' },
  { country: 'Romania', countryCode: 'RO', city: 'Bucharest', asn: 'AS43754 (Voxility S.R.L.)', sourceIp: '185.190.141.22', tactic: 'Credential Access', technique: 'T1621' },
  { country: 'Seychelles', countryCode: 'SC', city: 'Victoria', asn: 'AS39351 (Offshore VPS)', sourceIp: '193.106.191.80', tactic: 'Impact', technique: 'T1498' },
  { country: 'Brazil', countryCode: 'BR', city: 'Sao Paulo', asn: 'AS27699 (Telecomunicações)', sourceIp: '177.54.144.12', tactic: 'Discovery', technique: 'T1046' },
  { country: 'Singapore', countryCode: 'SG', city: 'Singapore', asn: 'AS13335 (Cloudflare Edge)', sourceIp: '128.199.200.15', tactic: 'Defense Evasion', technique: 'T1078' },
  { country: 'Canada', countryCode: 'CA', city: 'Toronto', asn: 'AS14061 (DigitalOcean)', sourceIp: '142.93.18.99', tactic: 'Privilege Escalation', technique: 'T1558.003' }
];

export const SiemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [incidents, setIncidents] = useState<IncidentAlert[]>(INITIAL_INCIDENTS);
  const [rules, setRules] = useState<DetectionRule[]>(INITIAL_RULES);
  const [playbooks, setPlaybooks] = useState<Playbook[]>(INITIAL_PLAYBOOKS);
  const [auditRecords, setAuditRecords] = useState<ResponseAuditRecord[]>([
    {
      id: 'audit-001',
      timestamp: new Date(Date.now() - 1000 * 170).toISOString(),
      incidentId: 'INC-2026-8798',
      incidentTitle: 'Distributed SSH Brute Force & Privilege Escalation Attempt',
      playbookName: 'Edge Perimeter Threat IP Blockade',
      executedBy: 'AUTOMATED_ENGINE',
      status: 'SUCCESS',
      actionsSummary: 'Blocked IP 194.26.29.112 across Cloudflare Edge & Palo Alto NGFW',
      affectedEntities: ['IP: 194.26.29.112'],
      canRollback: true
    }
  ]);

  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamSpeed, setStreamSpeed] = useState<1 | 2 | 5>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [pbiPage, setPbiPage] = useState<PowerBiPage>('overview');
  const [selectedIncident, setSelectedIncident] = useState<IncidentAlert | null>(null);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [activeExecutingPlaybook, setActiveExecutingPlaybook] = useState<{
    playbookId: string;
    currentStepIndex: number;
    logs: string[];
  } | null>(null);

  const [blockedIps, setBlockedIps] = useState<Set<string>>(new Set(['194.26.29.112']));
  const [isolatedHosts, setIsolatedHosts] = useState<Set<string>>(new Set());
  const [revokedUsers, setRevokedUsers] = useState<Set<string>>(new Set());

  // Data Refresh Sync states
  const [lastRefreshedAt, setLastRefreshedAt] = useState<number>(() => Date.now());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Power BI Cross-filtering & Layout states
  const [crossFilterSeverity, setCrossFilterSeverity] = useState<IncidentSeverity | null>(null);
  const [crossFilterSource, setCrossFilterSource] = useState<string | null>(null);
  const [crossFilterStatus, setCrossFilterStatus] = useState<IncidentStatus | null>(null);
  const [isFilterPaneOpen, setIsFilterPaneOpen] = useState<boolean>(false);
  const [focusedVisualId, setFocusedVisualId] = useState<string | null>(null);

  // Multi-Theme Engine
  const [theme, setThemeState] = useState<PowerBiThemeId>(() => {
    try {
      const saved = localStorage.getItem('aegis_pbi_theme');
      if (saved && (saved in THEMES)) return saved as PowerBiThemeId;
    } catch {
      // ignore
    }
    return 'dark';
  });

  // Multilingual i18n Engine (English & Arabic)
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('aegis_pbi_lang');
      if (saved === 'ar' || saved === 'en') return saved;
    } catch {
      // ignore
    }
    return 'ar';
  });

  const setTheme = (newTheme: PowerBiThemeId) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('aegis_pbi_theme', newTheme);
    } catch {
      // ignore
    }
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('aegis_pbi_lang', newLang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const isRtl = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRtl, language]);

  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = (langDict as Record<string, string>)[key] || (TRANSLATIONS.en as Record<string, string>)[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  }, [language]);

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    const now = Date.now();
    setLastRefreshedAt(now);

    const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
    const geo = STREAM_GEO_LOCATIONS[Math.floor(Math.random() * STREAM_GEO_LOCATIONS.length)];
    const randId = Math.floor(Math.random() * 9000 + 1000);

    const newEntry: LogEntry = {
      id: `log-${now}-${randId}`,
      timestamp: new Date().toISOString(),
      level: template.level as LogEntry['level'],
      source: template.source as LogEntry['source'],
      eventId: `EVT-${randId}`,
      eventName: template.name,
      host: template.host,
      user: template.user,
      sourceIp: geo.sourceIp,
      destIp: '10.14.0.1',
      geoIp: {
        country: geo.country,
        countryCode: geo.countryCode,
        city: geo.city,
        asn: geo.asn
      },
      mitreTactic: geo.tactic,
      mitreTechniqueId: geo.technique,
      rawPayload: {
        runtime_daemon: 'aegis-agent-v2',
        sequence: now,
        attributes: { thread_pool: 4, memory_mb: 28 }
      }
    };

    setLogs(prev => [newEntry, ...prev.slice(0, 249)]);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 380);
  }, []);

  const handleSetCrossFilterSeverity = (sev: IncidentSeverity | null) => {
    setCrossFilterSeverity(sev);
    setLastRefreshedAt(Date.now());
  };

  const handleSetCrossFilterSource = (src: string | null) => {
    setCrossFilterSource(src);
    setLastRefreshedAt(Date.now());
  };

  const handleSetCrossFilterStatus = (st: IncidentStatus | null) => {
    setCrossFilterStatus(st);
    setLastRefreshedAt(Date.now());
  };

  const resetAllCrossFilters = () => {
    setCrossFilterSeverity(null);
    setCrossFilterSource(null);
    setCrossFilterStatus(null);
    setLastRefreshedAt(Date.now());
  };

  // Calculated SOC Telemetry stats
  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED').length;
  const criticalAlerts = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const stats: SiemStats = {
    ingestionRateEPS: isStreaming ? 2450 * streamSpeed : 0,
    activeIncidents,
    criticalAlerts,
    mttdSeconds: 68,
    mttrMinutes: 4.2,
    autoContainmentRate: 88.5,
    totalLogsCount: logs.length + 142090
  };

  const logsRef = useRef(logs);
  logsRef.current = logs;

  // Real-time log background generation
  useEffect(() => {
    if (!isStreaming) return;
    const intervalMs = 1800 / streamSpeed;

    const timer = setInterval(() => {
      const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
      const geo = STREAM_GEO_LOCATIONS[Math.floor(Math.random() * STREAM_GEO_LOCATIONS.length)];
      const randId = Math.floor(Math.random() * 9000 + 1000);

      const newEntry: LogEntry = {
        id: `log-${Date.now()}-${randId}`,
        timestamp: new Date().toISOString(),
        level: template.level as LogEntry['level'],
        source: template.source as LogEntry['source'],
        eventId: `EVT-${randId}`,
        eventName: template.name,
        host: template.host,
        user: template.user,
        sourceIp: geo.sourceIp,
        destIp: '10.14.0.1',
        geoIp: {
          country: geo.country,
          countryCode: geo.countryCode,
          city: geo.city,
          asn: geo.asn
        },
        mitreTactic: geo.tactic,
        mitreTechniqueId: geo.technique,
        rawPayload: {
          runtime_daemon: 'aegis-agent-v2',
          sequence: Date.now(),
          attributes: { thread_pool: 4, memory_mb: 28 }
        }
      };

      setLogs(prev => [newEntry, ...prev.slice(0, 249)]);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isStreaming, streamSpeed]);

  const toggleStreaming = () => setIsStreaming(prev => !prev);
  const toggleSound = () => setSoundEnabled(prev => !prev);

  const updateIncidentStatus = (incidentId: string, status: IncidentStatus) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status,
            timeline: [
              ...inc.timeline,
              {
                id: `tl-stat-${Date.now()}`,
                timestamp: new Date().toISOString(),
                title: `Status Changed to ${status}`,
                description: `Incident state modified by SOC Analyst.`,
                phase: 'CONTAINMENT'
              }
            ]
          };
        }
        return inc;
      })
    );

    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(prev => prev ? { ...prev, status } : null);
    }
  };

  const assignIncident = (incidentId: string, assignee: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === incidentId ? { ...inc, assignedTo: assignee } : inc))
    );
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(prev => prev ? { ...prev, assignedTo: assignee } : null);
    }
  };

  const addIncidentNote = (incidentId: string, note: string) => {
    if (!note.trim()) return;
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            notes: [...inc.notes, note.trim()]
          };
        }
        return inc;
      })
    );
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(prev => prev ? { ...prev, notes: [...prev.notes, note.trim()] } : null);
    }
  };

  const quickBlockIp = (ip: string, reason: string) => {
    setBlockedIps(prev => new Set(prev).add(ip));
    const audit: ResponseAuditRecord = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      incidentId: selectedIncident?.id || 'MANUAL-SOC',
      incidentTitle: selectedIncident?.title || 'Direct Analyst Threat Mitigation',
      playbookName: 'Manual Firewall IP Drop Rule',
      executedBy: 'SOC_ANALYST',
      status: 'SUCCESS',
      actionsSummary: `Directly blocked IP ${ip}. Reason: ${reason}`,
      affectedEntities: [`IP: ${ip}`],
      canRollback: true
    };
    setAuditRecords(prev => [audit, ...prev]);
  };

  const quickIsolateHost = (host: string, reason: string) => {
    setIsolatedHosts(prev => new Set(prev).add(host));
    const audit: ResponseAuditRecord = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      incidentId: selectedIncident?.id || 'MANUAL-SOC',
      incidentTitle: selectedIncident?.title || 'Direct Host Containment',
      playbookName: 'Manual Endpoint Isolation',
      executedBy: 'SOC_ANALYST',
      status: 'SUCCESS',
      actionsSummary: `Host ${host} isolated from network mesh. Reason: ${reason}`,
      affectedEntities: [`Host: ${host}`],
      canRollback: true
    };
    setAuditRecords(prev => [audit, ...prev]);
  };

  const quickRevokeUser = (user: string, reason: string) => {
    setRevokedUsers(prev => new Set(prev).add(user));
    const audit: ResponseAuditRecord = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      incidentId: selectedIncident?.id || 'MANUAL-SOC',
      incidentTitle: selectedIncident?.title || 'Compromised Identity Revocation',
      playbookName: 'Manual Identity Revocation',
      executedBy: 'SOC_ANALYST',
      status: 'SUCCESS',
      actionsSummary: `Revoked active credentials & sessions for user ${user}. Reason: ${reason}`,
      affectedEntities: [`User: ${user}`],
      canRollback: true
    };
    setAuditRecords(prev => [audit, ...prev]);
  };

  const rollbackAction = (auditId: string) => {
    setAuditRecords(prev =>
      prev.map(rec => {
        if (rec.id === auditId) {
          rec.affectedEntities.forEach(entity => {
            if (entity.startsWith('IP: ')) {
              const ip = entity.replace('IP: ', '');
              setBlockedIps(b => {
                const n = new Set(b);
                n.delete(ip);
                return n;
              });
            } else if (entity.startsWith('Host: ')) {
              const host = entity.replace('Host: ', '');
              setIsolatedHosts(h => {
                const n = new Set(h);
                n.delete(host);
                return n;
              });
            } else if (entity.startsWith('User: ')) {
              const user = entity.replace('User: ', '');
              setRevokedUsers(u => {
                const n = new Set(u);
                n.delete(user);
                return n;
              });
            }
          });
          return { ...rec, rolledBack: true, canRollback: false };
        }
        return rec;
      })
    );
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev =>
      prev.map(r => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const addRule = (newRuleData: Omit<DetectionRule, 'id' | 'triggeredCount'>) => {
    const created: DetectionRule = {
      ...newRuleData,
      id: `rule-${Date.now()}`,
      triggeredCount: 0
    };
    setRules(prev => [created, ...prev]);
  };

  // Comprehensive step-by-step Playbook Execution engine
  const executePlaybook = useCallback(async (
    playbookId: string, 
    targetIncidentId?: string, 
    isAuto: boolean = false
  ): Promise<boolean> => {
    const playbook = playbooks.find(p => p.id === playbookId);
    if (!playbook) return false;

    const incident = targetIncidentId 
      ? incidents.find(i => i.id === targetIncidentId)
      : selectedIncident;

    setActiveExecutingPlaybook({
      playbookId,
      currentStepIndex: 0,
      logs: [`Initiating Playbook "${playbook.name}"... Target Scope: ${playbook.targetScope}`]
    });

    const affectedEntities: string[] = [];

    // Step through each playbook action with realistic SOC SOAR execution progression
    for (let i = 0; i < playbook.steps.length; i++) {
      const step = playbook.steps[i];
      setActiveExecutingPlaybook(curr => curr ? {
        ...curr,
        currentStepIndex: i,
        logs: [...curr.logs, `[${new Date().toLocaleTimeString()}] Executing step ${i + 1}/${playbook.steps.length}: ${step.name}...`]
      } : null);

      // Realistic action effect simulation
      await new Promise(res => setTimeout(res, 900));

      if (step.actionType === 'BLOCK_IP' && incident?.attackerIp) {
        setBlockedIps(b => new Set(b).add(incident.attackerIp));
        affectedEntities.push(`IP: ${incident.attackerIp}`);
      } else if (step.actionType === 'ISOLATE_HOST' && incident?.affectedHost) {
        setIsolatedHosts(h => new Set(h).add(incident.affectedHost));
        affectedEntities.push(`Host: ${incident.affectedHost}`);
      } else if (step.actionType === 'REVOKE_USER_TOKENS' && incident?.affectedUser) {
        setRevokedUsers(u => new Set(u).add(incident.affectedUser));
        affectedEntities.push(`User: ${incident.affectedUser}`);
      }

      setActiveExecutingPlaybook(curr => curr ? {
        ...curr,
        logs: [...curr.logs, `✓ Step ${i + 1} succeeded: ${step.outputMessage || 'Policy enforced across fleet.'}`]
      } : null);
    }

    // Wrap up execution
    await new Promise(res => setTimeout(res, 400));

    setPlaybooks(prev =>
      prev.map(p => {
        if (p.id === playbookId) {
          return {
            ...p,
            runsCount: p.runsCount + 1,
            lastRunTimestamp: new Date().toISOString()
          };
        }
        return p;
      })
    );

    // Record SOAR audit trail
    const auditRecord: ResponseAuditRecord = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      incidentId: incident ? incident.id : 'PLAYBOOK-TEST',
      incidentTitle: incident ? incident.title : `Direct execution: ${playbook.name}`,
      playbookName: playbook.name,
      executedBy: isAuto ? 'AUTOMATED_ENGINE' : 'SOC_ANALYST',
      status: 'SUCCESS',
      actionsSummary: `All ${playbook.steps.length} containment actions completed in 3.4s`,
      affectedEntities: affectedEntities.length > 0 ? affectedEntities : ['Fleet Security Layer'],
      canRollback: true
    };
    setAuditRecords(prev => [auditRecord, ...prev]);

    // Update incident state to CONTAINED if targeted
    if (incident) {
      setIncidents(prev =>
        prev.map(inc => {
          if (inc.id === incident.id) {
            return {
              ...inc,
              status: 'CONTAINED',
              responseActionsTaken: [
                ...inc.responseActionsTaken,
                `Executed Playbook: ${playbook.name}`
              ],
              timeline: [
                ...inc.timeline,
                {
                  id: `tl-pb-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  title: `Playbook Executed: ${playbook.name}`,
                  description: `Autonomous actions contained threat (${affectedEntities.join(', ')}).`,
                  phase: 'CONTAINMENT'
                }
              ]
            };
          }
          return inc;
        })
      );
      if (selectedIncident && selectedIncident.id === incident.id) {
        setSelectedIncident(curr => curr ? {
          ...curr,
          status: 'CONTAINED',
          responseActionsTaken: [...curr.responseActionsTaken, `Executed Playbook: ${playbook.name}`]
        } : null);
      }
    }

    setTimeout(() => {
      setActiveExecutingPlaybook(null);
    }, 1800);

    return true;
  }, [playbooks, incidents, selectedIncident]);

  // Simulate an active cyber attack scenario in the SIEM
  const simulateAttack = (scenario: AttackScenario) => {
    // 1. Play chime if sound enabled
    if (soundEnabled) {
      playAlertChime();
    }

    const timestamp = new Date().toISOString();
    const attackLogId = `log-atk-${Date.now()}`;

    // 2. Generate malicious trigger log
    const attackLog: LogEntry = {
      id: attackLogId,
      timestamp,
      level: 'CRITICAL',
      source: scenario.targetHost.includes('aws') ? 'AWS CloudTrail' : 'CrowdStrike EDR',
      eventId: `ATK-${Math.floor(Math.random() * 8999 + 1000)}`,
      eventName: scenario.name,
      host: scenario.targetHost,
      user: scenario.targetUser,
      sourceIp: scenario.attackerIp,
      geoIp: { country: 'Latvia', countryCode: 'LV', city: 'Riga', asn: 'AS39218' },
      mitreTechniqueId: scenario.mitreId,
      mitreTactic: scenario.tactic,
      signature: `Heuristic:Exploit:${scenario.mitreId}`,
      rawPayload: {
        attack_scenario: scenario.name,
        target_entity: scenario.targetHost,
        adversary_ip: scenario.attackerIp,
        payload: '0x90909090_SHELLCODE_EXEC',
        simulated: true
      }
    };

    setLogs(prev => [attackLog, ...prev]);

    // 3. Create active Incident Alert
    const incidentId = `INC-2026-${Math.floor(Math.random() * 8999 + 1000)}`;
    const newIncident: IncidentAlert = {
      id: incidentId,
      title: `${scenario.name} on ${scenario.targetHost}`,
      severity: 'CRITICAL',
      status: 'NEW',
      timestamp,
      detectionRuleId: 'rule-edr-injection',
      mitreTactic: scenario.tactic,
      mitreTechnique: scenario.mitreId,
      mitreTechniqueName: scenario.name,
      confidenceScore: 97,
      affectedHost: scenario.targetHost,
      affectedUser: scenario.targetUser,
      attackerIp: scenario.attackerIp,
      attackerGeo: { country: 'Latvia', countryCode: 'LV', city: 'Riga', asn: 'AS39218' },
      summary: scenario.description,
      recommendedPlaybookId: scenario.expectedPlaybookId,
      timeline: [
        {
          id: `tl-atk-1`,
          timestamp: new Date(Date.now() - 1000 * 20).toISOString(),
          title: 'Adversary Weaponization Detected',
          description: `Telemetry alerted on anomalous behavioral pattern from ${scenario.attackerIp}.`,
          phase: 'INITIAL_ACCESS'
        },
        {
          id: `tl-atk-2`,
          timestamp,
          title: 'Critical Threat Detection Fired',
          description: `SIEM rule engine correlated signature with MITRE ${scenario.mitreId}.`,
          phase: 'DETECTION'
        }
      ],
      correlatedLogIds: [attackLogId],
      responseActionsTaken: [],
      assignedTo: 'Automated Response Daemon',
      notes: [
        `Triggered via simulated attack drill: ${scenario.name}.`,
        `Automated containment playbook "${scenario.expectedPlaybookId}" queued.`
      ]
    };

    setIncidents(prev => [newIncident, ...prev]);

    // 4. Update Rule triggered count
    setRules(prev =>
      prev.map(r => (r.mitreTechnique === scenario.mitreId ? { ...r, triggeredCount: r.triggeredCount + 1 } : r))
    );

    // 5. Automatically execute response playbook if configured
    setLastRefreshedAt(Date.now());
    setTimeout(() => {
      executePlaybook(scenario.expectedPlaybookId, incidentId, true);
    }, 1200);
  };

  const exportLogsJson = () => {
    try {
      const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', url);
      downloadAnchor.setAttribute('download', `siem-logs-${new Date().toISOString().slice(0, 19)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (e) {
      console.error('Failed to export JSON:', e);
    }
  };

  const exportLogsCsv = () => {
    try {
      const headers = ['Timestamp', 'Level', 'Source', 'EventName', 'Host', 'User', 'SourceIp'];
      const rows = logs.map(l => [
        l.timestamp,
        l.level,
        `"${(l.source || '').replace(/"/g, '""')}"`,
        `"${(l.eventName || '').replace(/"/g, '""')}"`,
        `"${(l.host || '').replace(/"/g, '""')}"`,
        `"${(l.user || '').replace(/"/g, '""')}"`,
        l.sourceIp
      ]);
      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', url);
      downloadAnchor.setAttribute('download', `siem-logs-${new Date().toISOString().slice(0, 19)}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (e) {
      console.error('Failed to export CSV:', e);
    }
  };

  return (
    <SiemContext.Provider
      value={{
        logs,
        incidents,
        rules,
        playbooks,
        auditRecords,
        isStreaming,
        streamSpeed,
        soundEnabled,
        pbiPage,
        setPbiPage,
        selectedIncident,
        selectedLog,
        activeExecutingPlaybook,
        blockedIps,
        isolatedHosts,
        revokedUsers,
        stats,
        lastRefreshedAt,
        isRefreshing,
        refreshData,
        crossFilterSeverity,
        setCrossFilterSeverity: handleSetCrossFilterSeverity,
        crossFilterSource,
        setCrossFilterSource: handleSetCrossFilterSource,
        crossFilterStatus,
        setCrossFilterStatus: handleSetCrossFilterStatus,
        resetAllCrossFilters,
        isFilterPaneOpen,
        setIsFilterPaneOpen,
        focusedVisualId,
        setFocusedVisualId,
        theme,
        setTheme,
        language,
        setLanguage,
        toggleLanguage,
        isRtl,
        t,
        toggleStreaming,
        setStreamSpeed,
        toggleSound,
        setSelectedIncident,
        setSelectedLog,
        updateIncidentStatus,
        assignIncident,
        addIncidentNote,
        executePlaybook,
        rollbackAction,
        quickBlockIp,
        quickIsolateHost,
        quickRevokeUser,
        toggleRule,
        addRule,
        simulateAttack,
        exportLogsJson,
        exportLogsCsv
      }}
    >
      {children}
    </SiemContext.Provider>
  );
};

export const useSiem = () => {
  const context = useContext(SiemContext);
  if (!context) {
    throw new Error('useSiem must be used within a SiemProvider');
  }
  return context;
};
