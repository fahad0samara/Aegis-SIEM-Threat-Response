import React, { useState } from 'react';
import { useSiem } from '../context/SiemContext';
import { THEMES } from '../types/theme';

interface MitreTechniqueInfo {
  id: string;
  name: string;
  nameAr: string;
  tactic: string;
  tacticAr: string;
  description: string;
  descriptionAr: string;
}

const MITRE_TACTICS: { name: string; nameAr: string; id: string; techniques: MitreTechniqueInfo[] }[] = [
  {
    name: 'Initial Access',
    nameAr: 'الوصول الأولي',
    id: 'TA0001',
    techniques: [
      { 
        id: 'T1190', 
        name: 'Exploit Public-Facing App', 
        nameAr: 'استغلال التطبيقات المعرضة للإنترنت',
        tactic: 'Initial Access', 
        tacticAr: 'الوصول الأولي',
        description: 'Adversary leverages software vulnerabilities in Internet-facing web servers or APIs.',
        descriptionAr: 'يستغل المهاجم ثغرات برمجية في خوادم الويب أو واجهات برمجة التطبيقات المكشوفة للإنترنت.'
      },
      { 
        id: 'T1078.004', 
        name: 'Valid Accounts: Cloud', 
        nameAr: 'الحسابات المصرحة: الهوية السحابية',
        tactic: 'Initial Access', 
        tacticAr: 'الوصول الأولي',
        description: 'Obtaining cloud IAM credentials to access organizational cloud subscriptions.',
        descriptionAr: 'الحصول على بيانات اعتماد IAM السحابية للوصول غير المصرح به للبنية التحتية للمؤسسة.'
      },
      { 
        id: 'T1566', 
        name: 'Phishing', 
        nameAr: 'التصيد الاحتيالي',
        tactic: 'Initial Access', 
        tacticAr: 'الوصول الأولي',
        description: 'Spearphishing attachments or credential harvesting links delivered via email.',
        descriptionAr: 'مرفقات خبيثة أو روابط سرقة بيانات اعتماد مرسلة عبر البريد الإلكتروني.'
      }
    ]
  },
  {
    name: 'Execution',
    nameAr: 'التنفيذ البرمجي',
    id: 'TA0002',
    techniques: [
      { 
        id: 'T1059.001', 
        name: 'PowerShell', 
        nameAr: 'أوامر ونصوص PowerShell',
        tactic: 'Execution', 
        tacticAr: 'التنفيذ البرمجي',
        description: 'Abusing PowerShell commandlets for script execution and in-memory loading.',
        descriptionAr: 'استغلال أوامر ومكتبات PowerShell لتشغيل الشيفرات وتحميلها مباشرة في الذاكرة.'
      },
      { 
        id: 'T1609', 
        name: 'Container Administration Command', 
        nameAr: 'أوامر إدارة الحاويات (Docker/K8s)',
        tactic: 'Execution', 
        tacticAr: 'التنفيذ البرمجي',
        description: 'Using docker exec or kubectl exec to spawn shells in running production containers.',
        descriptionAr: 'استخدام أوامر kubectl exec أو docker لتشغيل صدفة تفاعلية داخل الحاويات النشطة.'
      },
      { 
        id: 'T1203', 
        name: 'Exploitation for Client Execution', 
        nameAr: 'استغلال ثغرات التطبيقات للتشغيل',
        tactic: 'Execution', 
        tacticAr: 'التنفيذ البرمجي',
        description: 'Exploitation of software vulnerabilities through user interaction or services (e.g. ActiveMQ RCE).',
        descriptionAr: 'استغلال الثغرات البرمجية في الخدمات أو تفاعل المستخدمين لتنفيذ تعليمات معادية عن بُعد.'
      }
    ]
  },
  {
    name: 'Defense Evasion',
    nameAr: 'التهرب الدفاعي',
    id: 'TA0005',
    techniques: [
      { 
        id: 'T1055.001', 
        name: 'Dynamic-link Library Injection', 
        nameAr: 'حقن مكتبات الارتباط الديناميكي (DLL)',
        tactic: 'Defense Evasion', 
        tacticAr: 'التهرب الدفاعي',
        description: 'Injecting malicious DLL into memory space of legitimate system process (svchost.exe).',
        descriptionAr: 'حقن ملفات DLL خبيثة في مساحة الذاكرة الخاصة بالعمليات المشروعة لتفادي رصد برامج الحماية.'
      },
      { 
        id: 'T1078.002', 
        name: 'Domain Accounts', 
        nameAr: 'حسابات نطاق الدليل النشط',
        tactic: 'Defense Evasion', 
        tacticAr: 'التهرب الدفاعي',
        description: 'Using legitimate Domain Controller credentials to bypass behavioral anomaly detection.',
        descriptionAr: 'استخدام حسابات نطاق موثوقة ومسؤولين للتنقل داخل الشبكة وتجاوز أنظمة الكشف.'
      },
      { 
        id: 'T1490', 
        name: 'Inhibit System Recovery', 
        nameAr: 'تعطيل استعادة النظام والنسخ الاحتياطي',
        tactic: 'Defense Evasion', 
        tacticAr: 'التهرب الدفاعي',
        description: 'Deleting volume shadow copies or disabling system recovery mechanisms prior to ransomware.',
        descriptionAr: 'حذف النسخ الاحتياطية وتعطيل آليات الاستعادة قبل تشفير البيانات لمنع التعافي.'
      }
    ]
  },
  {
    name: 'Credential Access',
    nameAr: 'الوصول لبيانات الاعتماد',
    id: 'TA0006',
    techniques: [
      { 
        id: 'T1110.001', 
        name: 'Password Guessing', 
        nameAr: 'تخمين كلمات المرور (القوة الغاشمة)',
        tactic: 'Credential Access', 
        tacticAr: 'الوصول لبيانات الاعتماد',
        description: 'Brute-force password guessing against SSH, RDP, or web authentication portals.',
        descriptionAr: 'هجمات تخمين كلمات المرور المكررة ضد منافذ SSH أو RDP أو بوابات الدخول السحابية.'
      },
      { 
        id: 'T1621', 
        name: 'MFA Request Generation', 
        nameAr: 'إجهاد طلبات المصادقة (MFA Fatigue)',
        tactic: 'Credential Access', 
        tacticAr: 'الوصول لبيانات الاعتماد',
        description: 'Push bombing to fatigue users into approving unauthorized multi-factor challenges.',
        descriptionAr: 'إمطار هاتف المستخدم بإشعارات الدخول لدفع الضحية للموافقة على التحدي بدافع الإجهاد.'
      },
      { 
        id: 'T1558.003', 
        name: 'Kerberoasting', 
        nameAr: 'استخراج تذاكر كيربيروس (Kerberoasting)',
        tactic: 'Credential Access', 
        tacticAr: 'الوصول لبيانات الاعتماد',
        description: 'Requesting Kerberos service tickets for accounts with SPNs to crack hashes offline.',
        descriptionAr: 'طلب تذاكر خدمات كيربيروس للحسابات ذات أسماء SPN لكسر تجزئة كلمات المرور خارج الشبكة.'
      }
    ]
  },
  {
    name: 'Lateral Movement',
    nameAr: 'التحرك الأفقي',
    id: 'TA0008',
    techniques: [
      { 
        id: 'T1021.002', 
        name: 'SMB/Windows Admin Shares', 
        nameAr: 'مشاركات إدارة ويندوز (SMB Admin Shares)',
        tactic: 'Lateral Movement', 
        tacticAr: 'التحرك الأفقي',
        description: 'Using SMB admin shares (C$, ADMIN$) to propagate binaries laterally across endpoints.',
        descriptionAr: 'استخدام مشاركات ويندوز الإدارية لنقل الملفات التنفيذية والانتشار بين أجهزة النطاق.'
      },
      { 
        id: 'T1550.002', 
        name: 'Pass the Hash', 
        nameAr: 'تمرير التجزئة المشفرة (Pass the Hash)',
        tactic: 'Lateral Movement', 
        tacticAr: 'التحرك الأفقي',
        description: 'Authenticating using intercepted NTLM password hashes without knowing plaintext passwords.',
        descriptionAr: 'المصادقة على خوادم أخرى باستخدام تجزئة NTLM الملتقطة دون الحاجة لمعرفة كلمة المرور.'
      }
    ]
  },
  {
    name: 'Exfiltration & C2',
    nameAr: 'تسريب البيانات والتحكم C2',
    id: 'TA0010',
    techniques: [
      { 
        id: 'T1071.001', 
        name: 'Web Protocols', 
        nameAr: 'بروتوكولات الويب (HTTP/HTTPS C2)',
        tactic: 'Exfiltration & C2', 
        tacticAr: 'تسريب البيانات والتحكم C2',
        description: 'Adversary C2 beaconing masked inside standard TLS/HTTPS traffic to evasive domains.',
        descriptionAr: 'تواصل إشارات التحكم C2 متنكرة داخل حركة مرور HTTPS العادية لخداع المراقبة.'
      },
      { 
        id: 'T1048.003', 
        name: 'DNS Tunneling / Exfiltration', 
        nameAr: 'نفق نظام أسماء النطاقات (DNS Tunneling)',
        tactic: 'Exfiltration & C2', 
        tacticAr: 'تسريب البيانات والتحكم C2',
        description: 'Exfiltrating encoded stolen credentials or telemetry via iterative DNS TXT queries.',
        descriptionAr: 'تسريب البيانات المشفرة والبيانات الحساسة عبر استعلامات DNS المتكررة لتجاوز جدران الحماية.'
      }
    ]
  }
];

export const MitreView: React.FC = () => {
  const { incidents, logs, rules, setPbiPage, setSelectedIncident, theme, isRtl } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const [selectedTechnique, setSelectedTechnique] = useState<MitreTechniqueInfo | null>(
    MITRE_TACTICS[0].techniques[0]
  );

  const getDetectionsForTechnique = (techId: string) => {
    const directIncidents = incidents.filter(i => i.mitreTechnique.includes(techId));
    const matchingLogs = logs.filter(l => l.mitreTechniqueId === techId);
    const coveringRules = rules.filter(r => r.mitreTechnique === techId);

    return {
      incidents: directIncidents,
      logs: matchingLogs,
      rules: coveringRules,
      hasActiveThreat: directIncidents.length > 0,
      coverageScore: coveringRules.length > 0 ? (coveringRules.some(r => r.enabled) ? 'ACTIVE' : 'DISABLED') : 'NONE'
    };
  };

  const selectedStats = selectedTechnique ? getDetectionsForTechnique(selectedTechnique.id) : null;

  return (
    <div className={`p-4 max-w-[1720px] mx-auto space-y-4 ${currentTheme.textPrimaryClass}`}>
      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b ${currentTheme.borderClass}`}>
        <div>
          <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
            <span>{isRtl ? 'مصفوفة إطار مايتر ATT&CK للمؤسسات' : 'MITRE ATT&CK Enterprise Matrix Visual'}</span>
          </h1>
          <p className={`text-xs mt-0.5 ${currentTheme.textSecondaryClass}`}>
            {isRtl ? 'خريطة حرارية لتغطية تقنيات الخصم مرتبطة بالاكتشافات النشطة وقواعد الرصد' : 'Adversary technique coverage heatmap mapped to active detections and detection rules.'}
          </p>
        </div>

        {/* Legend */}
        <div className={`flex items-center gap-3 text-xs font-mono px-3 py-1.5 rounded-[2px] border ${currentTheme.subtleBgClass} ${currentTheme.borderClass} ${currentTheme.textSecondaryClass}`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[1px] bg-rose-500" />
            <span>{isRtl ? 'حادث نشط' : 'Active Incident'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[1px] bg-emerald-500" />
            <span>{isRtl ? 'محمي بقاعدة' : 'Rule Guarded'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[1px] bg-slate-500" />
            <span>{isRtl ? 'خط الأساس' : 'Baseline'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Heatmap Columns + Side Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* MITRE Matrix Columns (8 cols) */}
        <div className="lg:col-span-8 overflow-x-auto pb-2">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 min-w-[700px]">
            {MITRE_TACTICS.map(tactic => (
              <div key={tactic.id} className="space-y-2">
                {/* Column Header */}
                <div className={`p-2 rounded-[2px] border text-center font-sans ${currentTheme.cardHeaderClass} ${currentTheme.borderClass}`}>
                  <div className={`text-[10px] font-mono ${currentTheme.textSecondaryClass}`}>{tactic.id}</div>
                  <div className={`text-xs font-semibold truncate ${currentTheme.textPrimaryClass}`} title={isRtl ? tactic.nameAr : tactic.name}>
                    {isRtl ? tactic.nameAr : tactic.name}
                  </div>
                </div>

                {/* Techniques */}
                <div className="space-y-1.5">
                  {tactic.techniques.map(tech => {
                    const stats = getDetectionsForTechnique(tech.id);
                    const isSelected = selectedTechnique?.id === tech.id;

                    let bgStateClass = `${currentTheme.cardBgClass} ${currentTheme.borderClass}`;
                    let textStateClass = currentTheme.textSecondaryClass;

                    if (stats.hasActiveThreat) {
                      bgStateClass = isDark ? 'bg-rose-950/40 border-rose-800' : 'bg-rose-50 border-rose-200';
                      textStateClass = 'text-rose-400 font-bold';
                    } else if (stats.coverageScore === 'ACTIVE') {
                      bgStateClass = isDark ? 'bg-emerald-950/30 border-emerald-800/60' : 'bg-emerald-50/60 border-emerald-200';
                    }

                    return (
                      <div
                        key={tech.id}
                        onClick={() => setSelectedTechnique(tech)}
                        className={`p-2 rounded-[2px] border cursor-pointer transition-all ${bgStateClass} ${
                          isSelected ? 'ring-2 ring-[#118dff] shadow-md' : 'hover:border-[#118dff]/60'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
                          <bdi dir="ltr" className="font-semibold text-[#118dff]">{tech.id}</bdi>
                          {stats.incidents.length > 0 && (
                            <span className="text-rose-400 font-bold">
                              {stats.incidents.length} {isRtl ? 'حوادث' : 'INC'}
                            </span>
                          )}
                        </div>

                        <div className={`text-[11px] leading-tight font-medium ${textStateClass}`}>
                          {isRtl ? tech.nameAr : tech.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technique Detail Inspector (4 cols) */}
        {selectedTechnique && selectedStats && (
          <div className={`lg:col-span-4 rounded-[2px] border p-4 space-y-4 ${
            currentTheme.cardBgClass
          } ${currentTheme.borderClass} shadow-xs`}>
            {/* Technique Header */}
            <div className={`pb-3 border-b space-y-1 ${currentTheme.borderClass}`}>
              <div className="flex items-center justify-between font-mono text-xs">
                <bdi dir="ltr" className="text-[#118dff] font-bold">{selectedTechnique.id}</bdi>
                <span className={currentTheme.textSecondaryClass}>
                  {isRtl ? selectedTechnique.tacticAr : selectedTechnique.tactic}
                </span>
              </div>
              <h2 className={`text-base font-bold font-sans ${currentTheme.textPrimaryClass}`}>
                {isRtl ? selectedTechnique.nameAr : selectedTechnique.name}
              </h2>
              <p className={`text-xs leading-relaxed ${currentTheme.textSecondaryClass}`}>
                {isRtl ? selectedTechnique.descriptionAr : selectedTechnique.description}
              </p>
            </div>

            {/* Coverage Summary Metrics */}
            <div className={`p-3 rounded-[2px] border grid grid-cols-2 divide-x divide-inherit text-xs font-mono ${currentTheme.borderClass} ${currentTheme.subtleBgClass} ${currentTheme.borderClass.replace('border-', 'divide-')}`}>
              <div className="space-y-0.5">
                <div className={`text-[10.5px] ${currentTheme.textSecondaryClass}`}>
                  {isRtl ? 'قواعد الرصد المحصنة' : 'Detection Rules'}
                </div>
                <div className="text-xl font-bold font-mono tabular-nums">{selectedStats.rules.length}</div>
                <div className="text-[10px] text-emerald-400 font-semibold">
                  {isRtl ? 'مرشحات تدفق نشطة' : 'Active Ingest Filters'}
                </div>
              </div>

              <div className="space-y-0.5 pl-3 rtl:pr-3 rtl:pl-0">
                <div className={`text-[10.5px] ${currentTheme.textSecondaryClass}`}>
                  {isRtl ? 'الحوادث الأمنية النشطة' : 'Active Incidents'}
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-rose-400">
                  {selectedStats.incidents.length}
                </div>
                <div className="text-[10px] text-rose-400 font-semibold">
                  {isRtl ? 'حالات فرز ذات أولوية' : 'Priority Triage Cases'}
                </div>
              </div>
            </div>

            {/* Active Incidents Triggered */}
            <div className="space-y-2">
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.textSecondaryClass}`}>
                {isRtl ? `الحوادث الأمنية المرصودة (${selectedStats.incidents.length})` : `Triggered SIEM Incidents (${selectedStats.incidents.length})`}
              </h3>

              {selectedStats.incidents.length === 0 ? (
                <div className={`p-3 rounded-[2px] border text-xs text-center ${currentTheme.subtleBgClass} ${currentTheme.borderClass} ${currentTheme.textSecondaryClass}`}>
                  {isRtl ? 'لم يتم رصد أي حوادث نشطة لهذه التقنية حالياً.' : 'No active incidents detected for this technique.'}
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedStats.incidents.map(inc => (
                    <div
                      key={inc.id}
                      onClick={() => {
                        setSelectedIncident(inc);
                        setPbiPage('incidents');
                      }}
                      className={`p-2.5 rounded-[2px] border transition-colors cursor-pointer ${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.tableRowHoverClass} shadow-xs`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <bdi dir="ltr" className="font-bold text-rose-400">{inc.id}</bdi>
                        <span className="text-[#118dff] font-medium">
                          {isRtl ? 'عرض في منصة الحوادث ←' : 'View in Workbench →'}
                        </span>
                      </div>
                      <div className={`text-xs font-medium font-sans truncate ${currentTheme.textPrimaryClass}`}>
                        {isRtl ? (inc.titleAr || inc.title) : inc.title}
                      </div>
                      <div className={`text-[10px] font-mono mt-1 ${currentTheme.textSecondaryClass}`}>
                        {isRtl ? 'الأصل:' : 'Host:'} {inc.affectedHost} · IP: <bdi dir="ltr">{inc.attackerIp}</bdi>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Guarding Detection Rules */}
            <div className="space-y-2">
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.textSecondaryClass}`}>
                {isRtl ? `قواعد الارتباط لـ SIEM (${selectedStats.rules.length})` : `SIEM Correlation Rules (${selectedStats.rules.length})`}
              </h3>

              <div className="space-y-1.5 font-mono text-xs">
                {selectedStats.rules.map(rule => (
                  <div key={rule.id} className={`p-2 rounded-[2px] border flex items-center justify-between ${currentTheme.subtleBgClass} ${currentTheme.borderClass}`}>
                    <div className="truncate pr-2 rtl:pl-2 rtl:pr-0">
                      <div className={`font-sans font-medium text-xs truncate ${currentTheme.textPrimaryClass}`}>
                        {isRtl ? (rule.nameAr || rule.name) : rule.name}
                      </div>
                      <div className={`text-[10.5px] truncate ${currentTheme.textSecondaryClass}`}>
                        {isRtl ? `العتبة: ${rule.threshold} أحداث / ${rule.timeWindowSeconds}ث` : `Threshold: ${rule.threshold} events / ${rule.timeWindowSeconds}s`}
                      </div>
                    </div>
                    <span className="text-emerald-400 text-[10px] font-bold shrink-0">
                      {isRtl ? 'نشط' : 'ACTIVE'}
                    </span>
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
