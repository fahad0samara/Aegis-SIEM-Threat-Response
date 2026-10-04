import React, { useState } from 'react';
import { useSiem } from '../../context/SiemContext';
import { LogSourceDrillDownData } from '../PowerBiLogDrillDownModal';
import { THEMES } from '../../types/theme';
import { User, UserX, Search, ArrowRight, ArrowLeft, ShieldAlert, Key, CheckCircle2 } from '../icons/SocIcons';

interface Props {
  onDrillDown?: (target: LogSourceDrillDownData) => void;
}

interface IdentityThreat {
  id: string;
  user: string;
  role: string;
  roleAr: string;
  vector: string;
  vectorAr: string;
  riskScore: number; // 0-100
  status: 'ACTIVE_RISK' | 'REVOKED' | 'EVALUATING';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  locationInfo: string;
  locationInfoAr: string;
  sourceIp: string;
}

const INITIAL_IDENTITIES: IdentityThreat[] = [
  {
    id: 'user-1',
    user: 'sarah.chen@corp',
    role: 'Principal Cloud Architect',
    roleAr: 'كبير معماريي السحابة',
    vector: 'Impossible Travel: NYC to London in 22 min',
    vectorAr: 'سفر مستحيل: نيويورك إلى لندن في 22 دقيقة',
    riskScore: 94,
    status: 'ACTIVE_RISK',
    severity: 'CRITICAL',
    locationInfo: 'US-East (NYC) ➔ UK-LON (ASN 13335)',
    locationInfoAr: 'أمريكا (NYC) ➔ بريطانيا (LON)',
    sourceIp: '185.220.101.42'
  },
  {
    id: 'user-2',
    user: 'david.ross@corp',
    role: 'VP Financial Operations',
    roleAr: 'نائب رئيس العمليات المالية',
    vector: 'MFA Push Bombing / Fatigue (18 pushes in 90s)',
    vectorAr: 'إغراق تنبيهات MFA (18 إشعاراً في 90ث)',
    riskScore: 96,
    status: 'ACTIVE_RISK',
    severity: 'CRITICAL',
    locationInfo: 'Prompt accepted outside working hours',
    locationInfoAr: 'قبول المطالبة خارج ساعات العمل',
    sourceIp: '194.26.29.112'
  },
  {
    id: 'user-3',
    user: 'admin_backup',
    role: 'AD Domain Service Account',
    roleAr: 'حساب خدمة نطاق Active Directory',
    vector: 'Kerberoasting: RC4 SPN Ticket Extraction',
    vectorAr: 'استخراج تذاكر SPN وتشفير RC4',
    riskScore: 89,
    status: 'ACTIVE_RISK',
    severity: 'CRITICAL',
    locationInfo: 'DC01.CORP Active Directory Controller',
    locationInfoAr: 'متحكم النطاق DC01.CORP',
    sourceIp: '10.0.1.5'
  },
  {
    id: 'user-4',
    user: 'svc_k8s_deployer',
    role: 'GitOps Automation Agent',
    roleAr: 'وكيل أتمتة GitOps',
    vector: 'Sudden GlobalAdmin Role Assignment',
    vectorAr: 'منح مفاجئ لصلاحيات مسؤول عام (GlobalAdmin)',
    riskScore: 85,
    status: 'ACTIVE_RISK',
    severity: 'HIGH',
    locationInfo: 'Azure Graph API token replay',
    locationInfoAr: 'إعادة استخدام رمز واجهة Azure Graph',
    sourceIp: '198.51.100.17'
  },
  {
    id: 'user-5',
    user: 'alex.turner@corp',
    role: 'Tier 1 Support Analyst',
    roleAr: 'محلل دعم فني مستوى أول',
    vector: 'Distributed Password Spraying (14 targets)',
    vectorAr: 'تخمين كلمات مرور موزعة عبر الأجهزة',
    riskScore: 72,
    status: 'ACTIVE_RISK',
    severity: 'MEDIUM',
    locationInfo: 'Internal workstation subnet 10.0.4.x',
    locationInfoAr: 'الشبكة الفرعية لمحطات العمل الداخلية',
    sourceIp: '10.0.4.15'
  }
];

export const PowerBiIdentityRiskVisual: React.FC<Props> = ({ onDrillDown }) => {
  const { theme, isRtl, quickRevokeUser } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const [identities, setIdentities] = useState<IdentityThreat[]>(INITIAL_IDENTITIES);
  const [selectedId, setSelectedId] = useState<string>('user-1');

  const selected = identities.find(i => i.id === selectedId) || identities[0];

  const handleRevoke = (user: IdentityThreat) => {
    quickRevokeUser(user.user, user.vector);
    setIdentities(prev => prev.map(item => item.id === user.id ? { ...item, status: 'REVOKED' } : item));
  };

  const handleDrill = (user: IdentityThreat) => {
    if (!onDrillDown) return;
    onDrillDown({
      title: isRtl ? `مخاطر الهوية والحساب: ${user.user}` : `Identity Threat Assessment: ${user.user}`,
      subtitle: isRtl
        ? `تحليل نشاط الدخول والمصادقة · ${user.roleAr} · ناقل الخطر: ${user.vectorAr} · تقييم الخطر: ${user.riskScore}/100`
        : `IAM Forensics & Auth Timeline · ${user.role} · Vector: ${user.vector} · Risk Score: ${user.riskScore}/100`,
      category: 'user',
      filterKey: isRtl ? 'المستخدم المستهدف' : 'Target User',
      filterValue: user.user,
      metricValue: `Risk ${user.riskScore}/100`
    });
  };

  return (
    <div className="flex flex-col h-full justify-between space-y-2.5 font-sans">
      {/* Subheader */}
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <Key className="w-3.5 h-3.5 text-[#118dff]" />
          <span>{isRtl ? 'مصفوفة مخاطر الهوية والوصول (ITDR)' : 'Identity Threat Detection & Response (ITDR)'}</span>
        </span>
        <span className="text-[#118dff] font-semibold flex items-center gap-1">
          <Search className="w-3 h-3" />
          <span>{isRtl ? 'اختر الحساب للتدقيق' : 'Select user to audit'}</span>
        </span>
      </div>

      {/* Main ITDR Container */}
      <div className="flex flex-col flex-1 space-y-2.5 min-h-0">
        {/* Horizontal Account Selector Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {identities.map((item) => {
            const isSelected = item.id === selectedId;
            const isRevoked = item.status === 'REVOKED';

            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[2px] border text-xs cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? isDark
                      ? 'bg-[#118dff]/20 border-[#118dff] text-white shadow-xs font-bold'
                      : 'bg-blue-100/80 border-[#0078d4] text-blue-950 shadow-xs font-bold'
                    : isDark
                      ? 'bg-[#080f1e]/80 border-[#18284c] text-slate-300 hover:text-white hover:border-[#118dff]/50'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <User className={`w-3.5 h-3.5 shrink-0 ${isRevoked ? 'text-emerald-400' : 'text-rose-400'}`} />
                <span className="font-mono text-[11px]">{item.user.split('@')[0]}</span>
                <span className={`text-[10px] font-mono tabular-nums font-bold ${
                  isRevoked ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isRevoked ? (isRtl ? 'مُبطل' : 'REVOKED') : item.riskScore}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected User IAM Risk Dossier */}
        <div className={`p-3 rounded-[2px] border flex flex-col justify-between flex-1 min-h-[200px] text-xs font-mono transition-colors ${
          isDark 
            ? 'bg-[#080f1e]/90 border-[#18284c] text-slate-100' 
            : 'bg-slate-50/90 border-slate-200 text-slate-900'
        }`}>
          <div className="space-y-2.5">
            {/* Account Header */}
            <div className="flex items-center justify-between pb-2 border-b border-inherit gap-2">
              <div className="truncate">
                <span className="font-bold text-sm text-[#118dff] font-mono truncate block">
                  {selected.user}
                </span>
                <span className={`text-[11px] truncate block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isRtl ? selected.roleAr : selected.role}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-[1px] font-bold font-mono text-[10px] shrink-0 ${
                selected.status === 'REVOKED'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {selected.status === 'REVOKED' ? (isRtl ? 'تم الإبطال' : 'REVOKED') : `Risk: ${selected.riskScore}/100`}
              </span>
            </div>

            {/* Risk Indicator Assessment */}
            <div className="space-y-2 text-[11px]">
              <div>
                <span className="text-[10px] opacity-70 block mb-0.5">
                  {isRtl ? 'ناقل الخطر المرصود عبر ITDR:' : 'Triggered Risk Indicator:'}
                </span>
                <span className="text-rose-400 font-semibold block leading-tight">
                  {isRtl ? selected.vectorAr : selected.vector}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-inherit">
                <div>
                  <span className="text-[10px] opacity-70 block mb-0.5">
                    {isRtl ? 'سياق الجغرافيا والسرعة:' : 'Geo-Velocity Context:'}
                  </span>
                  <span className={`font-medium block truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {isRtl ? selected.locationInfoAr : selected.locationInfo}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] opacity-70 block mb-0.5">
                    {isRtl ? 'عنوان IP المصدر:' : 'Source IP:'}
                  </span>
                  <bdi dir="ltr" className="font-mono font-bold text-cyan-400 block truncate">
                    {selected.sourceIp}
                  </bdi>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row with clean alignment and no overflow */}
          <div className="pt-2 mt-2 border-t border-inherit flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={() => handleDrill(selected)}
              className="text-[#118dff] hover:underline text-xs font-semibold flex items-center gap-1 cursor-pointer font-mono"
            >
              <span>{isRtl ? 'سجلات المصادقة' : 'Auth Logs'}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => handleRevoke(selected)}
              disabled={selected.status === 'REVOKED'}
              className={`px-2.5 py-1 text-[11px] rounded-[2px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                selected.status === 'REVOKED'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
              }`}
            >
              {selected.status === 'REVOKED' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تم إبطال الجلسة' : 'Session Revoked'}</span>
                </>
              ) : (
                <>
                  <UserX className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'إبطال الجلسة فوراً' : 'Revoke Session'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
