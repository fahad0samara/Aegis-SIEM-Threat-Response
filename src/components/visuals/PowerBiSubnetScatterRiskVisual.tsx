import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { useSiem } from '../../context/SiemContext';
import { LogSourceDrillDownData } from '../PowerBiLogDrillDownModal';
import { THEMES } from '../../types/theme';
import { Globe, ShieldAlert, Zap, Lock, Filter } from '../icons/SocIcons';

interface Props {
  onDrillDown?: (target: LogSourceDrillDownData) => void;
}

interface SubnetRiskPoint {
  id: string;
  cidr: string;
  asnName: string;
  country: string;
  countryCode: string;
  eventsPerHour: number;
  threatScore: number;
  affectedHosts: number;
  threatCategory: 'APT C2' | 'Brute Force Spray' | 'Vulnerability Scan' | 'DDoS Probe';
  threatCategoryAr: string;
  isBlocked: boolean;
  color: string;
}

export const PowerBiSubnetScatterRiskVisual: React.FC<Props> = ({ onDrillDown }) => {
  const { blockedIps, quickBlockIp, theme, isRtl } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const subnetPoints = useMemo<SubnetRiskPoint[]>(() => {
    return [
      {
        id: 'sub-1',
        cidr: '185.220.101.0/24',
        asnName: 'AS208323 / Tor Exit Node Fabric',
        country: 'Germany',
        countryCode: 'DE',
        eventsPerHour: 5420,
        threatScore: 98,
        affectedHosts: 14,
        threatCategory: 'APT C2',
        threatCategoryAr: 'تحكم وخوادم C2 متقدمة',
        isBlocked: blockedIps.has('185.220.101.5'),
        color: '#f43f5e'
      },
      {
        id: 'sub-2',
        cidr: '45.154.255.0/24',
        asnName: 'AS44050 / PetersHost Cloud Transit',
        country: 'Russia',
        countryCode: 'RU',
        eventsPerHour: 4890,
        threatScore: 95,
        affectedHosts: 12,
        threatCategory: 'APT C2',
        threatCategoryAr: 'تحكم وخوادم C2 متقدمة',
        isBlocked: blockedIps.has('45.154.255.88'),
        color: '#f43f5e'
      },
      {
        id: 'sub-3',
        cidr: '103.145.13.0/24',
        asnName: 'AS139220 / VNPT Bulletproof ISP',
        country: 'Vietnam',
        countryCode: 'VN',
        eventsPerHour: 3650,
        threatScore: 84,
        affectedHosts: 9,
        threatCategory: 'Brute Force Spray',
        threatCategoryAr: 'هجمات تخمين كلمات المرور الموزعة',
        isBlocked: false,
        color: '#f59e0b'
      },
      {
        id: 'sub-4',
        cidr: '91.240.118.0/24',
        asnName: 'AS200019 / Hostkey B.V. Cloud',
        country: 'Netherlands',
        countryCode: 'NL',
        eventsPerHour: 3120,
        threatScore: 88,
        affectedHosts: 11,
        threatCategory: 'Brute Force Spray',
        threatCategoryAr: 'هجمات تخمين كلمات المرور الموزعة',
        isBlocked: false,
        color: '#f59e0b'
      },
      {
        id: 'sub-5',
        cidr: '194.26.29.0/24',
        asnName: 'AS49505 / ServerAstra Proxy Net',
        country: 'Hungary',
        countryCode: 'HU',
        eventsPerHour: 2780,
        threatScore: 78,
        affectedHosts: 6,
        threatCategory: 'Vulnerability Scan',
        threatCategoryAr: 'مسح واستكشاف الثغرات',
        isBlocked: false,
        color: '#38bdf8'
      },
      {
        id: 'sub-6',
        cidr: '198.51.100.0/24',
        asnName: 'AS64512 / Shadow Brokers Transit',
        country: 'Romania',
        countryCode: 'RO',
        eventsPerHour: 2450,
        threatScore: 82,
        affectedHosts: 8,
        threatCategory: 'Vulnerability Scan',
        threatCategoryAr: 'مسح واستكشاف الثغرات',
        isBlocked: false,
        color: '#38bdf8'
      },
      {
        id: 'sub-7',
        cidr: '223.71.167.0/24',
        asnName: 'AS4134 / China Telecom Backbone',
        country: 'China',
        countryCode: 'CN',
        eventsPerHour: 4200,
        threatScore: 91,
        affectedHosts: 16,
        threatCategory: 'APT C2',
        threatCategoryAr: 'تحكم وخوادم C2 متقدمة',
        isBlocked: false,
        color: '#f43f5e'
      },
      {
        id: 'sub-8',
        cidr: '178.128.240.0/24',
        asnName: 'AS14061 / DigitalOcean Compromised VPS',
        country: 'Singapore',
        countryCode: 'SG',
        eventsPerHour: 1850,
        threatScore: 68,
        affectedHosts: 5,
        threatCategory: 'DDoS Probe',
        threatCategoryAr: 'استطلاع الحرمان من الخدمة',
        isBlocked: false,
        color: '#a855f7'
      }
    ];
  }, [blockedIps]);

  const filteredPoints = useMemo(() => {
    if (categoryFilter === 'all') return subnetPoints;
    return subnetPoints.filter(p => p.threatCategory === categoryFilter);
  }, [subnetPoints, categoryFilter]);

  const handlePointClick = (point: SubnetRiskPoint) => {
    if (!onDrillDown) return;
    onDrillDown({
      title: isRtl ? `نطاق الهجوم العدائي: ${point.cidr}` : `Adversary CIDR Subnet: ${point.cidr}`,
      subtitle: isRtl
        ? `المزود: ${point.asnName} · الدولة: ${point.country} · درجة الخطر: ${point.threatScore}/100 · الأجهزة المستهدفة: ${point.affectedHosts}`
        : `ASN: ${point.asnName} · Origin: ${point.country} · Threat Score: ${point.threatScore}/100 · Affected Hosts: ${point.affectedHosts}`,
      category: 'country',
      filterKey: 'Subnet CIDR',
      filterValue: point.country,
      metricValue: `${point.eventsPerHour.toLocaleString()} events/hr`
    });
  };

  return (
    <div className={`h-full flex flex-col justify-between font-sans ${currentTheme.textPrimaryClass}`}>
      {/* Top Filter & Slicer Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-inherit">
        {/* Metric Badges */}
        <div className="flex items-center gap-3 flex-wrap text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className={currentTheme.textSecondaryClass}>
              {isRtl ? 'نطاقات نشطة:' : 'Active CIDRs:'}
            </span>
            <span className="font-bold text-rose-400">{filteredPoints.length}</span>
          </div>

          <span className="opacity-30">·</span>

          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className={currentTheme.textSecondaryClass}>
              {isRtl ? 'متوسط الخطر:' : 'Avg Risk:'}
            </span>
            <span className="font-bold text-amber-400">86.2/100</span>
          </div>

          <span className="opacity-30">·</span>

          <span className={`text-[10px] ${currentTheme.textSecondaryClass}`}>
            {isRtl ? 'حجم الفقاعة = عدد الأجهزة المستهدفة' : 'Bubble size = Targeted fleet endpoints'}
          </span>
        </div>

        {/* Category Slicers */}
        <div className={`flex items-center rounded-[2px] p-0.5 font-mono text-[10.5px] border ${currentTheme.subtleBgClass} ${currentTheme.borderClass}`}>
          {[
            { id: 'all', label: isRtl ? 'الكل' : 'All' },
            { id: 'APT C2', label: 'APT C2' },
            { id: 'Brute Force Spray', label: isRtl ? 'تخمين' : 'Brute Force' },
            { id: 'Vulnerability Scan', label: isRtl ? 'مسح' : 'Scan' }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-2 py-0.5 rounded-[2px] cursor-pointer transition-colors ${
                categoryFilter === c.id
                  ? 'bg-[#118dff] text-white font-bold shadow-xs'
                  : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Scatter Matrix */}
      <div className="flex-1 min-h-[220px] w-full pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 10, right: 15, bottom: 5, left: -20 }}
          >
            <CartesianGrid
              strokeDasharray="2 2"
              stroke={isDark ? '#1e293b' : '#e2e8f0'}
              opacity={0.6}
            />

            <XAxis
              type="number"
              dataKey="eventsPerHour"
              name="Events/Hour"
              tickLine={false}
              axisLine={{ stroke: isDark ? '#334155' : '#cbd5e1' }}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            />

            <YAxis
              type="number"
              dataKey="threatScore"
              name="Threat Score"
              domain={[50, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontFamily: 'monospace' }}
              unit="pts"
            />

            <ZAxis
              type="number"
              dataKey="affectedHosts"
              range={[80, 480]}
              name="Target Hosts"
            />

            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: isDark ? '#475569' : '#94a3b8' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as SubnetRiskPoint;
                  return (
                    <div className={`p-2.5 rounded-[2px] shadow-xl border text-xs font-mono select-none ${
                      currentTheme.cardBgClass
                    } ${currentTheme.borderClass} ${currentTheme.textPrimaryClass}`}>
                      <div className="font-bold border-b pb-1 mb-1.5 flex items-center justify-between gap-4">
                        <span className="text-[#118dff]">{d.cidr}</span>
                        <span className="text-[10px] px-1 rounded-[2px] bg-rose-500/20 text-rose-400 font-bold">
                          {d.threatScore} / 100 Risk
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <div className="text-slate-300 truncate max-w-[200px]">
                          {d.asnName}
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className={currentTheme.textSecondaryClass}>{isRtl ? 'الموقع الجغرافي:' : 'Origin:'}</span>
                          <span className="font-semibold">{d.country} ({d.countryCode})</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className={currentTheme.textSecondaryClass}>{isRtl ? 'كثافة الهجمات:' : 'Ingress Rate:'}</span>
                          <span className="font-bold tabular-nums text-amber-400">{d.eventsPerHour.toLocaleString()} eps/hr</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className={currentTheme.textSecondaryClass}>{isRtl ? 'الأجهزة المستهدفة:' : 'Blast Radius:'}</span>
                          <span className="font-bold tabular-nums text-rose-400">{d.affectedHosts} hosts</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className={currentTheme.textSecondaryClass}>{isRtl ? 'تصنيف التهديد:' : 'Threat Vector:'}</span>
                          <span className="font-semibold text-purple-400">{isRtl ? d.threatCategoryAr : d.threatCategory}</span>
                        </div>
                      </div>

                      <div className="mt-2 pt-1 border-t flex items-center justify-between gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            quickBlockIp(d.cidr.split('/')[0], `Subnet block for ${d.cidr}`);
                          }}
                          className="px-2 py-0.5 rounded-[2px] bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold cursor-pointer"
                        >
                          {isRtl ? 'حظر عبر الجدار الناري' : 'Block CIDR'}
                        </button>
                        <span className="text-[9.5px] text-[#118dff] cursor-pointer">
                          {isRtl ? 'فحص السجلات ←' : 'Drill down →'}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Scatter
              data={filteredPoints}
              onClick={(node: any) => handlePointClick(node?.payload || node)}
              cursor="pointer"
            >
              {filteredPoints.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={entry.color}
                  fillOpacity={0.75}
                  stroke={entry.isBlocked ? '#10b981' : entry.color}
                  strokeWidth={entry.isBlocked ? 3 : 1}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Subnet Footnote */}
      <div className={`mt-2 pt-2 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10.5px] font-mono ${currentTheme.borderClass} ${currentTheme.textSecondaryClass}`}>
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-[#118dff]" />
          <span>
            {isRtl 
              ? 'توجيه ASN العدائي: رصد 8 نطاقات فرعية غير موثوقة تستهدف وحدات التحكم السحابية'
              : 'Autonomous Threat Intel: 8 suspicious transit ASNs actively probing cloud control plane'}
          </span>
        </div>

        <span className="text-emerald-400 font-semibold">
          {isRtl ? '✓ كشف تلقائي للبروكسيات' : '✓ Live Tor/Bulletproof Feed Active'}
        </span>
      </div>
    </div>
  );
};
