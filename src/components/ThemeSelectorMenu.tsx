import React, { useState, useRef, useEffect } from 'react';
import { useSiem } from '../context/SiemContext';
import { THEMES } from '../types/theme';
import { Palette, Check, ChevronDown } from './icons/SocIcons';

export const ThemeSelectorMenu: React.FC = () => {
  const { theme, setTheme, language, isRtl } = useSiem();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeTheme = THEMES[theme] || THEMES.dark;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const themeList = Object.values(THEMES);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Theme Trigger Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs cursor-pointer transition-colors border ${
          activeTheme.subtleBgClass
        } ${activeTheme.borderClass} ${activeTheme.textPrimaryClass}`}
        title={language === 'ar' ? 'تغيير مظهر ولوحة ألوان التقرير' : 'Change Power BI Theme Palette'}
      >
        <span
          className="w-2.5 h-2.5 rounded-full border border-white/40 shrink-0 shadow-xs"
          style={{ backgroundColor: activeTheme.accentColor }}
        />
        <Palette className="w-3.5 h-3.5 text-[#118dff]" />
        <span className="text-[11px] font-medium hidden md:inline truncate max-w-[75px]">
          {language === 'ar' ? 'المظهر' : activeTheme.nameEn}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform ${activeTheme.textSecondaryClass} ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-1.5 w-72 rounded-[2px] shadow-2xl z-50 overflow-hidden font-sans border ${
            activeTheme.cardBgClass
          } ${activeTheme.borderClass} ${activeTheme.textPrimaryClass}`}
        >
          {/* Header */}
          <div className={`px-3.5 py-2.5 border-b flex items-center justify-between ${
            activeTheme.cardHeaderBgClass
          } ${activeTheme.borderClass}`}>
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#118dff]" />
              <span className={`text-xs font-semibold ${activeTheme.textPrimaryClass}`}>
                {language === 'ar' ? 'مظاهر ولوحات الألوان' : 'Color Theme Palettes'}
              </span>
            </div>
            <span className={`text-[10px] font-mono ${activeTheme.textSecondaryClass}`}>
              {themeList.length} {language === 'ar' ? 'أنماط' : 'Profiles'}
            </span>
          </div>

          {/* Theme Options */}
          <div className="p-1.5 space-y-1 max-h-[360px] overflow-y-auto">
            {themeList.map((item) => {
              const isSelected = item.id === theme;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTheme(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-[2px] transition-all cursor-pointer ${
                    isRtl ? 'text-right' : 'text-left'
                  } ${
                    isSelected 
                      ? `${activeTheme.activeItemBgClass} ${activeTheme.textPrimaryClass} font-semibold ring-1 ring-[#118dff]`
                      : `${activeTheme.textPrimaryClass} ${activeTheme.hoverItemBgClass} border border-transparent`
                  }`}
                >
                  {/* Theme Color Preview Swatch */}
                  <div 
                    className="w-7 h-7 rounded-[2px] shrink-0 border flex flex-col justify-between p-0.5 shadow-xs mt-0.5"
                    style={{ 
                      backgroundColor: item.previewBg,
                      borderColor: item.previewBorder
                    }}
                  >
                    <div className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.previewAccent }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="h-1 rounded-[1px] w-full" style={{ backgroundColor: item.previewAccent, opacity: 0.8 }} />
                  </div>

                  {/* Theme Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-semibold truncate ${
                        isSelected 
                          ? activeTheme.textPrimaryClass 
                          : activeTheme.textPrimaryClass
                      }`}>
                        {language === 'ar' ? item.nameAr : item.nameEn}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#118dff] shrink-0" />
                      )}
                    </div>
                    <p className={`text-[10.5px] line-clamp-1 mt-0.5 ${
                      activeTheme.textSecondaryClass
                    }`}>
                      {language === 'ar' ? item.descriptionAr : item.descriptionEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className={`px-3.5 py-1.5 border-t text-[10px] flex items-center justify-between font-mono ${
            activeTheme.cardHeaderBgClass
          } ${activeTheme.borderClass} ${activeTheme.textSecondaryClass}`}>
            <span>{language === 'ar' ? 'نظام الألوان' : 'Color Profile'}</span>
            <span className="text-emerald-500 font-semibold">WCAG AA Nominal</span>
          </div>
        </div>
      )}
    </div>
  );
};
