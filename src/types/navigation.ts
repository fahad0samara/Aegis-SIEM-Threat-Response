import { PowerBiPage } from '../context/SiemContext';
import { TranslationKey } from '../i18n/translations';

export interface PageDefinition {
  id: PowerBiPage;
  labelKey: TranslationKey;
  hasBadge?: boolean;
}

export const REPORT_PAGES: PageDefinition[] = [
  { id: 'overview', labelKey: 'page.overview' },
  { id: 'incidents', labelKey: 'page.incidents', hasBadge: true },
  { id: 'mitre', labelKey: 'page.mitre' },
  { id: 'logs', labelKey: 'page.logs' },
  { id: 'playbooks', labelKey: 'page.playbooks' },
  { id: 'rules', labelKey: 'page.rules' }
];
