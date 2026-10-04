import React from 'react';
import { useSiem } from '../context/SiemContext';
import { ATTACK_SCENARIOS } from '../data/mockData';
import { AttackScenario } from '../types/siem';
import { THEMES } from '../types/theme';
import { X, Flame, ArrowRight, AlertTriangle } from './icons/SocIcons';

interface Props {
  onClose: () => void;
}

export const AttackSimulationModal: React.FC<Props> = ({ onClose }) => {
  const { simulateAttack, playbooks, theme, isRtl } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const handleLaunch = (scenario: AttackScenario) => {
    simulateAttack(scenario);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className={`w-full max-w-2xl rounded-[2px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border ${currentTheme.cardBgClass} ${currentTheme.borderClass}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3.5 border-b ${
          isDark ? 'border-[#18284c]' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[2px] bg-rose-500/10 text-rose-500">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">
                {isRtl ? 'تمرين محاكاة الهجمات السيبرانية المعادية' : 'Adversary Attack Simulation Drill'}
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {isRtl ? 'حقن أحداث قياس حية لاختبار قواعد الارتباط وسرعة استجابة محرك SOAR.' : 'Inject controlled live telemetry events to validate correlation and SOAR response.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-[2px] cursor-pointer transition-colors ${
              isDark ? 'hover:bg-[#0f1a34] text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scenarios List */}
        <div className="p-5 space-y-3.5 overflow-y-auto flex-1 font-sans">
          <div className={`p-3 rounded-[2px] border flex items-start gap-2.5 text-xs font-mono leading-relaxed ${
            isDark ? 'bg-amber-950/20 border-amber-800/40 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span>
              {isRtl 
                ? 'تشغيل التمرين يقوم بحقن سجلات هجومية مباشرة في محرك SIEM، ومطابقتها مع القواعد النشطة، وتوليد حادث أمني مع الإطلاق التلقائي لكتيب الاستجابة المحدد.' 
                : 'Triggering a drill injects attack logs into the SIEM, correlates with active rules, fires an incident, and auto-dispatches the mapped containment playbook.'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {ATTACK_SCENARIOS.map((scenario) => {
              const matchedPlaybook = playbooks.find(p => p.id === scenario.expectedPlaybookId);

              return (
                <div
                  key={scenario.id}
                  className={`p-3.5 rounded-[2px] border transition-all ${
                    isDark ? 'bg-[#080f1e]/80 border-[#18284c] hover:border-[#1e3466] hover:bg-[#0b162c]' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-rose-400">
                          {isRtl ? (scenario.nameAr || scenario.name) : scenario.name}
                        </span>
                        <span aria-hidden="true" className="opacity-40">·</span>
                        <span className="text-[10px] font-mono text-[#118dff] font-semibold">
                          <bdi dir="ltr">{scenario.mitreId}</bdi> ({isRtl ? (scenario.tacticAr || scenario.tactic) : scenario.tactic})
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {isRtl ? (scenario.descriptionAr || scenario.description) : scenario.description}
                      </p>
                      <div className={`text-[11px] font-mono pt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {isRtl ? 'الهدف:' : 'Target:'} <bdi dir="ltr">{scenario.targetHost}</bdi> · {isRtl ? 'المهاجم:' : 'Attacker:'} <bdi dir="ltr">{scenario.attackerIp}</bdi>
                        {matchedPlaybook && ` · ${isRtl ? 'الاستجابة الآلية:' : 'Auto-SOAR:'} ${isRtl ? (matchedPlaybook.nameAr || matchedPlaybook.name) : matchedPlaybook.name}`}
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunch(scenario)}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-[2px] bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                    >
                      <span>{isRtl ? 'تشغيل التمرين' : 'Launch Drill'}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
