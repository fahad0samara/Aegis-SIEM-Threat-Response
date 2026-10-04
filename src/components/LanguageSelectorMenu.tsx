import React from 'react';
import { useSiem } from '../context/SiemContext';
import { THEMES } from '../types/theme';

export const LanguageSelectorMenu: React.FC = () => {
  const { language, setLanguage, theme } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  return (
    <div className={`flex items-center gap-1 p-0.5 rounded-[2px] border text-xs ${currentTheme.cardBgClass} ${currentTheme.borderClass}`}>
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] transition-all cursor-pointer font-medium text-[11px] ${
          language === 'en'
            ? 'bg-[#118dff] text-white font-bold shadow-xs'
            : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`
        }`}
        title="Switch to English"
      >
        <span className="text-[12px] leading-none">🇺🇸</span>
        <span>EN</span>
      </button>

      <button
        onClick={() => setLanguage('ar')}
        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] transition-all cursor-pointer font-medium text-[11px] ${
          language === 'ar'
            ? 'bg-[#10b981] text-white font-bold shadow-xs'
            : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`
        }`}
        title="التبديل إلى اللغة العربية"
      >
        <span className="text-[12px] leading-none">🇸🇦</span>
        <span className="font-sans font-bold">عربي</span>
      </button>
    </div>
  );
};
