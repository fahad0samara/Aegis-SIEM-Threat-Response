export type Language = 'en' | 'ar';

export const TRANSLATIONS = {
  en: {
    // Report Page Navigation
    'page.overview': 'Executive Threat Overview',
    'page.incidents': 'Incident Workbench & SOAR',
    'page.mitre': 'MITRE ATT&CK Matrix',
    'page.logs': 'Raw Telemetry Log Matrix',
    'page.playbooks': 'Response Playbooks Engine',
    'page.rules': 'Detection & Correlation Rules',

    // Slicer & Filter Pane
    'filter.title': 'Filters',
    'filter.collapse': 'Collapse filter pane',
    'filter.pageLevel': 'Filters on this page',
    'filter.clear': 'Clear filter',
    'filter.clearAll': 'Clear all filters',
    'filter.severity': 'Severity Slicer',
    'filter.source': 'Log Source Stream',
    'filter.status': 'Incident Status',
    'filter.searchSource': 'Search sources...',
    'filter.all': 'All'
  },
  ar: {
    // Report Page Navigation
    'page.overview': 'نظرة عامة على التهديدات التنفيذية',
    'page.incidents': 'منصة الحوادث الأمنية و SOAR',
    'page.mitre': 'مصفوفة تكتيكات ميتري (MITRE)',
    'page.logs': 'مصفوفة سجلات القياس عن بُعد',
    'page.playbooks': 'محرك كتيبات الاستجابة الآلية',
    'page.rules': 'قواعد الكشف والربط الذكي',

    // Slicer & Filter Pane
    'filter.title': 'عوامل التصفية',
    'filter.collapse': 'طي لوحة التصفية',
    'filter.pageLevel': 'عوامل التصفية لهذه الصفحة',
    'filter.clear': 'مسح التصفية',
    'filter.clearAll': 'مسح الكل',
    'filter.severity': 'محدد مستوى الخطورة',
    'filter.source': 'مصدر تدفق السجلات',
    'filter.status': 'حالة الحادث',
    'filter.searchSource': 'بحث في المصادر...',
    'filter.all': 'الكل'
  }
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;
