import React from 'react';
import { useSiem, PowerBiPage } from '../context/SiemContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  ShieldAlert, 
  Grid, 
  Terminal, 
  Zap, 
  Code,
  ZoomIn
} from './icons/SocIcons';
import { THEMES } from '../types/theme';
import { REPORT_PAGES } from '../types/navigation';

const PAGE_ICONS: Record<PowerBiPage, React.ReactNode> = {
  overview: <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />,
  incidents: <ShieldAlert className="w-3.5 h-3.5 shrink-0" />,
  mitre: <Grid className="w-3.5 h-3.5 shrink-0" />,
  logs: <Terminal className="w-3.5 h-3.5 shrink-0" />,
  playbooks: <Zap className="w-3.5 h-3.5 shrink-0" />,
  rules: <Code className="w-3.5 h-3.5 shrink-0" />
};

export const PowerBiPageTabs: React.FC = () => {
  const { pbiPage, setPbiPage, stats, theme, isRtl, t } = useSiem();

  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const currentPageIndex = REPORT_PAGES.findIndex(p => p.id === pbiPage);

  const goToPrev = () => {
    if (currentPageIndex > 0) {
      setPbiPage(REPORT_PAGES[currentPageIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (currentPageIndex < REPORT_PAGES.length - 1) {
      setPbiPage(REPORT_PAGES[currentPageIndex + 1].id);
    }
  };

  return (
    <footer className={`sticky bottom-0 z-30 flex items-center justify-between px-2 sm:px-3 h-9 sm:h-9 border-t text-xs select-none transition-colors ${
      currentTheme.surfaceClass
    } ${currentTheme.borderClass} ${currentTheme.textPrimaryClass}`}>
      {/* Page Sheet Tabs Navigation */}
      <div className="flex items-center gap-1 h-full overflow-x-auto scroll-smooth no-scrollbar touch-pan-x">
        {/* Navigation Step Arrows */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={goToPrev}
            disabled={currentPageIndex === 0}
            className={`p-1 rounded-[2px] transition-colors cursor-pointer border disabled:opacity-25 disabled:cursor-not-allowed ${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass} shadow-2xs`}
            title={isRtl ? 'الصفحة السابقة' : 'Previous page'}
            aria-label="Previous page"
          >
            {isRtl ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={goToNext}
            disabled={currentPageIndex === REPORT_PAGES.length - 1}
            className={`p-1 rounded-[2px] transition-colors cursor-pointer border disabled:opacity-25 disabled:cursor-not-allowed ${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass} shadow-2xs`}
            title={isRtl ? 'الصفحة التالية' : 'Next page'}
            aria-label="Next page"
          >
            {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className={`h-4 w-px mx-1 ${currentTheme.borderClass.replace('border-', 'bg-')}`} aria-hidden="true" />

        {/* Enterprise Sheet Tabs */}
        <div className="flex items-end h-full gap-1">
          {REPORT_PAGES.map((pg) => {
            const isActive = pbiPage === pg.id;
            const badge = pg.hasBadge ? stats.activeIncidents : undefined;

            return (
              <button
                key={pg.id}
                onClick={() => setPbiPage(pg.id)}
                className={`relative flex items-center gap-2 px-3.5 h-8 text-xs transition-all whitespace-nowrap cursor-pointer rounded-t-[2px] ${
                  isActive
                    ? `${currentTheme.cardBgClass} ${currentTheme.textPrimaryClass} font-semibold border-t-2 border-t-[#118dff] border-x ${currentTheme.borderClass} shadow-xs`
                    : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass} border-t-2 border-transparent border-x border-transparent`
                }`}
              >
                {PAGE_ICONS[pg.id]}
                <span className="tracking-tight">{t(pg.labelKey)}</span>
                {badge !== undefined && badge > 0 && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] font-bold ${
                    isActive 
                      ? 'bg-rose-600 text-white' 
                      : isDark ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60' : 'bg-rose-100 text-rose-700 border border-rose-300'
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Enterprise Power BI Status Bar Info */}
      <div className={`hidden lg:flex items-center gap-2.5 text-[11px] font-mono shrink-0 pl-2 rtl:pr-2 rtl:pl-0 ${currentTheme.textSecondaryClass}`}>
        <span className="tabular-nums">
          {isRtl 
            ? `صفحة ${currentPageIndex + 1} من ${REPORT_PAGES.length}` 
            : `Page ${currentPageIndex + 1} of ${REPORT_PAGES.length}`}
        </span>
        
        <span className="opacity-40" aria-hidden="true">|</span>
        
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-none bg-emerald-500 shrink-0" />
          <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} font-semibold`}>
            {isRtl ? 'حالة المنظومة: نشطة 100%' : 'System: Nominal'}
          </span>
        </div>
      </div>
    </footer>
  );
};
