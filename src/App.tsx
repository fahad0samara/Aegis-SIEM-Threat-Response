import React from 'react';
import { SiemProvider, useSiem } from './context/SiemContext';
import { PowerBiRibbon } from './components/PowerBiRibbon';
import { PowerBiPageTabs } from './components/PowerBiPageTabs';
import { PowerBiFilterPane } from './components/PowerBiFilterPane';
import { PowerBiOverviewPage } from './components/pages/PowerBiOverviewPage';
import { IncidentsView } from './components/IncidentsView';
import { LogStreamView } from './components/LogStreamView';
import { MitreView } from './components/MitreView';
import { PlaybooksView } from './components/PlaybooksView';
import { RulesView } from './components/RulesView';
import { THEMES } from './types/theme';
import { ErrorBoundary } from './components/ErrorBoundary';

const PowerBiCanvasContainer: React.FC = () => {
  const { pbiPage, theme } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;

  return (
    <div className={`flex-1 overflow-y-auto min-h-0 pb-8 transition-colors duration-200 ${currentTheme.canvasBgClass}`}>
      {pbiPage === 'overview' && <PowerBiOverviewPage />}
      {pbiPage === 'incidents' && <IncidentsView />}
      {pbiPage === 'mitre' && <MitreView />}
      {pbiPage === 'logs' && <LogStreamView />}
      {pbiPage === 'playbooks' && <PlaybooksView />}
      {pbiPage === 'rules' && <RulesView />}
    </div>
  );
};

const DashboardApp: React.FC = () => {
  const { theme, isRtl } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`h-screen max-h-screen overflow-hidden flex flex-col font-sans select-none transition-colors duration-200 ${
        currentTheme.textPrimaryClass
      } ${currentTheme.surfaceClass}`}
    >
      {/* Power BI Ribbon and Action Header */}
      <PowerBiRibbon />

      {/* Main Report Body: Canvas + Side Filter Pane */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        <ErrorBoundary>
          <PowerBiCanvasContainer />
        </ErrorBoundary>
        <PowerBiFilterPane />
      </div>

      {/* Power BI Bottom Page Tabs & Status Bar */}
      <PowerBiPageTabs />
    </div>
  );
};

export default function App() {
  return (
    <SiemProvider>
      <DashboardApp />
    </SiemProvider>
  );
}
