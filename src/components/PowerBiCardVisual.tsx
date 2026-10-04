import React, { useState } from 'react';
import { Maximize2, Minimize2, Filter, MoreHorizontal, Download, Focus } from './icons/SocIcons';
import { useSiem } from '../context/SiemContext';
import { THEMES } from '../types/theme';
import { ErrorBoundary } from './ErrorBoundary';

interface Props {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  isFilterActive?: boolean;
}

export const PowerBiCardVisual: React.FC<Props> = ({
  id,
  title,
  subtitle,
  children,
  className = '',
  isFilterActive = false
}) => {
  const { focusedVisualId, setFocusedVisualId, exportLogsCsv, theme, isRtl, t } = useSiem();
  const [showMenu, setShowMenu] = useState(false);
  const [isSpotlight, setIsSpotlight] = useState(false);

  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;
  const isFocused = focusedVisualId === id;

  const toggleFocus = () => {
    setFocusedVisualId(isFocused ? null : id);
  };

  return (
    <div
      className={`relative transition-all duration-150 flex flex-col rounded-[2px] border ${
        isFocused 
          ? 'fixed inset-4 z-50 shadow-2xl overflow-hidden' 
          : 'shadow-xs'
      } ${currentTheme.cardBgClass} ${currentTheme.borderClass} ${
        isSpotlight ? 'ring-2 ring-[#f2c811]' : ''
      } ${className}`}
    >
      {/* Power BI Visual Header */}
      <div 
        className={`flex items-center justify-between px-3.5 py-2.5 border-b select-none ${currentTheme.cardHeaderClass} ${currentTheme.borderClass}`}
      >
        <div className={`space-y-0.5 truncate ${isRtl ? 'pl-2 text-right' : 'pr-2 text-left'}`}>
          <div className="flex items-center gap-2">
            <h3 className={`text-[12px] font-semibold tracking-tight truncate ${currentTheme.textPrimaryClass}`}>
              {title}
            </h3>
            {isFilterActive && (
              <span className="text-[11px] font-mono font-medium text-[#118dff]">
                · {t('filter.title')}
              </span>
            )}
          </div>
          {subtitle && (
            <p className={`text-[10.5px] truncate ${currentTheme.textSecondaryClass}`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Power BI Visual Header Action Icons */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            title={isFilterActive ? 'Visual is filtered by page slicer' : 'No filters applied to visual'}
            className={`p-1 rounded-[2px] transition-colors cursor-pointer ${
              isFilterActive 
                ? 'text-[#118dff] font-bold' 
                : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleFocus}
            title={isFocused ? (isRtl ? 'إلغاء وضع التركيز' : 'Exit Focus Mode') : (isRtl ? 'وضع التركيز' : 'Focus Mode (Expand Visual)')}
            className={`p-1 rounded-[2px] transition-colors cursor-pointer ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`}
          >
            {isFocused ? (
              <Minimize2 className="w-3.5 h-3.5 text-[#118dff]" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(prev => !prev)}
              title={isRtl ? 'خيارات إضافية' : 'More Options'}
              className={`p-1 rounded-[2px] transition-colors cursor-pointer ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div 
                className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-1 w-44 rounded-[2px] shadow-lg py-1 text-xs z-50 border ${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.textPrimaryClass}`}
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  onClick={() => {
                    exportLogsCsv();
                    setShowMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 flex items-center gap-2 cursor-pointer ${
                    isRtl ? 'text-right' : 'text-left'
                  } ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`}
                >
                  <Download className="w-3.5 h-3.5 text-[#118dff]" />
                  <span>{isRtl ? 'تصدير البيانات' : 'Export data'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsSpotlight(prev => !prev);
                    setShowMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 flex items-center gap-2 cursor-pointer ${
                    isRtl ? 'text-right' : 'text-left'
                  } ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`}
                >
                  <Focus className="w-3.5 h-3.5 text-[#f2c811]" />
                  <span>
                    {isSpotlight 
                      ? (isRtl ? 'إزالة التركيز' : 'Remove spotlight') 
                      : (isRtl ? 'تسليط الضوء على العنصر' : 'Spotlight visual')}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Content Body */}
      <div className={`p-3 sm:p-3.5 flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar ${isFocused ? 'overflow-auto' : ''}`}>
        <ErrorBoundary visualTitle={title}>
          {children}
        </ErrorBoundary>
      </div>
    </div>
  );
};
