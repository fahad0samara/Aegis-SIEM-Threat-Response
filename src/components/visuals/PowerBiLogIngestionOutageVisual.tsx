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
  ReferenceLine,
  ReferenceDot,
  ReferenceArea
} from 'recharts';
import { useSiem } from '../../context/SiemContext';
import { LogSourceDrillDownData } from '../PowerBiLogDrillDownModal';
import { THEMES } from '../../types/theme';
import { Activity, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft } from '../icons/SocIcons';

interface Props {
  onDrillDown?: (target: LogSourceDrillDownData) => void;
}

interface IngestionHourlyPoint {
  hourLabel: string;
  hourNumber: number;
  timestamp: string;
  actualIngestionGb: number;
  expectedBaselineGb: number;
  outageThresholdGb: number;
  epsRate: number;
  isOutage: boolean;
  outageSeverity?: 'CRITICAL' | 'WARNING' | 'NOMINAL';
  outageReason?: string;
  outageReasonAr?: string;
  affectedSource?: string;
}

type SourceFilter = 'ALL' | 'Palo Alto NGFW' | 'CrowdStrike EDR' | 'AWS CloudTrail' | 'CoreDNS' | 'Okta SSO';

export const PowerBiLogIngestionOutageVisual: React.FC<Props> = ({ onDrillDown }) => {
  const { logs, theme, isRtl } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const [selectedSource, setSelectedSource] = useState<SourceFilter>('ALL');
  const [metricUnit, setMetricUnit] = useState<'volume' | 'eps'>('volume');

  // Generate 24 hours of realistic telemetry ingestion data with a distinct outage drop window
  const hourlyData = useMemo<IngestionHourlyPoint[]>(() => {
    const points: IngestionHourlyPoint[] = [];
    const now = new Date();
    const currentHour = now.getHours();

    // Diurnal business cycle curve for expected enterprise telemetry
    const diurnalExpected = [
      42, 36, 32, 28, 29, 44, 
      72, 110, 148, 172, 185, 178, 
      165, 174, 188, 180, 155, 128, 
      98, 82, 70, 58, 50, 44
    ];

    // Source volume scaling weights
    const sourceScale: Record<SourceFilter, number> = {
      'ALL': 1.0,
      'Palo Alto NGFW': 0.38,
      'CrowdStrike EDR': 0.26,
      'AWS CloudTrail': 0.18,
      'CoreDNS': 0.10,
      'Okta SSO': 0.08
    };

    const scale = sourceScale[selectedSource] || 1.0;

    // Outage occurs ~7 hours ago in CoreDNS and cascades partially to ALL
    const outageHour1 = (currentHour - 7 + 24) % 24;
    const outageHour2 = (currentHour - 6 + 24) % 24;

    for (let i = 23; i >= 0; i--) {
      const pastDate = new Date(now.getTime() - i * 60 * 60 * 1000);
      const h = pastDate.getHours();
      const hourLabel = `${h.toString().padStart(2, '0')}:00`;

      const expected = Math.round(diurnalExpected[h] * scale);
      const threshold = Math.round(expected * 0.45); // Outage triggered if drops below 45% of expected baseline

      let actual = Math.round(expected * (0.92 + Math.sin(h * 1.5 + i) * 0.12));
      let isOutage = false;
      let outageSeverity: 'CRITICAL' | 'WARNING' | 'NOMINAL' = 'NOMINAL';
      let outageReason = '';
      let outageReasonAr = '';
      let affectedSource = '';

      // Introduce explicit outage scenario for testing/investigation
      if ((h === outageHour1 || h === outageHour2) && (selectedSource === 'ALL' || selectedSource === 'CoreDNS')) {
        if (selectedSource === 'CoreDNS') {
          actual = Math.round(expected * 0.08); // 92% volume drop (hard forwarder crash)
          isOutage = true;
          outageSeverity = 'CRITICAL';
          outageReason = 'DNS Forwarder Daemon OOM Crash (0.8 GB/hr vs 18 GB/hr baseline)';
          outageReasonAr = 'توقف مفاجئ لخدمة ترحيل سجلات DNS بسبب استنفاد الذاكرة (0.8 جيجابايت/ساعة مقابل 18 جيجابايت)';
          affectedSource = 'CoreDNS & Infoblox';
        } else if (selectedSource === 'ALL') {
          actual = Math.round(expected * 0.62); // Noticeable dip in overall enterprise pipe
          isOutage = true;
          outageSeverity = 'WARNING';
          outageReason = 'Partial Pipeline Ingestion Stall (CoreDNS telemetry drop detected)';
          outageReasonAr = 'انخفاض جزئي في تدفق البيانات (توقف خط سجلات CoreDNS)';
          affectedSource = 'CoreDNS & Infoblox';
        }
      }

      // EPS approximation: ~2.4k EPS per 100 GB/hr
      const eps = Math.round(actual * 24.5);

      points.push({
        hourLabel,
        hourNumber: h,
        timestamp: pastDate.toISOString(),
        actualIngestionGb: actual,
        expectedBaselineGb: expected,
        outageThresholdGb: threshold,
        epsRate: eps,
        isOutage,
        outageSeverity,
        outageReason,
        outageReasonAr,
        affectedSource
      });
    }

    return points;
  }, [selectedSource]);

  // Aggregate metrics
  const totalActualGb = useMemo(() => hourlyData.reduce((acc, p) => acc + p.actualIngestionGb, 0), [hourlyData]);
  const totalExpectedGb = useMemo(() => hourlyData.reduce((acc, p) => acc + p.expectedBaselineGb, 0), [hourlyData]);
  const outagePoints = useMemo(() => hourlyData.filter(p => p.isOutage), [hourlyData]);
  const hasActiveOutage = outagePoints.length > 0;
  const healthRate = Math.min(100, Math.round((totalActualGb / Math.max(1, totalExpectedGb)) * 100));

  const handlePointClick = (point: IngestionHourlyPoint) => {
    if (!onDrillDown) return;
    onDrillDown({
      title: isRtl ? `فحص استيعاب السجلات عند ${point.hourLabel}` : `Ingestion Health Forensic: ${point.hourLabel}`,
      subtitle: isRtl
        ? `الحجم المستوعب: ${point.actualIngestionGb} جيجابايت · خط الأساس المتوقع: ${point.expectedBaselineGb} جيجابايت · معدل التدفق: ${point.epsRate.toLocaleString()} حدث/ثانية${point.isOutage ? ' · ⚠ رصد انقطاع في تدفق المصدر!' : ' · حالة التدفق: طبيعية'}`
        : `Ingested: ${point.actualIngestionGb} GB · Baseline: ${point.expectedBaselineGb} GB · Rate: ${point.epsRate.toLocaleString()} EPS${point.isOutage ? ' · ⚠ PIPELINE OUTAGE DETECTED' : ' · Status: Healthy'}`,
      category: 'hourly',
      filterKey: 'Ingest Hour',
      filterValue: point.hourLabel,
      metricValue: `${point.actualIngestionGb} GB`
    });
  };

  return (
    <div className={`h-full flex flex-col justify-between font-sans ${currentTheme.textPrimaryClass}`}>
      {/* Top Header: Pipeline Health Chips & Slicers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-inherit">
        {/* Left: Headline Outage Telemetry Chips */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 font-mono">
            <span className={`w-2 h-2 rounded-full ${hasActiveOutage ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className={currentTheme.textSecondaryClass}>
              {isRtl ? 'حالة التدفق (24 ساعة):' : 'Pipeline Health (24h):'}
            </span>
            <span className={`font-bold ${hasActiveOutage ? 'text-amber-400' : 'text-emerald-400'}`}>
              {healthRate}% {isRtl ? 'اسمي' : 'Nominal'}
            </span>
          </div>

          <span className="opacity-30">·</span>

          <div className="flex items-center gap-1.5 font-mono">
            <span className={currentTheme.textSecondaryClass}>
              {isRtl ? 'إجمالي الاستيعاب:' : 'Total Volume:'}
            </span>
            <span className="font-bold text-[#118dff]">{(totalActualGb / 1024).toFixed(2)} TB</span>
          </div>

          <span className="opacity-30">·</span>

          {/* Outage status pill/badge */}
          {hasActiveOutage ? (
            <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-[2px] border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isRtl 
                  ? `رصد انقطاع تدفق (${outagePoints.length} ساعات غير مستقرة)` 
                  : `Ingestion Drop: ${outagePoints.length}h Sub-Baseline`}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isRtl ? 'كافة المصادر تعمل بصورة طبيعية' : 'All Collectors Ingesting Normally'}</span>
            </div>
          )}
        </div>

        {/* Right: Source Slicer & Metric Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Unit Toggle: Volume (GB) vs EPS */}
          <div className={`flex items-center rounded-[2px] p-0.5 font-mono text-[10.5px] border ${currentTheme.subtleBgClass} ${currentTheme.borderClass}`}>
            {[
              { id: 'volume' as const, label: isRtl ? 'حجم (GB)' : 'GB/hr' },
              { id: 'eps' as const, label: isRtl ? 'معدل (EPS)' : 'EPS' }
            ].map(u => (
              <button
                key={u.id}
                onClick={() => setMetricUnit(u.id)}
                className={`px-2 py-0.5 rounded-[2px] cursor-pointer transition-colors ${
                  metricUnit === u.id
                    ? 'bg-[#118dff] text-white font-bold shadow-xs'
                    : `${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>

          {/* Source Dropdown Slicer */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value as SourceFilter)}
              className={`px-2 py-1 rounded-[2px] text-xs font-mono border cursor-pointer ${
                currentTheme.inputBgClass
              } ${currentTheme.borderClass} ${currentTheme.textPrimaryClass}`}
            >
              <option value="ALL">{isRtl ? 'كافة مصادر التدفق (مجمعة)' : 'All Ingest Pipelines (Aggregate)'}</option>
              <option value="Palo Alto NGFW">Palo Alto NGFW</option>
              <option value="CrowdStrike EDR">CrowdStrike Falcon</option>
              <option value="AWS CloudTrail">AWS CloudTrail & VPC</option>
              <option value="CoreDNS">CoreDNS & Infoblox (Outage Window)</option>
              <option value="Okta SSO">Microsoft Entra / Okta</option>
            </select>
          </div>
        </div>
      </div>

      {/* Outage Warning Banner if Source Drop is Present */}
      {hasActiveOutage && (
        <div className={`mt-2 px-3 py-1.5 rounded-[2px] border text-xs font-mono flex items-center justify-between gap-2 ${
          isDark 
            ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' 
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center gap-2 truncate">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold shrink-0">{isRtl ? 'تنبيه انقطاع المصدر:' : 'SOURCE OUTAGE ALERT:'}</span>
            <span className="truncate">
              {isRtl ? outagePoints[0]?.outageReasonAr : outagePoints[0]?.outageReason}
            </span>
          </div>
          <button
            onClick={() => handlePointClick(outagePoints[0])}
            className="text-[11px] text-[#118dff] hover:underline font-bold shrink-0 cursor-pointer"
          >
            {isRtl ? 'فحص السجلات التشخيصية ←' : 'Inspect Diagnostic Logs →'}
          </button>
        </div>
      )}

      {/* Chart Canvas */}
      <div className="flex-1 min-h-[220px] w-full pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={hourlyData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload[0]) {
                handlePointClick(state.activePayload[0].payload as IngestionHourlyPoint);
              }
            }}
          >
            <defs>
              <linearGradient id="ingestionAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#118dff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#118dff" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="outageGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="2 2"
              vertical={false}
              stroke={isDark ? '#1e293b' : '#e2e8f0'}
              opacity={0.6}
            />

            <XAxis
              dataKey="hourLabel"
              tickLine={false}
              axisLine={{ stroke: isDark ? '#334155' : '#cbd5e1' }}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontFamily: 'monospace' }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontFamily: 'monospace' }}
              unit={metricUnit === 'volume' ? 'GB' : ''}
              tickFormatter={(v) => metricUnit === 'volume' ? v : `${(v / 1000).toFixed(0)}k`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as IngestionHourlyPoint;
                  const isDrop = d.isOutage;
                  const deviation = Math.round(((d.actualIngestionGb - d.expectedBaselineGb) / Math.max(1, d.expectedBaselineGb)) * 100);

                  return (
                    <div className={`p-3 rounded-[2px] shadow-2xl border text-xs font-mono select-none ${
                      currentTheme.cardBgClass
                    } ${currentTheme.borderClass} ${currentTheme.textPrimaryClass}`}>
                      <div className="font-bold border-b pb-1.5 mb-2 flex items-center justify-between gap-4">
                        <span>{d.hourLabel} ({isRtl ? 'خلال 24 ساعة' : 'Last 24h'})</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-[2px] font-bold ${
                          isDrop 
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {isDrop ? (isRtl ? '⚠ رصد انقطاع للمصدر' : '⚠ SOURCE OUTAGE') : (isRtl ? '✓ تدفق طبيعي' : '✓ HEALTHY')}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-6 text-[#118dff]">
                          <span>{isRtl ? 'الحجم الفعلي المستوعب:' : 'Actual Ingest Volume:'}</span>
                          <span className="font-bold tabular-nums">
                            {metricUnit === 'volume' ? `${d.actualIngestionGb} GB/hr` : `${d.epsRate.toLocaleString()} EPS`}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-6 opacity-75">
                          <span>{isRtl ? 'خط الأساس المتوقع:' : 'Diurnal Expected Baseline:'}</span>
                          <span className="tabular-nums">
                            {metricUnit === 'volume' ? `${d.expectedBaselineGb} GB/hr` : `${Math.round(d.expectedBaselineGb * 24.5).toLocaleString()} EPS`}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-6 text-rose-400">
                          <span>{isRtl ? 'حد الأمان والانقطاع (< 45%):' : 'Outage Floor Threshold:'}</span>
                          <span className="tabular-nums">{d.outageThresholdGb} GB/hr</span>
                        </div>

                        <div className={`flex items-center justify-between gap-6 pt-1 border-t text-[10.5px] ${
                          deviation < -40 ? 'text-rose-400 font-bold' : currentTheme.textSecondaryClass
                        }`}>
                          <span>{isRtl ? 'الانحراف عن المعدل:' : 'Baseline Variance:'}</span>
                          <span className="tabular-nums">{deviation > 0 ? `+${deviation}%` : `${deviation}%`}</span>
                        </div>

                        {d.isOutage && (
                          <div className="mt-1.5 p-1.5 rounded-[2px] bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-300">
                            {isRtl ? d.outageReasonAr : d.outageReason}
                          </div>
                        )}
                      </div>

                      <div className="mt-2 pt-1 border-t text-[9.5px] text-[#118dff] text-center cursor-pointer">
                        {isRtl ? 'انقر لفحص سجلات هذه الساعة بالتفصيل ←' : 'Click to inspect raw forensic logs for this hour →'}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Minimum Health / Outage Threshold Reference Line */}
            <ReferenceLine
              y={hourlyData[0]?.outageThresholdGb}
              stroke="#f43f5e"
              strokeDasharray="3 3"
              strokeWidth={1.2}
              label={{
                value: isRtl ? 'حد رصد الانقطاع (Threshold)' : 'Outage Trigger Floor',
                position: isRtl ? 'insideTopLeft' : 'insideTopRight',
                fill: '#f43f5e',
                fontSize: 9.5,
                fontFamily: 'monospace'
              }}
            />

            {/* Expected Diurnal Baseline Line */}
            <Line
              type="monotone"
              dataKey={metricUnit === 'volume' ? 'expectedBaselineGb' : (d) => Math.round(d.expectedBaselineGb * 24.5)}
              stroke={isDark ? '#64748b' : '#94a3b8'}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              name={isRtl ? 'خط الأساس المتوقع' : 'Expected Baseline'}
            />

            {/* Actual Ingestion Volume Area */}
            <Area
              type="monotone"
              dataKey={metricUnit === 'volume' ? 'actualIngestionGb' : 'epsRate'}
              stroke="#118dff"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#ingestionAreaGrad)"
              name={isRtl ? 'الحجم الفعلي' : 'Actual Ingestion'}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (payload.isOutage) {
                  return (
                    <circle
                      key={`outage-${payload.hourLabel}`}
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill="#f43f5e"
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  );
                }
                return <circle key={`dot-${payload.hourLabel}`} cx={cx} cy={cy} r={2} fill="#118dff" />;
              }}
              activeDot={{ r: 6, fill: '#118dff', strokeWidth: 2, stroke: '#fff' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Insights & Diagnostic Action */}
      <div className={`mt-2 pt-2 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10.5px] font-mono ${currentTheme.borderClass} ${currentTheme.textSecondaryClass}`}>
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#118dff]" />
          <span>
            {isRtl 
              ? 'نظام مراقبة سلامة التدفق: يتم تفعيل إنذارات فورية عند انخفاض تدفق السجلات لأي مصدر دون 45% من المعدل اليومي'
              : 'Autonomous Collector Heartbeat: Alerts trigger automatically if ingestion drops below 45% of diurnal baseline'}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-emerald-400 font-semibold">
            {isRtl ? 'معدل التحديث: فوري (DirectQuery)' : 'Sync: DirectQuery Active'}
          </span>
        </div>
      </div>
    </div>
  );
};
