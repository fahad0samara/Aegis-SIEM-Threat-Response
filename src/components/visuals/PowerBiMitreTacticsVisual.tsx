import React, { useState } from 'react';
import { useSiem } from '../../context/SiemContext';
import { THEMES } from '../../types/theme';
import { LogSourceDrillDownData } from '../PowerBiLogDrillDownModal';
import { Search, Flame, ShieldAlert, ArrowUpRight } from '../icons/SocIcons';

interface Props {
  onDrillDown?: (target: LogSourceDrillDownData) => void;
}

export const PowerBiMitreTacticsVisual: React.FC<Props> = ({ onDrillDown }) => {
  const { incidents, logs, theme, isRtl, setPbiPage } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const [selectedTacticId, setSelectedTacticId] = useState<string | null>(null);

  // Real MITRE ATT&CK Matrix Enterprise Tactics
  const tactics = [
    {
      id: 'TA0001',
      nameEn: 'Initial Access',
      nameAr: 'الوصول الأولي',
      techniqueId: 'T1190',
      techniqueName: 'Exploit Public App',
      techniqueNameAr: 'استغلال تطبيق خارجي',
      severity: 'HIGH',
      eventsCount: 384,
      alertsCount: 2,
      intensity: 85
    },
    {
      id: 'TA0002',
      nameEn: 'Execution',
      nameAr: 'التنفيذ البرمجي',
      techniqueId: 'T1059.001',
      techniqueName: 'PowerShell Scripts',
      techniqueNameAr: 'تنفيذ برمجيات PowerShell',
      severity: 'CRITICAL',
      eventsCount: 412,
      alertsCount: 3,
      intensity: 92
    },
    {
      id: 'TA0003',
      nameEn: 'Persistence',
      nameAr: 'الاستدامة والتواجد',
      techniqueId: 'T1572',
      techniqueName: 'Protocol Tunneling',
      techniqueNameAr: 'أنفاق بروتوكول مشبوهة',
      severity: 'MEDIUM',
      eventsCount: 156,
      alertsCount: 1,
      intensity: 45
    },
    {
      id: 'TA0004',
      nameEn: 'Priv Escalation',
      nameAr: 'رفع الامتيازات',
      techniqueId: 'T1558.003',
      techniqueName: 'Kerberoasting',
      techniqueNameAr: 'استغلال تذاكر Kerberos',
      severity: 'HIGH',
      eventsCount: 248,
      alertsCount: 1,
      intensity: 72
    },
    {
      id: 'TA0005',
      nameEn: 'Defense Evasion',
      nameAr: 'التهرب الدفاعي',
      techniqueId: 'T1055.001',
      techniqueName: 'Process Injection',
      techniqueNameAr: 'حقن العمليات svchost',
      severity: 'CRITICAL',
      eventsCount: 520,
      alertsCount: 4,
      intensity: 98
    },
    {
      id: 'TA0006',
      nameEn: 'Credential Access',
      nameAr: 'الوصول للاعتماد',
      techniqueId: 'T1110.001',
      techniqueName: 'Password Spray',
      techniqueNameAr: 'رش كلمات المرور SSH',
      severity: 'CRITICAL',
      eventsCount: 468,
      alertsCount: 3,
      intensity: 89
    },
    {
      id: 'TA0007',
      nameEn: 'Discovery',
      nameAr: 'الاستكشاف الأمني',
      techniqueId: 'T1046',
      techniqueName: 'Port Scanning',
      techniqueNameAr: 'مسح المنافذ والشبكة',
      severity: 'LOW',
      eventsCount: 94,
      alertsCount: 0,
      intensity: 28
    },
    {
      id: 'TA0008',
      nameEn: 'Lateral Movement',
      nameAr: 'التحرك الجانبي',
      techniqueId: 'T1210',
      techniqueName: 'Remote Services RCE',
      techniqueNameAr: 'استغلال الخدمات عن بعد',
      severity: 'HIGH',
      eventsCount: 290,
      alertsCount: 2,
      intensity: 76
    },
    {
      id: 'TA0011',
      nameEn: 'Command & Control',
      nameAr: 'القيادة والتحكم',
      techniqueId: 'T1071.001',
      techniqueName: 'Web Protocols C2',
      techniqueNameAr: 'إشارات C2 عبر الويب',
      severity: 'CRITICAL',
      eventsCount: 560,
      alertsCount: 5,
      intensity: 95
    },
    {
      id: 'TA0010',
      nameEn: 'Exfiltration',
      nameAr: 'تسريب البيانات',
      techniqueId: 'T1048.003',
      techniqueName: 'DNS Tunneling',
      techniqueNameAr: 'أنفاق نظام أسماء النطاقات',
      severity: 'CRITICAL',
      eventsCount: 380,
      alertsCount: 2,
      intensity: 88
    }
  ];

  const getTacticColor = (intensity: number) => {
    if (intensity >= 85) return '#f43f5e';
    if (intensity >= 70) return '#fb923c';
    if (intensity >= 45) return '#facc15';
    return '#38bdf8';
  };

  const handleTacticClick = (tac: typeof tactics[0]) => {
    setSelectedTacticId(curr => curr === tac.id ? null : tac.id);
    onDrillDown?.({
      title: isRtl ? `تكتيك ميتري: ${tac.nameAr} (${tac.id})` : `MITRE Tactic: ${tac.nameEn} (${tac.id})`,
      subtitle: isRtl 
        ? `التقنية: ${tac.techniqueNameAr} · الرمز: ${tac.techniqueId} · إنذارات نشطة: ${tac.alertsCount}`
        : `Technique: ${tac.techniqueName} · ID: ${tac.techniqueId} · Active Alerts: ${tac.alertsCount}`,
      category: 'technique',
      filterKey: isRtl ? 'التكتيك الأمني' : 'MITRE Tactic',
      filterValue: tac.nameEn,
      metricValue: `${tac.eventsCount.toLocaleString()} ${isRtl ? 'أحداث' : 'Events'}`
    });
  };

  return (
    <div className={`w-full h-full flex flex-col justify-between p-2 select-none font-sans text-xs ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Top Matrix Header & Matrix Full View Link */}
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-inherit text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-bold">
            {isRtl ? 'مصفوفة ميتري للتهديدات النشطة (Enterprise Matrix)' : 'MITRE ATT&CK Enterprise Matrix Heatmap'}
          </span>
        </div>
        <button
          onClick={() => setPbiPage('mitre')}
          className="text-[#118dff] hover:underline flex items-center gap-0.5 cursor-pointer text-[10.5px] font-bold"
        >
          <span>{isRtl ? 'فتح المصفوفة الكاملة' : 'Full Matrix View'}</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Grid of 10 Tactic Heatmap Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 flex-1 min-h-[220px]">
        {tactics.map(tac => {
          const color = getTacticColor(tac.intensity);
          const isSelected = selectedTacticId === tac.id;

          return (
            <div
              key={tac.id}
              onClick={() => handleTacticClick(tac)}
              className={`p-2 rounded-[2px] border flex flex-col justify-between transition-all cursor-pointer ${
                isSelected 
                  ? 'ring-2 ring-[#118dff] shadow-md' 
                  : isDark ? 'hover:border-[#1e3466]' : 'hover:border-slate-400'
              } ${
                isDark 
                  ? 'bg-[#080f1e]/90 border-[#18284c] hover:bg-[#0f1a34]' 
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              {/* Top Row: Tactic ID & Alert Counter */}
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="opacity-60">{tac.id}</span>
                {tac.alertsCount > 0 ? (
                  <span className="text-[9px] font-bold px-1 rounded-xs bg-rose-600/20 text-rose-400 border border-rose-500/30">
                    {tac.alertsCount} {isRtl ? 'إنذار' : 'ALERTS'}
                  </span>
                ) : (
                  <span className="text-[9px] opacity-50">
                    {isRtl ? 'مراقب' : 'MONITORED'}
                  </span>
                )}
              </div>

              {/* Tactic Title */}
              <div className="my-1">
                <div className="font-bold text-[11px] truncate tracking-tight" title={isRtl ? tac.nameAr : tac.nameEn}>
                  {isRtl ? tac.nameAr : tac.nameEn}
                </div>
                <div className="text-[9.5px] font-mono text-[#118dff] truncate" title={isRtl ? tac.techniqueNameAr : tac.techniqueName}>
                  <bdi dir="ltr">{tac.techniqueId}</bdi>
                </div>
              </div>

              {/* Intensity Progress Meter */}
              <div className="space-y-1">
                <div className={`w-full h-1 rounded-full overflow-hidden ${isDark ? 'bg-[#0f1a34]' : 'bg-slate-200'}`}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${tac.intensity}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9.5px] font-mono opacity-75">
                  <span>{tac.eventsCount} {isRtl ? 'حدث' : 'ev'}</span>
                  <span className="font-bold" style={{ color }}>{tac.intensity}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Guidance */}
      <div className={`mt-2 pt-1 border-t text-[10px] font-mono flex items-center justify-between opacity-70 ${
        isDark ? 'border-[#18284c]' : 'border-slate-200'
      }`}>
        <span>{isRtl ? 'انقر على أي مرحلة لاستعراض سجلات التقنية وحظرها' : 'Click tactic tile to filter forensic logs by ATT&CK technique'}</span>
        <span className="text-rose-400 font-bold">{isRtl ? 'تحديث متواصل' : 'Real-time telemetry'}</span>
      </div>
    </div>
  );
};
