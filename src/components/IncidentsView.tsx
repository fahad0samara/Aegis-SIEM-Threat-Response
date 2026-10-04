import React, { useState } from 'react';
import { useSiem } from '../context/SiemContext';
import { IncidentSeverity, IncidentStatus } from '../types/siem';
import { 
  Zap, 
  Lock, 
  Server, 
  UserX, 
  Plus, 
  Terminal,
  Clock,
  FileText
} from './icons/SocIcons';

import { THEMES } from '../types/theme';

type InvestigationTab = 'timeline' | 'iocs' | 'logs' | 'notes';

export const IncidentsView: React.FC = () => {
  const { 
    incidents, 
    selectedIncident, 
    setSelectedIncident, 
    updateIncidentStatus, 
    addIncidentNote,
    executePlaybook,
    playbooks,
    blockedIps,
    isolatedHosts,
    revokedUsers,
    quickBlockIp,
    quickIsolateHost,
    quickRevokeUser,
    logs,
    activeExecutingPlaybook,
    theme,
    isRtl
  } = useSiem();

  const currentTheme = THEMES[theme] || THEMES.dark;
  const [statusFilter, setStatusFilter] = useState<'ALL' | IncidentStatus>('ALL');
  const [investigationTab, setInvestigationTab] = useState<InvestigationTab>('timeline');
  const [mobilePane, setMobilePane] = useState<'queue' | 'workbench'>('queue');
  const [newNoteText, setNewNoteText] = useState('');

  const activeIncident = selectedIncident || (incidents.length > 0 ? incidents[0] : null);

  const filteredIncidents = incidents.filter(i => {
    if (statusFilter !== 'ALL' && i.status !== statusFilter) return false;
    return true;
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIncident && newNoteText.trim()) {
      addIncidentNote(activeIncident.id, newNoteText.trim());
      setNewNoteText('');
    }
  };

  const getSeverityBadge = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'CRITICAL': return <span className="text-rose-400 font-mono text-xs font-bold">{isRtl ? 'حرج للغاية' : 'CRITICAL'}</span>;
      case 'HIGH': return <span className="text-amber-400 font-mono text-xs font-semibold">{isRtl ? 'عالي الخطورة' : 'HIGH'}</span>;
      case 'MEDIUM': return <span className="text-yellow-400 font-mono text-xs font-medium">{isRtl ? 'متوسط' : 'MEDIUM'}</span>;
      case 'LOW': return <span className="text-[#118dff] font-mono text-xs font-medium">{isRtl ? 'منخفض' : 'LOW'}</span>;
    }
  };

  const getStatusLabel = (status: IncidentStatus) => {
    switch (status) {
      case 'NEW': return isRtl ? 'جديد' : 'NEW';
      case 'INVESTIGATING': return isRtl ? 'قيد التحقيق' : 'INVESTIGATING';
      case 'CONTAINED': return isRtl ? 'تم الاحتواء' : 'CONTAINED';
      case 'RESOLVED': return isRtl ? 'تم الحل' : 'RESOLVED';
    }
  };

  const matchedPlaybook = activeIncident 
    ? playbooks.find(p => p.id === activeIncident.recommendedPlaybookId)
    : null;

  const correlatedLogs = activeIncident
    ? logs.filter(l => activeIncident.correlatedLogIds.includes(l.id))
    : [];

  return (
    <div className={`p-4 max-w-[1720px] mx-auto space-y-4 ${currentTheme.textPrimaryClass}`}>
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2.5 border-b ${currentTheme.borderClass}`}>
        <div>
          <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
            <span>{isRtl ? 'منصة التحقيق في الحوادث الأمنية والاستجابة الآلية' : 'Incident Investigation & Response Workbench'}</span>
          </h1>
          <p className={`text-xs mt-0.5 ${currentTheme.textSecondaryClass}`}>
            {isRtl ? 'فرز التهديدات النشطة، فحص مسار الهجوم المتسلسل، وتشغيل كتيبات الاستجابة الآلية (SOAR).' : 'Triage active detections, inspect chronological attack chains, and dispatch automated SOAR playbooks.'}
          </p>
        </div>

        {/* Clean Enterprise Slicer Tabs */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className={`flex items-center rounded-[2px] p-0.5 font-mono text-[11px] border ${
            currentTheme.subtleBgClass
          } ${currentTheme.borderClass}`}>
            {(['ALL', 'NEW', 'INVESTIGATING', 'CONTAINED', 'RESOLVED'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-[2px] cursor-pointer transition-colors ${
                  statusFilter === st
                    ? 'bg-[#118dff] text-white font-semibold shadow-xs'
                    : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.hoverItemBgClass}`
                }`}
              >
                {st === 'ALL' ? (isRtl ? 'الكل' : 'ALL') : getStatusLabel(st)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher between Queue & Workbench */}
      <div className={`flex lg:hidden items-center p-1 rounded-[2px] border text-xs font-mono font-medium ${
        currentTheme.subtleBgClass
      } ${currentTheme.borderClass}`}>
        <button
          onClick={() => setMobilePane('queue')}
          className={`flex-1 py-1.5 px-3 rounded-[2px] cursor-pointer transition-colors text-center ${
            mobilePane === 'queue'
              ? 'bg-[#118dff] text-white font-bold shadow-xs'
              : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`
          }`}
        >
          {isRtl ? `قائمة الحوادث (${filteredIncidents.length})` : `Incidents Queue (${filteredIncidents.length})`}
        </button>
        <button
          onClick={() => setMobilePane('workbench')}
          className={`flex-1 py-1.5 px-3 rounded-[2px] cursor-pointer transition-colors text-center ${
            mobilePane === 'workbench'
              ? 'bg-[#118dff] text-white font-bold shadow-xs'
              : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`
          }`}
        >
          {isRtl ? `منصة التحقيق (${activeIncident?.id || '-'})` : `Investigation (${activeIncident?.id || '-'})`}
        </button>
      </div>

      {/* Main Dual-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: Incident List Queue (4 cols) */}
        <div className={`lg:col-span-4 space-y-2.5 ${mobilePane === 'queue' ? 'block' : 'hidden lg:block'}`}>
          <div className={`text-[11px] font-semibold uppercase tracking-wider px-1 ${
            currentTheme.textSecondaryClass
          }`}>
            {isRtl ? `الحوادث النشطة (${filteredIncidents.length})` : `Active Incidents (${filteredIncidents.length})`}
          </div>

          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {filteredIncidents.map(inc => {
              const isSelected = activeIncident?.id === inc.id;

              return (
                <div
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncident(inc);
                    setMobilePane('workbench');
                  }}
                  className={`p-3 rounded-[2px] border transition-all cursor-pointer ${
                    isSelected
                      ? `${currentTheme.activeItemBgClass} shadow-xs ring-1 ring-[#118dff]`
                      : `${currentTheme.cardBgClass} ${currentTheme.borderClass} hover:border-[#118dff]/50 shadow-2xs`
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1 font-mono">
                    <div className="flex items-center gap-2">
                      <bdi dir="ltr" className="font-bold text-[#118dff]">{inc.id}</bdi>
                      <span aria-hidden="true" className="opacity-40">·</span>
                      {getSeverityBadge(inc.severity)}
                    </div>
                    <span className={`text-[10.5px] tabular-nums font-mono ${currentTheme.textSecondaryClass}`}>
                      {new Date(inc.timestamp).toLocaleTimeString(isRtl ? 'ar-SA' : undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold line-clamp-2 leading-snug">
                    {isRtl ? (inc.titleAr || inc.title) : inc.title}
                  </h3>

                  <div className={`flex items-center gap-2 pt-2 text-[10.5px] font-mono ${currentTheme.textSecondaryClass}`}>
                    <span>{inc.mitreTechnique}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{inc.affectedHost}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#118dff] font-bold">{inc.confidenceScore}%</span>
                  </div>

                  <div className={`flex items-center justify-between pt-2 border-t mt-2 text-[11px] ${currentTheme.borderClass}`}>
                    <span className={`font-mono text-[10.5px] font-semibold ${
                      inc.status === 'CONTAINED' ? 'text-emerald-400' :
                      inc.status === 'INVESTIGATING' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {getStatusLabel(inc.status)}
                    </span>
                    <span className={`text-[10px] truncate max-w-[120px] ${currentTheme.textSecondaryClass}`}>
                      {isRtl ? (inc.assignedToAr || inc.assignedTo || 'غير معين') : (inc.assignedTo || 'Unassigned')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Investigation Workbench (8 cols) */}
        {activeIncident ? (
          <div className={`lg:col-span-8 rounded-[2px] border p-4 sm:p-5 space-y-4 ${
            currentTheme.cardBgClass
          } ${currentTheme.borderClass} shadow-xs ${mobilePane === 'workbench' ? 'block' : 'hidden lg:block'}`}>
            {/* Mobile Back Button */}
            <div className={`lg:hidden pb-2 border-b ${currentTheme.borderClass}`}>
              <button
                onClick={() => setMobilePane('queue')}
                className="text-xs text-[#118dff] font-mono hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isRtl ? '← العودة لقائمة الحوادث' : '← Back to Incident Queue'}</span>
              </button>
            </div>

            {/* Header: Title, Status and Action Controls */}
            <div className={`space-y-2 pb-3 border-b ${currentTheme.borderClass}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <bdi dir="ltr" className="font-mono text-sm font-bold text-[#118dff]">
                    {activeIncident.id}
                  </bdi>
                  <span aria-hidden="true" className="opacity-40">·</span>
                  {getSeverityBadge(activeIncident.severity)}
                  <span aria-hidden="true" className="opacity-40">·</span>
                  <span className={`text-xs font-mono tabular-nums ${currentTheme.textSecondaryClass}`}>
                    {isRtl ? 'تم الرصد:' : 'Detected:'} {new Date(activeIncident.timestamp).toLocaleTimeString(isRtl ? 'ar-SA' : undefined)}
                  </span>
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${currentTheme.textSecondaryClass}`}>
                    {isRtl ? 'تغيير الحالة:' : 'Status:'}
                  </span>
                  <select
                    value={activeIncident.status}
                    onChange={(e) => updateIncidentStatus(activeIncident.id, e.target.value as IncidentStatus)}
                    className={`py-1 px-2.5 text-xs rounded-[2px] font-mono border focus:outline-hidden focus:border-[#118dff] cursor-pointer ${
                      currentTheme.inputBgClass
                    }`}
                  >
                    <option value="NEW">{isRtl ? 'جديد (NEW)' : 'NEW'}</option>
                    <option value="INVESTIGATING">{isRtl ? 'قيد التحقيق (INVESTIGATING)' : 'INVESTIGATING'}</option>
                    <option value="CONTAINED">{isRtl ? 'تم الاحتواء (CONTAINED)' : 'CONTAINED'}</option>
                    <option value="RESOLVED">{isRtl ? 'تم الحل (RESOLVED)' : 'RESOLVED'}</option>
                  </select>
                </div>
              </div>

              <h2 className="text-base font-bold">
                {isRtl ? (activeIncident.titleAr || activeIncident.title) : activeIncident.title}
              </h2>

              <p className={`text-xs leading-relaxed ${currentTheme.textSecondaryClass}`}>
                {isRtl ? (activeIncident.summaryAr || activeIncident.summary) : activeIncident.summary}
              </p>
            </div>

            {/* Active Playbook Execution */}
            {activeExecutingPlaybook && activeExecutingPlaybook.playbookId === activeIncident.recommendedPlaybookId && (
              <div className={`p-3.5 rounded-[2px] border space-y-2 ${
                currentTheme.activeItemBgClass
              } ${currentTheme.borderClass}`}>
                <div className="flex items-center justify-between text-xs font-semibold text-[#118dff]">
                  <span className="flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span>{isRtl ? 'جاري تنفيذ كتيب الاستجابة SOAR:' : 'Executing SOAR Playbook:'} {isRtl ? (matchedPlaybook?.nameAr || matchedPlaybook?.name) : matchedPlaybook?.name}</span>
                  </span>
                  <span className="font-mono">
                    {isRtl 
                      ? `الخطوة ${activeExecutingPlaybook.currentStepIndex + 1} من ${matchedPlaybook?.steps.length}` 
                      : `Step ${activeExecutingPlaybook.currentStepIndex + 1} of ${matchedPlaybook?.steps.length}`}
                  </span>
                </div>
                <div className={`p-2.5 rounded-[2px] font-mono text-[11px] max-h-24 overflow-y-auto space-y-1 ${
                  currentTheme.mutedBgClass
                } ${currentTheme.borderClass} text-sky-400`}>
                  {activeExecutingPlaybook.logs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Autonomous Response Recommendation Banner */}
            <div className={`p-3.5 rounded-[2px] border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              currentTheme.subtleBgClass
            } ${currentTheme.borderClass}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#118dff]">
                  <Zap className="w-4 h-4" />
                  <span>{isRtl ? 'كتيب الاستجابة الموصى به (SOAR)' : 'Recommended SOAR Playbook'}</span>
                </div>
                <div className="text-xs font-semibold">
                  {matchedPlaybook ? (isRtl ? (matchedPlaybook.nameAr || matchedPlaybook.name) : matchedPlaybook.name) : activeIncident.recommendedPlaybookId}
                </div>
                <p className={`text-[11px] max-w-xl ${currentTheme.textSecondaryClass}`}>
                  {isRtl ? (matchedPlaybook?.descriptionAr || matchedPlaybook?.description) : matchedPlaybook?.description}
                </p>
              </div>

              <button
                onClick={() => executePlaybook(activeIncident.recommendedPlaybookId, activeIncident.id, false)}
                disabled={activeIncident.status === 'CONTAINED' || activeIncident.status === 'RESOLVED'}
                className={`px-4 py-2 text-xs font-semibold rounded-[2px] transition-colors flex items-center gap-2 shadow-xs cursor-pointer whitespace-nowrap ${
                  activeIncident.status === 'CONTAINED' || activeIncident.status === 'RESOLVED'
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                    : 'bg-[#118dff] hover:bg-[#0078d4] text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>
                  {activeIncident.status === 'CONTAINED' 
                    ? (isRtl ? 'اكتمل تنفيذ الكتيب (تم الاحتواء)' : 'Playbook Completed (Contained)') 
                    : (isRtl ? 'تشغيل كتيب الاستجابة الآن' : 'Execute Playbook Now')}
                </span>
              </button>
            </div>

            {/* Investigation Workbench Tabs */}
            <div className={`flex items-center gap-1 border-b pb-px ${currentTheme.borderClass}`}>
              {[
                { 
                  id: 'timeline' as const, 
                  label: isRtl ? 'التسلسل الزمني للهجوم' : 'Attack Chronology', 
                  icon: <Clock className="w-3.5 h-3.5" />, 
                  badge: activeIncident.timeline.length 
                },
                { 
                  id: 'iocs' as const, 
                  label: isRtl ? 'مؤشرات الاختراق والأصول' : 'IOCs & Quarantine', 
                  icon: <Lock className="w-3.5 h-3.5" />,
                  badge: 3
                },
                { 
                  id: 'logs' as const, 
                  label: isRtl ? 'سجلات القياس المرتبطة' : 'Correlated Telemetry Logs', 
                  icon: <Terminal className="w-3.5 h-3.5" />, 
                  badge: correlatedLogs.length 
                },
                { 
                  id: 'notes' as const, 
                  label: isRtl ? 'ملاحظات التحقيق والتدقيق' : 'Analyst Triage & Notes', 
                  icon: <FileText className="w-3.5 h-3.5" />, 
                  badge: activeIncident.notes.length 
                }
              ].map(tab => {
                const isTabActive = investigationTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setInvestigationTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium cursor-pointer transition-colors border-b-2 -mb-px ${
                      isTabActive
                        ? `${currentTheme.activeItemBgClass} border-b-[#118dff] font-semibold`
                        : `border-transparent ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span className={`text-[10px] font-mono px-1 rounded-[2px] font-bold ${
                        isTabActive
                          ? 'bg-[#118dff] text-white'
                          : `${currentTheme.subtleBgClass} ${currentTheme.textSecondaryClass} border ${currentTheme.borderClass}`
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Attack Chain Timeline */}
            {investigationTab === 'timeline' && (
              <div className="space-y-3 pt-1">
                <div className={`space-y-3 relative ${
                  isRtl 
                    ? 'pr-6 before:absolute before:right-2 before:top-2 before:bottom-2 before:w-0.5' 
                    : 'pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5'
                } before:${currentTheme.borderClass.replace('border-', 'bg-')}`}>
                  {activeIncident.timeline.map((evt) => (
                    <div key={evt.id} className="relative space-y-1">
                      <span className={`absolute ${isRtl ? '-right-6' : '-left-6'} top-1 w-2.5 h-2.5 rounded-full bg-[#118dff] ring-2 ring-transparent`} />
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className={currentTheme.textSecondaryClass}>
                          {new Date(evt.timestamp).toLocaleTimeString(isRtl ? 'ar-SA' : undefined)}
                        </span>
                        <span aria-hidden="true" className="opacity-40">·</span>
                        <span className="font-semibold text-[#118dff]">{isRtl ? (evt.titleAr || evt.title) : evt.title}</span>
                        <span aria-hidden="true" className="opacity-40">·</span>
                        <span className={`text-[10.5px] font-semibold ${currentTheme.textSecondaryClass}`}>[{evt.phase}]</span>
                      </div>
                      <p className={`text-xs ${currentTheme.textPrimaryClass}`}>
                        {isRtl ? (evt.descriptionAr || evt.description) : evt.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Indicators of Compromise (IOCs) */}
            {investigationTab === 'iocs' && (
              <div className="space-y-3 pt-1">
                <div className={`divide-y rounded-[2px] border ${
                  currentTheme.subtleBgClass
                } ${currentTheme.borderClass} divide-inherit`}>
                  {/* Attacker IP */}
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className={currentTheme.textSecondaryClass}>
                          {isRtl ? 'عنوان المهاجم:' : 'Adversary IP:'}
                        </span>
                        <bdi dir="ltr" className="text-rose-400 font-bold">{activeIncident.attackerIp}</bdi>
                        {blockedIps.has(activeIncident.attackerIp) && (
                          <span className="text-emerald-400 font-bold text-[10.5px]">· {isRtl ? 'محظور' : 'BLOCKED'}</span>
                        )}
                      </div>
                      {activeIncident.attackerGeo && (
                        <div className={`text-[11px] ${currentTheme.textSecondaryClass}`}>
                          {isRtl ? 'الموقع الجغرافي:' : 'Location:'} {activeIncident.attackerGeo.city}, {activeIncident.attackerGeo.country}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => quickBlockIp(activeIncident.attackerIp, `Incident ${activeIncident.id} adversary IOC`)}
                      disabled={blockedIps.has(activeIncident.attackerIp)}
                      className={`px-3 py-1.5 text-xs font-mono rounded-[2px] border transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                        blockedIps.has(activeIncident.attackerIp)
                          ? 'opacity-50 cursor-not-allowed'
                          : `${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.textPrimaryClass} hover:border-[#118dff]/60 shadow-2xs`
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5 text-rose-500" />
                      <span>
                        {blockedIps.has(activeIncident.attackerIp) 
                          ? (isRtl ? 'الحظر نشط' : 'Quarantine Active') 
                          : (isRtl ? 'حظر عنوان IP' : 'Block Ingress IP')}
                      </span>
                    </button>
                  </div>

                  {/* Target Host */}
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className={currentTheme.textSecondaryClass}>
                          {isRtl ? 'الجهاز المستهدف:' : 'Target Host:'}
                        </span>
                        <bdi dir="ltr" className={`font-bold ${currentTheme.textPrimaryClass}`}>{activeIncident.affectedHost}</bdi>
                        {isolatedHosts.has(activeIncident.affectedHost) && (
                          <span className="text-emerald-400 font-bold text-[10.5px]">· {isRtl ? 'معزول' : 'ISOLATED'}</span>
                        )}
                      </div>
                      <div className={`text-[11px] ${currentTheme.textSecondaryClass}`}>
                        {isRtl ? 'معرف وكيل الأمان:' : 'Endpoint Agent ID:'} contoso-edr-{activeIncident.affectedHost.toLowerCase()}
                      </div>
                    </div>

                    <button
                      onClick={() => quickIsolateHost(activeIncident.affectedHost, `Incident ${activeIncident.id} host quarantine`)}
                      disabled={isolatedHosts.has(activeIncident.affectedHost)}
                      className={`px-3 py-1.5 text-xs font-mono rounded-[2px] border transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                        isolatedHosts.has(activeIncident.affectedHost)
                          ? 'opacity-50 cursor-not-allowed'
                          : `${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.textPrimaryClass} hover:border-[#118dff]/60 shadow-2xs`
                      }`}
                    >
                      <Server className="w-3.5 h-3.5 text-amber-500" />
                      <span>
                        {isolatedHosts.has(activeIncident.affectedHost) 
                          ? (isRtl ? 'تم عزل الجهاز' : 'Host Isolated') 
                          : (isRtl ? 'عزل الجهاز المستهدف' : 'Isolate Endpoint')}
                      </span>
                    </button>
                  </div>

                  {/* Compromised Identity */}
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className={currentTheme.textSecondaryClass}>
                          {isRtl ? 'الهوية المستهدفة:' : 'Identity:'}
                        </span>
                        <bdi dir="ltr" className="text-[#118dff] font-bold">{activeIncident.affectedUser}</bdi>
                        {revokedUsers.has(activeIncident.affectedUser) && (
                          <span className="text-emerald-400 font-bold text-[10.5px]">· {isRtl ? 'تم الإلغاء' : 'REVOKED'}</span>
                        )}
                      </div>
                      <div className={`text-[11px] ${currentTheme.textSecondaryClass}`}>
                        {isRtl ? 'حساب الهوية السحابية / الدليل النشط (IAM)' : 'Cloud Identity / Active Directory Principal'}
                      </div>
                    </div>

                    <button
                      onClick={() => quickRevokeUser(activeIncident.affectedUser, `Incident ${activeIncident.id} user credential revoke`)}
                      disabled={revokedUsers.has(activeIncident.affectedUser)}
                      className={`px-3 py-1.5 text-xs font-mono rounded-[2px] border transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                        revokedUsers.has(activeIncident.affectedUser)
                          ? 'opacity-50 cursor-not-allowed'
                          : `${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.textPrimaryClass} hover:border-[#118dff]/60 shadow-2xs`
                      }`}
                    >
                      <UserX className="w-3.5 h-3.5 text-[#118dff]" />
                      <span>
                        {revokedUsers.has(activeIncident.affectedUser) 
                          ? (isRtl ? 'تم إلغاء الجلسات' : 'Tokens Revoked') 
                          : (isRtl ? 'إلغاء جلسات IAM' : 'Revoke IAM Tokens')}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Correlated Telemetry Logs */}
            {investigationTab === 'logs' && (
              <div className="space-y-2.5 pt-1">
                {correlatedLogs.length === 0 ? (
                  <div className={`p-8 text-center text-xs rounded-[2px] border ${
                    currentTheme.subtleBgClass
                  } ${currentTheme.borderClass} ${currentTheme.textSecondaryClass}`}>
                    {isRtl ? 'لا توجد سجلات قياس مرتبطة مباشرة بهذا الحادث.' : 'No correlated telemetry logs found for this case.'}
                  </div>
                ) : (
                  <div className={`rounded-[2px] border overflow-hidden font-mono text-[11px] ${
                    currentTheme.subtleBgClass
                  } ${currentTheme.borderClass}`}>
                    {correlatedLogs.map(l => (
                      <div key={l.id} className={`p-3 border-b last:border-b-0 space-y-1 ${currentTheme.borderClass}`}>
                        <div className={`flex items-center justify-between ${currentTheme.textSecondaryClass}`}>
                          <div className="flex items-center gap-2">
                            <span className="text-rose-400 font-bold">{l.level}</span>
                            <span aria-hidden="true" className="opacity-40">·</span>
                            <span className="font-semibold">{l.source}</span>
                          </div>
                          <span className="tabular-nums font-mono text-[10.5px]">{new Date(l.timestamp).toLocaleTimeString(isRtl ? 'ar-SA' : undefined)}</span>
                        </div>
                        <div className="font-sans font-medium">{isRtl ? (l.eventNameAr || l.eventName) : l.eventName}</div>
                        <div className={`text-[10.5px] ${currentTheme.textSecondaryClass}`}>
                          {isRtl ? 'التوقيع السلوكي:' : 'Signature:'} {isRtl ? (l.signatureAr || l.signature || 'نمط ارتباط إرشادي') : (l.signature || 'Heuristic Behavioral Trigger')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Analyst Investigation Notes */}
            {investigationTab === 'notes' && (
              <div className="space-y-3 pt-1">
                <div className="space-y-2">
                  {activeIncident.notes.map((note, index) => {
                    const localizedNote = isRtl && activeIncident.notesAr && activeIncident.notesAr[index]
                      ? activeIncident.notesAr[index]
                      : note;
                    return (
                      <div key={index} className={`p-3 rounded-[2px] border text-xs leading-relaxed ${
                        currentTheme.subtleBgClass
                      } ${currentTheme.borderClass} ${currentTheme.textPrimaryClass} shadow-2xs`}>
                        {localizedNote}
                      </div>
                    );
                  })}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder={isRtl ? 'إضافة ملاحظة فنية أو إجراء تتبعي...' : 'Append triage observation...'}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className={`flex-1 py-1.5 px-3 text-xs rounded-[2px] border focus:outline-hidden focus:border-[#118dff] ${
                      currentTheme.inputBgClass
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#118dff] hover:bg-[#0078d4] rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'إضافة الملاحظة' : 'Add Note'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div className={`lg:col-span-8 rounded-[2px] border p-12 text-center text-xs ${
            currentTheme.cardBgClass
          } ${currentTheme.borderClass} ${currentTheme.textSecondaryClass}`}>
            {isRtl ? 'لم يتم تحديد أي حادث. يرجى اختيار حادث من قائمة الانتظار لعرض التحليل الجنائي.' : 'No incident selected. Select an incident from the queue to inspect forensics.'}
          </div>
        )}
      </div>
    </div>
  );
};
