import React, { useState } from 'react';
import { useSiem } from '../../context/SiemContext';
import { THEMES } from '../../types/theme';
import { LogSourceDrillDownData } from '../PowerBiLogDrillDownModal';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from 'recharts';
import { Zap, Search, ShieldCheck } from '../icons/SocIcons';

interface Props {
  onDrillDown?: (target: LogSourceDrillDownData) => void;
}

export const PowerBiAttackVectorRadarVisual: React.FC<Props> = ({ onDrillDown }) => {
  const { incidents, theme, isRtl } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const [activeVectorId, setActiveVectorId] = useState<string | null>(null);

  // Real cybersecurity attack vector classifications
  const vectorData = [
    {
      id: 'c2',
      vectorEn: 'C2 Beacons',
      vectorAr: 'إشارات C2',
      mitreId: 'T1071',
      pressure: 92,
      baseline: 28,
      severity: 'CRITICAL',
      sampleEvent: 'CobaltStrike TLS C2 Reverse Beaconing'
    },
    {
      id: 'bruteforce',
      vectorEn: 'Brute Force',
      vectorAr: 'قوة غاشمة',
      mitreId: 'T1110',
      pressure: 85,
      baseline: 35,
      severity: 'HIGH',
      sampleEvent: 'Distributed SSH Password Spray (AS44050)'
    },
    {
      id: 'rce',
      vectorEn: 'RCE Exploits',
      vectorAr: 'استغلال RCE',
      mitreId: 'T1203',
      pressure: 78,
      baseline: 18,
      severity: 'CRITICAL',
      sampleEvent: 'ActiveMQ OpenWire RCE (CVE-2023-46604)'
    },
    {
      id: 'exfil',
      vectorEn: 'Data Exfil',
      vectorAr: 'تسريب بيانات',
      mitreId: 'T1048',
      pressure: 68,
      baseline: 15,
      severity: 'HIGH',
      sampleEvent: 'High-Entropy DNS TXT Query Exfiltration'
    },
    {
      id: 'sqli',
      vectorEn: 'Web & SQLi',
      vectorAr: 'حقن SQL',
      mitreId: 'T1190',
      pressure: 74,
      baseline: 42,
      severity: 'HIGH',
      sampleEvent: 'SQL Injection in /api/v2/customer/lookup'
    },
    {
      id: 'mfa',
      vectorEn: 'MFA Fatigue',
      vectorAr: 'إجهاد MFA',
      mitreId: 'T1621',
      pressure: 62,
      baseline: 20,
      severity: 'MEDIUM',
      sampleEvent: 'Okta SSO 14x Consecutive Push Challenges'
    },
    {
      id: 'ddos',
      vectorEn: 'SYN DDoS',
      vectorAr: 'هجوم حجب',
      mitreId: 'T1498',
      pressure: 88,
      baseline: 25,
      severity: 'CRITICAL',
      sampleEvent: 'Mirai IoT 14.2 Gbps Volumetric Network Flood'
    }
  ];

  const highestThreat = vectorData.reduce((prev, curr) => (curr.pressure > prev.pressure ? curr : prev));

  const handleVectorClick = (vec: typeof vectorData[0]) => {
    setActiveVectorId(curr => curr === vec.id ? null : vec.id);
    onDrillDown?.({
      title: isRtl ? `ناقل الهجوم: ${vec.vectorAr} (${vec.mitreId})` : `Attack Vector: ${vec.vectorEn} (${vec.mitreId})`,
      subtitle: isRtl 
        ? `الضغط الحالي: ${vec.pressure}/100 · الخط المرجعي: ${vec.baseline}/100 · مثال: ${vec.sampleEvent}`
        : `Threat Pressure: ${vec.pressure}/100 · Baseline: ${vec.baseline}/100 · Sample: ${vec.sampleEvent}`,
      category: 'tactic',
      filterKey: isRtl ? 'الناقل الأمني' : 'Attack Vector',
      filterValue: vec.vectorEn,
      metricValue: `${vec.pressure}/100 Pressure Index`
    });
  };

  return (
    <div className={`w-full h-full flex flex-col justify-between p-2 select-none font-sans text-xs ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Top Threat Vector Headline Strip */}
      <div className={`p-2 rounded-[2px] border flex items-center justify-between text-[11px] font-mono mb-2 ${
        isDark ? 'bg-[#080f1e]/90 border-[#18284c]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
          <span className="opacity-75">{isRtl ? 'الناقل الأعلى خطورة:' : 'Peak Adversary Vector:'}</span>
          <span className="font-bold text-rose-400 truncate">
            {isRtl ? highestThreat.vectorAr : highestThreat.vectorEn} (<bdi dir="ltr">{highestThreat.mitreId}</bdi>)
          </span>
        </div>
        <span className="text-rose-400 font-bold tabular-nums shrink-0">
          {highestThreat.pressure}/100
        </span>
      </div>

      {/* Radar Chart Container */}
      <div className="w-full flex-1 min-h-[220px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={vectorData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid 
              stroke={isDark ? '#18284c' : '#cbd5e1'} 
              strokeDasharray="3 3"
              strokeOpacity={isDark ? 0.6 : 0.8}
            />
            <PolarAngleAxis 
              dataKey={isRtl ? 'vectorAr' : 'vectorEn'}
              tick={{ 
                fill: isDark ? '#94a3b8' : '#475569', 
                fontSize: 10, 
                fontFamily: 'monospace', 
                fontWeight: 600 
              }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              stroke={isDark ? '#18284c' : '#94a3b8'} 
              tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 8 }}
            />
            <RechartsTooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload as typeof vectorData[0];
                return (
                  <div className={`p-2.5 rounded-[2px] border shadow-xl text-xs font-mono min-w-[200px] ${
                    isDark ? 'bg-[#060c18] border-[#18284c] text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    <div className="font-bold text-[11px] pb-1 border-b border-inherit flex items-center justify-between">
                      <span>{isRtl ? d.vectorAr : d.vectorEn} (<bdi dir="ltr">{d.mitreId}</bdi>)</span>
                      <span className="text-rose-400 font-bold">{d.severity}</span>
                    </div>
                    <div className="py-1.5 space-y-1 text-[10.5px]">
                      <div className="flex justify-between items-center">
                        <span className="opacity-75">{isRtl ? 'ضغط التهديد الحالي:' : 'Threat Pressure:'}</span>
                        <span className="font-bold text-rose-400 tabular-nums">{d.pressure}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="opacity-75">{isRtl ? 'الخط المرجعي العادي:' : 'Normal Baseline:'}</span>
                        <span className="font-bold text-[#38bdf8] tabular-nums">{d.baseline}/100</span>
                      </div>
                      <div className="text-[10px] opacity-75 truncate" title={d.sampleEvent}>
                        {d.sampleEvent}
                      </div>
                    </div>
                    <div className="pt-1 border-t border-inherit flex items-center justify-between text-[10px] text-[#118dff] font-semibold cursor-pointer">
                      <span>{isRtl ? 'استعراض السجلات' : 'Filter by vector'}</span>
                      <Search className="w-3 h-3" />
                    </div>
                  </div>
                );
              }}
            />
            {/* Baseline Profile (Cyan) */}
            <Radar
              name={isRtl ? 'الخط المرجعي العادي' : 'Normal Baseline'}
              dataKey="baseline"
              stroke="#38bdf8"
              fill="#38bdf8"
              fillOpacity={0.15}
              strokeWidth={1.5}
            />
            {/* Active Incident Pressure (Rose) */}
            <Radar
              name={isRtl ? 'ضغط التهديدات الحية' : 'Live Attack Ingress'}
              dataKey="pressure"
              stroke="#f43f5e"
              fill="#f43f5e"
              fillOpacity={0.35}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Quick Interactive Vector Slices */}
      <div className={`pt-2 border-t text-[10.5px] font-mono space-y-1.5 ${
        isDark ? 'border-[#18284c]' : 'border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-rose-500 rounded-xs" />
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{isRtl ? 'الضغط الحي' : 'Live Pressure'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-[#38bdf8] rounded-xs" />
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{isRtl ? 'المرجعي' : 'Baseline'}</span>
            </div>
          </div>
          <span className="text-[10px] text-[#118dff] cursor-pointer hover:underline" onClick={() => handleVectorClick(highestThreat)}>
            {isRtl ? 'فحص السجلات' : 'Inspect Logs →'}
          </span>
        </div>
      </div>
    </div>
  );
};
