import React, { useState } from 'react';
import { useSiem } from '../context/SiemContext';
import { Filter, ChevronRight, ChevronLeft, RotateCcw, Search, CheckSquare, Square } from './icons/SocIcons';
import { IncidentSeverity, IncidentStatus } from '../types/siem';
import { THEMES } from '../types/theme';

export const PowerBiFilterPane: React.FC = () => {
  const { 
    isFilterPaneOpen, 
    setIsFilterPaneOpen,
    crossFilterSeverity,
    setCrossFilterSeverity,
    crossFilterSource,
    setCrossFilterSource,
    crossFilterStatus,
    setCrossFilterStatus,
    resetAllCrossFilters,
    incidents,
    logs,
    theme,
    isRtl,
    t
  } = useSiem();

  const [sourceSearch, setSourceSearch] = useState('');
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const getSeverityLabel = (sev: IncidentSeverity) => {
    if (!isRtl) return sev;
    switch (sev) {
      case 'CRITICAL': return 'حرج للغاية';
      case 'HIGH': return 'عالي الخطورة';
      case 'MEDIUM': return 'متوسط';
      case 'LOW': return 'منخفض';
    }
  };

  const getStatusLabel = (st: IncidentStatus) => {
    if (!isRtl) return st;
    switch (st) {
      case 'NEW': return 'جديد';
      case 'INVESTIGATING': return 'قيد التحقيق';
      case 'CONTAINED': return 'تم الاحتواء';
      case 'RESOLVED': return 'تم الحل';
    }
  };

  if (!isFilterPaneOpen) {
    return (
      <button
        onClick={() => setIsFilterPaneOpen(true)}
        className={`hidden 2xl:flex fixed ${isRtl ? 'left-0 border-r rounded-r-[2px]' : 'right-0 border-l rounded-l-[2px]'} top-32 z-30 border-y px-1.5 py-4 shadow-md flex-col items-center gap-2 text-xs font-mono cursor-pointer transition-colors ${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`}
        title={isRtl ? 'فتح لوحة عوامل التصفية' : 'Expand Power BI Filter Pane'}
      >
        <Filter className="w-3.5 h-3.5 text-[#118dff]" />
        <span className="[writing-mode:vertical-lr] tracking-widest text-[10px] uppercase font-semibold">
          {t('filter.title')}
        </span>
      </button>
    );
  }

  const allSources = Array.from(new Set(logs.map(l => l.source)));
  const filteredSources = allSources.filter(s => s.toLowerCase().includes(sourceSearch.toLowerCase()));
  const hasActiveFilters = crossFilterSeverity !== null || crossFilterSource !== null || crossFilterStatus !== null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs"
        onClick={() => setIsFilterPaneOpen(false)}
        aria-hidden="true"
      />
      <aside className={`fixed md:relative top-12 bottom-9 md:top-auto md:bottom-auto ${isRtl ? 'left-0 border-r md:border-r' : 'right-0 border-l md:border-l'} w-72 sm:w-80 md:w-72 flex flex-col shrink-0 h-[calc(100vh-84px)] md:h-full z-45 md:z-20 text-xs select-none shadow-2xl md:shadow-none ${currentTheme.surfaceClass} ${currentTheme.borderClass} ${currentTheme.textPrimaryClass}`}>
      {/* Filter Pane Header */}
      <div className={`flex items-center justify-between px-3.5 py-2.5 border-b ${currentTheme.cardHeaderClass} ${currentTheme.borderClass}`}>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#118dff]" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            {t('filter.title')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasActiveFilters && (
            <button
              onClick={resetAllCrossFilters}
              title={isRtl ? 'إعادة ضبط كل التصفية' : 'Clear all filters'}
              className={`p-1 rounded-[2px] transition-colors cursor-pointer ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#118dff]" />
            </button>
          )}

          <button
            onClick={() => setIsFilterPaneOpen(false)}
            title={t('filter.collapse')}
            className={`p-1 rounded-[2px] transition-colors cursor-pointer ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`}
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="p-3 space-y-3.5 overflow-y-auto flex-1 font-sans">
        <div className={`text-[10px] uppercase tracking-wider font-semibold ${currentTheme.textSecondaryClass}`}>
          {t('filter.pageLevel')}
        </div>

        {/* Filter Card 1: Severity Slicer */}
        <div className={`p-2.5 rounded-[2px] border space-y-2 ${currentTheme.cardBgClass} ${currentTheme.borderClass} shadow-xs`}>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>{t('filter.severity')}</span>
            {crossFilterSeverity && (
              <button
                onClick={() => setCrossFilterSeverity(null)}
                className="text-[10px] text-[#118dff] hover:underline cursor-pointer"
              >
                {t('filter.clear')}
              </button>
            )}
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as IncidentSeverity[]).map(sev => {
              const isChecked = crossFilterSeverity === sev;
              const count = incidents.filter(i => i.severity === sev).length;

              return (
                <button
                  key={sev}
                  onClick={() => setCrossFilterSeverity(isChecked ? null : sev)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded-[2px] transition-colors cursor-pointer ${
                    isChecked 
                      ? `${currentTheme.activeItemBgClass} font-semibold ring-1 ring-[#118dff]/40` 
                      : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isChecked ? (
                      <CheckSquare className="w-3.5 h-3.5 text-[#118dff]" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>{getSeverityLabel(sev)}</span>
                  </div>
                  <span className="text-[10px] tabular-nums opacity-75">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Card 2: Incident Status */}
        <div className={`p-2.5 rounded-[2px] border space-y-2 ${currentTheme.cardBgClass} ${currentTheme.borderClass} shadow-xs`}>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>{t('filter.status')}</span>
            {crossFilterStatus && (
              <button
                onClick={() => setCrossFilterStatus(null)}
                className="text-[10px] text-[#118dff] hover:underline cursor-pointer"
              >
                {t('filter.clear')}
              </button>
            )}
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            {(['NEW', 'INVESTIGATING', 'CONTAINED', 'RESOLVED'] as IncidentStatus[]).map(st => {
              const isChecked = crossFilterStatus === st;
              const count = incidents.filter(i => i.status === st).length;

              return (
                <button
                  key={st}
                  onClick={() => setCrossFilterStatus(isChecked ? null : st)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded-[2px] transition-colors cursor-pointer ${
                    isChecked 
                      ? `${currentTheme.activeItemBgClass} font-semibold ring-1 ring-[#118dff]/40` 
                      : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isChecked ? (
                      <CheckSquare className="w-3.5 h-3.5 text-[#118dff]" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>{getStatusLabel(st)}</span>
                  </div>
                  <span className="text-[10px] tabular-nums opacity-75">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Card 3: Log Source Stream */}
        <div className={`p-2.5 rounded-[2px] border space-y-2 ${currentTheme.cardBgClass} ${currentTheme.borderClass} shadow-xs`}>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>{t('filter.source')}</span>
            {crossFilterSource && (
              <button
                onClick={() => setCrossFilterSource(null)}
                className="text-[10px] text-[#118dff] hover:underline cursor-pointer"
              >
                {t('filter.clear')}
              </button>
            )}
          </div>

          {/* Search sources input */}
          <div className="relative">
            <Search className={`w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-2' : 'left-2'}`} />
            <input
              type="text"
              placeholder={t('filter.searchSource')}
              value={sourceSearch}
              onChange={(e) => setSourceSearch(e.target.value)}
              className={`w-full py-1 text-[11px] rounded-[2px] border focus:outline-hidden focus:border-[#118dff] ${
                isRtl ? 'pr-7 pl-2' : 'pl-7 pr-2'
              } ${currentTheme.inputBgClass}`}
            />
          </div>

          <div className="space-y-1 font-mono text-[11px] max-h-48 overflow-y-auto pr-0.5">
            {filteredSources.map(src => {
              const isChecked = crossFilterSource === src;
              const count = logs.filter(l => l.source === src).length;

              return (
                <button
                  key={src}
                  onClick={() => setCrossFilterSource(isChecked ? null : src)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded-[2px] transition-colors cursor-pointer ${
                    isChecked 
                      ? `${currentTheme.activeItemBgClass} font-semibold ring-1 ring-[#118dff]/40` 
                      : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-1">
                    {isChecked ? (
                      <CheckSquare className="w-3.5 h-3.5 text-[#118dff] shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    )}
                    <span className="truncate">{src}</span>
                  </div>
                  <span className="text-[10px] tabular-nums opacity-75 shrink-0">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};
