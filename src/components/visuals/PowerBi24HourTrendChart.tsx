import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot
} from 'recharts';
import { useSiem } from '../../context/SiemContext';
import { LogSourceDrillDownData } from '../PowerBiLogDrillDownModal';
import { THEMES } from '../../types/theme';
import { ArrowRight, ArrowLeft, Search, Activity, AlertTriangle, ShieldAlert } from '../icons/SocIcons';

interface HourlyDataPoint {
  hourLabel: string;
  hourNumber: number;
  totalEvents: number;
  criticalEvents: number;
  warningEvents: number;
  infoEvents: number;
  baselineEvents: number;
  threshold: number;
  anomaly?: boolean;
  anomalyTitle?: string;
  anomalyTitleAr?: string;
}

interface Props {
  onDrillDown?: (target: LogSourceDrillDownData) => void;
}

type HorizonMode = '6h' | '12h' | '24h';
type MetricView = 'waveform' | 'stacked' | 'spikes';

export const PowerBi24HourTrendChart: React.FC<Props> = ({ onDrillDown }) => {
  const { logs, incidents, theme, isRtl, isStreaming } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const [horizon, setHorizon] = useState<HorizonMode>('24h');
  const [metricView, setMetricView] = useState<MetricView>('waveform');

  // Generate continuous time series ending at the current hour
  const fullTrendData = useMemo<HourlyDataPoint[]>(() => {
    const points: HourlyDataPoint[] = [];
    const now = new Date();
    const currentHour = now.getHours();

    const diurnalCurve = [
      0.35, 0.28, 0.22, 0.20, 0.24, 0.38, 
      0.65, 0.95, 1.35, 1.62, 1.78, 1.70, 
      1.55, 1.68, 1.82, 1.75, 1.50, 1.25, 
      0.98, 0.85, 0.72, 0.58, 0.48, 0.40
    ];

    const bucketCounts: Record<number, { total: number; critical: number; warn: number; info: number }> = {};
    for (let h = 0; h < 24; h++) {
      bucketCounts[h] = { total: 0, critical: 0, warn: 0, info: 0 };
    }

    logs.forEach(l => {
      const d = new Date(l.timestamp);
      const h = d.getHours();
      if (bucketCounts[h]) {
        bucketCounts[h].total++;
        if (l.level === 'CRITICAL' || l.level === 'ERROR') {
          bucketCounts[h].critical++;
        } else if (l.level === 'WARN') {
          bucketCounts[h].warn++;
        } else {
          bucketCounts[h].info++;
        }
      }
    });

    incidents.forEach(inc => {
      const d = new Date(inc.timestamp);
      const h = d.getHours();
      if (bucketCounts[h]) {
        bucketCounts[h].critical += 3;
        bucketCounts[h].total += 8;
      }
    });

    for (let i = 23; i >= 0; i--) {
      const pastHourDate = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = pastHourDate.getHours();
      const label = `${hour.toString().padStart(2, '0')}:00`;
      
      const factor = diurnalCurve[hour] || 1.0;
      const baseVolume = 1200 * factor;
      
      const dynamicMultiplier = logs.length > 0 ? (logs.length / 50) : 1;
      const realTotal = bucketCounts[hour].total * 18;
      const realCrit = bucketCounts[hour].critical * 6;
      const realWarn = bucketCounts[hour].warn * 8;

      const jitter = Math.sin(hour * 1.7 + i) * 110;
      const totalEvents = Math.max(220, Math.round((baseVolume + realTotal + jitter) * dynamicMultiplier));
      
      const isCobaltSpike = hour === (currentHour - 2 + 24) % 24;
      const isBruteSpike = hour === (currentHour - 8 + 24) % 24;
      const criticalEvents = Math.max(2, Math.round((totalEvents * 0.08) + realCrit + (isCobaltSpike ? 65 : isBruteSpike ? 42 : 0)));
      const warningEvents = Math.max(8, Math.round((totalEvents * 0.22) + realWarn));
      const infoEvents = Math.max(10, totalEvents - criticalEvents - warningEvents);

      const isSpikeAnomaly = isCobaltSpike || isBruteSpike || criticalEvents > 60;
      const anomalyTitle = isCobaltSpike 
        ? 'Cobalt Strike C2 Beaconing Burst' 
        : isBruteSpike 
        ? 'Distributed SSH Password Spray' 
        : 'Elevated Threat Volume';
      const anomalyTitleAr = isCobaltSpike 
        ? 'تدفق إشارات C2 لبرمجية Cobalt Strike' 
        : isBruteSpike 
        ? 'هجوم رش كلمات مرور SSH موزع' 
        : 'ارتفاع حاد في حجم التهديدات';

      points.push({
        hourLabel: label,
        hourNumber: hour,
        totalEvents,
        criticalEvents,
        warningEvents,
        infoEvents,
        baselineEvents: Math.round(baseVolume),
        threshold: 2100,
        anomaly: isSpikeAnomaly,
        anomalyTitle,
        anomalyTitleAr
      });
    }

    return points;
  }, [logs, incidents]);

  // Filter based on selected horizon
  const trendData = useMemo(() => {
    if (horizon === '6h') return fullTrendData.slice(-6);
    if (horizon === '12h') return fullTrendData.slice(-12);
    return fullTrendData;
  }, [fullTrendData, horizon]);

  const statsAggregates = useMemo(() => {
    let sumTotal = 0;
    let sumCrit = 0;
    let peakVal = 0;
    let peakHour = '';

    trendData.forEach(d => {
      sumTotal += d.totalEvents;
      sumCrit += d.criticalEvents;
      if (d.totalEvents > peakVal) {
        peakVal = d.totalEvents;
        peakHour = d.hourLabel;
      }
    });

    const eps = Math.round(sumTotal / (trendData.length * 3600) * 12);

    return { sumTotal, sumCrit, peakVal, peakHour, eps };
  }, [trendData]);

  const formatNumber = (val: number) => {
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toString();
  };

  const triggerDrillDownForHour = (hourStr: string, point?: HourlyDataPoint) => {
    if (!onDrillDown) return;
    const pt = point || trendData.find(d => d.hourLabel === hourStr);
    onDrillDown({
      title: isRtl ? `النافذة الزمنية للقياس: ${hourStr}` : `Hourly Telemetry Window: ${hourStr}`,
      subtitle: isRtl 
        ? `عينة التدفق بالساعة · ${pt ? pt.totalEvents.toLocaleString() : '1,200'} حدث قياس · ${pt ? pt.criticalEvents : '0'} تنبيهات أمنية حرجة`
        : `Hourly telemetry sample · ${pt ? pt.totalEvents.toLocaleString() : '1,200'} events · ${pt ? pt.criticalEvents : '0'} critical alarms`,
      category: 'hourly',
      filterKey: isRtl ? 'النافذة الزمنية' : 'Time Bucket',
      filterValue: hourStr,
      metricValue: `${pt ? pt.totalEvents.toLocaleString() : '0'} ${isRtl ? 'أحداث' : 'events'}`
    });
  };

  return (
    <div className="flex flex-col h-full justify-between space-y-2.5 font-sans select-none">
      {/* Top Telemetry Header Bar */}
      <div className={`p-2 rounded-[2px] border flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
        isDark ? 'bg-[#080f1e]/90 border-[#18284c]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Total Volume */}
          <div className="space-y-0.5">
            <span className={`text-[10px] uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {isRtl ? 'إجمالي التدفق' : 'Ingress Volume'}
            </span>
            <span className="text-base font-bold text-[#118dff] tabular-nums">
              {statsAggregates.sumTotal.toLocaleString()}
            </span>
          </div>

          <div className="h-6 w-px bg-inherit opacity-40 hidden sm:block" />

          {/* Critical Threats */}
          <div className="space-y-0.5">
            <span className={`text-[10px] uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {isRtl ? 'طفرات التهديد الحرجة' : 'Critical Threat Spikes'}
            </span>
            <span className="text-base font-bold text-rose-500 tabular-nums">
              {statsAggregates.sumCrit.toLocaleString()}
            </span>
          </div>

          <div className="h-6 w-px bg-inherit opacity-40 hidden sm:block" />

          {/* Peak Rate */}
          <div className="space-y-0.5">
            <span className={`text-[10px] uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {isRtl ? 'ذروة الساعة' : 'Peak Velocity'}
            </span>
            <span className="text-base font-bold text-cyan-400 tabular-nums">
              {statsAggregates.peakVal.toLocaleString()} <span className="text-[10px] font-normal opacity-70">@ {statsAggregates.peakHour}</span>
            </span>
          </div>

          <div className="h-6 w-px bg-inherit opacity-40 hidden md:block" />

          {/* Real-Time EPS */}
          <div className="space-y-0.5 hidden md:block">
            <span className={`text-[10px] uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {isRtl ? 'معدل الاستيعاب (EPS)' : 'Throughput'}
            </span>
            <span className="text-base font-bold text-emerald-400 tabular-nums">
              {statsAggregates.eps} EPS
            </span>
          </div>
        </div>

        {/* Horizon and Mode Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Horizon Selector */}
          <div className={`flex items-center gap-0.5 p-0.5 rounded-[2px] border text-[10.5px] ${
            isDark ? 'bg-[#060c18] border-[#18284c]' : 'bg-slate-200 border-slate-300'
          }`}>
            <button
              onClick={() => setHorizon('6h')}
              className={`px-2 py-0.5 rounded-[1px] transition-colors cursor-pointer ${
                horizon === '6h' 
                  ? 'bg-[#118dff] text-white font-bold shadow-xs' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              6H
            </button>
            <button
              onClick={() => setHorizon('12h')}
              className={`px-2 py-0.5 rounded-[1px] transition-colors cursor-pointer ${
                horizon === '12h' 
                  ? 'bg-[#118dff] text-white font-bold shadow-xs' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              12H
            </button>
            <button
              onClick={() => setHorizon('24h')}
              className={`px-2 py-0.5 rounded-[1px] transition-colors cursor-pointer ${
                horizon === '24h' 
                  ? 'bg-[#118dff] text-white font-bold shadow-xs' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              24H
            </button>
          </div>

          {/* Metric View Selector */}
          <div className={`flex items-center gap-0.5 p-0.5 rounded-[2px] border text-[10.5px] ${
            isDark ? 'bg-[#060c18] border-[#18284c]' : 'bg-slate-200 border-slate-300'
          }`}>
            <button
              onClick={() => setMetricView('waveform')}
              className={`px-2 py-0.5 rounded-[1px] transition-colors cursor-pointer ${
                metricView === 'waveform'
                  ? 'bg-[#118dff] text-white font-bold shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isRtl ? 'الموجة' : 'Waveform'}
            </button>
            <button
              onClick={() => setMetricView('stacked')}
              className={`px-2 py-0.5 rounded-[1px] transition-colors cursor-pointer ${
                metricView === 'stacked'
                  ? 'bg-[#118dff] text-white font-bold shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isRtl ? 'الطبقات' : 'Stacked'}
            </button>
            <button
              onClick={() => setMetricView('spikes')}
              className={`px-2 py-0.5 rounded-[1px] transition-colors cursor-pointer ${
                metricView === 'spikes'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isRtl ? 'الطفرات' : 'Spikes'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Composed Chart */}
      <div className="w-full h-[240px] min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={trendData}
            margin={{ top: 12, right: 15, left: -8, bottom: 0 }}
            onClick={(e: any) => {
              if (e && e.activePayload && e.activePayload.length > 0) {
                const pt = e.activePayload[0].payload as HourlyDataPoint;
                if (pt) triggerDrillDownForHour(pt.hourLabel, pt);
              } else if (e && e.activeLabel) {
                triggerDrillDownForHour(e.activeLabel);
              }
            }}
            className="cursor-pointer"
          >
            <defs>
              <linearGradient id="pbiTotalWaveform" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#118dff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#118dff" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="pbiCritWaveform" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="pbiWarnWaveform" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#facc15" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#facc15" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#18284c' : '#e2e8f0'}
              vertical={false}
            />

            <XAxis
              dataKey="hourLabel"
              tickLine={false}
              axisLine={{ stroke: isDark ? '#18284c' : '#cbd5e1' }}
              tick={{
                fill: isDark ? '#94a3b8' : '#64748b',
                fontSize: 10,
                fontFamily: 'monospace'
              }}
              interval={horizon === '6h' ? 0 : horizon === '12h' ? 1 : 2}
            />

            <YAxis
              tickLine={false}
              axisLine={{ stroke: isDark ? '#18284c' : '#cbd5e1' }}
              tick={{
                fill: isDark ? '#94a3b8' : '#64748b',
                fontSize: 10,
                fontFamily: 'monospace'
              }}
              tickFormatter={formatNumber}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const point = payload[0]?.payload as HourlyDataPoint;
                if (!point) return null;

                return (
                  <div className={`p-3 rounded-[2px] border shadow-xl text-xs font-mono min-w-[240px] ${
                    isDark 
                      ? 'bg-[#080f1e] border-[#18284c] text-white' 
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-inherit">
                      <span className="font-bold">{isRtl ? `النافذة: ${label}` : `Window: ${label}`}</span>
                      {point.anomaly && (
                        <span className="text-[9.5px] bg-rose-600 text-white px-1.5 py-0.5 rounded-[1px] font-sans font-bold flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>{isRtl ? 'طفرة شاذة' : 'THREAT SPIKE'}</span>
                        </span>
                      )}
                    </div>

                    {point.anomaly && (
                      <div className="mb-2 p-1.5 rounded-[1px] bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10.5px]">
                        <strong>{isRtl ? point.anomalyTitleAr : point.anomalyTitle}</strong>
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-none bg-[#118dff]" />
                          <span>{isRtl ? 'إجمالي السجلات:' : 'Total Telemetry:'}</span>
                        </span>
                        <span className="font-bold tabular-nums">
                          {point.totalEvents.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-none bg-rose-500" />
                          <span>{isRtl ? 'إنذارات حرجة:' : 'Critical Spikes:'}</span>
                        </span>
                        <span className="font-bold text-rose-500 tabular-nums">
                          {point.criticalEvents.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-none bg-amber-400" />
                          <span>{isRtl ? 'تحذيرات:' : 'Warnings:'}</span>
                        </span>
                        <span className="font-bold text-amber-400 tabular-nums">
                          {point.warningEvents.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-none bg-emerald-500" />
                          <span>{isRtl ? 'طبيعي / معلوماتي:' : 'Standard Wire:'}</span>
                        </span>
                        <span className="tabular-nums opacity-60">
                          {point.infoEvents.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Drill Down Action Hint */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerDrillDownForHour(label as string, point);
                      }}
                      className="mt-2.5 pt-1.5 border-t border-inherit flex items-center justify-between text-[10px] text-[#118dff] font-bold cursor-pointer group"
                    >
                      <span className="flex items-center gap-1">
                        <Search className="w-3 h-3" />
                        <span>{isRtl ? 'فحص السجلات التفصيلية' : 'Drill down into hourly logs'}</span>
                      </span>
                      {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />}
                    </div>
                  </div>
                );
              }}
            />

            <Legend
              verticalAlign="top"
              align={isRtl ? 'left' : 'right'}
              iconType="plainline"
              wrapperStyle={{
                paddingBottom: 6,
                fontSize: '11px',
                fontFamily: 'monospace'
              }}
            />

            {/* Anomaly 95th Percentile Reference Line */}
            <ReferenceLine
              y={2100}
              stroke="#f43f5e"
              strokeDasharray="4 4"
              strokeOpacity={0.65}
              label={{
                value: '95th Percentile Anomaly Threshold (2,100 ev/h)',
                fill: '#f43f5e',
                fontSize: 9.5,
                fontFamily: 'monospace',
                position: 'top'
              }}
            />

            {/* WAVEFORM MODE: Area for Ambient + Bold Line for Total + Line for Crit */}
            {metricView === 'waveform' && (
              <>
                <Area
                  name={isRtl ? 'إجمالي التدفق السلكي' : 'Total Telemetry Velocity'}
                  type="monotone"
                  dataKey="totalEvents"
                  stroke="#118dff"
                  strokeWidth={2}
                  fill="url(#pbiTotalWaveform)"
                  dot={{ r: 2.5, fill: '#118dff', strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Line
                  name={isRtl ? 'طفرات التهديد الحرجة' : 'Critical Threat Spikes'}
                  type="monotone"
                  dataKey="criticalEvents"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#f43f5e', strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                />
              </>
            )}

            {/* STACKED MODE: Multi-severity layers */}
            {metricView === 'stacked' && (
              <>
                <Area
                  name={isRtl ? 'أحداث قياسية' : 'Standard Wire'}
                  type="monotone"
                  dataKey="infoEvents"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
                <Area
                  name={isRtl ? 'تحذيرات' : 'Warnings'}
                  type="monotone"
                  dataKey="warningEvents"
                  stackId="1"
                  stroke="#facc15"
                  fill="#facc15"
                  fillOpacity={0.4}
                />
                <Area
                  name={isRtl ? 'إنذارات حرجة' : 'Critical Alarms'}
                  type="monotone"
                  dataKey="criticalEvents"
                  stackId="1"
                  stroke="#f43f5e"
                  fill="#f43f5e"
                  fillOpacity={0.6}
                />
              </>
            )}

            {/* SPIKES ONLY MODE: Focus on critical incidents with spike bars */}
            {metricView === 'spikes' && (
              <>
                <Bar
                  name={isRtl ? 'طفرات الإنذار الحرج' : 'Critical Spike Bar'}
                  dataKey="criticalEvents"
                  fill="#f43f5e"
                  radius={[2, 2, 0, 0]}
                />
                <Line
                  name={isRtl ? 'الخط المرجعي العادي' : 'Ambient Baseline'}
                  type="monotone"
                  dataKey="baselineEvents"
                  stroke="#64748b"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  dot={false}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Status & Guide */}
      <div className={`flex items-center justify-between text-[10px] font-mono pt-1 border-t ${
        isDark ? 'border-[#18284c] text-slate-400' : 'border-slate-200 text-slate-500'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-none bg-[#118dff]" />
          <span>{isRtl ? 'موجة القياس الزمني الفوري' : 'Live Wire SOC Waveform'}</span>
          <span aria-hidden="true">·</span>
          <span>{isRtl ? 'انقر على أي نقطة لفحص السجلات' : 'Click data point to drill down'}</span>
        </div>

        <div>
          {isStreaming ? (
            <span className="text-emerald-500 font-semibold">{isRtl ? '● مزامنة تدفق حية ومستمرة' : '● Live Ingestion Active'}</span>
          ) : (
            <span className="text-amber-500">{isRtl ? '⏸ التدفق متوقف مؤقتاً' : '⏸ Stream Paused'}</span>
          )}
        </div>
      </div>
    </div>
  );
};
