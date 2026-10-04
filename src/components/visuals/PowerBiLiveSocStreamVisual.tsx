import React from 'react';
import { useSiem } from '../../context/SiemContext';
import { 
  ChevronRight, 
  ChevronLeft,
  Activity
} from '../icons/SocIcons';
import { LogEntry } from '../../types/siem';
import { THEMES } from '../../types/theme';

export const PowerBiLiveSocStreamVisual: React.FC = () => {
  const { 
    logs, 
    blockedIps, 
    quickBlockIp, 
    theme,
    isRtl,
    setSelectedLog, 
    setPbiPage 
  } = useSiem();

  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const recentLogs = logs.slice(0, 7);

  const getLevelBadge = (level: LogEntry['level']) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="text-rose-500 font-mono font-bold tracking-tight">{isRtl ? 'حرج' : 'CRIT'}</span>;
      case 'ERROR':
        return <span className="text-orange-500 font-mono font-bold tracking-tight">{isRtl ? 'خطأ' : 'ERR'}</span>;
      case 'WARN':
        return <span className="text-amber-400 font-mono font-semibold tracking-tight">{isRtl ? 'تحذير' : 'WARN'}</span>;
      default:
        return <span className="text-slate-400 font-mono font-medium tracking-tight">{isRtl ? 'معلومات' : 'INFO'}</span>;
    }
  };

  return (
    <div className={`h-full flex flex-col justify-between font-mono text-xs select-none ${
      isDark ? 'text-slate-200' : 'text-slate-800'
    }`}>
      {/* Top Stream Status Header */}
      <div className={`flex items-center justify-between pb-2 mb-1.5 border-b text-[11px] ${
        isDark ? 'border-[#18284c]' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold">{isRtl ? 'تدفق سجلات القياس الحي' : 'Active Wire Telemetry Stream'}</span>
        </div>
        <button
          onClick={() => setPbiPage('logs')}
          className="text-[#118dff] hover:underline flex items-center gap-0.5 cursor-pointer text-[10.5px]"
        >
          <span>{isRtl ? 'فتح مصفوفة السجلات' : 'Open Full Log Matrix'}</span>
          {isRtl ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
      </div>

      {/* Stream Rows */}
      <div className="flex-1 divide-y divide-inherit overflow-y-auto space-y-0.5 max-h-[220px]">
        {recentLogs.map(log => {
          const isQuarantined = blockedIps.has(log.sourceIp);

          return (
            <div
              key={log.id}
              onClick={() => {
                setSelectedLog(log);
                setPbiPage('logs');
              }}
              className={`p-2 rounded-[2px] flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                isDark 
                  ? 'hover:bg-[#0f1a34]/60 text-slate-300' 
                  : 'hover:bg-slate-100 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="shrink-0 text-[10px]">
                  {getLevelBadge(log.level)}
                </div>

                <div className="min-w-0">
                  <div className="font-sans font-semibold text-[11px] truncate flex items-center gap-1.5">
                    <span className="truncate">{log.eventName}</span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">({log.source})</span>
                  </div>
                  <div className="text-[10.5px] text-slate-400 flex items-center gap-1.5 truncate">
                    <span>{isRtl ? 'المضيف:' : 'Host:'} <bdi dir="ltr"><strong className={isDark ? 'text-slate-200' : 'text-slate-700'}>{log.host}</strong></bdi></span>
                    <span aria-hidden="true">·</span>
                    <span>{isRtl ? 'المصدر:' : 'Src:'} <bdi dir="ltr"><strong className="text-[#118dff] font-mono">{log.sourceIp}</strong></bdi></span>
                    {log.mitreTactic && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-400">{log.mitreTactic}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side Quick Block or Timestamp */}
              <div className="shrink-0 flex items-center gap-2 text-[10px]">
                <span className="text-slate-400 tabular-nums hidden md:inline">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>

                {log.level === 'CRITICAL' && !isQuarantined && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      quickBlockIp(log.sourceIp, `Blocked from Live Stream (${log.eventName})`);
                    }}
                    className="px-2 py-0.5 rounded-[2px] bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer transition-colors shadow-xs"
                    title={isRtl ? 'حظر وعزل IP فوري' : 'Quick Quarantine IP'}
                  >
                    {isRtl ? 'حظر' : 'Block'}
                  </button>
                )}

                {isQuarantined && (
                  <span className="text-emerald-400 font-mono font-bold text-[10.5px]">
                    {isRtl ? 'معزول' : 'Quarantined'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stream Footer */}
      <div className={`pt-2 mt-1 border-t flex items-center justify-between text-[10px] text-slate-400 ${
        isDark ? 'border-[#18284c]' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-[#118dff]" />
          <span>{isRtl ? 'تدفق DirectQuery فوري للبيانات' : 'Real-time DirectQuery Event Pipe'}</span>
        </div>
        <span>{isRtl ? 'نافذة انزلاقية (آخر 250 حدث)' : 'Automatic sliding window (Last 250 events)'}</span>
      </div>
    </div>
  );
};
