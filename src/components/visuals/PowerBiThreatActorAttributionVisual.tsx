import React, { useState } from 'react';
import { useSiem } from '../../context/SiemContext';
import { LogSourceDrillDownData } from '../PowerBiLogDrillDownModal';
import { THEMES } from '../../types/theme';
import { Crosshair, ShieldAlert, Search, ExternalLink, ArrowRight, ArrowLeft, CheckCircle2 } from '../icons/SocIcons';

interface Props {
  onDrillDown?: (target: LogSourceDrillDownData) => void;
}

interface ThreatActor {
  id: string;
  name: string;
  codename: string;
  origin: string;
  originAr: string;
  motivation: string;
  motivationAr: string;
  confidence: number; // 0-100%
  eventCount: number;
  criticalCount: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  primaryTarget: string;
  primaryTargetAr: string;
  adversaryIp: string;
  techniques: { id: string; name: string }[];
  lastSeen: string;
  lastSeenAr: string;
}

const THREAT_ACTORS: ThreatActor[] = [
  {
    id: 'apt29',
    name: 'APT29',
    codename: 'Midnight Blizzard / Cozy Bear',
    origin: 'Eastern Europe / SVR',
    originAr: 'أوروبا الشرقية / SVR',
    motivation: 'State-Sponsored Espionage',
    motivationAr: 'تجسس استخباراتي ترعاه دولة',
    confidence: 96,
    eventCount: 142,
    criticalCount: 48,
    severity: 'CRITICAL',
    primaryTarget: 'Cloud IAM & Entra ID Tokens',
    primaryTargetAr: 'هويات السحابة ورموز Entra ID',
    adversaryIp: '185.220.101.42',
    techniques: [
      { id: 'T1078', name: 'Valid Accounts' },
      { id: 'T1098', name: 'Account Manipulation' },
      { id: 'T1566', name: 'Phishing' }
    ],
    lastSeen: '4m ago',
    lastSeenAr: 'منذ 4 دقائق'
  },
  {
    id: 'volt_typhoon',
    name: 'Volt Typhoon',
    codename: 'Bronze Silhouette',
    origin: 'East Asia',
    originAr: 'شرق آسيا',
    motivation: 'Critical Infrastructure Pre-positioning',
    motivationAr: 'تموضع في البنية التحتية الحرجة',
    confidence: 92,
    eventCount: 98,
    criticalCount: 36,
    severity: 'CRITICAL',
    primaryTarget: 'K8s Cluster & Edge Routers',
    primaryTargetAr: 'عناقيد K8s وموجهات الشبكة',
    adversaryIp: '198.51.100.17',
    techniques: [
      { id: 'T1190', name: 'Exploit Public App' },
      { id: 'T1059', name: 'Command & Scripting (LotL)' }
    ],
    lastSeen: '11m ago',
    lastSeenAr: 'منذ 11 دقيقة'
  },
  {
    id: 'scattered_spider',
    name: 'Scattered Spider',
    codename: 'UNC3944 / Octo Tempest',
    origin: 'Transnational Syndicate',
    originAr: 'تنظيم عبر وطني',
    motivation: 'Identity Hijacking & Ransomware',
    motivationAr: 'قرصنة الهوية والفدية الرقمية',
    confidence: 95,
    eventCount: 114,
    criticalCount: 42,
    severity: 'CRITICAL',
    primaryTarget: 'Okta SSO & Helpdesk Portals',
    primaryTargetAr: 'بوابات Okta والدعم الفني',
    adversaryIp: '194.26.29.112',
    techniques: [
      { id: 'T1621', name: 'MFA Request Fatigue' },
      { id: 'T1566', name: 'Social Engineering' }
    ],
    lastSeen: '18m ago',
    lastSeenAr: 'منذ 18 دقيقة'
  },
  {
    id: 'lazarus',
    name: 'Lazarus Group',
    codename: 'HIDDEN COBRA',
    origin: 'East Asia',
    originAr: 'شرق آسيا',
    motivation: 'Financial Fraud & Crypto Exfiltration',
    motivationAr: 'احتيال مالي وتسريب عملات مشفرة',
    confidence: 88,
    eventCount: 76,
    criticalCount: 19,
    severity: 'HIGH',
    primaryTarget: 'PostgreSQL DB & Payment Bridge',
    primaryTargetAr: 'قواعد بيانات الدفع والمعاملات',
    adversaryIp: '103.224.182.241',
    techniques: [
      { id: 'T1486', name: 'Data Encrypted for Impact' },
      { id: 'T1565', name: 'Data Manipulation' }
    ],
    lastSeen: '35m ago',
    lastSeenAr: 'منذ 35 دقيقة'
  },
  {
    id: 'fin7',
    name: 'FIN7',
    codename: 'Carbanak Group',
    origin: 'Cybercrime Syndicate',
    originAr: 'عصابة جرائم سيبرانية',
    motivation: 'Point-of-Sale Data Theft',
    motivationAr: 'سرقة نقاط البيع وبطاقات الدفع',
    confidence: 84,
    eventCount: 53,
    criticalCount: 8,
    severity: 'MEDIUM',
    primaryTarget: 'Windows POS Endpoints',
    primaryTargetAr: 'أجهزة نقاط البيع بنظام ويندوز',
    adversaryIp: '185.156.73.54',
    techniques: [
      { id: 'T1055', name: 'Process Injection' },
      { id: 'T1204', name: 'User Execution' }
    ],
    lastSeen: '1h ago',
    lastSeenAr: 'منذ ساعة'
  }
];

export const PowerBiThreatActorAttributionVisual: React.FC<Props> = ({ onDrillDown }) => {
  const { theme, isRtl, quickBlockIp, blockedIps } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const [selectedActorId, setSelectedActorId] = useState<string>('apt29');

  const selectedActor = THREAT_ACTORS.find(a => a.id === selectedActorId) || THREAT_ACTORS[0];
  const isIpBlocked = blockedIps.has(selectedActor.adversaryIp);

  const handleDrill = (actor: ThreatActor) => {
    if (!onDrillDown) return;
    onDrillDown({
      title: isRtl ? `استخبارات الفاعل العدائي: ${actor.name}` : `Adversary Attribution: ${actor.name} (${actor.codename})`,
      subtitle: isRtl
        ? `حملة معادية نشطة · الأصل: ${actor.originAr} · الاستهداف: ${actor.primaryTargetAr} · ثقة ${actor.confidence}%`
        : `Active Adversary Campaign · Origin: ${actor.origin} · Target: ${actor.primaryTarget} · ${actor.confidence}% Confidence`,
      category: 'source',
      filterKey: isRtl ? 'الفاعل التهديدي' : 'Threat Actor',
      filterValue: actor.name,
      metricValue: `${actor.eventCount} ${isRtl ? 'حدث مسجل' : 'events'}`
    });
  };

  return (
    <div className="flex flex-col h-full justify-between space-y-2.5 font-sans">
      {/* Subheader & Intelligence Indicator */}
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <Crosshair className="w-3.5 h-3.5 text-[#118dff]" />
          <span>{isRtl ? 'حملات التهديد المتقدمة (APT) المرصودة' : 'Active APT Threat Campaigns & MITRE Mapping'}</span>
        </span>
        <span className="text-[#118dff] font-semibold flex items-center gap-1">
          <Search className="w-3 h-3" />
          <span>{isRtl ? 'انقر على الفاعل للتحليل' : 'Select actor for telemetry'}</span>
        </span>
      </div>

      {/* Main Attribution Container */}
      <div className="flex flex-col flex-1 space-y-2.5 min-h-0">
        {/* Horizontal Actor Slicer Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {THREAT_ACTORS.map((actor) => {
            const isSelected = actor.id === selectedActorId;
            const blocked = blockedIps.has(actor.adversaryIp);

            return (
              <button
                key={actor.id}
                onClick={() => setSelectedActorId(actor.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[2px] border text-xs cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? isDark
                      ? 'bg-[#118dff]/20 border-[#118dff] text-white shadow-xs font-bold'
                      : 'bg-blue-100/80 border-[#0078d4] text-blue-950 shadow-xs font-bold'
                    : isDark
                      ? 'bg-[#080f1e]/80 border-[#18284c] text-slate-300 hover:text-white hover:border-[#118dff]/50'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  blocked 
                    ? 'bg-emerald-400' 
                    : actor.severity === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'
                }`} />
                <span className="font-mono text-[11px]">{actor.name}</span>
                <span className={`text-[10px] font-mono tabular-nums opacity-80 ${
                  isSelected ? 'text-[#118dff]' : isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {actor.confidence}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Actor Deep Dossier Panel */}
        <div className={`p-3 rounded-[2px] border flex flex-col justify-between flex-1 min-h-[200px] text-xs font-mono transition-colors ${
          isDark 
            ? 'bg-[#080f1e]/90 border-[#18284c] text-slate-100' 
            : 'bg-slate-50/90 border-slate-200 text-slate-900'
        }`}>
          <div className="space-y-2.5">
            {/* Dossier Header */}
            <div className="flex items-center justify-between pb-2 border-b border-inherit gap-2">
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-sm text-[#118dff] font-mono">
                  {selectedActor.name}
                </span>
                <span className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  ({selectedActor.codename})
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                <span className={`px-1.5 py-0.5 rounded-[1px] font-bold ${
                  selectedActor.severity === 'CRITICAL' 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {selectedActor.severity}
                </span>
                <span className={`hidden sm:inline ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isRtl ? selectedActor.lastSeenAr : selectedActor.lastSeen}
                </span>
              </div>
            </div>

            {/* Structured Threat Intel Matrix */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
              <div>
                <span className="text-[10px] opacity-70 block mb-0.5">
                  {isRtl ? 'الأصل الجغرافي / التبعية:' : 'Attributed Origin:'}
                </span>
                <span className={`font-semibold block truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {isRtl ? selectedActor.originAr : selectedActor.origin}
                </span>
              </div>
              <div>
                <span className="text-[10px] opacity-70 block mb-0.5">
                  {isRtl ? 'دافع الهجوم الاستراتيجي:' : 'Strategic Motivation:'}
                </span>
                <span className={`font-semibold block truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {isRtl ? selectedActor.motivationAr : selectedActor.motivation}
                </span>
              </div>
              <div>
                <span className="text-[10px] opacity-70 block mb-0.5">
                  {isRtl ? 'البنية التحتية المستهدفة:' : 'Targeted Infrastructure:'}
                </span>
                <span className="font-semibold text-emerald-400 block truncate">
                  {isRtl ? selectedActor.primaryTargetAr : selectedActor.primaryTarget}
                </span>
              </div>
              <div>
                <span className="text-[10px] opacity-70 block mb-0.5">
                  {isRtl ? 'عنوان IP المعادي (C2):' : 'Adversary C2 IP:'}
                </span>
                <bdi dir="ltr" className="font-mono font-bold text-cyan-400 block truncate">
                  {selectedActor.adversaryIp}
                </bdi>
              </div>
            </div>

            {/* Triggered MITRE Techniques */}
            <div className="space-y-1 pt-1 border-t border-inherit">
              <span className="text-[10px] opacity-70 block">
                {isRtl ? 'تقنيات ميتري المرصودة في الهجوم:' : 'Triggered MITRE ATT&CK Techniques:'}
              </span>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                {selectedActor.techniques.map((tech, idx) => (
                  <React.Fragment key={tech.id}>
                    {idx > 0 && <span aria-hidden="true" className="opacity-30">·</span>}
                    <span className="inline-flex items-center gap-1 font-mono">
                      <bdi dir="ltr" className="text-[#118dff] font-bold">{tech.id}</bdi>
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{tech.name}</span>
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row with zero overflow */}
          <div className="pt-2 mt-2 border-t border-inherit flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={() => handleDrill(selectedActor)}
              className="text-[#118dff] hover:underline text-xs font-semibold flex items-center gap-1 cursor-pointer font-mono"
            >
              <span>{isRtl ? 'فحص السجلات الجنائية' : 'Drill Down Telemetry'}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => quickBlockIp(selectedActor.adversaryIp, `Attributed C2 for ${selectedActor.name}`)}
              disabled={isIpBlocked}
              className={`px-2.5 py-1 text-[11px] rounded-[2px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isIpBlocked
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
              }`}
            >
              {isIpBlocked ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تم عزل C2' : 'C2 Isolated'}</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'عزل IP الفاعل' : 'Quarantine C2 IP'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
