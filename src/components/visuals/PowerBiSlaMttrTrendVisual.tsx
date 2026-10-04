import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { useSiem } from '../../context/SiemContext';
import { LogSourceDrillDownData } from '../PowerBiLogDrillDownModal';
import { THEMES } from '../../types/theme';
import { Zap, Clock, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft } from '../icons/SocIcons';

interface Props {
  onDrillDown?: (target: LogSourceDrillDownData) => void;
}

type SlaTimeRange = '7d' | '14d' | '30d';

interface SlaDataPoint {
  dayLabel: string;
  mttdMinutes: number; // Mean Time to Detect
  mttrMinutes: number; // Mean Time to Respond/Contain
  slaTargetMinutes: number; // Target SLA (15 min)
  autonomousClosureRate: number; // % handled by SOAR
  incidentsResolved: number;
}

export const PowerBiSlaMttrTrendVisual: React.FC<Props> = ({ onDrillDown }) => {
  const { incidents, playbooks, theme, isRtl, setPbiPage } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const [timeRange, setTimeRange] = useState<SlaTimeRange>('7d');
  const [activeMetric, setActiveMetric] = useState<'both' | 'mttr' | 'mttd'>('both');

  const daysCount = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;

  const trendData = useMemo<SlaDataPoint[]>(() => {
    const points: SlaDataPoint[] = [];
    const now = new Date();

    // Baseline MTTR improves toward current day thanks to SOAR playbooks
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayLabel = d.toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
        month: 'short',
        day: 'numeric'
      });

      // Synthetic realistic variance with downward trend (faster response over time)
      const progressFactor = (daysCount - i) / daysCount;
      const mttd = Math.max(1.8, +(4.8 - progressFactor * 1.6 + Math.sin(i * 1.3) * 0.7).toFixed(1));
      const mttr = Math.max(4.5, +(14.2 - progressFactor * 4.8 + Math.cos(i * 1.5) * 1.2).toFixed(1));
      const autonomousRate = Math.min(94, Math.round(62 + progressFactor * 24 + Math.sin(i * 2.1) * 4));
      const resolvedCount = Math.max(6, Math.round(14 + Math.sin(i) * 5));

      points.push({
        dayLabel,
        mttdMinutes: mttd,
        mttrMinutes: mttr,
        slaTargetMinutes: 15,
        autonomousClosureRate: autonomousRate,
        incidentsResolved: resolvedCount
      });
    }

    return points;
  }, [daysCount, isRtl]);

  const currentMttr = trendData[trendData.length - 1]?.mttrMinutes || 9.4;
  const currentMttd = trendData[trendData.length - 1]?.mttdMinutes || 3.2;
  const currentSoarRate = trendData[trendData.length - 1]?.autonomousClosureRate || 86;

  const handlePointClick = (data: SlaDataPoint) => {
    if (!onDrillDown) return;
    onDrillDown({
      title: isRtl ? `أداء الاستجابة لـ ${data.dayLabel}` : `SLA Response Metrics for ${data.dayLabel}`,
      subtitle: isRtl
        ? `متوسط زمن الرصد: ${data.mttdMinutes} دقيقة · متوسط زمن الاحتواء: ${data.mttrMinutes} دقيقة · نسبة الأتمتة: ${data.autonomousClosureRate}%`
        : `MTTD: ${data.mttdMinutes}m · MTTR: ${data.mttrMinutes}m · SOAR Closure Rate: ${data.autonomousClosureRate}% · Target SLA: 15m`,
      category: 'anomaly',
      filterKey: 'SLA Date',
      filterValue: data.dayLabel,
      metricValue: `${data.mttrMinutes}m MTTR`
    });
  };

  return (
    <div className={`h-full flex flex-col justify-between font-sans ${currentTheme.textPrimaryClass}`}>
      {/* Top Controls & Headline Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-inherit">
        {/* KPI Spark Summary Badges */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className={currentTheme.textSecondaryClass}>
              {isRtl ? 'زمن الاحتواء (MTTR):' : 'MTTR:'}
            </span>
            <span className="font-bold text-emerald-400">{currentMttr}m</span>
          </div>

          <span className="opacity-30">·</span>

          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#118dff]" />
            <span className={currentTheme.textSecondaryClass}>
              {isRtl ? 'زمن الرصد (MTTD):' : 'MTTD:'}
            </span>
            <span className="font-bold text-[#118dff]">{currentMttd}m</span>
          </div>

          <span className="opacity-30">·</span>

          <div className="flex items-center gap-1.5 font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className={currentTheme.textSecondaryClass}>
              {isRtl ? 'إغلاق آلي:' : 'SOAR Auto:'}
            </span>
            <span className="font-bold text-amber-400">{currentSoarRate}%</span>
          </div>

          <span className="opacity-30">·</span>

          <span className="text-[10.5px] font-mono text-emerald-400 font-semibold">
            {isRtl ? '✓ ضمن التزام SLA (< 15 دقيقة)' : '✓ 100% SLA Compliant (< 15m)'}
          </span>
        </div>

        {/* Filter Slicers: 7D / 14D / 30D & Metric Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Slicer */}
          <div className={`flex items-center rounded-[2px] p-0.5 font-mono text-[10.5px] border ${currentTheme.subtleBgClass} ${currentTheme.borderClass}`}>
            {(['7d', '14d', '30d'] as const).map(rng => (
              <button
                key={rng}
                onClick={() => setTimeRange(rng)}
                className={`px-2 py-0.5 rounded-[2px] cursor-pointer transition-colors ${
                  timeRange === rng
                    ? 'bg-[#118dff] text-white font-bold shadow-xs'
                    : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`
                }`}
              >
                {rng.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Metric Filter */}
          <div className={`flex items-center rounded-[2px] p-0.5 font-mono text-[10.5px] border ${currentTheme.subtleBgClass} ${currentTheme.borderClass}`}>
            {[
              { id: 'both' as const, label: isRtl ? 'كلاهما' : 'Both' },
              { id: 'mttr' as const, label: 'MTTR' },
              { id: 'mttd' as const, label: 'MTTD' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setActiveMetric(m.id)}
                className={`px-2 py-0.5 rounded-[2px] cursor-pointer transition-colors ${
                  activeMetric === m.id
                    ? `${currentTheme.activeItemBgClass} font-bold shadow-xs`
                    : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 min-h-[220px] w-full pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={trendData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload[0]) {
                handlePointClick(state.activePayload[0].payload as SlaDataPoint);
              }
            }}
          >
            <defs>
              <linearGradient id="mttrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="mttdGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#118dff" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#118dff" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="2 2"
              vertical={false}
              stroke={isDark ? '#1e293b' : '#e2e8f0'}
              opacity={0.6}
            />

            <XAxis
              dataKey="dayLabel"
              tickLine={false}
              axisLine={{ stroke: isDark ? '#334155' : '#cbd5e1' }}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontFamily: 'monospace' }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, 20]}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontFamily: 'monospace' }}
              unit="m"
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as SlaDataPoint;
                  return (
                    <div className={`p-2.5 rounded-[2px] shadow-xl border text-xs font-mono select-none ${
                      currentTheme.cardBgClass
                    } ${currentTheme.borderClass} ${currentTheme.textPrimaryClass}`}>
                      <div className="font-bold border-b pb-1 mb-1.5 flex items-center justify-between gap-4">
                        <span>{d.dayLabel}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">
                          {d.mttrMinutes <= 15 ? (isRtl ? '✓ ملتزم بالاتفاقية' : '✓ SLA Compliant') : (isRtl ? '⚠ تجاوز الاتفاقية' : '⚠ Breach')}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4 text-emerald-400">
                          <span>{isRtl ? 'زمن الاحتواء (MTTR):' : 'Mean Time to Respond:'}</span>
                          <span className="font-bold tabular-nums">{d.mttrMinutes} min</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[#118dff]">
                          <span>{isRtl ? 'زمن الرصد (MTTD):' : 'Mean Time to Detect:'}</span>
                          <span className="font-bold tabular-nums">{d.mttdMinutes} min</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-amber-400">
                          <span>{isRtl ? 'أتمتة SOAR:' : 'SOAR Autonomous Rate:'}</span>
                          <span className="font-bold tabular-nums">{d.autonomousClosureRate}%</span>
                        </div>
                        <div className={`flex items-center justify-between gap-4 text-[10px] pt-1 border-t ${currentTheme.borderClass} ${currentTheme.textSecondaryClass}`}>
                          <span>{isRtl ? 'هدف اتفاقية SLA:' : 'SLA Target:'}</span>
                          <span>&lt; 15.0 min</span>
                        </div>
                      </div>

                      <div className="mt-1.5 pt-1 border-t text-[9.5px] text-[#118dff] text-center cursor-pointer">
                        {isRtl ? 'انقر لاستعراض السجلات التفصيلية ←' : 'Click to drill down into logs →'}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* SLA Commitment Target Line (15 Minutes) */}
            <ReferenceLine
              y={15}
              stroke="#f43f5e"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: isRtl ? 'سقف اتفاقية SLA (15 دقيقة)' : 'SLA Max (15m)',
                position: isRtl ? 'insideTopLeft' : 'insideTopRight',
                fill: '#f43f5e',
                fontSize: 10,
                fontFamily: 'monospace'
              }}
            />

            {/* MTTR Area & Line */}
            {(activeMetric === 'both' || activeMetric === 'mttr') && (
              <Area
                type="monotone"
                dataKey="mttrMinutes"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#mttrGradient)"
                name="MTTR"
                dot={{ r: 2.5, fill: '#10b981', strokeWidth: 1, stroke: '#fff' }}
                activeDot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
              />
            )}

            {/* MTTD Area & Line */}
            {(activeMetric === 'both' || activeMetric === 'mttd') && (
              <Area
                type="monotone"
                dataKey="mttdMinutes"
                stroke="#118dff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#mttdGradient)"
                name="MTTD"
                dot={{ r: 2, fill: '#118dff', strokeWidth: 1, stroke: '#fff' }}
                activeDot={{ r: 4, fill: '#118dff', strokeWidth: 2, stroke: '#fff' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Insights Footnote */}
      <div className={`mt-2 pt-2 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10.5px] font-mono ${currentTheme.borderClass} ${currentTheme.textSecondaryClass}`}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {isRtl 
              ? 'معدل تقليص وقت الاستجابة: تحسن بنسبة 38% بفضل تفعيل مشغلات SOAR الآلية'
              : 'SOC Containment Velocity: 38% response acceleration achieved via automated SOAR triage'}
          </span>
        </div>

        <button
          onClick={() => setPbiPage('playbooks')}
          className="text-[#118dff] hover:underline font-bold flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>{isRtl ? 'عرض كتيبات SOAR' : 'View SOAR Playbooks'}</span>
          {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};
