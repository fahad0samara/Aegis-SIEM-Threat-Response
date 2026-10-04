import React, { useMemo, useState } from 'react';
import { useSiem } from '../../context/SiemContext';
import { LogSourceDrillDownData } from '../PowerBiLogDrillDownModal';
import { THEMES } from '../../types/theme';
import { Server, Search, ShieldAlert, ShieldCheck, ArrowRight, ArrowLeft } from '../icons/SocIcons';

interface Props {
  onDrillDown?: (target: LogSourceDrillDownData) => void;
}

type BarViewMode = 'threatStack' | 'riskScore' | 'fleetMatrix';
type SortBy = 'volume' | 'critical' | 'risk';

interface HostData {
  host: string;
  ip: string;
  role: string;
  roleAr: string;
  os: string;
  count: number;
  criticalCount: number;
  warnCount: number;
  riskScore: number;
  isIsolated: boolean;
  statusText: string;
  statusTextAr: string;
}

export const PowerBiBarChart: React.FC<Props> = ({ onDrillDown }) => {
  const { logs, isolatedHosts, quickIsolateHost, rollbackAction, theme, isRtl } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const [viewMode, setViewMode] = useState<BarViewMode>('threatStack');
  const [sortBy, setSortBy] = useState<SortBy>('risk');

  // Realistic host infrastructure mapping
  const hostMetadata: Record<string, { ip: string; role: string; roleAr: string; os: string; baseRisk: number }> = {
    'dc-prod-01': { ip: '10.0.1.10', role: 'Domain Controller (AD/Kerberos)', roleAr: 'متحكم النطاق الرئيسي', os: 'Windows Server 2025', baseRisk: 94 },
    'api-gw-aws': { ip: '172.31.8.4', role: 'Edge API Gateway Envoy', roleAr: 'بوابة الويب والـ API الحدودية', os: 'Linux Ubuntu 24.04', baseRisk: 86 },
    'db-cluster-node2': { ip: '10.0.2.22', role: 'PostgreSQL Primary Cluster', roleAr: 'مجمع قواعد البيانات الرئيسي', os: 'Debian 12 Bookworm', baseRisk: 78 },
    'k8s-ingress-worker': { ip: '10.0.3.45', role: 'Kubernetes Ingress Controller', roleAr: 'متحكم دخول Kubernetes', os: 'CoreOS Container Linux', baseRisk: 72 },
    'bastion-core-01': { ip: '10.0.0.5', role: 'Jump Host & SSH Gateway', roleAr: 'بوابة العبور الآمنة SSH', os: 'Hardened Alpine Linux', baseRisk: 64 },
    'win-client-finance': { ip: '10.0.5.112', role: 'Executive Finance Workstation', roleAr: 'محطة العمل المالية التنفيذية', os: 'Windows 11 Pro Enterprise', baseRisk: 89 },
    'vpn-gateway-01': { ip: '198.51.100.1', role: 'Zero-Trust Network Access Gateway', roleAr: 'بوابة الوصول الشبكي الآمن', os: 'FreeBSD OpenVPN Hardened', baseRisk: 81 }
  };

  const chartData = useMemo<HostData[]>(() => {
    const hostMap: Record<string, { count: number; criticalCount: number; warnCount: number }> = {};
    
    logs.forEach(l => {
      if (!hostMap[l.host]) {
        hostMap[l.host] = { count: 0, criticalCount: 0, warnCount: 0 };
      }
      hostMap[l.host].count++;
      if (l.level === 'CRITICAL' || l.level === 'ERROR') {
        hostMap[l.host].criticalCount++;
      } else if (l.level === 'WARN') {
        hostMap[l.host].warnCount++;
      }
    });

    // Ensure all known critical fleet endpoints are listed
    Object.keys(hostMetadata).forEach(h => {
      if (!hostMap[h]) {
        hostMap[h] = { count: 48, criticalCount: 3, warnCount: 8 };
      }
    });

    const entries = Object.entries(hostMap).map(([host, data]) => {
      const meta = hostMetadata[host] || {
        ip: '10.0.4.50',
        role: 'Fleet Infrastructure Asset',
        roleAr: 'أصل بنية تحتية',
        os: 'Linux Server',
        baseRisk: 50
      };

      const isIsolated = isolatedHosts.has(host);
      // Risk formula: baseRisk + criticalCount * 4
      const calculatedRisk = Math.min(100, Math.max(10, meta.baseRisk + data.criticalCount * 3));

      return {
        host,
        ip: meta.ip,
        role: meta.role,
        roleAr: meta.roleAr,
        os: meta.os,
        count: Math.max(data.count, 24),
        criticalCount: data.criticalCount,
        warnCount: data.warnCount,
        riskScore: isIsolated ? Math.max(15, calculatedRisk - 40) : calculatedRisk,
        isIsolated,
        statusText: isIsolated ? 'ISOLATED' : data.criticalCount > 0 ? 'UNDER ATTACK' : 'HEALTHY',
        statusTextAr: isIsolated ? 'معزول' : data.criticalCount > 0 ? 'تحت الهجوم' : 'سليم'
      };
    });

    if (sortBy === 'risk') {
      return entries.sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
    } else if (sortBy === 'critical') {
      return entries.sort((a, b) => b.criticalCount - a.criticalCount).slice(0, 5);
    } else {
      return entries.sort((a, b) => b.count - a.count).slice(0, 5);
    }
  }, [logs, isolatedHosts, sortBy]);

  const handleBarClick = (entry: HostData) => {
    if (!onDrillDown) return;
    onDrillDown({
      title: isRtl ? `الأصل المستهدف: ${entry.host}` : `Endpoint Asset: ${entry.host}`,
      subtitle: isRtl
        ? `عقدة البنية التحتية · عنوان ${entry.ip} · درجة المخاطر: ${entry.riskScore}/100 · ${entry.criticalCount} إنذار حرج${entry.isIsolated ? ' · معزول أمنياً' : ''}`
        : `Infrastructure node · IP: ${entry.ip} · Risk Score: ${entry.riskScore}/100 · ${entry.criticalCount} critical alerts${entry.isIsolated ? ' · ISOLATED' : ''}`,
      category: 'host',
      filterKey: isRtl ? 'الأصل المستهدف' : 'Target Host',
      filterValue: entry.host,
      metricValue: `${entry.count} ${isRtl ? 'أحداث' : 'events'}`
    });
  };

  const handleIsolationToggle = (e: React.MouseEvent, entry: HostData) => {
    e.stopPropagation();
    if (entry.isIsolated) {
      // Find audit rollback or toggle off
      rollbackAction(`manual-${entry.host}`);
    } else {
      quickIsolateHost(entry.host, `Autonomous SOAR quarantine triggered from Fleet Exposure visual`);
    }
  };

  const maxVolume = Math.max(...chartData.map(d => d.count), 1);

  return (
    <div className="flex flex-col h-full justify-between space-y-2.5 font-sans select-none">
      {/* Subheader & Mode Controls */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-inherit text-xs font-mono">
        <div className="flex items-center gap-1.5 truncate">
          <Server className="w-3.5 h-3.5 text-[#118dff] shrink-0" />
          <span className={`text-[11px] font-semibold truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {viewMode === 'threatStack' && (isRtl ? 'تراكم الإنذارات مقابل التدفق' : 'Threat Pressure Stack')}
            {viewMode === 'riskScore' && (isRtl ? 'مؤشر تعرض الأصول للمخاطر (0-100)' : 'Asset Exposure Risk Index')}
            {viewMode === 'fleetMatrix' && (isRtl ? 'بيانات الأسطول والاحتواء السريع' : 'Fleet Profile & Containment')}
          </span>
        </div>

        {/* View Mode Segmented Controls */}
        <div className={`flex items-center gap-0.5 p-0.5 rounded-[2px] border text-[10px] shrink-0 ${
          currentTheme.subtleBgClass
        } ${currentTheme.borderClass}`}>
          <button
            onClick={() => setViewMode('threatStack')}
            className={`px-2 py-0.5 rounded-[1px] transition-colors cursor-pointer ${
              viewMode === 'threatStack'
                ? 'bg-[#118dff] text-white font-bold shadow-xs'
                : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`
            }`}
          >
            {isRtl ? 'التراكم' : 'Stack'}
          </button>
          <button
            onClick={() => setViewMode('riskScore')}
            className={`px-2 py-0.5 rounded-[1px] transition-colors cursor-pointer ${
              viewMode === 'riskScore'
                ? 'bg-[#118dff] text-white font-bold shadow-xs'
                : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`
            }`}
          >
            {isRtl ? 'المخاطر' : 'Risk'}
          </button>
          <button
            onClick={() => setViewMode('fleetMatrix')}
            className={`px-2 py-0.5 rounded-[1px] transition-colors cursor-pointer ${
              viewMode === 'fleetMatrix'
                ? 'bg-[#118dff] text-white font-bold shadow-xs'
                : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`
            }`}
          >
            {isRtl ? 'الأسطول' : 'Fleet'}
          </button>
        </div>
      </div>

      {/* Main Host Rows */}
      <div className="w-full flex-1 flex flex-col justify-between py-0.5 space-y-2">
        {chartData.map((entry) => {
          const volumePercent = Math.min(100, Math.max(12, Math.round((entry.count / maxVolume) * 100)));
          const criticalPercent = Math.min(volumePercent, Math.round((entry.criticalCount / Math.max(entry.count, 1)) * 100));

          return (
            <div
              key={entry.host}
              onClick={() => handleBarClick(entry)}
              className={`p-2 rounded-[2px] border transition-all cursor-pointer group ${
                entry.isIsolated
                  ? isDark 
                    ? 'bg-emerald-950/20 border-emerald-500/40 hover:bg-emerald-950/30' 
                    : 'bg-emerald-50/70 border-emerald-300 hover:bg-emerald-100/60'
                  : `${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.tableRowHoverClass} hover:border-[#118dff]/70`
              }`}
            >
              {/* Row 1: Host Identifier, IP, Role & Status */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-none shrink-0 ${
                    entry.isIsolated 
                      ? 'bg-emerald-400' 
                      : entry.criticalCount > 0 
                      ? 'bg-rose-500 animate-pulse' 
                      : 'bg-[#118dff]'
                  }`} />
                  
                  <div className="truncate">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                      <bdi dir="ltr" className="group-hover:text-[#118dff] transition-colors">
                        {entry.host}
                      </bdi>
                      <span className={`text-[10px] font-normal opacity-60`}>
                        (<bdi dir="ltr">{entry.ip}</bdi>)
                      </span>
                    </div>

                    <div className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isRtl ? entry.roleAr : entry.role} · <bdi dir="ltr">{entry.os}</bdi>
                    </div>
                  </div>
                </div>

                {/* Right Metrics & Quick Actions */}
                <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
                  {/* Containment Badge / Trigger */}
                  <button
                    onClick={(e) => handleIsolationToggle(e, entry)}
                    title={entry.isIsolated ? 'Host isolated. Click to restore' : 'Click to isolate host via SOAR'}
                    className={`px-1.5 py-0.5 rounded-[1px] text-[10px] font-bold border transition-colors cursor-pointer ${
                      entry.isIsolated
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30'
                        : entry.criticalCount > 0
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 hover:bg-rose-500/30'
                        : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  >
                    {isRtl ? entry.statusTextAr : entry.statusText}
                  </button>

                  {/* Risk Badge */}
                  <div className="text-right">
                    <span className={`text-xs font-bold tabular-nums ${
                      entry.riskScore >= 80 ? 'text-rose-500' : entry.riskScore >= 60 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {entry.riskScore}
                    </span>
                    <span className="text-[9.5px] opacity-60 block leading-none">RISK</span>
                  </div>

                  <Search className="w-3.5 h-3.5 text-[#118dff] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Row 2: Visual Representation depending on active mode */}
              {viewMode === 'threatStack' && (
                <div className="space-y-1">
                  {/* Dual-tone Stacked Bar */}
                  <div className={`h-2.5 w-full rounded-none overflow-hidden flex relative ${
                    isDark ? 'bg-[#050914] border border-[#18284c]/80' : 'bg-slate-100 border border-slate-300'
                  }`}>
                    {/* Critical Threat Volume */}
                    {entry.criticalCount > 0 && (
                      <div 
                        className="h-full bg-rose-500 transition-all duration-500"
                        style={{ width: `${Math.max(6, (entry.criticalCount / Math.max(entry.count, 1)) * volumePercent)}%` }}
                        title={`Critical Alarms: ${entry.criticalCount}`}
                      />
                    )}
                    {/* Warning / Elevated Events */}
                    {entry.warnCount > 0 && (
                      <div 
                        className="h-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${Math.max(4, (entry.warnCount / Math.max(entry.count, 1)) * volumePercent)}%` }}
                        title={`Warnings: ${entry.warnCount}`}
                      />
                    )}
                    {/* Ambient Telemetry */}
                    <div 
                      className={`h-full ${entry.isIsolated ? 'bg-emerald-500' : 'bg-[#118dff]'} transition-all duration-500`}
                      style={{ width: `${Math.max(10, volumePercent - ((entry.criticalCount + entry.warnCount) / Math.max(entry.count, 1)) * volumePercent)}%` }}
                      title={`Telemetry: ${entry.count} events`}
                    />

                    {/* Threat Exposure Baseline Threshold Marker at 70% */}
                    <div 
                      className="absolute top-0 bottom-0 w-[2px] bg-rose-400/80 z-10"
                      style={{ left: '70%' }}
                      title="SLA Risk Threshold (70%)"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[9.5px] font-mono opacity-75">
                    <span className="text-rose-400 font-bold">{entry.criticalCount} crit alerts</span>
                    <span className="text-amber-400">{entry.warnCount} warnings</span>
                    <span>{entry.count} total ev</span>
                  </div>
                </div>
              )}

              {viewMode === 'riskScore' && (
                <div className="space-y-1">
                  <div className={`h-2 w-full rounded-none overflow-hidden relative ${
                    isDark ? 'bg-[#050914] border border-[#18284c]' : 'bg-slate-100 border border-slate-300'
                  }`}>
                    <div 
                      className={`h-full transition-all duration-500 ${
                        entry.riskScore >= 80 ? 'bg-rose-500' : entry.riskScore >= 60 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${entry.riskScore}%` }}
                    />
                    <div 
                      className="absolute top-0 bottom-0 w-[2px] bg-amber-400/90 z-10"
                      style={{ left: '75%' }}
                      title="Alert Baseline: 75"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9.5px] font-mono opacity-75">
                    <span>{isRtl ? 'المستوى المحسوب' : 'Exposure Level'}</span>
                    <span className="font-semibold">{entry.riskScore}/100</span>
                  </div>
                </div>
              )}

              {viewMode === 'fleetMatrix' && (
                <div className={`flex items-center justify-between text-[10px] font-mono pt-1 border-t ${
                  isDark ? 'border-[#18284c]/60 text-slate-300' : 'border-slate-200 text-slate-700'
                }`}>
                  <span>Agent: Sentinel-EDR v4.2</span>
                  <span className="text-emerald-400 font-semibold">● Wire Ingestion Active</span>
                  <span className="text-[#118dff] font-bold">1-Click Drill →</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Legend with Baseline Threshold */}
      <div className={`pt-1.5 border-t flex items-center justify-between text-[10px] font-mono ${
        isDark ? 'border-[#18284c] text-slate-400' : 'border-slate-200 text-slate-500'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-none bg-rose-500" />
            <span>Crit Alarms</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-none bg-[#118dff]" />
            <span>Telemetry</span>
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2 h-0.5 bg-rose-400" />
            <span>Threshold (70%)</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400 font-bold">SOAR Ready</span>
        </div>
      </div>
    </div>
  );
};
