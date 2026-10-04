export type PowerBiThemeId = 'dark' | 'light' | 'cobalt' | 'matrix' | 'crimson';

export interface ThemeConfig {
  id: PowerBiThemeId;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  isDarkBase: boolean;
  
  // Theme Color Swatches for Picker
  previewBg: string;
  previewAccent: string;
  previewBorder: string;

  // Semantic styles
  canvasBgClass: string;
  surfaceClass: string;
  cardBgClass: string;
  cardHeaderClass: string;
  cardHeaderBgClass: string;
  subtleBgClass: string;
  mutedBgClass: string;
  inputBgClass: string;
  tableHeaderBgClass: string;
  tableRowHoverClass: string;
  hoverItemBgClass: string;
  activeItemBgClass: string;
  borderClass: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
  textMutedClass: string;
  accentColor: string;
}

export const THEMES: Record<PowerBiThemeId, ThemeConfig> = {
  dark: {
    id: 'dark',
    nameEn: 'Enterprise Dark (Cyber Navy)',
    nameAr: 'الوضع الداكن المؤسسي (كحلي سيبراني)',
    descriptionEn: 'Deep cyber midnight navy engineered for 24/7 security operations centers',
    descriptionAr: 'واجهة داكنة متناسقة عالية التباين ومريحة مصممة لمراكز العمليات الأمنية (SOC)',
    isDarkBase: true,
    previewBg: '#070b14',
    previewAccent: '#118dff',
    previewBorder: '#18284c',
    canvasBgClass: 'bg-[#070b14] text-slate-100',
    surfaceClass: 'bg-[#070b14]',
    cardBgClass: 'bg-[#0b1326]',
    cardHeaderClass: 'bg-[#0f1a34] border-[#18284c]',
    cardHeaderBgClass: 'bg-[#0f1a34]',
    subtleBgClass: 'bg-[#080f1e]',
    mutedBgClass: 'bg-[#050914]',
    inputBgClass: 'bg-[#080f1e] border-[#18284c] text-white placeholder:text-slate-500',
    tableHeaderBgClass: 'bg-[#080f1e]/98 text-slate-300 border-[#18284c]',
    tableRowHoverClass: 'hover:bg-[#0f1d38]/60',
    hoverItemBgClass: 'hover:bg-[#0f1d38]/60',
    activeItemBgClass: 'bg-[#0f1d38] border-[#118dff] text-white',
    borderClass: 'border-[#18284c]',
    textPrimaryClass: 'text-slate-100',
    textSecondaryClass: 'text-slate-400',
    textMutedClass: 'text-slate-500',
    accentColor: '#118dff'
  },
  light: {
    id: 'light',
    nameEn: 'Executive Light (Clean)',
    nameAr: 'الوضع المؤسسي الفاتح (تنفيذي)',
    descriptionEn: 'Clean, high-legibility executive paper canvas with crisp hairline dividers',
    descriptionAr: 'واجهة فاتحة ناصعة ذات مقروئية فائقة مصممة للتقارير التنفيذية والتحليل',
    isDarkBase: false,
    previewBg: '#f8fafc',
    previewAccent: '#0078d4',
    previewBorder: '#e2e8f0',
    canvasBgClass: 'bg-[#f8fafc] text-slate-900',
    surfaceClass: 'bg-white',
    cardBgClass: 'bg-white shadow-xs',
    cardHeaderClass: 'bg-slate-50/80 border-slate-200',
    cardHeaderBgClass: 'bg-slate-50/80',
    subtleBgClass: 'bg-white',
    mutedBgClass: 'bg-white',
    inputBgClass: 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#0078d4]',
    tableHeaderBgClass: 'bg-white text-slate-800 border-slate-200',
    tableRowHoverClass: 'hover:bg-blue-50/50',
    hoverItemBgClass: 'hover:bg-slate-100',
    activeItemBgClass: 'bg-blue-50/80 border-[#0078d4] text-[#0078d4]',
    borderClass: 'border-slate-200',
    textPrimaryClass: 'text-slate-900',
    textSecondaryClass: 'text-slate-600',
    textMutedClass: 'text-slate-500',
    accentColor: '#0078d4'
  },
  cobalt: {
    id: 'cobalt',
    nameEn: 'Midnight Navy (Sentinel)',
    nameAr: 'الأزرق الكحلي الليلي (سينتينل)',
    descriptionEn: 'Deep maritime navy with steel blue borders and ice cyan telemetry indicators',
    descriptionAr: 'أزرق كحلي عميق بأسلوب مايكروسوفت سينتينل مع مؤشرات زرقاء جليدية',
    isDarkBase: true,
    previewBg: '#060e1e',
    previewAccent: '#38bdf8',
    previewBorder: '#1a2a47',
    canvasBgClass: 'bg-[#060e1e] text-slate-100',
    surfaceClass: 'bg-[#060e1e]',
    cardBgClass: 'bg-[#0c1933]',
    cardHeaderClass: 'bg-[#102042] border-blue-900/60',
    cardHeaderBgClass: 'bg-[#102042]',
    subtleBgClass: 'bg-[#081329]',
    mutedBgClass: 'bg-[#040a16]',
    inputBgClass: 'bg-[#081329] border-blue-900/60 text-white placeholder:text-slate-400',
    tableHeaderBgClass: 'bg-[#081329]/98 text-slate-300 border-blue-900/60',
    tableRowHoverClass: 'hover:bg-[#102246]/60',
    hoverItemBgClass: 'hover:bg-[#102246]/60',
    activeItemBgClass: 'bg-[#112347] border-[#38bdf8] text-white',
    borderClass: 'border-blue-900/60',
    textPrimaryClass: 'text-slate-100',
    textSecondaryClass: 'text-slate-300',
    textMutedClass: 'text-slate-400',
    accentColor: '#38bdf8'
  },
  matrix: {
    id: 'matrix',
    nameEn: 'Industrial Titanium (Zinc)',
    nameAr: 'الرمادي التيتانيوم المحايد',
    descriptionEn: 'Zero-saturation neutral zinc palette engineered for minimal eye strain',
    descriptionAr: 'لوحة رمادية محايدة نقية تركز بالكامل على بيانات وسجلات الأمان',
    isDarkBase: true,
    previewBg: '#121214',
    previewAccent: '#3b82f6',
    previewBorder: '#27272a',
    canvasBgClass: 'bg-[#121214] text-zinc-100',
    surfaceClass: 'bg-[#121214]',
    cardBgClass: 'bg-[#18181b]',
    cardHeaderClass: 'bg-[#202024] border-zinc-800',
    cardHeaderBgClass: 'bg-[#202024]',
    subtleBgClass: 'bg-[#141416]',
    mutedBgClass: 'bg-[#0c0c0e]',
    inputBgClass: 'bg-[#141416] border-zinc-800 text-zinc-100 placeholder:text-zinc-500',
    tableHeaderBgClass: 'bg-[#141416]/98 text-zinc-300 border-zinc-800',
    tableRowHoverClass: 'hover:bg-[#202024]/60',
    hoverItemBgClass: 'hover:bg-[#202024]/60',
    activeItemBgClass: 'bg-[#222227] border-blue-500 text-white',
    borderClass: 'border-zinc-800',
    textPrimaryClass: 'text-zinc-100',
    textSecondaryClass: 'text-zinc-400',
    textMutedClass: 'text-zinc-500',
    accentColor: '#3b82f6'
  },
  crimson: {
    id: 'crimson',
    nameEn: 'Command Wall (Pure OLED)',
    nameAr: 'شاشات المراقبة (OLED فائق التباين)',
    descriptionEn: 'Pure black deep contrast canvas designed for large SOC wall monitoring',
    descriptionAr: 'أسود نقي عالي التباين مصمم لشاشات مراكز القيادة والتحكم الجدارية',
    isDarkBase: true,
    previewBg: '#000000',
    previewAccent: '#0ea5e9',
    previewBorder: '#262626',
    canvasBgClass: 'bg-[#000000] text-neutral-100',
    surfaceClass: 'bg-[#000000]',
    cardBgClass: 'bg-[#0a0a0a]',
    cardHeaderClass: 'bg-[#141414] border-neutral-800',
    cardHeaderBgClass: 'bg-[#141414]',
    subtleBgClass: 'bg-[#080808]',
    mutedBgClass: 'bg-[#030303]',
    inputBgClass: 'bg-[#080808] border-neutral-800 text-neutral-100 placeholder:text-neutral-500',
    tableHeaderBgClass: 'bg-[#080808]/98 text-neutral-300 border-neutral-800',
    tableRowHoverClass: 'hover:bg-[#141414]',
    hoverItemBgClass: 'hover:bg-[#141414]',
    activeItemBgClass: 'bg-[#141414] border-sky-500 text-white',
    borderClass: 'border-neutral-800',
    textPrimaryClass: 'text-neutral-100',
    textSecondaryClass: 'text-neutral-400',
    textMutedClass: 'text-neutral-500',
    accentColor: '#0ea5e9'
  }
};
