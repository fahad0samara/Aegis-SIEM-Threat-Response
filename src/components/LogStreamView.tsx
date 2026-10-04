import React, { useState, useMemo } from 'react';
import { useSiem } from '../context/SiemContext';
import { LogEntry, LogSeverity } from '../types/siem';
import { 
  Search, 
  Download, 
  Pause, 
  Radio, 
  X, 
  Copy, 
  Check, 
  ShieldAlert, 
  Lock, 
  Server, 
  Terminal
} from './icons/SocIcons';
import { THEMES } from '../types/theme';

export const LogStreamView: React.FC = () => {
  const { 
    logs, 
    isStreaming, 
    toggleStreaming, 
    streamSpeed, 
    setStreamSpeed,
    exportLogsJson, 
    exportLogsCsv,
    selectedLog,
    setSelectedLog,
    quickBlockIp,
    quickIsolateHost,
    blockedIps,
    isolatedHosts,
    setPbiPage,
    setSelectedIncident,
    incidents,
    theme,
    isRtl
  } = useSiem();

  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sources = useMemo(() => {
    const list = Array.from(new Set(logs.map(l => l.source)));
    return ['ALL', ...list];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (selectedSource !== 'ALL' && log.source !== selectedSource) return false;
      if (selectedSeverity !== 'ALL' && log.level !== selectedSeverity) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          log.eventName.toLowerCase().includes(q) ||
          (log.eventNameAr && log.eventNameAr.toLowerCase().includes(q)) ||
          log.host.toLowerCase().includes(q) ||
          log.user.toLowerCase().includes(q) ||
          log.sourceIp.toLowerCase().includes(q) ||
          log.eventId.toLowerCase().includes(q) ||
          log.source.toLowerCase().includes(q) ||
          (log.signature && log.signature.toLowerCase().includes(q)) ||
          JSON.stringify(log.rawPayload).toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [logs, selectedSource, selectedSeverity, searchQuery]);

  const handleCopyJson = (log: LogEntry) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getSeverityStyle = (level: LogSeverity) => {
    switch (level) {
      case 'CRITICAL': return 'text-rose-400 font-bold';
      case 'ERROR': return 'text-amber-400 font-semibold';
      case 'WARN': return 'text-yellow-400 font-medium';
      case 'INFO': return isDark ? 'text-slate-400 font-normal' : 'text-slate-600 font-normal';
    }
  };

  const getSeverityLabel = (level: LogSeverity | 'ALL') => {
    if (!isRtl) return level;
    switch (level) {
      case 'ALL': return 'الكل';
      case 'INFO': return 'معلومات';
      case 'WARN': return 'تحذير';
      case 'ERROR': return 'خطأ';
      case 'CRITICAL': return 'حرج';
    }
  };

  return (
    <div className={`p-4 max-w-[1720px] mx-auto space-y-3.5 ${currentTheme.textPrimaryClass}`}>
      {/* Top Header & Search Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b ${currentTheme.borderClass}`}>
        <div>
          <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
            <span>{isRtl ? 'مستكشف سجلات القياس المباشر (DirectQuery)' : 'Real-Time Telemetry Log Stream'}</span>
          </h1>
          <p className={`text-xs mt-0.5 ${currentTheme.textSecondaryClass}`}>
            {isRtl 
              ? 'تدفق السجلات في الوقت الحقيقي عبر الأنظمة المراقبة مع محددات التصفية ومعاينة حمولة السجل.' 
              : 'Live telemetry stream across monitored infrastructure with column filters, search query, and forensic inspection.'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className={`flex items-center rounded-[2px] px-2 py-1 border ${currentTheme.subtleBgClass} ${currentTheme.borderClass}`}>
            <button
              onClick={toggleStreaming}
              className="flex items-center gap-1.5 cursor-pointer font-medium"
            >
              {isStreaming ? (
                <>
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="font-mono text-emerald-400">{isRtl ? 'بث مباشر' : 'Live Stream'}</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono text-amber-400">{isRtl ? 'متوقف مؤقتاً' : 'Paused'}</span>
                </>
              )}
            </button>

            {isStreaming && (
              <div className={`flex items-center mx-2 px-2 border-x ${currentTheme.borderClass} gap-1 text-[11px] font-mono`}>
                {([1, 2, 5] as const).map(speed => (
                  <button
                    key={speed}
                    onClick={() => setStreamSpeed(speed)}
                    className={`px-1.5 py-0.5 rounded-[1px] ${
                      streamSpeed === speed 
                        ? 'bg-[#118dff] text-white font-bold' 
                        : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={exportLogsCsv}
            className={`px-2.5 py-1 text-xs rounded-[2px] border transition-colors flex items-center gap-1 cursor-pointer ${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass} shadow-xs`}
            title={isRtl ? 'تصدير كملف CSV' : 'Export CSV'}
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={exportLogsJson}
            className={`px-2.5 py-1 text-xs rounded-[2px] border transition-colors flex items-center gap-1 cursor-pointer ${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass} shadow-xs`}
            title={isRtl ? 'تصدير كملف JSON' : 'Export JSON'}
          >
            <Download className="w-3.5 h-3.5 text-[#118dff]" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Query Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search input */}
        <div className="md:col-span-6 relative">
          <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={isRtl ? "بحث في السجلات، مثال: 'PowerShell'، 'root'، '194.26'..." : "Search query, e.g. 'PowerShell', 'root', '194.26', 'T1055'..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-1.5 text-xs rounded-[2px] font-mono border focus:outline-hidden focus:border-[#118dff] ${
              isRtl ? 'pr-9 pl-8' : 'pl-9 pr-8'
            } ${currentTheme.inputBgClass}`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer ${isRtl ? 'left-2.5' : 'right-2.5'}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Source Dropdown */}
        <div className="md:col-span-3">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className={`w-full py-1.5 px-3 text-xs rounded-[2px] font-mono border focus:outline-hidden focus:border-[#118dff] cursor-pointer ${currentTheme.inputBgClass}`}
          >
            {sources.map(src => (
              <option key={src} value={src}>
                {src === 'ALL' ? (isRtl ? 'المصدر: كافة المصادر' : 'Source: All Sources') : `${isRtl ? 'المصدر:' : 'Source:'} ${src}`}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Segmented Filter */}
        <div className={`md:col-span-3 flex items-center gap-1 p-0.5 rounded-[2px] border text-[11px] font-mono justify-between ${currentTheme.subtleBgClass} ${currentTheme.borderClass}`}>
          {(['ALL', 'INFO', 'WARN', 'ERROR', 'CRITICAL'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2 py-0.5 rounded-[2px] cursor-pointer transition-colors ${
                selectedSeverity === sev
                  ? 'bg-[#118dff] text-white font-semibold shadow-xs'
                  : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`
              }`}
            >
              {getSeverityLabel(sev)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table & Inspector Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Table Column */}
        <div className={`${selectedLog ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all duration-150`}>
          <div className={`rounded-[2px] border overflow-hidden ${currentTheme.cardBgClass} ${currentTheme.borderClass} shadow-xs`}>
            <div className="overflow-x-auto max-h-[680px]">
              <table className="w-full text-start border-collapse text-xs">
                <thead className={`sticky top-0 border-b font-mono text-[11px] ${currentTheme.tableHeaderBgClass}`}>
                  <tr>
                    <th className="py-2.5 px-3 font-semibold text-start">{isRtl ? 'الوقت' : 'Timestamp'}</th>
                    <th className="py-2.5 px-3 font-semibold text-start">{isRtl ? 'الخطورة' : 'Level'}</th>
                    <th className="py-2.5 px-3 font-semibold text-start">{isRtl ? 'المصدر' : 'Source'}</th>
                    <th className="py-2.5 px-3 font-semibold text-start">{isRtl ? 'اسم الحدث' : 'Event Name'}</th>
                    <th className="py-2.5 px-3 font-semibold text-start">{isRtl ? 'الأصل' : 'Host'}</th>
                    <th className="py-2.5 px-3 font-semibold text-start">{isRtl ? 'المستخدم' : 'User'}</th>
                    <th className="py-2.5 px-3 font-semibold text-start">{isRtl ? 'عنوان IP' : 'Source IP'}</th>
                    <th className="py-2.5 px-3 text-end font-semibold">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y font-mono text-[11px] ${currentTheme.borderClass.replace('border-', 'divide-')}`}>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className={`py-12 text-center ${currentTheme.textSecondaryClass} font-sans`}>
                        {isRtl ? 'لا توجد سجلات تطابق شروط التصفية الحالية.' : 'No logs match current filter criteria.'}
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map(log => {
                      const isSelected = selectedLog?.id === log.id;
                      const isBlocked = blockedIps.has(log.sourceIp);

                      return (
                        <tr
                          key={log.id}
                          onClick={() => setSelectedLog(log)}
                          className={`transition-colors cursor-pointer ${
                            isSelected
                              ? `${currentTheme.activeItemBgClass} font-medium`
                              : `${currentTheme.tableRowHoverClass}`
                          }`}
                        >
                          <td className={`py-2 px-3 whitespace-nowrap tabular-nums ${currentTheme.textSecondaryClass}`}>
                            {new Date(log.timestamp).toLocaleTimeString(isRtl ? 'ar-SA' : undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </td>

                          <td className="py-2 px-3 whitespace-nowrap">
                            <span className={getSeverityStyle(log.level)}>
                              {getSeverityLabel(log.level)}
                            </span>
                          </td>

                          <td className={`py-2 px-3 whitespace-nowrap truncate max-w-[120px] ${currentTheme.textPrimaryClass}`}>
                            {log.source}
                          </td>

                          <td className="py-2 px-3 font-sans truncate max-w-[200px]" title={isRtl ? (log.eventNameAr || log.eventName) : log.eventName}>
                            {isRtl ? (log.eventNameAr || log.eventName) : log.eventName}
                          </td>

                          <td className={`py-2 px-3 whitespace-nowrap truncate max-w-[140px] ${currentTheme.textPrimaryClass}`}>
                            <bdi dir="ltr">{log.host}</bdi>
                          </td>

                          <td className={`py-2 px-3 whitespace-nowrap ${currentTheme.textSecondaryClass}`}>
                            <bdi dir="ltr">{log.user}</bdi>
                          </td>

                          <td className="py-2 px-3 whitespace-nowrap">
                            <bdi dir="ltr">{log.sourceIp}</bdi>
                            {isBlocked && (
                              <span className="text-emerald-400 font-semibold mx-1.5 text-[10.5px]">
                                · {isRtl ? 'محظور' : 'Blocked'}
                              </span>
                            )}
                          </td>

                          <td className="py-2 px-3 text-end whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLog(log);
                              }}
                              className="text-[#118dff] hover:underline px-1 py-0.5 cursor-pointer font-medium"
                            >
                              {isRtl ? 'فحص' : 'Inspect'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className={`py-2 px-4 border-t flex items-center justify-between text-[11px] font-mono ${currentTheme.subtleBgClass} ${currentTheme.borderClass} ${currentTheme.textSecondaryClass}`}>
              <span>{isRtl ? `عرض ${filteredLogs.length} من أصل ${logs.length} حدث` : `Showing ${filteredLogs.length} of ${logs.length} events`}</span>
              <span>{isRtl ? 'الذاكرة المؤقتة: 250 سجلاً' : 'Memory buffer: 250 rows'}</span>
            </div>
          </div>
        </div>

        {/* Side Drawer: Detailed Log Inspector */}
        {selectedLog && (
          <>
            {/* Mobile backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
              onClick={() => setSelectedLog(null)}
              aria-hidden="true"
            />
            <div className={`fixed lg:relative inset-x-2 bottom-12 lg:inset-auto z-50 lg:z-auto max-h-[85vh] lg:max-h-none overflow-y-auto lg:overflow-visible lg:col-span-5 rounded-[2px] border p-4 space-y-3.5 shadow-2xl lg:shadow-lg ${currentTheme.cardBgClass} ${currentTheme.borderClass}`}>
            <div className={`flex items-center justify-between pb-2.5 border-b ${currentTheme.borderClass}`}>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#118dff]" />
                <h3 className="text-sm font-semibold">
                  {isRtl ? 'الفحص الجنائي المتقدم للحدث' : 'Event Forensic Inspector'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className={`p-1 rounded-[2px] cursor-pointer ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={getSeverityStyle(selectedLog.level)}>{getSeverityLabel(selectedLog.level)}</span>
                <span className={currentTheme.textSecondaryClass}>
                  {new Date(selectedLog.timestamp).toLocaleTimeString(isRtl ? 'ar-SA' : undefined)}
                </span>
              </div>
              <h4 className="text-sm font-bold">
                {isRtl ? (selectedLog.eventNameAr || selectedLog.eventName) : selectedLog.eventName}
              </h4>
              <div className={`text-xs font-mono ${currentTheme.textSecondaryClass}`}>
                {isRtl ? 'المعرف:' : 'Event ID:'} {selectedLog.eventId} · {isRtl ? 'المصدر:' : 'Source:'} {selectedLog.source}
              </div>
            </div>

            {(selectedLog.mitreTechniqueId || selectedLog.signature) && (
              <div className={`p-2.5 rounded-[2px] border text-xs font-mono space-y-1 ${currentTheme.subtleBgClass} ${currentTheme.borderClass}`}>
                {selectedLog.mitreTechniqueId && (
                  <div className="text-[#118dff] font-semibold">
                    {isRtl ? 'مصفوفة ميتري ATT&CK:' : 'MITRE ATT&CK:'} {selectedLog.mitreTechniqueId} ({isRtl ? (selectedLog.mitreTacticAr || selectedLog.mitreTactic) : selectedLog.mitreTactic})
                  </div>
                )}
                {selectedLog.signature && (
                  <div className={`text-[11px] truncate ${currentTheme.textSecondaryClass}`}>
                    {isRtl ? 'التوقيع السلوكي:' : 'Signature:'} {isRtl ? (selectedLog.signatureAr || selectedLog.signature) : selectedLog.signature}
                  </div>
                )}
              </div>
            )}

            {/* Key Properties Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className={`p-2 rounded-[2px] border ${currentTheme.subtleBgClass} ${currentTheme.borderClass}`}>
                <div className={`text-[10px] ${currentTheme.textSecondaryClass}`}>
                  {isRtl ? 'عنوان IP المصدر' : 'Source IP'}
                </div>
                <div className="font-semibold mt-0.5 truncate"><bdi dir="ltr">{selectedLog.sourceIp}</bdi></div>
                {selectedLog.geoIp && (
                  <div className={`text-[10px] mt-0.5 ${currentTheme.textSecondaryClass}`}>
                    {selectedLog.geoIp.city}, {selectedLog.geoIp.country}
                  </div>
                )}
              </div>

              <div className={`p-2 rounded-[2px] border ${currentTheme.subtleBgClass} ${currentTheme.borderClass}`}>
                <div className={`text-[10px] ${currentTheme.textSecondaryClass}`}>
                  {isRtl ? 'الأصل المستهدف' : 'Target Host'}
                </div>
                <div className="font-semibold mt-0.5 truncate"><bdi dir="ltr">{selectedLog.host}</bdi></div>
                <div className={`text-[10px] mt-0.5 ${currentTheme.textSecondaryClass}`}>
                  {isRtl ? 'المستخدم:' : 'User:'} <bdi dir="ltr">{selectedLog.user}</bdi>
                </div>
              </div>
            </div>

            {/* Quick Threat Actions */}
            <div className="space-y-1.5 pt-1">
              <div className={`text-[11px] font-semibold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {isRtl ? 'إجراءات التهديد الفورية' : 'Instant Threat Actions'}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => quickBlockIp(selectedLog.sourceIp, `Suspicious event ${selectedLog.eventId}`)}
                  disabled={blockedIps.has(selectedLog.sourceIp)}
                  className={`px-2.5 py-1 text-xs rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer font-medium ${
                    blockedIps.has(selectedLog.sourceIp)
                      ? 'opacity-60 cursor-not-allowed bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  <span>
                    {blockedIps.has(selectedLog.sourceIp) 
                      ? (isRtl ? 'تم حظر IP' : 'IP Blocked') 
                      : (isRtl ? 'حظر عنوان IP' : 'Block IP')}
                  </span>
                </button>

                <button
                  onClick={() => quickIsolateHost(selectedLog.host, `Investigation on event ${selectedLog.eventId}`)}
                  disabled={isolatedHosts.has(selectedLog.host)}
                  className={`px-2.5 py-1 text-xs rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer font-medium ${
                    isolatedHosts.has(selectedLog.host)
                      ? 'opacity-60 cursor-not-allowed bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  <Server className="w-3 h-3" />
                  <span>
                    {isolatedHosts.has(selectedLog.host) 
                      ? (isRtl ? 'تم عزل الجهاز' : 'Host Isolated') 
                      : (isRtl ? 'عزل الجهاز' : 'Isolate Host')}
                  </span>
                </button>

                {(() => {
                  const correlatedIncident = incidents.find(i => i.correlatedLogIds.includes(selectedLog.id));
                  if (correlatedIncident) {
                    return (
                      <button
                        onClick={() => {
                          setSelectedIncident(correlatedIncident);
                          setPbiPage('incidents');
                        }}
                        className="px-2.5 py-1 text-xs rounded-[2px] border border-[#118dff] text-[#118dff] hover:bg-[#118dff]/10 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                      >
                        <ShieldAlert className="w-3 h-3" />
                        <span>{isRtl ? 'معاينة الحادث الأمني' : 'View Incident'}</span>
                      </button>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>

            {/* Raw JSON Payload */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {isRtl ? 'حمولة السجل الخام (JSON Payload)' : 'Raw JSON Telemetry Payload'}
                </span>
                <button
                  onClick={() => handleCopyJson(selectedLog)}
                  className={`text-[11px] font-mono flex items-center gap-1 cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {copiedId === selectedLog.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">{isRtl ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{isRtl ? 'نسخ' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>

              <pre className={`p-2.5 rounded-[2px] text-[10.5px] font-mono overflow-x-auto max-h-48 border ${
                isDark ? 'bg-[#050914] border-[#18284c] text-sky-400' : 'bg-slate-900 text-sky-300 border-slate-800'
              }`}>
                {JSON.stringify(selectedLog.rawPayload, null, 2)}
              </pre>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
};
