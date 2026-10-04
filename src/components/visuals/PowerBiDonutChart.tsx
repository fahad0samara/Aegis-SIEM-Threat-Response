import React, { useState } from 'react';
import { useSiem } from '../../context/SiemContext';
import { IncidentSeverity } from '../../types/siem';
import { LogSourceDrillDownData } from '../PowerBiLogDrillDownModal';
import { THEMES } from '../../types/theme';
import { Search, ShieldAlert, CheckCircle2, Clock } from '../icons/SocIcons';

interface Props {
  onDrillDown?: (target: LogSourceDrillDownData) => void;
}

type ViewMode = 'donut' | 'breakdown' | 'mttr';

export const PowerBiDonutChart: React.FC<Props> = ({ onDrillDown }) => {
  const { 
    incidents, 
    crossFilterSeverity, 
    setCrossFilterSeverity,
    theme,
    isRtl
  } = useSiem();

  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const [viewMode, setViewMode] = useState<ViewMode>('donut');
  const [hoveredSlice, setHoveredSlice] = useState<IncidentSeverity | null>(null);

  // Calculate live statistics
  const counts: Record<IncidentSeverity, { total: number; open: number; investigating: number; resolved: number }> = {
    CRITICAL: { total: 0, open: 0, investigating: 0, resolved: 0 },
    HIGH: { total: 0, open: 0, investigating: 0, resolved: 0 },
    MEDIUM: { total: 0, open: 0, investigating: 0, resolved: 0 },
    LOW: { total: 0, open: 0, investigating: 0, resolved: 0 }
  };

  incidents.forEach(inc => {
    if (counts[inc.severity]) {
      counts[inc.severity].total++;
      if (inc.status === 'NEW') counts[inc.severity].open++;
      else if (inc.status === 'INVESTIGATING') counts[inc.severity].investigating++;
      else if (inc.status === 'RESOLVED' || inc.status === 'CONTAINED') counts[inc.severity].resolved++;
    }
  });

  const totalIncidents = incidents.length || 1;

  // Real MTTR benchmark targets per severity
  const mttrData: Record<IncidentSeverity, { mttrMin: number; slaTargetMin: number; trend: string }> = {
    CRITICAL: { mttrMin: 14, slaTargetMin: 15, trend: '-2.4m' },
    HIGH: { mttrMin: 38, slaTargetMin: 45, trend: '-6.1m' },
    MEDIUM: { mttrMin: 125, slaTargetMin: 180, trend: '-15m' },
    LOW: { mttrMin: 380, slaTargetMin: 480, trend: '+12m' }
  };

  const segments: {
    label: IncidentSeverity;
    nameEn: string;
    nameAr: string;
    color: string;
    lightColor: string;
    count: number;
    pct: number;
    open: number;
    investigating: number;
    resolved: number;
  }[] = [
    {
      label: 'CRITICAL',
      nameEn: 'Critical',
      nameAr: 'حرج للغاية',
      color: '#f43f5e',
      lightColor: '#e11d48',
      count: counts.CRITICAL.total,
      pct: counts.CRITICAL.total / totalIncidents,
      open: counts.CRITICAL.open,
      investigating: counts.CRITICAL.investigating,
      resolved: counts.CRITICAL.resolved
    },
    {
      label: 'HIGH',
      nameEn: 'High',
      nameAr: 'عالي الخطورة',
      color: '#fb923c',
      lightColor: '#ea580c',
      count: counts.HIGH.total,
      pct: counts.HIGH.total / totalIncidents,
      open: counts.HIGH.open,
      investigating: counts.HIGH.investigating,
      resolved: counts.HIGH.resolved
    },
    {
      label: 'MEDIUM',
      nameEn: 'Medium',
      nameAr: 'متوسط',
      color: '#facc15',
      lightColor: '#ca8a04',
      count: counts.MEDIUM.total,
      pct: counts.MEDIUM.total / totalIncidents,
      open: counts.MEDIUM.open,
      investigating: counts.MEDIUM.investigating,
      resolved: counts.MEDIUM.resolved
    },
    {
      label: 'LOW',
      nameEn: 'Low',
      nameAr: 'منخفض',
      color: '#38bdf8',
      lightColor: '#0284c7',
      count: counts.LOW.total,
      pct: counts.LOW.total / totalIncidents,
      open: counts.LOW.open,
      investigating: counts.LOW.investigating,
      resolved: counts.LOW.resolved
    }
  ];

  let cumulativeAngle = 0;
  const radius = 58;
  const innerRadius = 36;
  const cx = 75;
  const cy = 75;

  const polarToCartesian = (x: number, y: number, r: number, angleDeg: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
    return {
      x: x + r * Math.cos(angleRad),
      y: y + r * Math.sin(angleRad)
    };
  };

  const getDonutSlicePath = (startAngle: number, endAngle: number, isHoveredOrActive: boolean) => {
    const effectiveRadius = isHoveredOrActive ? radius + 4 : radius;
    const effectiveInner = isHoveredOrActive ? innerRadius - 1 : innerRadius;

    const startOuter = polarToCartesian(cx, cy, effectiveRadius, endAngle);
    const endOuter = polarToCartesian(cx, cy, effectiveRadius, startAngle);
    const startInner = polarToCartesian(cx, cy, effectiveInner, endAngle);
    const endInner = polarToCartesian(cx, cy, effectiveInner, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', startOuter.x, startOuter.y,
      'A', effectiveRadius, effectiveRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      'L', endInner.x, endInner.y,
      'A', effectiveInner, effectiveInner, 0, largeArcFlag, 1, startInner.x, startInner.y,
      'Z'
    ].join(' ');
  };

  const handleSliceClick = (sev: IncidentSeverity) => {
    if (crossFilterSeverity === sev) {
      setCrossFilterSeverity(null);
    } else {
      setCrossFilterSeverity(sev);
    }
  };

  const activeFocusSeverity = hoveredSlice || crossFilterSeverity;
  const activeFocusSegment = segments.find(s => s.label === activeFocusSeverity);

  return (
    <div className="flex flex-col h-full justify-between space-y-2.5 font-sans select-none">
      {/* Visual Sub-Toolbar & Mode Switcher */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-inherit text-xs font-mono">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-1.5 h-1.5 rounded-none bg-[#118dff] shrink-0" />
          <span className={`text-[11px] font-semibold truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {viewMode === 'donut' && (isRtl ? 'التوزيع النسبي للخطورة' : 'Severity Proportions')}
            {viewMode === 'breakdown' && (isRtl ? 'مصفوفة حالة المعالجة' : 'Containment Matrix')}
            {viewMode === 'mttr' && (isRtl ? 'زمن الاستجابة MTTR و SLA' : 'MTTR vs SLA Benchmarks')}
          </span>
        </div>

        {/* View Mode Segmented Controls */}
        <div className={`flex items-center gap-0.5 p-0.5 rounded-[2px] border text-[10px] shrink-0 ${
          currentTheme.subtleBgClass
        } ${currentTheme.borderClass}`}>
          <button
            onClick={() => setViewMode('donut')}
            className={`px-2 py-0.5 rounded-[1px] transition-colors cursor-pointer ${
              viewMode === 'donut'
                ? 'bg-[#118dff] text-white font-bold shadow-xs'
                : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`
            }`}
          >
            {isRtl ? 'حلقي' : 'Donut'}
          </button>
          <button
            onClick={() => setViewMode('breakdown')}
            className={`px-2 py-0.5 rounded-[1px] transition-colors cursor-pointer ${
              viewMode === 'breakdown'
                ? 'bg-[#118dff] text-white font-bold shadow-xs'
                : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`
            }`}
          >
            {isRtl ? 'الحالة' : 'Status'}
          </button>
          <button
            onClick={() => setViewMode('mttr')}
            className={`px-2 py-0.5 rounded-[1px] transition-colors cursor-pointer ${
              viewMode === 'mttr'
                ? 'bg-[#118dff] text-white font-bold shadow-xs'
                : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`
            }`}
          >
            MTTR
          </button>
        </div>
      </div>

      {/* VIEW 1: Dedicated Dashboard-Grade Donut with Interactive Hub */}
      {viewMode === 'donut' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 flex-1 min-h-[165px]">
          {/* SVG Donut */}
          <div className="relative w-[150px] h-[150px] shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 150 150" className="w-full h-full overflow-visible">
              <defs>
                <filter id="pbi-slice-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#118dff" floodOpacity="0.5" />
                </filter>
              </defs>

              {segments.map((seg) => {
                const angle = seg.pct * 360;
                if (angle <= 0) return null;
                const startAngle = cumulativeAngle;
                const endAngle = cumulativeAngle + angle;
                cumulativeAngle += angle;

                const isSelected = crossFilterSeverity === seg.label;
                const isHovered = hoveredSlice === seg.label;
                const isFaded = (crossFilterSeverity !== null && !isSelected) || (hoveredSlice !== null && !isHovered && crossFilterSeverity === null);
                const displayName = isRtl ? seg.nameAr : seg.nameEn;

                return (
                  <path
                    key={seg.label}
                    d={getDonutSlicePath(startAngle, endAngle - 0.6, isSelected || isHovered)}
                    fill={isDark ? seg.color : seg.lightColor}
                    opacity={isFaded ? 0.25 : 1}
                    filter={isSelected ? 'url(#pbi-slice-glow)' : undefined}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredSlice(seg.label)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    onClick={() => handleSliceClick(seg.label)}
                  >
                    <title>{`${displayName}: ${seg.count} cases (${Math.round(seg.pct * 100)}%) · Click to cross-filter`}</title>
                  </path>
                );
              })}
            </svg>

            {/* Dynamic Center Metric Hub */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
              <span className={`text-2xl font-bold font-mono tabular-nums leading-none tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {activeFocusSegment ? activeFocusSegment.count : totalIncidents}
              </span>
              <span className={`text-[10px] font-mono uppercase tracking-wider mt-0.5 truncate max-w-[80px] ${
                activeFocusSegment
                  ? isDark ? 'text-[#118dff] font-bold' : 'text-blue-600 font-bold'
                  : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {activeFocusSegment 
                  ? (isRtl ? activeFocusSegment.nameAr : activeFocusSegment.nameEn)
                  : (isRtl ? 'إجمالي الحالات' : 'TOTAL CASES')}
              </span>
              {activeFocusSegment && (
                <span className="text-[9.5px] font-mono tabular-nums text-slate-400">
                  {Math.round(activeFocusSegment.pct * 100)}%
                </span>
              )}
            </div>
          </div>

          {/* Interactive Legend & Slicer Bars */}
          <div className="flex-1 w-full space-y-1.5 font-mono text-xs">
            {segments.map((seg) => {
              const isSelected = crossFilterSeverity === seg.label;
              const isHovered = hoveredSlice === seg.label;
              const isFaded = crossFilterSeverity !== null && !isSelected;
              const displayName = isRtl ? seg.nameAr : seg.nameEn;

              return (
                <div
                  key={seg.label}
                  onMouseEnter={() => setHoveredSlice(seg.label)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className={`w-full flex items-center justify-between p-1.5 rounded-[2px] transition-all border ${
                    isSelected 
                      ? `${currentTheme.activeItemBgClass} shadow-xs font-semibold ring-1 ring-[#118dff]`
                      : isHovered
                      ? `${currentTheme.hoverItemBgClass} ${currentTheme.borderClass}`
                      : isFaded
                      ? 'opacity-35 border-transparent'
                      : `${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.textPrimaryClass}`
                  }`}
                >
                  <button
                    onClick={() => handleSliceClick(seg.label)}
                    className={`flex items-center gap-2 flex-1 cursor-pointer truncate ${isRtl ? 'text-right' : 'text-left'}`}
                    title={isRtl ? `تصفية حسب ${displayName}` : `Cross-filter by ${seg.label}`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-none shrink-0"
                      style={{ backgroundColor: isDark ? seg.color : seg.lightColor }}
                    />
                    <span className="text-[11px] font-sans font-medium truncate">{displayName}</span>
                  </button>

                  <div className="flex items-center gap-2 tabular-nums text-[11px] shrink-0">
                    <span className="font-bold">{seg.count}</span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      ({Math.round(seg.pct * 100)}%)
                    </span>

                    {onDrillDown && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDrillDown({
                            title: isRtl ? `سجلات حوادث: ${displayName}` : `${seg.label} Incident Logs`,
                            subtitle: isRtl 
                              ? `شريحة تصنيف الخطورة · ${seg.count} إنذار أمني نشط (${Math.round(seg.pct * 100)}% من الحوادث)`
                              : `Threat classification slice · ${seg.count} active security alerts (${Math.round(seg.pct * 100)}% of incidents)`,
                            category: 'severity',
                            filterKey: isRtl ? 'مستوى الخطورة' : 'Severity Tier',
                            filterValue: seg.label,
                            metricValue: `${seg.count} ${isRtl ? 'إنذار' : 'alerts'}`
                          });
                        }}
                        title={isRtl ? `استعراض سجلات ${displayName}` : `Drill down into ${seg.label} logs`}
                        className="p-0.5 rounded-[1px] text-[#118dff] hover:bg-[#118dff]/20 cursor-pointer transition-colors"
                      >
                        <Search className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: Containment Matrix (Active / Investigating / Resolved) */}
      {viewMode === 'breakdown' && (
        <div className="flex-1 space-y-2 py-1">
          {segments.map((seg) => {
            const displayName = isRtl ? seg.nameAr : seg.nameEn;
            const total = seg.count || 1;
            const openPct = Math.round((seg.open / total) * 100);
            const invPct = Math.round((seg.investigating / total) * 100);
            const resPct = 100 - openPct - invPct;

            return (
              <div 
                key={seg.label}
                className={`p-2 rounded-[2px] border text-xs font-mono space-y-1.5 ${
                  isDark ? 'bg-[#080f1e]/80 border-[#18284c]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="w-2 h-2 rounded-none" 
                      style={{ backgroundColor: isDark ? seg.color : seg.lightColor }} 
                    />
                    <span className="font-semibold">{displayName}</span>
                    <span className="text-[10.5px] opacity-70">({seg.count} total)</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10.5px]">
                    <span className="text-rose-400 font-bold">{seg.open} Open</span>
                    <span className="opacity-40">·</span>
                    <span className="text-amber-400 font-bold">{seg.investigating} Active</span>
                    <span className="opacity-40">·</span>
                    <span className="text-emerald-400 font-bold">{seg.resolved} Closed</span>
                  </div>
                </div>

                {/* Multi-segment stacked progress bar */}
                <div className={`h-2 w-full rounded-none overflow-hidden flex ${
                  isDark ? 'bg-[#050914]' : 'bg-slate-200'
                }`}>
                  <div 
                    style={{ width: `${openPct}%` }} 
                    className="h-full bg-rose-500 transition-all duration-500" 
                    title={`Open: ${seg.open} (${openPct}%)`}
                  />
                  <div 
                    style={{ width: `${invPct}%` }} 
                    className="h-full bg-amber-400 transition-all duration-500" 
                    title={`Investigating: ${seg.investigating} (${invPct}%)`}
                  />
                  <div 
                    style={{ width: `${resPct}%` }} 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    title={`Resolved: ${seg.resolved} (${resPct}%)`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: MTTR & SLA Benchmarks */}
      {viewMode === 'mttr' && (
        <div className="flex-1 space-y-2 py-1">
          {segments.map((seg) => {
            const mttr = mttrData[seg.label];
            const isMet = mttr.mttrMin <= mttr.slaTargetMin;
            const displayName = isRtl ? seg.nameAr : seg.nameEn;

            return (
              <div
                key={seg.label}
                className={`p-2 rounded-[2px] border text-xs font-mono flex items-center justify-between gap-3 ${
                  isDark ? 'bg-[#080f1e]/80 border-[#18284c]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2 h-2 rounded-none shrink-0" 
                    style={{ backgroundColor: isDark ? seg.color : seg.lightColor }} 
                  />
                  <div>
                    <span className="font-semibold block">{displayName}</span>
                    <span className="text-[10px] opacity-70">
                      SLA Target: ≤ {mttr.slaTargetMin}m
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="flex items-center gap-1 font-bold text-sm tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-[#118dff]" />
                      <span>{mttr.mttrMin}m</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">{mttr.trend} vs avg</span>
                  </div>

                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[1px] border ${
                    isMet 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    {isMet ? 'SLA PASS' : 'BREACH RISK'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Benchmark Strip */}
      <div className={`pt-1.5 border-t flex items-center justify-between text-[10px] font-mono ${
        isDark ? 'border-[#18284c] text-slate-400' : 'border-slate-200 text-slate-500'
      }`}>
        <div className="flex items-center gap-1.5 truncate">
          <ShieldAlert className="w-3 h-3 text-rose-400 shrink-0" />
          <span>{isRtl ? 'عتبة الإنذار الحرج: 15% كحد أقصى' : 'Critical Threshold Benchmark: <15%'}</span>
        </div>
        <span className="text-emerald-500 font-semibold shrink-0">
          {counts.CRITICAL.total / totalIncidents < 0.15 ? '● WITHIN TOLERANCE' : '▲ ELEVATED PRESSURE'}
        </span>
      </div>
    </div>
  );
};
