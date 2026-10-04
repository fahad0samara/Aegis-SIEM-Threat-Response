import React from 'react';
import { useSiem } from '../../context/SiemContext';
import { THEMES } from '../../types/theme';
import { LogSourceDrillDownData } from '../PowerBiLogDrillDownModal';
import { ShieldCheck, Zap, ShieldAlert, ArrowUpRight } from '../icons/SocIcons';

interface Props {
  onDrillDown?: (target: LogSourceDrillDownData) => void;
}

export const PowerBiSecurityScoreGaugeVisual: React.FC<Props> = ({ onDrillDown }) => {
  const { stats, theme, isRtl, setPbiPage } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const overallScore = 94.2;

  const pillarScores = [
    {
      id: 'edr',
      nameEn: 'EDR Fleet Coverage',
      nameAr: 'تغطية وكلاء EDR للأجهزة',
      score: 99.4,
      target: 98,
      statusEn: 'PASS',
      statusAr: 'ناجح',
      color: '#10b981',
      metric: '485 / 488 Hosts Active'
    },
    {
      id: 'soar',
      nameEn: 'SOAR Containment SLA',
      nameAr: 'نسبة الاستجابة التلقائية SOAR',
      score: stats.autoContainmentRate,
      target: 85,
      statusEn: 'PASS',
      statusAr: 'ناجح',
      color: '#10b981',
      metric: `${stats.autoContainmentRate}% Automated Block`
    },
    {
      id: 'mfa',
      nameEn: 'Zero-Trust Identity MFA',
      nameAr: 'المصادقة الثنائية الصفرية',
      score: 96.8,
      target: 95,
      statusEn: 'PASS',
      statusAr: 'ناجح',
      color: '#10b981',
      metric: 'Strict FIDO2 & Okta Push'
    },
    {
      id: 'exposure',
      nameEn: 'Perimeter Threat Isolation',
      nameAr: 'عزل التهديدات عند المحيط',
      score: 91.5,
      target: 90,
      statusEn: 'PASS',
      statusAr: 'ناجح',
      color: '#118dff',
      metric: 'Cloudflare WAF + Palo Alto'
    }
  ];

  return (
    <div className={`w-full h-full flex flex-col justify-between p-2 select-none font-sans text-xs ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Header Metric Gauge Badge */}
      <div className={`p-3 rounded-[2px] border flex items-center justify-between mb-2 ${
        isDark ? 'bg-[#080f1e]/90 border-[#18284c]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 flex items-center justify-center font-mono font-bold text-sm text-emerald-400 shadow-sm">
            <bdi dir="ltr">94%</bdi>
          </div>
          <div>
            <div className={`text-[12px] font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isRtl ? 'مؤشر كفاءة الحماية السيبرانية' : 'Cyber Defense Readiness'}
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] font-mono opacity-80">
              <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{isRtl ? 'تصنيف ممتاز A+' : 'Rating A+ Excellent'}</span>
              <span>·</span>
              <bdi dir="ltr">MTTR: {stats.mttrMinutes}m</bdi>
            </div>
          </div>
        </div>

        <button
          onClick={() => setPbiPage('playbooks')}
          className="text-[#118dff] hover:underline flex items-center gap-0.5 cursor-pointer text-[10.5px] font-bold shrink-0"
        >
          <span>{isRtl ? 'إدارة كتيبات الحل' : 'Playbooks'}</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Pillar Breakdown Bars */}
      <div className="space-y-2 flex-1 min-h-[160px] flex flex-col justify-around py-1">
        {pillarScores.map(pillar => (
          <div 
            key={pillar.id}
            onClick={() => {
              onDrillDown?.({
                title: isRtl ? `مقياس الدفاع: ${pillar.nameAr}` : `Defense Metric: ${pillar.nameEn}`,
                subtitle: isRtl ? `النتيجة: ${pillar.score}% · الهدف: > ${pillar.target}% · التفاصيل: ${pillar.metric}` : `Score: ${pillar.score}% · SLA Target: > ${pillar.target}% · ${pillar.metric}`,
                category: 'source',
                filterKey: isRtl ? 'المقياس' : 'Metric',
                filterValue: pillar.nameEn,
                metricValue: `${pillar.score}% Compliance`
              });
            }}
            className={`p-1.5 rounded-[2px] border transition-colors cursor-pointer ${
              isDark ? 'bg-[#080f1e]/80 hover:bg-[#0f1a34] border-[#18284c]' : 'bg-white hover:bg-slate-100 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-[10.5px] mb-1">
              <span className="font-semibold">{isRtl ? pillar.nameAr : pillar.nameEn}</span>
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                <bdi dir="ltr" className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{pillar.score}%</bdi>
                <bdi dir="ltr" className="opacity-60 font-normal">(&gt;{pillar.target}%)</bdi>
              </div>
            </div>

            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#0f1a34]' : 'bg-slate-200'}`}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, pillar.score)}%`,
                  backgroundColor: pillar.color
                }}
              />
            </div>

            <div className="flex justify-between items-center text-[9.5px] font-mono opacity-70 mt-1">
              <span>{pillar.metric}</span>
              <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{isRtl ? pillar.statusAr : pillar.statusEn}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className={`mt-2 pt-1 border-t text-[10px] font-mono flex items-center justify-between opacity-70 ${
        isDark ? 'border-[#18284c]' : 'border-slate-200'
      }`}>
        <span>{isRtl ? 'معايير الامتثال: ISO 27001 / SOC 2 Type II' : 'Compliance: ISO 27001 · SOC 2 Type II'}</span>
        <span className="text-emerald-400 font-semibold">{isRtl ? 'مستمر' : 'Audit-Ready'}</span>
      </div>
    </div>
  );
};
