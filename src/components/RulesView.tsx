import React, { useState } from 'react';
import { useSiem } from '../context/SiemContext';
import { IncidentSeverity } from '../types/siem';
import { 
  Plus, 
  X, 
  Code,
  Zap
} from './icons/SocIcons';
import { THEMES } from '../types/theme';

export const RulesView: React.FC = () => {
  const { rules, toggleRule, addRule, playbooks, theme, isRtl } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  // New Rule Form State
  const [name, setName] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('HIGH');
  const [mitreTechnique, setMitreTechnique] = useState('T1059.001');
  const [mitreTactic, setMitreTactic] = useState('Execution');
  const [query, setQuery] = useState('source:CrowdStrike AND eventName:*PowerShell* AND command_line:*-enc*');
  const [threshold, setThreshold] = useState(1);
  const [timeWindowSeconds, setTimeWindowSeconds] = useState(60);
  const [automatedPlaybookId, setAutomatedPlaybookId] = useState(playbooks[0]?.id || '');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('PowerShell, Execution, Obfuscation');

  const filteredRules = rules.filter(r => {
    if (selectedSeverity !== 'ALL' && r.severity !== selectedSeverity) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        (r.nameAr && r.nameAr.toLowerCase().includes(q)) ||
        r.mitreTechnique.toLowerCase().includes(q) ||
        r.query.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !query.trim()) return;

    addRule({
      name: name.trim(),
      severity,
      mitreTechnique: mitreTechnique.trim(),
      mitreTactic: mitreTactic.trim(),
      query: query.trim(),
      threshold,
      timeWindowSeconds,
      enabled: true,
      automatedPlaybookId: automatedPlaybookId || undefined,
      description: description.trim() || 'Custom SOC detection signature created by administrator.',
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setIsModalOpen(false);
    setName('');
    setDescription('');
  };

  const getSeverityBadge = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'CRITICAL': return <span className="text-rose-400 font-mono text-xs font-bold">{isRtl ? 'حرج' : 'CRITICAL'}</span>;
      case 'HIGH': return <span className="text-amber-400 font-mono text-xs font-semibold">{isRtl ? 'عالي' : 'HIGH'}</span>;
      case 'MEDIUM': return <span className="text-yellow-400 font-mono text-xs">{isRtl ? 'متوسط' : 'MEDIUM'}</span>;
      case 'LOW': return <span className="text-sky-400 font-mono text-xs">{isRtl ? 'منخفض' : 'LOW'}</span>;
    }
  };

  const getSeverityLabel = (sev: string) => {
    if (!isRtl) return sev;
    switch (sev) {
      case 'ALL': return 'الكل';
      case 'CRITICAL': return 'حرج';
      case 'HIGH': return 'عالي';
      case 'MEDIUM': return 'متوسط';
      case 'LOW': return 'منخفض';
      default: return sev;
    }
  };

  return (
    <div className={`p-4 max-w-[1720px] mx-auto space-y-4 ${currentTheme.textPrimaryClass}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b ${currentTheme.borderClass}`}>
        <div>
          <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
            <span>{isRtl ? 'قواعد الارتباط وكشف التهديدات السيبرانية (SIEM Rules)' : 'SIEM Correlation & Threat Detection Rules'}</span>
          </h1>
          <p className={`text-xs mt-0.5 ${currentTheme.textSecondaryClass}`}>
            {isRtl 
              ? 'أنماط سلوكية متوافقة مع معايير Sigma، وعتبات الانحراف الشاذ، وربط الاستجابة الآلية SOAR.' 
              : 'Sigma-compatible behavioural patterns, anomaly thresholds, and SOAR response bindings.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#118dff] hover:bg-[#0078d4] rounded-[2px] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isRtl ? 'إنشاء قاعدة كشف جديدة' : 'New Detection Rule'}</span>
        </button>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <input
          type="text"
          placeholder={isRtl ? 'تصفية القواعد حسب الاسم، معرف التقنية، أو الوسم...' : 'Filter detection rules by name, technique ID, or tag...'}
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className={`w-full sm:w-96 py-1.5 px-3 text-xs rounded-[2px] font-mono border focus:outline-hidden focus:border-[#118dff] ${currentTheme.inputBgClass}`}
        />

        <div className={`flex items-center gap-1 p-0.5 rounded-[2px] border text-[11px] font-mono ${currentTheme.subtleBgClass} ${currentTheme.borderClass}`}>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2.5 py-1 rounded-[2px] cursor-pointer transition-colors ${
                selectedSeverity === sev
                  ? 'bg-[#118dff] text-white font-medium'
                  : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} ${currentTheme.tableRowHoverClass}`
              }`}
            >
              {getSeverityLabel(sev)}
            </button>
          ))}
        </div>
      </div>

      {/* Rule Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map(rule => (
          <div
            key={rule.id}
            className={`p-4 rounded-[2px] border transition-all flex flex-col justify-between gap-3 ${
              rule.enabled 
                ? `${currentTheme.cardBgClass} ${currentTheme.borderClass} hover:border-[#118dff]/50 shadow-xs` 
                : `${currentTheme.subtleBgClass} ${currentTheme.borderClass} opacity-60`
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(rule.severity)}
                    <span aria-hidden="true" className="opacity-40">·</span>
                    <bdi dir="ltr" className="font-mono text-xs text-[#118dff] font-semibold">
                      {rule.mitreTechnique}
                    </bdi>
                    <span aria-hidden="true" className="opacity-40">·</span>
                    <span className={`text-xs font-mono ${currentTheme.textSecondaryClass}`}>
                      {isRtl ? (rule.mitreTacticAr || rule.mitreTactic) : rule.mitreTactic}
                    </span>
                  </div>
                  <h3 className={`text-sm font-semibold ${currentTheme.textPrimaryClass}`}>
                    {isRtl ? (rule.nameAr || rule.name) : rule.name}
                  </h3>
                </div>

                {/* Enable / Disable switch */}
                <button
                  onClick={() => toggleRule(rule.id)}
                  title={rule.enabled ? (isRtl ? 'تعطيل القاعدة' : 'Click to Disable Rule') : (isRtl ? 'تفعيل القاعدة' : 'Click to Enable Rule')}
                  className="cursor-pointer"
                >
                  {rule.enabled ? (
                    <span className="text-emerald-400 font-mono text-xs flex items-center gap-1 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {isRtl ? 'نشط' : 'ACTIVE'}
                    </span>
                  ) : (
                    <span className="text-slate-500 font-mono text-xs flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-600" />
                      {isRtl ? 'معطل' : 'OFF'}
                    </span>
                  )}
                </button>
              </div>

              <p className={`text-xs leading-relaxed ${currentTheme.textSecondaryClass}`}>
                {isRtl ? (rule.descriptionAr || rule.description) : rule.description}
              </p>

              {/* Code Query Block */}
              <div className={`p-2.5 rounded-[2px] font-mono text-[11px] overflow-x-auto border ${
                isDark ? 'bg-[#050914] border-[#18284c] text-sky-400' : 'bg-slate-900 border-slate-800 text-sky-300'
              }`}>
                {rule.query}
              </div>
            </div>

            {/* Bottom Metadata & Automated Playbook binding */}
            <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${currentTheme.borderClass} ${currentTheme.textSecondaryClass}`}>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-[#118dff]" />
                <span>{isRtl ? 'كتيب الاستجابة:' : 'Playbook:'} {rule.automatedPlaybookId || (isRtl ? 'لا يوجد (تنبيه فقط)' : 'None (Alert Only)')}</span>
              </div>

              <span>{isRtl ? `تم الإطلاق: ${rule.triggeredCount} مرات` : `Fired: ${rule.triggeredCount} times`}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Detection Rule */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-xl rounded-[2px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border ${currentTheme.cardBgClass} ${currentTheme.borderClass}`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${currentTheme.cardHeaderClass} ${currentTheme.borderClass}`}>
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Code className="w-4 h-4 text-[#118dff]" />
                <span>{isRtl ? 'إنشاء قاعدة ارتباط وكشف أمني' : 'Create Detection Correlation Rule'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`p-1 rounded-[2px] cursor-pointer ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs font-sans">
              <div className="space-y-1">
                <label className={`font-semibold ${currentTheme.textPrimaryClass}`}>
                  {isRtl ? 'اسم القاعدة' : 'Rule Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'مثال: تنفيذ مشفر لأوامر PowerShell' : 'e.g. Obfuscated Base64 PowerShell Execution'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-2 rounded-[2px] border focus:outline-hidden focus:border-[#118dff] ${currentTheme.inputBgClass}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`font-semibold ${currentTheme.textPrimaryClass}`}>
                    {isRtl ? 'مستوى الخطورة' : 'Severity'}
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                    className={`w-full p-2 rounded-[2px] font-mono border focus:outline-hidden focus:border-[#118dff] cursor-pointer ${currentTheme.inputBgClass}`}
                  >
                    <option value="CRITICAL">{isRtl ? 'حرج (CRITICAL)' : 'CRITICAL'}</option>
                    <option value="HIGH">{isRtl ? 'عالي (HIGH)' : 'HIGH'}</option>
                    <option value="MEDIUM">{isRtl ? 'متوسط (MEDIUM)' : 'MEDIUM'}</option>
                    <option value="LOW">{isRtl ? 'منخفض (LOW)' : 'LOW'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={`font-semibold ${currentTheme.textPrimaryClass}`}>
                    {isRtl ? 'معرف تقنية MITRE' : 'MITRE Technique ID'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. T1059.001"
                    value={mitreTechnique}
                    onChange={(e) => setMitreTechnique(e.target.value)}
                    className={`w-full p-2 rounded-[2px] font-mono border focus:outline-hidden focus:border-[#118dff] ${currentTheme.inputBgClass}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`font-semibold ${currentTheme.textPrimaryClass}`}>
                  {isRtl ? 'تكتيك MITRE' : 'MITRE Tactic'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Execution"
                  value={mitreTactic}
                  onChange={(e) => setMitreTactic(e.target.value)}
                  className={`w-full p-2 rounded-[2px] font-mono border focus:outline-hidden focus:border-[#118dff] ${currentTheme.inputBgClass}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`font-semibold ${currentTheme.textPrimaryClass}`}>
                  {isRtl ? 'استعلام الارتباط الأمني (Sigma / SIEM Query)' : 'Correlation Query'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={`w-full p-2 rounded-[2px] font-mono text-[11px] border focus:outline-hidden focus:border-[#118dff] ${currentTheme.inputBgClass}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`font-semibold ${currentTheme.textPrimaryClass}`}>
                    {isRtl ? 'عتبة تكرار الأحداث' : 'Threshold Count'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className={`w-full p-2 rounded-[2px] font-mono border focus:outline-hidden focus:border-[#118dff] ${currentTheme.inputBgClass}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`font-semibold ${currentTheme.textPrimaryClass}`}>
                    {isRtl ? 'النافذة الزمنية (بالثواني)' : 'Window (Seconds)'}
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={timeWindowSeconds}
                    onChange={(e) => setTimeWindowSeconds(Number(e.target.value))}
                    className={`w-full p-2 rounded-[2px] font-mono border focus:outline-hidden focus:border-[#118dff] ${currentTheme.inputBgClass}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`font-semibold ${currentTheme.textPrimaryClass}`}>
                  {isRtl ? 'كتيب الاستجابة الآلي المرتبط (SOAR)' : 'Automated Playbook'}
                </label>
                <select
                  value={automatedPlaybookId}
                  onChange={(e) => setAutomatedPlaybookId(e.target.value)}
                  className={`w-full p-2 rounded-[2px] font-mono border focus:outline-hidden focus:border-[#118dff] cursor-pointer ${currentTheme.inputBgClass}`}
                >
                  <option value="">{isRtl ? 'بدون كتيب (توليد إنذار فقط)' : 'None (Alert Only)'}</option>
                  {playbooks.map(pb => (
                    <option key={pb.id} value={pb.id}>
                      {pb.id} - {isRtl ? (pb.nameAr || pb.name) : pb.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className={`font-semibold ${currentTheme.textPrimaryClass}`}>
                  {isRtl ? 'الوسوم (مفصولة بفاصلة)' : 'Tags (comma separated)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. PowerShell, Execution, Obfuscation"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className={`w-full p-2 rounded-[2px] font-mono border focus:outline-hidden focus:border-[#118dff] ${currentTheme.inputBgClass}`}
                />
              </div>

              <div className={`flex justify-end gap-2 pt-3 border-t ${currentTheme.borderClass}`}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 rounded-[2px] border cursor-pointer ${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.textSecondaryClass} ${currentTheme.tableRowHoverClass}`}
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#118dff] hover:bg-[#0078d4] text-white rounded-[2px] font-semibold cursor-pointer shadow-xs"
                >
                  {isRtl ? 'حفظ وتفعيل القاعدة' : 'Save & Enable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
