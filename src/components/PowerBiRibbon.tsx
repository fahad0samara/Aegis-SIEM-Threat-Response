import React, { useState } from 'react';
import { useSiem } from '../context/SiemContext';
import { 
  ShieldAlert, 
  Pause, 
  RotateCcw, 
  Filter, 
  Flame, 
  Volume2, 
  VolumeX
} from './icons/SocIcons';
import { AttackSimulationModal } from './AttackSimulationModal';
import { ThemeSelectorMenu } from './ThemeSelectorMenu';
import { LanguageSelectorMenu } from './LanguageSelectorMenu';
import { THEMES } from '../types/theme';
import { REPORT_PAGES } from '../types/navigation';

export const PowerBiRibbon: React.FC = () => {
  const { 
    isStreaming, 
    toggleStreaming, 
    streamSpeed, 
    setStreamSpeed,
    soundEnabled, 
    toggleSound,
    isFilterPaneOpen, 
    setIsFilterPaneOpen,
    crossFilterSeverity,
    crossFilterSource,
    crossFilterStatus,
    resetAllCrossFilters,
    theme,
    pbiPage,
    setPbiPage,
    stats,
    isRtl,
    t,
    refreshData,
    isRefreshing
  } = useSiem();

  const [isAttackModalOpen, setIsAttackModalOpen] = useState(false);
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;
  const hasCrossFilters = crossFilterSeverity !== null || crossFilterSource !== null || crossFilterStatus !== null;

  return (
    <>
      <header className={`select-none border-b transition-colors ${currentTheme.surfaceClass} ${currentTheme.borderClass} ${currentTheme.textPrimaryClass} shadow-xs`}>
        <div className="max-w-[1780px] mx-auto px-4 h-12 flex items-center justify-between gap-4">
          {/* Zone 1: Brand & Tenant Context */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[2px] bg-[#118dff] flex items-center justify-center text-white shadow-xs">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className={`font-bold text-sm tracking-tight font-sans ${currentTheme.textPrimaryClass}`}>
                {isRtl ? 'منظومة إيجيس SIEM' : 'Aegis SIEM'}
              </span>
            </div>

            <span className="opacity-30 hidden md:inline" aria-hidden="true">/</span>
            
            <span className={`text-[11px] font-mono hidden md:inline truncate max-w-[220px] ${currentTheme.textSecondaryClass}`}>
              {isRtl ? 'مركز العمليات الأمنية للمؤسسة (SOC)' : 'Contoso Enterprise SOC'}
            </span>
          </div>

          {/* Zone 2: Report Breadcrumb & Ingestion Telemetry (Eliminates duplicated nav bar) */}
          <div className="hidden lg:flex items-center gap-2 font-mono text-xs">
            <div className={`px-2.5 py-1 rounded-[2px] border flex items-center gap-2 ${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.textPrimaryClass}`}>
              <span className={`w-2 h-2 rounded-full ${stats.criticalAlerts > 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="font-sans font-semibold text-[11px] tracking-tight">
                {t(REPORT_PAGES.find(p => p.id === pbiPage)?.labelKey || 'page.overview')}
              </span>
              <span className="opacity-30" aria-hidden="true">|</span>
              <span className="text-[10.5px] tabular-nums font-mono opacity-80">
                {stats.ingestionRateEPS.toLocaleString()} EPS
              </span>
              {stats.activeIncidents > 0 && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-[2px] bg-rose-600 text-white">
                  {stats.activeIncidents} {isRtl ? 'حالة نشطة' : 'ACTIVE'}
                </span>
              )}
            </div>
          </div>

          {/* Zone 3: Functional Controls & System Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 text-xs">
            {/* Live Streaming State Button */}
            <div className="flex items-center gap-1">
              <button
                onClick={toggleStreaming}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-[2px] font-mono text-[11px] cursor-pointer transition-colors border ${
                  isStreaming 
                    ? isDark 
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' 
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : isDark 
                      ? 'bg-amber-950/40 text-amber-400 border-amber-500/30' 
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
                title={isStreaming ? (isRtl ? 'التدفق نشط' : 'Stream is active') : (isRtl ? 'التدفق متوقف مؤقتاً' : 'Stream is paused')}
              >
                {isStreaming ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="hidden xs:inline">{isRtl ? 'بث حي' : 'Live'}</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-amber-500" />
                    <span className="hidden xs:inline">{isRtl ? 'متوقف' : 'Paused'}</span>
                  </>
                )}
              </button>

              {/* Speed multiplier selector */}
              {isStreaming && (
                <div className={`hidden sm:flex items-center rounded-[2px] border text-[10px] font-mono p-0.5 ${currentTheme.subtleBgClass} ${currentTheme.borderClass}`}>
                  {([1, 2, 5] as const).map(speed => (
                    <button
                      key={speed}
                      onClick={() => setStreamSpeed(speed)}
                      className={`px-1.5 py-0.5 rounded-[1px] cursor-pointer transition-colors ${
                        streamSpeed === speed 
                          ? 'bg-[#118dff] text-white font-bold' 
                          : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Manual Data Refresh Button */}
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className={`flex items-center gap-1 px-2 py-1 rounded-[2px] border font-mono text-[11px] cursor-pointer transition-colors ${
                isRefreshing
                  ? 'bg-[#118dff]/20 border-[#118dff] text-[#118dff]'
                  : `${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`
              }`}
              title={isRtl ? 'تحديث البيانات ومؤشرات الأداء' : 'Refresh dashboard data & KPI metrics'}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isRtl ? 'تحديث' : 'Refresh'}</span>
            </button>

            {/* Attack Simulation Launcher */}
            <button
              onClick={() => setIsAttackModalOpen(true)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-[2px] bg-rose-600 hover:bg-rose-500 text-white font-medium text-[11px] transition-colors cursor-pointer shadow-xs"
              title={isRtl ? 'محاكاة هجوم' : 'Simulate Strike'}
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isRtl ? 'محاكاة هجوم' : 'Simulate Strike'}</span>
            </button>

            {/* Clear active cross-filters button */}
            {hasCrossFilters && (
              <button
                onClick={resetAllCrossFilters}
                className="flex items-center gap-1 px-2 py-1 rounded-[2px] bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono cursor-pointer transition-colors"
                title={isRtl ? 'مسح كافة عوامل التصفية التبادلية النشطة' : 'Clear active visual cross-filters'}
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden md:inline">{isRtl ? 'مسح التصفية' : 'Reset Slicers'}</span>
              </button>
            )}

            {/* Side Filter Pane Toggle */}
            <button
              onClick={() => setIsFilterPaneOpen(prev => !prev)}
              className={`p-1.5 rounded-[2px] border transition-colors cursor-pointer ${
                isFilterPaneOpen 
                  ? 'bg-[#118dff]/15 border-[#118dff]/40 text-[#118dff]' 
                  : `${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`
              }`}
              title={isRtl ? 'تبديل لوحة عوامل التصفية' : 'Toggle Filter Pane'}
            >
              <Filter className="w-3.5 h-3.5" />
            </button>

            {/* Audio chime toggle */}
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-[2px] transition-colors cursor-pointer hidden xs:inline-flex ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title={soundEnabled ? (isRtl ? 'كتم التنبيهات الصوتية' : 'Mute alert sounds') : (isRtl ? 'تفعيل التنبيهات الصوتية' : 'Enable alert sounds')}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-[#118dff]" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {/* Palette & Localization Pickers */}
            <ThemeSelectorMenu />
            <LanguageSelectorMenu />
          </div>
        </div>
      </header>

      {/* Attack Scenario Modal */}
      {isAttackModalOpen && (
        <AttackSimulationModal onClose={() => setIsAttackModalOpen(false)} />
      )}
    </>
  );
};
