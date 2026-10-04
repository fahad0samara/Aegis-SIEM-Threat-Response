import React, { useState } from 'react';
import { useSiem } from '../context/SiemContext';
import { Playbook, PlaybookStep } from '../types/siem';
import { THEMES } from '../types/theme';
import { 
  Zap, 
  Terminal, 
  Play, 
  RotateCcw, 
  Lock, 
  Server, 
  UserX
} from './icons/SocIcons';

export const PlaybooksView: React.FC = () => {
  const { 
    playbooks, 
    auditRecords, 
    executePlaybook, 
    rollbackAction, 
    activeExecutingPlaybook,
    theme,
    isRtl
  } = useSiem();

  const currentTheme = THEMES[theme] || THEMES.dark;
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>(playbooks[0]?.id || '');
  const activePlaybook = playbooks.find(p => p.id === selectedPlaybookId) || playbooks[0];

  const handleRunPlaybook = async (playbook: Playbook) => {
    await executePlaybook(playbook.id, undefined, false);
  };

  const getActionIcon = (actionType: PlaybookStep['actionType']) => {
    switch (actionType) {
      case 'BLOCK_IP':
      case 'ENFORCE_FIREWALL_RULE':
        return <Lock className="w-3.5 h-3.5 text-rose-500" />;
      case 'ISOLATE_HOST':
      case 'KILL_PROCESS':
        return <Server className="w-3.5 h-3.5 text-amber-500" />;
      case 'REVOKE_USER_TOKENS':
      case 'ROTATE_CREDENTIALS':
        return <UserX className="w-3.5 h-3.5 text-[#118dff]" />;
      default:
        return <Zap className="w-3.5 h-3.5 text-[#118dff]" />;
    }
  };

  return (
    <div className={`p-4 max-w-[1720px] mx-auto space-y-4 ${currentTheme.textPrimaryClass}`}>
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b ${currentTheme.borderClass}`}>
        <div>
          <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
            <span>{isRtl ? 'محرك كتيبات الاستجابة الآلية (SOAR)' : 'Automated SOAR Playbooks Engine'}</span>
          </h1>
          <p className={`text-xs mt-0.5 ${currentTheme.textSecondaryClass}`}>
            {isRtl 
              ? 'دليل الاستجابة الذاتية مع خطوات التخفيف الآلية وإمكانية التراجع عن الحظر بنقرة واحدة.' 
              : 'Self-healing response catalog with automated mitigation steps and 1-click containment rollback.'}
          </p>
        </div>
      </div>

      {/* Main Dual-Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Playbook Catalog (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className={`text-[11px] font-semibold uppercase tracking-wider px-1 ${currentTheme.textSecondaryClass}`}>
            {isRtl ? `كتيبات الاستجابة (${playbooks.length})` : `Playbook Catalog (${playbooks.length})`}
          </div>

          <div className="space-y-2">
            {playbooks.map(pb => {
              const isSelected = activePlaybook?.id === pb.id;
              const isRunning = activeExecutingPlaybook?.playbookId === pb.id;

              return (
                <div
                  key={pb.id}
                  onClick={() => setSelectedPlaybookId(pb.id)}
                  className={`p-3 rounded-[2px] border transition-all cursor-pointer ${
                    isSelected
                      ? `${currentTheme.activeItemBgClass} shadow-xs ring-1 ring-[#118dff]`
                      : `${currentTheme.cardBgClass} ${currentTheme.borderClass} hover:border-[#118dff]/50 shadow-2xs`
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1 font-mono">
                    <bdi dir="ltr" className="font-semibold text-[#118dff]">
                      {pb.id}
                    </bdi>
                    <span className={`text-[11px] font-medium ${
                      pb.triggerType.startsWith('AUTOMATIC') 
                        ? 'text-emerald-400 font-semibold' 
                        : currentTheme.textSecondaryClass
                    }`}>
                      · {pb.triggerType.startsWith('AUTOMATIC') ? (isRtl ? 'آلي فوري' : 'AUTOMATIC') : (isRtl ? 'فرز يدوي' : 'MANUAL')}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold leading-snug">
                    {isRtl ? (pb.nameAr || pb.name) : pb.name}
                  </h3>

                  <p className={`text-[11px] line-clamp-2 mt-1 leading-relaxed ${currentTheme.textSecondaryClass}`}>
                    {isRtl ? (pb.descriptionAr || pb.description) : pb.description}
                  </p>

                  <div className={`flex items-center justify-between pt-2 border-t mt-2 text-[10.5px] font-mono ${currentTheme.borderClass} ${currentTheme.textSecondaryClass}`}>
                    <span>{pb.steps.length} {isRtl ? 'إجراءات مؤتمتة' : 'Automated Actions'}</span>
                    {isRunning && (
                      <span className="text-[#118dff] font-bold animate-pulse">{isRtl ? 'قيد التنفيذ...' : 'Running...'}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Playbook Detailed Steps & Runner (8 cols) */}
        {activePlaybook && (
          <div className="lg:col-span-8 space-y-4">
            <div className={`rounded-[2px] border p-4 space-y-4 ${
              currentTheme.cardBgClass
            } ${currentTheme.borderClass} shadow-xs`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${currentTheme.borderClass}`}>
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-[#118dff]">
                    <bdi dir="ltr">{activePlaybook.id}</bdi>
                    <span aria-hidden="true">·</span>
                    <span>{activePlaybook.triggerType}</span>
                  </div>
                  <h2 className="text-base font-bold font-sans mt-0.5">
                    {isRtl ? (activePlaybook.nameAr || activePlaybook.name) : activePlaybook.name}
                  </h2>
                  <p className={`text-xs mt-1 leading-relaxed ${currentTheme.textSecondaryClass}`}>
                    {isRtl ? (activePlaybook.descriptionAr || activePlaybook.description) : activePlaybook.description}
                  </p>
                </div>

                <button
                  onClick={() => handleRunPlaybook(activePlaybook)}
                  disabled={activeExecutingPlaybook !== null}
                  className={`px-4 py-2 text-xs font-semibold rounded-[2px] transition-colors flex items-center gap-2 shadow-xs cursor-pointer whitespace-nowrap ${
                    activeExecutingPlaybook !== null
                      ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30 cursor-not-allowed'
                      : 'bg-[#118dff] hover:bg-[#0078d4] text-white'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تشغيل تمرين الكتيب' : 'Run Playbook Drill'}</span>
                </button>
              </div>

              {/* Execution Console Output */}
              {activeExecutingPlaybook && activeExecutingPlaybook.playbookId === activePlaybook.id && (
                <div className={`p-3 rounded-[2px] border space-y-2 ${
                  currentTheme.activeItemBgClass
                } ${currentTheme.borderClass}`}>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#118dff]">
                    <span className="flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      {isRtl ? 'مسار تنفيذ SOAR المباشر' : 'Live SOAR Execution Pipeline'}
                    </span>
                    <span className="font-mono">
                      {isRtl 
                        ? `الخطوة ${activeExecutingPlaybook.currentStepIndex + 1} من ${activePlaybook.steps.length}`
                        : `Step ${activeExecutingPlaybook.currentStepIndex + 1} of ${activePlaybook.steps.length}`}
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-[2px] font-mono text-[11px] max-h-36 overflow-y-auto space-y-1 ${
                    currentTheme.mutedBgClass
                  } ${currentTheme.borderClass} text-sky-400`}>
                    {activeExecutingPlaybook.logs.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ordered Playbook Step Pipeline */}
              <div className="space-y-2.5">
                <h3 className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.textSecondaryClass}`}>
                  {isRtl ? 'خطوات التسلسل المنظم' : 'Orchestrated Sequence Steps'}
                </h3>

                <div className={`divide-y rounded-[2px] border ${
                  currentTheme.subtleBgClass
                } ${currentTheme.borderClass} divide-inherit`}>
                  {activePlaybook.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="p-3 flex items-start gap-3"
                    >
                      <div className="mt-0.5 shrink-0 text-[#118dff]">
                        {getActionIcon(step.actionType)}
                      </div>

                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold font-sans">
                            {index + 1}. {isRtl ? (step.nameAr || step.name) : step.name}
                          </span>
                          <span className="font-mono text-[10.5px] text-[#118dff] font-semibold">{step.actionType}</span>
                        </div>
                        <p className={`text-xs ${currentTheme.textSecondaryClass}`}>
                          {isRtl ? (step.targetDescriptionAr || step.targetDescription) : step.targetDescription}
                        </p>
                        <div className={`text-[10.5px] font-mono pt-0.5 ${currentTheme.textSecondaryClass}`}>
                          {isRtl 
                            ? `المهلة: ${step.timeoutSeconds}ث · الحالة: ${step.status === 'COMPLETED' ? 'مكتمل' : 'جاهز'}`
                            : `Timeout: ${step.timeoutSeconds}s · Status: ${step.status}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Audit Log & 1-Click Rollback Station */}
            <div className={`rounded-[2px] border p-4 space-y-3 ${
              currentTheme.cardBgClass
            } ${currentTheme.borderClass} shadow-xs`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.textSecondaryClass}`}>
                  {isRtl ? `سجل تدقيق الاستجابة والتراجع (${auditRecords.length})` : `Immutable Response Audit Log & Rollback (${auditRecords.length})`}
                </h3>
              </div>

              <div className={`divide-y text-xs font-mono max-h-56 overflow-y-auto ${currentTheme.borderClass}`}>
                {auditRecords.map(rec => (
                  <div key={rec.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="space-y-0.5 truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400">✓ {isRtl ? (rec.playbookNameAr || rec.playbookName) : rec.playbookName}</span>
                        <span className={`text-[10px] tabular-nums ${currentTheme.textSecondaryClass}`}>
                          {new Date(rec.timestamp).toLocaleTimeString(isRtl ? 'ar-SA' : undefined)}
                        </span>
                      </div>
                      <div className={`text-[11px] truncate ${currentTheme.textSecondaryClass}`}>
                        {isRtl 
                          ? `الإجراءات: ${rec.actionsSummaryAr || rec.actionsSummary} · المنفذ: ${rec.executedBy === 'AUTOMATED_ENGINE' ? 'المحرك الآلي' : 'المحلل الأمني'}`
                          : `Actions: ${rec.actionsSummary} · Dispatcher: ${rec.executedBy}`}
                      </div>
                    </div>

                    {rec.canRollback && (
                      <button
                        onClick={() => rollbackAction(rec.id)}
                        disabled={rec.rolledBack}
                        className={`px-2.5 py-1 text-[11px] rounded-[2px] border font-mono transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                          rec.rolledBack
                            ? 'opacity-40 cursor-not-allowed'
                            : `${currentTheme.subtleBgClass} ${currentTheme.borderClass} text-amber-500 hover:border-amber-400`
                        }`}
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{rec.rolledBack ? (isRtl ? 'تم التراجع' : 'Rolled Back') : (isRtl ? 'تراجع' : 'Rollback')}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
