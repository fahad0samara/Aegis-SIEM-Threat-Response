import React, { useState, useEffect } from 'react';
import { useSiem } from '../../context/SiemContext';
import { THEMES } from '../../types/theme';
import { Filter, RotateCcw, Clock, ShieldAlert, Zap } from '../icons/SocIcons';

export const PowerBiExecutiveSlicerBar: React.FC = () => {
  const { 
    crossFilterSeverity, 
    setCrossFilterSeverity,
    crossFilterStatus,
    setCrossFilterStatus,
    resetAllCrossFilters,
    stats,
    theme,
    isRtl,
    incidents,
    refreshData
  } = useSiem();

  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const [activeTimeRange, setActiveTimeRange] = useState<'15m' | '1h' | '6h' | '24h' | '7d'>('24h');
  const [activeEnv, setActiveEnv] = useState<'all' | 'aws' | 'k8s' | 'onprem'>('all');
  const [currentTimeUtc, setCurrentTimeUtc] = useState<string>('');

  // Live SOC clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeUtc(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const hasFilters = crossFilterSeverity !== null || crossFilterStatus !== null || activeEnv !== 'all' || activeTimeRange !== '24h';

  const handleReset = () => {
    resetAllCrossFilters();
    setActiveTimeRange('24h');
    setActiveEnv('all');
  };

  return (
    <div className={`p-2 rounded-[2px] border flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono shadow-xs select-none ${
      currentTheme.cardBgClass
    } ${currentTheme.borderClass}`}>
      {/* Left Group: High-Level SOC Operational Telemetry */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="w-2 h-2 rounded-none bg-rose-500 shrink-0 animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-rose-400">
            {isRtl ? 'حالة التهديد: المستوى ٢' : 'Threat Level: Tier-2'}
          </span>
        </div>

        <span className="opacity-30" aria-hidden="true">·</span>

        <div className={`flex items-center gap-1 font-mono text-[11px] ${currentTheme.textPrimaryClass}`}>
          <span className="text-emerald-400 font-bold">99.98% SLA</span>
          <span className="hidden md:inline">{isRtl ? 'محرك تشغيلي' : 'Engine Up'}</span>
        </div>

        <span className="opacity-30" aria-hidden="true">·</span>

        <div className={`flex items-center gap-1.5 font-mono text-[11px] ${currentTheme.textPrimaryClass}`}>
          <Clock className="w-3.5 h-3.5 text-[#118dff]" />
          <span className="tabular-nums">{currentTimeUtc || 'SYNCING...'}</span>
        </div>

        <span className="opacity-30" aria-hidden="true">·</span>

        <div className={`font-mono text-[11px] ${currentTheme.textSecondaryClass}`}>
          <span className="tabular-nums font-semibold">{stats.totalLogsCount.toLocaleString()}</span> {isRtl ? 'حدث' : 'events'}
        </div>
      </div>

      {/* Right Group: Integrated Quick Slicers (Time Window + Scope + Reset) */}
      <div className="flex items-center gap-2 flex-wrap ml-auto">
        {/* Slicer Group 1: Time Horizon */}
        <div className="flex items-center gap-0.5">
          <span className={`text-[10px] uppercase font-bold tracking-wider mr-1 opacity-70 ${currentTheme.textSecondaryClass}`}>
            {isRtl ? 'النافذة:' : 'Window:'}
          </span>
          {[
            { id: '1h', labelEn: '1h', labelAr: '1س' },
            { id: '6h', labelEn: '6h', labelAr: '6س' },
            { id: '24h', labelEn: '24h', labelAr: '24س' },
            { id: '7d', labelEn: '7d', labelAr: '7أيام' }
          ].map(range => (
            <button
              key={range.id}
              onClick={() => {
                setActiveTimeRange(range.id as any);
                refreshData();
              }}
              className={`px-1.5 py-0.5 rounded-[1px] text-[10.5px] font-medium transition-all cursor-pointer whitespace-nowrap border ${
                activeTimeRange === range.id
                  ? 'bg-[#118dff] text-white font-bold border-[#118dff]'
                  : `${currentTheme.subtleBgClass} ${currentTheme.borderClass} ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`
              }`}
            >
              {isRtl ? range.labelAr : range.labelEn}
            </button>
          ))}
        </div>

        <span className="opacity-30" aria-hidden="true">·</span>

        {/* Slicer Group 2: Scope Environment */}
        <div className="flex items-center gap-0.5">
          <span className={`text-[10px] uppercase font-bold tracking-wider mr-1 opacity-70 ${currentTheme.textSecondaryClass}`}>
            {isRtl ? 'النطاق:' : 'Scope:'}
          </span>
          {[
            { id: 'all', labelEn: 'All', labelAr: 'الكل' },
            { id: 'aws', labelEn: 'AWS', labelAr: 'سحابي' },
            { id: 'onprem', labelEn: 'DC', labelAr: 'محلي' }
          ].map(env => (
            <button
              key={env.id}
              onClick={() => {
                setActiveEnv(env.id as any);
                refreshData();
              }}
              className={`px-1.5 py-0.5 rounded-[1px] text-[10.5px] font-medium transition-all cursor-pointer whitespace-nowrap border ${
                activeEnv === env.id
                  ? isDark ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold' : 'bg-cyan-600 text-white border-cyan-600 font-bold'
                  : `${currentTheme.subtleBgClass} ${currentTheme.borderClass} ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`
              }`}
            >
              {isRtl ? env.labelAr : env.labelEn}
            </button>
          ))}
        </div>

        {/* Reset Filter Button if active */}
        {hasFilters && (
          <>
            <span className="opacity-30" aria-hidden="true">·</span>
            <button
              onClick={handleReset}
              title={isRtl ? 'إعادة ضبط كافة عوامل التصفية' : 'Reset all active filters'}
              className="flex items-center gap-1 text-[10.5px] text-[#118dff] hover:underline cursor-pointer font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isRtl ? 'إعادة ضبط' : 'Reset Slicers'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
