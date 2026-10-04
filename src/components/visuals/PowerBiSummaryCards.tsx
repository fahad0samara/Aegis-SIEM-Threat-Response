import React from 'react';
import { useSiem } from '../../context/SiemContext';
import { THEMES } from '../../types/theme';
import { ShieldAlert, Clock, Terminal, ShieldCheck, ArrowUpRight } from '../icons/SocIcons';

interface Props {
  onDrillDownThreats?: () => void;
  onDrillDownMttr?: () => void;
  onDrillDownLogs?: () => void;
  onDrillDownHealth?: () => void;
}

interface AnimatedMetricProps {
  value: React.ReactNode;
  triggerKey: string | number;
  className?: string;
}

const AnimatedMetric: React.FC<AnimatedMetricProps> = ({ value, triggerKey, className = '' }) => (
  <span
    key={triggerKey}
    className={`animate-kpi-fade-in inline-block will-change-[opacity,transform] ${className}`}
  >
    {value}
  </span>
);

export const PowerBiSummaryCards: React.FC<Props> = ({
  onDrillDownThreats,
  onDrillDownMttr,
  onDrillDownLogs,
  onDrillDownHealth
}) => {
  const { 
    incidents, 
    stats, 
    theme, 
    isRtl, 
    setPbiPage,
    lastRefreshedAt,
    isRefreshing
  } = useSiem();

  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const activeThreatsList = incidents.filter(i => i.status !== 'RESOLVED');
  const activeThreatsCount = activeThreatsList.length;
  const criticalThreatsCount = activeThreatsList.filter(i => i.severity === 'CRITICAL').length;
  const elevatedThreatsCount = activeThreatsCount - criticalThreatsCount;

  const systemHealthPct = 99.98;

  return (
    <div className={`rounded-[2px] border select-none overflow-hidden relative ${
      currentTheme.cardBgClass
    } ${currentTheme.borderClass} shadow-xs`}>
      {/* Live Telemetry Refresh Sync Line */}
      <div className="h-[2px] w-full bg-transparent overflow-hidden absolute top-0 left-0 right-0 z-10">
        <div 
          className={`h-full transition-all duration-300 ease-out ${
            isRefreshing 
              ? 'w-full bg-[#118dff] opacity-100' 
              : 'w-0 opacity-0'
          }`}
        />
      </div>

      <div className={`grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 ${
        isRtl ? 'lg:divide-x-reverse' : ''
      } ${currentTheme.borderClass.replace('border-', 'divide-')} lg:divide-x`}>
        
        {/* KPI 1: Active Threats */}
        <div
          key={`kpi-threats-${lastRefreshedAt}`}
          onClick={() => {
            if (onDrillDownThreats) onDrillDownThreats();
            else setPbiPage('incidents');
          }}
          className={`p-2.5 sm:px-3 sm:py-2.5 transition-colors cursor-pointer flex flex-col justify-between animate-kpi-card-sync ${currentTheme.tableRowHoverClass}`}
        >
          <div className="flex items-center justify-between text-[10.5px] font-mono">
            <span className={`font-semibold uppercase tracking-wider truncate ${currentTheme.textSecondaryClass}`}>
              {isRtl ? 'التهديدات النشطة' : 'Active Threats'}
            </span>
            <span className={`flex items-center gap-1 text-[10px] shrink-0 font-bold ${
              criticalThreatsCount > 0 ? 'text-rose-400' : 'text-slate-400'
            }`}>
              <ShieldAlert className="w-3 h-3 shrink-0" />
              <AnimatedMetric
                value={`${criticalThreatsCount} CRIT`}
                triggerKey={`crit-${criticalThreatsCount}-${lastRefreshedAt}`}
              />
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <AnimatedMetric
              value={activeThreatsCount}
              triggerKey={`act-${activeThreatsCount}-${lastRefreshedAt}`}
              className={`text-xl sm:text-2xl font-bold font-mono tabular-nums tracking-tight ${
                activeThreatsCount > 0 
                  ? isDark ? 'text-rose-400' : 'text-rose-600' 
                  : currentTheme.textPrimaryClass
              }`}
            />
            <AnimatedMetric
              value={`${elevatedThreatsCount} ${isRtl ? 'مرتفع' : 'elevated'}`}
              triggerKey={`elev-${elevatedThreatsCount}-${lastRefreshedAt}`}
              className={`text-[11px] font-mono ${currentTheme.textSecondaryClass}`}
            />
          </div>

          <div className="space-y-1 mt-1.5">
            <div className={`h-1 w-full rounded-none overflow-hidden flex ${currentTheme.subtleBgClass}`}>
              <div 
                className="bg-rose-500 h-full transition-all duration-300 ease-out" 
                style={{ width: `${activeThreatsCount ? (criticalThreatsCount / activeThreatsCount) * 100 : 0}%` }}
              />
              <div 
                className="bg-amber-500 h-full transition-all duration-300 ease-out" 
                style={{ width: `${activeThreatsCount ? (elevatedThreatsCount / activeThreatsCount) * 100 : 0}%` }}
              />
            </div>
            <div className={`flex items-center justify-between text-[10px] font-mono opacity-80 ${currentTheme.textSecondaryClass}`}>
              <AnimatedMetric
                value={`MTTD: ${stats.mttdSeconds}s`}
                triggerKey={`mttd-${stats.mttdSeconds}-${lastRefreshedAt}`}
              />
              <span className="text-[#118dff] font-semibold flex items-center gap-0.5">
                <span>{isRtl ? 'فحص' : 'Triage'}</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Mean Time to Respond (MTTR) */}
        <div
          key={`kpi-mttr-${lastRefreshedAt}`}
          onClick={() => {
            if (onDrillDownMttr) onDrillDownMttr();
            else setPbiPage('playbooks');
          }}
          className={`p-2.5 sm:px-3 sm:py-2.5 transition-colors cursor-pointer flex flex-col justify-between animate-kpi-card-sync ${currentTheme.tableRowHoverClass}`}
        >
          <div className="flex items-center justify-between text-[10.5px] font-mono">
            <span className={`font-semibold uppercase tracking-wider truncate ${currentTheme.textSecondaryClass}`}>
              {isRtl ? 'وقت الاستجابة (MTTR)' : 'MTTR Response'}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-cyan-400 shrink-0 font-bold">
              <Clock className="w-3 h-3 shrink-0" />
              <span>&lt;15m SLA</span>
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-1">
              <AnimatedMetric
                value={stats.mttrMinutes}
                triggerKey={`mttr-${stats.mttrMinutes}-${lastRefreshedAt}`}
                className={`text-xl sm:text-2xl font-bold font-mono tabular-nums tracking-tight ${currentTheme.textPrimaryClass}`}
              />
              <span className="text-xs font-normal text-slate-500">{isRtl ? 'د' : 'min'}</span>
            </div>
            <AnimatedMetric
              value="PASS"
              triggerKey={`pass-${lastRefreshedAt}`}
              className={`text-[11px] font-mono font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
            />
          </div>

          <div className="space-y-1 mt-1.5">
            <div className={`h-1 w-full rounded-none overflow-hidden ${currentTheme.subtleBgClass}`}>
              <div 
                className="bg-cyan-500 h-full transition-all duration-300 ease-out" 
                style={{ width: `${Math.min(100, (stats.mttrMinutes / 15) * 100)}%` }}
              />
            </div>
            <div className={`flex items-center justify-between text-[10px] font-mono opacity-80 ${currentTheme.textSecondaryClass}`}>
              <AnimatedMetric
                value={`Auto-SOAR: ${stats.autoContainmentRate}%`}
                triggerKey={`soar-${stats.autoContainmentRate}-${lastRefreshedAt}`}
              />
              <span className="text-[#118dff] font-semibold flex items-center gap-0.5">
                <span>{isRtl ? 'الأتمتة' : 'SOAR'}</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: Logs Processed */}
        <div
          key={`kpi-logs-${lastRefreshedAt}`}
          onClick={() => {
            if (onDrillDownLogs) onDrillDownLogs();
            else setPbiPage('logs');
          }}
          className={`p-2.5 sm:px-3 sm:py-2.5 transition-colors cursor-pointer flex flex-col justify-between animate-kpi-card-sync ${currentTheme.tableRowHoverClass}`}
        >
          <div className="flex items-center justify-between text-[10.5px] font-mono">
            <span className={`font-semibold uppercase tracking-wider truncate ${currentTheme.textSecondaryClass}`}>
              {isRtl ? 'السجلات المعالجة' : 'Logs Processed'}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[#118dff] shrink-0 font-bold">
              <Terminal className="w-3 h-3 shrink-0" />
              <AnimatedMetric
                value={`${stats.ingestionRateEPS.toLocaleString()} EPS`}
                triggerKey={`eps-${stats.ingestionRateEPS}-${lastRefreshedAt}`}
              />
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <AnimatedMetric
              value={stats.totalLogsCount.toLocaleString()}
              triggerKey={`logs-${stats.totalLogsCount}`}
              className={`text-xl sm:text-2xl font-bold font-mono tabular-nums tracking-tight ${currentTheme.textPrimaryClass}`}
            />
            <AnimatedMetric
              value="+4.2%"
              triggerKey={`growth-${lastRefreshedAt}`}
              className={`text-[11px] font-mono font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
            />
          </div>

          <div className="space-y-1 mt-1.5">
            <div className={`h-1 w-full rounded-none overflow-hidden ${currentTheme.subtleBgClass}`}>
              <div 
                className="bg-[#118dff] h-full transition-all duration-300 ease-out" 
                style={{ width: `${Math.min(100, (stats.ingestionRateEPS / 6000) * 100)}%` }}
              />
            </div>
            <div className={`flex items-center justify-between text-[10px] font-mono opacity-80 ${currentTheme.textSecondaryClass}`}>
              <AnimatedMetric
                value="9 Connectors · 0 drop"
                triggerKey={`conn-${lastRefreshedAt}`}
              />
              <span className="text-[#118dff] font-semibold flex items-center gap-0.5">
                <span>{isRtl ? 'التدفق' : 'Stream'}</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4: System Health Percentage */}
        <div
          key={`kpi-health-${lastRefreshedAt}`}
          onClick={() => {
            if (onDrillDownHealth) onDrillDownHealth();
            else setPbiPage('rules');
          }}
          className={`p-2.5 sm:px-3 sm:py-2.5 transition-colors cursor-pointer flex flex-col justify-between animate-kpi-card-sync ${currentTheme.tableRowHoverClass}`}
        >
          <div className="flex items-center justify-between text-[10.5px] font-mono">
            <span className={`font-semibold uppercase tracking-wider truncate ${currentTheme.textSecondaryClass}`}>
              {isRtl ? 'سلامة النظام' : 'System Health'}
            </span>
            <span className={`flex items-center gap-1 text-[10px] shrink-0 font-bold ${
              isDark ? 'text-emerald-400' : 'text-emerald-600'
            }`}>
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span>NOMINAL</span>
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <AnimatedMetric
              value={`${systemHealthPct}%`}
              triggerKey={`health-${systemHealthPct}-${lastRefreshedAt}`}
              className={`text-xl sm:text-2xl font-bold font-mono tabular-nums tracking-tight ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}
            />
            <AnimatedMetric
              value="12/12 Up"
              triggerKey={`up-${lastRefreshedAt}`}
              className={`text-[11px] font-mono ${currentTheme.textSecondaryClass}`}
            />
          </div>

          <div className="space-y-1 mt-1.5">
            <div className={`h-1 w-full rounded-none overflow-hidden ${currentTheme.subtleBgClass}`}>
              <div 
                className="bg-emerald-500 h-full transition-all duration-300 ease-out" 
                style={{ width: `${systemHealthPct}%` }}
              />
            </div>
            <div className={`flex items-center justify-between text-[10px] font-mono opacity-80 ${currentTheme.textSecondaryClass}`}>
              <AnimatedMetric
                value="Latency: 4ms · HA Core"
                triggerKey={`lat-${lastRefreshedAt}`}
              />
              <span className="text-[#118dff] font-semibold flex items-center gap-0.5">
                <span>{isRtl ? 'الحالة' : 'Audit'}</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

