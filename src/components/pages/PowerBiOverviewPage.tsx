import React, { useState, useEffect } from 'react';
import { useSiem } from '../../context/SiemContext';
import { PowerBiCardVisual } from '../PowerBiCardVisual';
import { PowerBiDonutChart } from '../visuals/PowerBiDonutChart';
import { PowerBiBarChart } from '../visuals/PowerBiBarChart';
import { PowerBi24HourTrendChart } from '../visuals/PowerBi24HourTrendChart';
import { PowerBiGeoHeatMapVisual } from '../visuals/PowerBiGeoHeatMapVisual';
import { PowerBiLiveSocStreamVisual } from '../visuals/PowerBiLiveSocStreamVisual';
import { PowerBiFunnelVisual } from '../visuals/PowerBiFunnelVisual';
import { PowerBiAttackVectorRadarVisual } from '../visuals/PowerBiAttackVectorRadarVisual';
import { PowerBiMitreTacticsVisual } from '../visuals/PowerBiMitreTacticsVisual';
import { PowerBiSecurityScoreGaugeVisual } from '../visuals/PowerBiSecurityScoreGaugeVisual';
import { PowerBiExecutiveSlicerBar } from '../visuals/PowerBiExecutiveSlicerBar';
import { PowerBiSummaryCards } from '../visuals/PowerBiSummaryCards';
import { PowerBiThreatActorAttributionVisual } from '../visuals/PowerBiThreatActorAttributionVisual';
import { PowerBiNetworkPortProtocolVisual } from '../visuals/PowerBiNetworkPortProtocolVisual';
import { PowerBiIdentityRiskVisual } from '../visuals/PowerBiIdentityRiskVisual';
import { PowerBiSlaMttrTrendVisual } from '../visuals/PowerBiSlaMttrTrendVisual';
import { PowerBiLogSourceTreemapVisual } from '../visuals/PowerBiLogSourceTreemapVisual';
import { PowerBiSubnetScatterRiskVisual } from '../visuals/PowerBiSubnetScatterRiskVisual';
import { PowerBiLogIngestionOutageVisual } from '../visuals/PowerBiLogIngestionOutageVisual';
import { PowerBiLogDrillDownModal, LogSourceDrillDownData } from '../PowerBiLogDrillDownModal';
import { THEMES } from '../../types/theme';
import { ArrowUpRight, Clock } from '../icons/SocIcons';

export const PowerBiOverviewPage: React.FC = () => {
  const { 
    incidents,
    stats, 
    crossFilterSeverity, 
    crossFilterSource,
    crossFilterStatus,
    resetAllCrossFilters,
    theme,
    isRtl,
    setPbiPage,
    setSelectedIncident
  } = useSiem();

  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;
  const isFiltered = crossFilterSeverity !== null || crossFilterSource !== null || crossFilterStatus !== null;

  const latestCriticalIncident = incidents.find(i => i.status !== 'RESOLVED' && i.severity === 'CRITICAL') || incidents[0];

  const [drillDownTarget, setDrillDownTarget] = useState<LogSourceDrillDownData | null>(null);

  return (
    <div className={`p-3 sm:p-4 space-y-3 max-w-[1850px] mx-auto min-h-full font-sans transition-colors duration-200 ${currentTheme.textPrimaryClass}`}>
      {/* 1. Unified Executive SOC Command & Slicer Ribbon */}
      <PowerBiExecutiveSlicerBar />

      {/* 2. Priority Critical Incident Alert Dispatch */}
      {latestCriticalIncident && (
        <div className={`px-3 py-2 rounded-[2px] border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs select-none shadow-xs ${
          isDark 
            ? 'bg-rose-950/20 border-rose-900/60 text-slate-200' 
            : 'bg-rose-50/80 border-rose-200 text-slate-900'
        }`}>
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-rose-500 shrink-0 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-none bg-rose-500 shrink-0 animate-pulse" />
              <span>{isRtl ? 'حالة حرجة ذات أولوية:' : 'PRIORITY CASE:'}</span>
            </span>
            <span className="truncate font-semibold">
              {isRtl ? (latestCriticalIncident.titleAr || latestCriticalIncident.title) : latestCriticalIncident.title}
            </span>
            <span className="opacity-30" aria-hidden="true">·</span>
            <span className={`font-mono text-[11px] hidden sm:inline ${currentTheme.textSecondaryClass}`}>
              Host: <bdi dir="ltr">{latestCriticalIncident.affectedHost}</bdi>
            </span>
            <span className="opacity-30" aria-hidden="true">·</span>
            <span className={`font-mono text-[11px] hidden md:inline ${currentTheme.textSecondaryClass}`}>
              Origin: <bdi dir="ltr">{latestCriticalIncident.attackerIp}</bdi>
            </span>
          </div>

          <button
            onClick={() => {
              setSelectedIncident(latestCriticalIncident);
              setPbiPage('incidents');
            }}
            className="text-[#118dff] hover:underline text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer self-start sm:self-auto font-mono"
          >
            <span>{isRtl ? 'فحص وتحقيق الحادث' : 'Investigate Case'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Active Cross-Filters Token Bar */}
      {isFiltered && (
        <div className={`px-3 py-1.5 rounded-[2px] border text-xs font-mono flex items-center justify-between shadow-xs ${
          isDark 
            ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' 
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{isRtl ? 'عوامل التصفية النشطة:' : 'Active Slicers:'}</span>
            {crossFilterSeverity && (
              <span className="px-1.5 py-0.2 rounded-[1px] bg-amber-500/20 border border-amber-500/40">
                Severity: {crossFilterSeverity}
              </span>
            )}
            {crossFilterSource && (
              <span className="px-1.5 py-0.2 rounded-[1px] bg-amber-500/20 border border-amber-500/40">
                Source: {crossFilterSource}
              </span>
            )}
            {crossFilterStatus && (
              <span className="px-1.5 py-0.2 rounded-[1px] bg-amber-500/20 border border-amber-500/40">
                Status: {crossFilterStatus}
              </span>
            )}
          </div>
          <button
            onClick={resetAllCrossFilters}
            className="text-[11px] text-[#118dff] hover:underline cursor-pointer font-bold shrink-0 ml-2"
          >
            {isRtl ? 'إلغاء التصفية' : 'Clear All'}
          </button>
        </div>
      )}

      {/* 4. High-Contrast Executive KPI Metric Tiles */}
      <PowerBiSummaryCards 
        onDrillDownThreats={() => setPbiPage('incidents')}
        onDrillDownMttr={() => setPbiPage('playbooks')}
        onDrillDownLogs={() => setPbiPage('logs')}
        onDrillDownHealth={() => setPbiPage('rules')}
      />

      {/* SECTION 1: Panoramic Dominant Anchor - Global Adversary Ingress & Geo Threat Intelligence (Full-Width 12-col) */}
      <div className="grid grid-cols-1 gap-3.5">
        <PowerBiCardVisual
          id="pbi-hero-map"
          title={isRtl ? 'استخبارات التهديدات الجغرافية والدخول العدائي' : 'Global Adversary Ingress & Geographic Threat Intelligence'}
          subtitle={isRtl ? 'تتبع مصادر التهديد العالمية وعناوين IP ونقاط الاختراق الحية مع نبضات الرادار الفورية' : 'Adversary ASN routing, live heat index, sonar pulse markers, and interactive threat logs'}
          className="min-h-[460px] lg:min-h-[500px]"
        >
          <PowerBiGeoHeatMapVisual onDrillDown={setDrillDownTarget} />
        </PowerBiCardVisual>
      </div>

      {/* SECTION 2: Core Analytical Triad Immediately After Map - Bar, Pie/Donut & Advanced Vector Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-4">
          <PowerBiCardVisual
            id="pbi-target-assets"
            title={isRtl ? 'أكثر الأنظمة استهدافا (مخطط شريطي)' : 'Top Targeted Fleet Endpoints (Bar Chart)'}
            subtitle={isRtl ? 'ترتيب الأجهزة مع إنذارات الخطورة ومستوى التعرض' : 'Ranked by cumulative event volume, risk score, and active containment'}
            className="min-h-[380px]"
          >
            <PowerBiBarChart onDrillDown={setDrillDownTarget} />
          </PowerBiCardVisual>
        </div>

        <div className="lg:col-span-4">
          <PowerBiCardVisual
            id="pbi-severity-donut"
            title={isRtl ? 'توزيع خطورة الحوادث (مخطط دائري / حلقي)' : 'Incident Severity Distribution (Pie / Donut)'}
            subtitle={isRtl ? 'انقر على القطاع للتصفية الفورية لكامل لوحة التحكم' : 'Click slice to cross-filter entire dashboard canvas'}
            isFilterActive={crossFilterSeverity !== null}
            className="min-h-[380px]"
          >
            <PowerBiDonutChart onDrillDown={setDrillDownTarget} />
          </PowerBiCardVisual>
        </div>

        <div className="lg:col-span-4">
          <PowerBiCardVisual
            id="pbi-vector-radar"
            title={isRtl ? 'رادار نواقل الهجوم والبروتوكولات (مخطط راداري متقدم)' : 'Adversary Attack Vector & Protocol Radar (Advanced)'}
            subtitle={isRtl ? 'مقارنة الضغط الحي مقابل الخط المرجعي للشبكة' : 'Live adversary pressure vs normal enterprise baseline'}
            className="min-h-[380px]"
          >
            <PowerBiAttackVectorRadarVisual onDrillDown={setDrillDownTarget} />
          </PowerBiCardVisual>
        </div>
      </div>

      {/* SECTION 3: 24-Hour Telemetry Timeline & Outage Detection Area Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-6">
          <PowerBiCardVisual
            id="pbi-timeline-trend"
            title={isRtl ? 'مسار الأحداث الأمنية خلال 24 ساعة' : '24-Hour Telemetry Timeline & Anomaly Spikes'}
            subtitle={isRtl ? 'توزيع حجم الأحداث بالخط الزمني مع تحديد طفرات الهجمات والخط المرجعي' : 'Hourly event volume, baseline comparison, and multi-severity series'}
            className="min-h-[365px]"
          >
            <PowerBi24HourTrendChart onDrillDown={setDrillDownTarget} />
          </PowerBiCardVisual>
        </div>

        <div className="lg:col-span-6">
          <PowerBiCardVisual
            id="pbi-ingestion-outage"
            title={isRtl ? 'حجم استيعاب السجلات ورصد انقطاع المصادر (24 ساعة)' : '24-Hour Log Ingestion Volume & Outage Detection Visual'}
            subtitle={isRtl ? 'مخطط مساحي زمني لتتبع حجم السجلات المستوعبة ومقارنتها بخط الأساس لرصد التوقفات والانقطاعات المفاجئة' : 'Time-series area chart tracking hourly ingestion volume against diurnal baseline with automated outage threshold alerts'}
            className="min-h-[365px]"
          >
            <PowerBiLogIngestionOutageVisual onDrillDown={setDrillDownTarget} />
          </PowerBiCardVisual>
        </div>
      </div>

      {/* SECTION 4: Advanced Threat Intelligence, Identity Risk & NetFlow Port Spectrum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-4">
          <PowerBiCardVisual
            id="pbi-threat-actors"
            title={isRtl ? 'استخبارات الفاعلين وحملات APT' : 'APT Adversary Attribution & Campaign Intel'}
            subtitle={isRtl ? 'تتبع مجموعات التهديد المتقدمة ومطابقة تكتيكات ميتري' : 'Active state & syndicate actors, confidence scores, and MITRE mapping'}
            className="min-h-[375px]"
          >
            <PowerBiThreatActorAttributionVisual onDrillDown={setDrillDownTarget} />
          </PowerBiCardVisual>
        </div>

        <div className="lg:col-span-4">
          <PowerBiCardVisual
            id="pbi-identity-matrix"
            title={isRtl ? 'مصفوفة مخاطر الهوية والوصول (ITDR)' : 'IAM & Identity Zero-Trust Risk Matrix'}
            subtitle={isRtl ? 'رصد السفر المستحيل وإغراق MFA واستخراج التذاكر' : 'Impossible travel, MFA fatigue, Kerberoasting, and role anomalies'}
            className="min-h-[375px]"
          >
            <PowerBiIdentityRiskVisual onDrillDown={setDrillDownTarget} />
          </PowerBiCardVisual>
        </div>

        <div className="lg:col-span-4">
          <PowerBiCardVisual
            id="pbi-port-spectrum"
            title={isRtl ? 'طيف منافذ الشبكة ورصد إشارات C2' : 'Egress NetFlow & Port Anomaly Spectrum'}
            subtitle={isRtl ? 'مراقبة حركة الخروج وأنفاق DNS وإشارات التحكم' : 'Port egress telemetry, Cobalt Strike beaconing, and DNS tunneling'}
            className="min-h-[375px]"
          >
            <PowerBiNetworkPortProtocolVisual onDrillDown={setDrillDownTarget} />
          </PowerBiCardVisual>
        </div>
      </div>

      {/* SECTION 5: MITRE Kill-Chain Enterprise Matrix Heatmap & Triage Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-8">
          <PowerBiCardVisual
            id="pbi-mitre-tactics"
            title={isRtl ? 'مصفوفة ميتري للتهديدات النشطة' : 'MITRE ATT&CK Enterprise Matrix Heatmap'}
            subtitle={isRtl ? 'تغطية مراحل الهجمات النشطة من الوصول الأولي إلى تسريب البيانات' : 'Tactics coverage, triggered technique IDs, and detection intensity'}
            className="min-h-[365px]"
          >
            <PowerBiMitreTacticsVisual onDrillDown={setDrillDownTarget} />
          </PowerBiCardVisual>
        </div>

        <div className="lg:col-span-4">
          <PowerBiCardVisual
            id="pbi-killchain-funnel"
            title={isRtl ? 'قمع مراحل هجمات ميتري' : 'MITRE Kill-Chain Triage Funnel'}
            subtitle={isRtl ? 'كفاءة الفرز من الاستيعاب إلى الاحتواء' : 'Telemetry ingestion down to autonomous SOAR containment'}
            className="min-h-[365px]"
          >
            <PowerBiFunnelVisual />
          </PowerBiCardVisual>
        </div>
      </div>

      {/* SECTION 6: SOC Containment Velocity (MTTD vs MTTR SLA) & Data Fabric Treemap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        <div className="lg:col-span-6">
          <PowerBiCardVisual
            id="pbi-sla-mttr-trend"
            title={isRtl ? 'سرعة الاستجابة وأداء اتفاقيات الخدمة (MTTR / MTTD)' : 'SOC Containment Velocity & SLA Performance (MTTR vs MTTD)'}
            subtitle={isRtl ? 'تتبع متوسط زمن الرصد والاستجابة ومعدل الأتمتة مقابل سقف اتفاقية الخدمة (15 دقيقة)' : 'Mean Time to Detect (MTTD), Mean Time to Respond (MTTR), and autonomous SOAR closure vs 15m SLA target'}
            className="min-h-[365px]"
          >
            <PowerBiSlaMttrTrendVisual onDrillDown={setDrillDownTarget} />
          </PowerBiCardVisual>
        </div>

        <div className="lg:col-span-6">
          <PowerBiCardVisual
            id="pbi-logsource-treemap"
            title={isRtl ? 'خريطة استيعاب تدفقات السجلات وكثافة التهديدات' : 'Enterprise Telemetry Ingestion Fabric & Anomaly Treemap'}
            subtitle={isRtl ? 'توزيع حجم البيانات اليومية وسرعة التدفق والإنذارات الحرجة عبر خطوط الاستيعاب' : 'Daily ingestion volume (TB/day), throughput (EPS), and critical alert density by log source pipeline'}
            isFilterActive={crossFilterSource !== null}
            className="min-h-[365px]"
          >
            <PowerBiLogSourceTreemapVisual onDrillDown={setDrillDownTarget} />
          </PowerBiCardVisual>
        </div>
      </div>

      {/* SECTION 7: Readiness Defense SLA Gauge, Subnet Scatter Matrix & Live Wire Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5">
        <div className="md:col-span-1 lg:col-span-3">
          <PowerBiCardVisual
            id="pbi-defense-score"
            title={isRtl ? 'كفاءة الحماية والامتثال الأمني' : 'Cyber Defense Readiness & SOC SLA'}
            subtitle={isRtl ? 'مؤشرات التغطية والاحتواء والمصادقة الصفرية' : 'EDR coverage, autonomous SLA, and Zero-Trust metrics'}
            className="min-h-[365px]"
          >
            <PowerBiSecurityScoreGaugeVisual onDrillDown={setDrillDownTarget} />
          </PowerBiCardVisual>
        </div>

        <div className="md:col-span-1 lg:col-span-6">
          <PowerBiCardVisual
            id="pbi-subnet-scatter"
            title={isRtl ? 'مصفوفة تشتت النطاقات العدائية والمخاطر التراكمية' : 'Adversary Ingress Velocity vs Blast Radius Scatter Matrix'}
            subtitle={isRtl ? 'تحليل كثافة الهجمات لكل نطاق CIDR ودرجة الخطر ونطاق الأجهزة المستهدفة مع إمكانية الحظر الفوري' : 'Ingress velocity (events/hr) vs threat score (0-100) with bubble size indicating targeted fleet endpoints'}
            className="min-h-[365px]"
          >
            <PowerBiSubnetScatterRiskVisual onDrillDown={setDrillDownTarget} />
          </PowerBiCardVisual>
        </div>

        <div className="md:col-span-1 lg:col-span-3">
          <PowerBiCardVisual
            id="pbi-directquery-stream"
            title={isRtl ? 'تدفق السجلات المباشر' : 'Live Wire Telemetry Stream'}
            subtitle={isRtl ? 'سجلات حية مع إمكانية الحظر الفوري' : 'Real-time event pipeline with instant IP quarantine'}
            className="min-h-[365px]"
          >
            <PowerBiLiveSocStreamVisual />
          </PowerBiCardVisual>
        </div>
      </div>

      {/* Forensic Log Drill-down Modal Explorer */}
      {drillDownTarget && (
        <PowerBiLogDrillDownModal
          target={drillDownTarget}
          onClose={() => setDrillDownTarget(null)}
        />
      )}
    </div>
  );
};
