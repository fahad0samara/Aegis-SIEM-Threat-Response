import React, { useState, useMemo } from 'react';
import { useSiem } from '../../context/SiemContext';
import { LogSourceDrillDownData } from '../PowerBiLogDrillDownModal';
import { THEMES } from '../../types/theme';
import { Server, Filter, ArrowUpRight, ShieldAlert, Activity } from '../icons/SocIcons';

interface Props {
  onDrillDown?: (target: LogSourceDrillDownData) => void;
}

interface IngestionSourceItem {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  volumeGb: number;
  epsRate: number; // Events per second
  anomalyCount: number;
  criticalCount: number;
  healthPercent: number;
  color: string;
  bgGradientDark: string;
  bgGradientLight: string;
}

export const PowerBiLogSourceTreemapVisual: React.FC<Props> = ({ onDrillDown }) => {
  const { 
    logs, 
    crossFilterSource, 
    setCrossFilterSource, 
    theme, 
    isRtl,
    t
  } = useSiem();

  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const [metricMode, setMetricMode] = useState<'volume' | 'anomalies' | 'eps'>('volume');

  // Dynamic telemetry pipeline aggregation
  const sourcesData = useMemo<IngestionSourceItem[]>(() => {
    const rawCounts: Record<string, { count: number; crit: number; warn: number }> = {};
    logs.forEach(l => {
      const src = l.source;
      if (!rawCounts[src]) {
        rawCounts[src] = { count: 0, crit: 0, warn: 0 };
      }
      rawCounts[src].count++;
      if (l.level === 'CRITICAL' || l.level === 'ERROR') rawCounts[src].crit++;
      else if (l.level === 'WARN') rawCounts[src].warn++;
    });

    const baseSources: IngestionSourceItem[] = [
      {
        id: 'palo-alto',
        name: 'Palo Alto NGFW',
        nameAr: 'جدران حماية بالو ألتو (NGFW)',
        category: 'Perimeter Network',
        categoryAr: 'الشبكة الحدودية',
        volumeGb: 3840,
        epsRate: 8450,
        anomalyCount: 42 + (rawCounts['Palo Alto NGFW']?.warn || 4),
        criticalCount: 8 + (rawCounts['Palo Alto NGFW']?.crit || 2),
        healthPercent: 99.8,
        color: '#118dff',
        bgGradientDark: 'from-[#0b2447] to-[#071329]',
        bgGradientLight: 'from-blue-100 to-blue-50'
      },
      {
        id: 'crowdstrike',
        name: 'CrowdStrike Falcon EDR',
        nameAr: 'حماية النقاط النهائية CrowdStrike',
        category: 'Endpoint Telemetry',
        categoryAr: 'الأجهزة والنقاط',
        volumeGb: 2680,
        epsRate: 6200,
        anomalyCount: 68 + (rawCounts['CrowdStrike EDR']?.warn || 8),
        criticalCount: 19 + (rawCounts['CrowdStrike EDR']?.crit || 5),
        healthPercent: 99.9,
        color: '#f43f5e',
        bgGradientDark: 'from-[#3b1219] to-[#1c080c]',
        bgGradientLight: 'from-rose-100 to-rose-50'
      },
      {
        id: 'aws-cloudtrail',
        name: 'AWS CloudTrail & VPC',
        nameAr: 'سجلات سحابة AWS وVPC',
        category: 'Cloud Fabric',
        categoryAr: 'البنية السحابية',
        volumeGb: 1920,
        epsRate: 4100,
        anomalyCount: 31 + (rawCounts['AWS CloudTrail']?.warn || 3),
        criticalCount: 6 + (rawCounts['AWS CloudTrail']?.crit || 1),
        healthPercent: 100.0,
        color: '#f59e0b',
        bgGradientDark: 'from-[#38260b] to-[#1c1305]',
        bgGradientLight: 'from-amber-100 to-amber-50'
      },
      {
        id: 'entra-id',
        name: 'Microsoft Entra / Okta',
        nameAr: 'الهوية السحابية Entra ID وOkta',
        category: 'Identity & Access',
        categoryAr: 'الهوية والوصول',
        volumeGb: 1450,
        epsRate: 3250,
        anomalyCount: 54 + (rawCounts['Okta SSO']?.warn || 6),
        criticalCount: 14 + (rawCounts['Okta SSO']?.crit || 3),
        healthPercent: 99.7,
        color: '#8b5cf6',
        bgGradientDark: 'from-[#2e154d] to-[#160a26]',
        bgGradientLight: 'from-purple-100 to-purple-50'
      },
      {
        id: 'windows-sysmon',
        name: 'Windows Security & Sysmon',
        nameAr: 'سجلات ويندوز وSysmon',
        category: 'OS Audit',
        categoryAr: 'تدقيق نظام التشغيل',
        volumeGb: 1180,
        epsRate: 2900,
        anomalyCount: 26 + (rawCounts['Windows Sysmon']?.warn || 2),
        criticalCount: 5 + (rawCounts['Windows Sysmon']?.crit || 1),
        healthPercent: 99.4,
        color: '#06b6d4',
        bgGradientDark: 'from-[#082933] to-[#04151a]',
        bgGradientLight: 'from-cyan-100 to-cyan-50'
      },
      {
        id: 'coredns',
        name: 'CoreDNS & Infoblox',
        nameAr: 'نظام أسماء النطاقات DNS',
        category: 'Resolver & C2',
        categoryAr: 'تحليل DNS والتحكم',
        volumeGb: 980,
        epsRate: 2150,
        anomalyCount: 18 + (rawCounts['CoreDNS']?.warn || 1),
        criticalCount: 4 + (rawCounts['CoreDNS']?.crit || 1),
        healthPercent: 100.0,
        color: '#10b981',
        bgGradientDark: 'from-[#0b291d] to-[#05140e]',
        bgGradientLight: 'from-emerald-100 to-emerald-50'
      },
      {
        id: 'k8s-audit',
        name: 'Kubernetes API Fabric',
        nameAr: 'حاويات Kubernetes',
        category: 'Containers',
        categoryAr: 'الحاويات والتطبيقات',
        volumeGb: 740,
        epsRate: 1680,
        anomalyCount: 15,
        criticalCount: 3,
        healthPercent: 99.9,
        color: '#38bdf8',
        bgGradientDark: 'from-[#0c2438] to-[#06121c]',
        bgGradientLight: 'from-sky-100 to-sky-50'
      },
      {
        id: 'suricata-nids',
        name: 'Suricata NIDS',
        nameAr: 'كشف اختراق الشبكة Suricata',
        category: 'Packet Inspection',
        categoryAr: 'فحص الحزم العميقة',
        volumeGb: 620,
        epsRate: 1350,
        anomalyCount: 22,
        criticalCount: 7,
        healthPercent: 99.5,
        color: '#ec4899',
        bgGradientDark: 'from-[#360e22] to-[#1c0711]',
        bgGradientLight: 'from-pink-100 to-pink-50'
      }
    ];

    return baseSources;
  }, [logs]);

  const totalVolumeGb = useMemo(() => sourcesData.reduce((acc, s) => acc + s.volumeGb, 0), [sourcesData]);
  const totalEps = useMemo(() => sourcesData.reduce((acc, s) => acc + s.epsRate, 0), [sourcesData]);
  const totalAnomalies = useMemo(() => sourcesData.reduce((acc, s) => acc + s.anomalyCount, 0), [sourcesData]);

  const handleTileClick = (source: IngestionSourceItem) => {
    // Cross-filter toggle
    if (crossFilterSource === source.name) {
      setCrossFilterSource(null);
    } else {
      setCrossFilterSource(source.name);
    }

    if (onDrillDown) {
      onDrillDown({
        title: isRtl ? `تدفق بيانات: ${source.nameAr}` : `Data Pipeline: ${source.name}`,
        subtitle: isRtl
          ? `الحجم: ${(source.volumeGb / 1024).toFixed(1)} تيرابايت/يوم · معدل التدفق: ${source.epsRate.toLocaleString()} حدث/ثانية · ${source.criticalCount} إنذارات حرجة`
          : `Ingestion: ${(source.volumeGb / 1024).toFixed(1)} TB/day · Rate: ${source.epsRate.toLocaleString()} EPS · ${source.criticalCount} Critical Threats`,
        category: 'source',
        filterKey: isRtl ? 'المصدر الأمني' : 'Log Source',
        filterValue: source.name,
        metricValue: `${(source.volumeGb / 1024).toFixed(1)} TB/day`
      });
    }
  };

  return (
    <div className={`h-full flex flex-col justify-between font-sans ${currentTheme.textPrimaryClass}`}>
      {/* Top Slicer Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-inherit">
        {/* Pipeline Telemetry KPIs */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 font-mono">
            <Server className="w-3.5 h-3.5 text-[#118dff]" />
            <span className={currentTheme.textSecondaryClass}>
              {isRtl ? 'إجمالي الاستيعاب:' : 'Daily Ingest:'}
            </span>
            <span className="font-bold text-[#118dff]">{(totalVolumeGb / 1024).toFixed(1)} TB</span>
          </div>

          <span className="opacity-30">·</span>

          <div className="flex items-center gap-1.5 font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className={currentTheme.textSecondaryClass}>
              {isRtl ? 'سرعة التدفق:' : 'Throughput:'}
            </span>
            <span className="font-bold text-emerald-400">{totalEps.toLocaleString()} EPS</span>
          </div>

          <span className="opacity-30">·</span>

          <div className="flex items-center gap-1.5 font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className={currentTheme.textSecondaryClass}>
              {isRtl ? 'إنذارات المصادر:' : 'Anomalies:'}
            </span>
            <span className="font-bold text-rose-400">{totalAnomalies}</span>
          </div>
        </div>

        {/* Metric Slicer Buttons */}
        <div className={`flex items-center rounded-[2px] p-0.5 font-mono text-[10.5px] border ${currentTheme.subtleBgClass} ${currentTheme.borderClass}`}>
          {[
            { id: 'volume' as const, label: isRtl ? 'الحجم (GB)' : 'Volume' },
            { id: 'eps' as const, label: isRtl ? 'المعدل (EPS)' : 'Rate (EPS)' },
            { id: 'anomalies' as const, label: isRtl ? 'الإنذارات' : 'Threats' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMetricMode(m.id)}
              className={`px-2 py-0.5 rounded-[2px] cursor-pointer transition-colors ${
                metricMode === m.id
                  ? 'bg-[#118dff] text-white font-bold shadow-xs'
                  : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Power BI Treemap Canvas Grid */}
      <div className="flex-1 min-h-[220px] w-full pt-3 grid grid-cols-12 gap-2">
        {/* Main Big Block 1: Palo Alto (Col 7 / Row 1-2) */}
        {(() => {
          const s = sourcesData[0];
          const isSelected = crossFilterSource === s.name;
          const share = ((s.volumeGb / totalVolumeGb) * 100).toFixed(1);

          return (
            <div
              key={s.id}
              onClick={() => handleTileClick(s)}
              className={`col-span-12 sm:col-span-7 row-span-2 p-3 rounded-[2px] border transition-all cursor-pointer flex flex-col justify-between shadow-2xs relative overflow-hidden group ${
                isSelected
                  ? 'ring-2 ring-[#118dff] shadow-md'
                  : 'hover:border-[#118dff]/60'
              } ${currentTheme.borderClass} bg-gradient-to-br ${
                isDark ? s.bgGradientDark : s.bgGradientLight
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-[1px]" style={{ backgroundColor: s.color }} />
                    <span className="text-[10px] font-mono uppercase tracking-wider opacity-75">
                      {isRtl ? s.categoryAr : s.category}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold font-sans mt-0.5 truncate">
                    {isRtl ? s.nameAr : s.name}
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-[2px] bg-black/20 text-[#118dff] shrink-0">
                  {share}%
                </span>
              </div>

              <div className="mt-4 pt-2 border-t border-black/10 flex items-center justify-between text-xs font-mono">
                <div className="space-y-0.5">
                  <span className="text-[10px] opacity-75 block">{isRtl ? 'حجم البيانات' : 'Ingested Data'}</span>
                  <span className="font-bold text-sm">{(s.volumeGb / 1024).toFixed(1)} TB/day</span>
                </div>
                <div className="text-end space-y-0.5">
                  <span className="text-[10px] opacity-75 block">{isRtl ? 'الإنذارات الحرجة' : 'Critical Threats'}</span>
                  <span className="font-bold text-sm text-rose-400">{s.criticalCount}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Block 2: CrowdStrike Falcon (Col 5 / Row 1) */}
        {(() => {
          const s = sourcesData[1];
          const isSelected = crossFilterSource === s.name;
          const share = ((s.volumeGb / totalVolumeGb) * 100).toFixed(1);

          return (
            <div
              key={s.id}
              onClick={() => handleTileClick(s)}
              className={`col-span-12 sm:col-span-5 p-2.5 rounded-[2px] border transition-all cursor-pointer flex flex-col justify-between shadow-2xs relative overflow-hidden ${
                isSelected ? 'ring-2 ring-[#118dff]' : 'hover:border-rose-400/60'
              } ${currentTheme.borderClass} bg-gradient-to-br ${
                isDark ? s.bgGradientDark : s.bgGradientLight
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <div className="text-[9.5px] font-mono opacity-75 truncate">{isRtl ? s.categoryAr : s.category}</div>
                  <h4 className="text-xs font-bold truncate">{isRtl ? s.nameAr : s.name}</h4>
                </div>
                <span className="text-[11px] font-mono font-bold text-rose-400 shrink-0">{share}%</span>
              </div>
              <div className="mt-2 pt-1 border-t border-black/10 flex items-center justify-between text-[11px] font-mono">
                <span>{(s.volumeGb / 1024).toFixed(1)} TB</span>
                <span className="text-rose-400 font-bold">{s.anomalyCount} threats</span>
              </div>
            </div>
          );
        })()}

        {/* Block 3: AWS CloudTrail (Col 5 / Row 2) */}
        {(() => {
          const s = sourcesData[2];
          const isSelected = crossFilterSource === s.name;
          const share = ((s.volumeGb / totalVolumeGb) * 100).toFixed(1);

          return (
            <div
              key={s.id}
              onClick={() => handleTileClick(s)}
              className={`col-span-12 sm:col-span-5 p-2.5 rounded-[2px] border transition-all cursor-pointer flex flex-col justify-between shadow-2xs relative overflow-hidden ${
                isSelected ? 'ring-2 ring-[#118dff]' : 'hover:border-amber-400/60'
              } ${currentTheme.borderClass} bg-gradient-to-br ${
                isDark ? s.bgGradientDark : s.bgGradientLight
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <div className="text-[9.5px] font-mono opacity-75 truncate">{isRtl ? s.categoryAr : s.category}</div>
                  <h4 className="text-xs font-bold truncate">{isRtl ? s.nameAr : s.name}</h4>
                </div>
                <span className="text-[11px] font-mono font-bold text-amber-400 shrink-0">{share}%</span>
              </div>
              <div className="mt-2 pt-1 border-t border-black/10 flex items-center justify-between text-[11px] font-mono">
                <span>{(s.volumeGb / 1024).toFixed(1)} TB</span>
                <span className="text-amber-400 font-bold">{s.anomalyCount} threats</span>
              </div>
            </div>
          );
        })()}

        {/* Bottom Row Blocks: Entra ID, Windows Sysmon, CoreDNS, Kubernetes, Suricata */}
        {sourcesData.slice(3).map(s => {
          const isSelected = crossFilterSource === s.name;
          const share = ((s.volumeGb / totalVolumeGb) * 100).toFixed(1);

          return (
            <div
              key={s.id}
              onClick={() => handleTileClick(s)}
              className={`col-span-6 sm:col-span-4 lg:col-span-2.4 p-2 rounded-[2px] border transition-all cursor-pointer flex flex-col justify-between shadow-2xs relative overflow-hidden ${
                isSelected ? 'ring-2 ring-[#118dff]' : 'hover:border-[#118dff]/50'
              } ${currentTheme.borderClass} bg-gradient-to-br ${
                isDark ? s.bgGradientDark : s.bgGradientLight
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center justify-between text-[9px] font-mono opacity-75 mb-0.5">
                  <span className="truncate">{s.category.split(' ')[0]}</span>
                  <span className="font-bold">{share}%</span>
                </div>
                <h5 className="text-[11px] font-bold truncate leading-tight">{s.name}</h5>
              </div>

              <div className="mt-2 pt-1 border-t border-black/10 flex items-center justify-between text-[10px] font-mono">
                <span className="opacity-80">{s.volumeGb} GB</span>
                <span className="text-rose-400 font-bold">{s.criticalCount} crit</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Insights Footnote */}
      <div className={`mt-2 pt-2 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10.5px] font-mono ${currentTheme.borderClass} ${currentTheme.textSecondaryClass}`}>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#118dff]" />
          <span>
            {isRtl 
              ? 'انقر على أي مصدر لتصفية كامل لوحة القيادة واستعراض سجلات التدفق المباشرة'
              : 'Click any telemetry tile to cross-filter entire dashboard canvas and drill down'}
          </span>
        </div>

        {crossFilterSource && (
          <button
            onClick={() => setCrossFilterSource(null)}
            className="text-[#118dff] hover:underline font-bold cursor-pointer"
          >
            {isRtl ? 'إلغاء تصفية المصدر' : `Clear (${crossFilterSource})`}
          </button>
        )}
      </div>
    </div>
  );
};
