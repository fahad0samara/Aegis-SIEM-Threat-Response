import React, { useState } from 'react';
import { useSiem } from '../../context/SiemContext';
import { LogSourceDrillDownData } from '../PowerBiLogDrillDownModal';
import { THEMES } from '../../types/theme';
import { Network, Search, ArrowRight, ArrowLeft, ShieldAlert, Activity, CheckCircle2 } from '../icons/SocIcons';

interface Props {
  onDrillDown?: (target: LogSourceDrillDownData) => void;
}

interface PortProtocolMetric {
  port: number;
  protocol: string;
  name: string;
  nameAr: string;
  packetsPerSec: number;
  volumeMb: number;
  threatLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'NORMAL';
  anomalyDescription: string;
  anomalyDescriptionAr: string;
  beaconJitter: string;
  beaconJitterAr: string;
  sampleIp: string;
}

const PORT_METRICS: PortProtocolMetric[] = [
  {
    port: 53,
    protocol: 'UDP/DNS',
    name: 'DNS Domain Resolv & Tunneling',
    nameAr: 'تحليل نطاقات DNS وأنفاق البيانات',
    packetsPerSec: 1240,
    volumeMb: 142,
    threatLevel: 'CRITICAL',
    anomalyDescription: 'High-entropy TXT records detected · Outbound data staging',
    anomalyDescriptionAr: 'استعلامات TXT عالية العشوائية · محاولة تسريب بيانات للخارج',
    beaconJitter: 'Pulse: Burst 2.1s',
    beaconJitterAr: 'نبض متدفق: 2.1ث',
    sampleIp: '198.51.100.17'
  },
  {
    port: 8443,
    protocol: 'TCP/TLS-Alt',
    name: 'Cobalt Strike / C2 Beaconing',
    nameAr: 'إشارات C2 والتحكم الخارجي البديل',
    packetsPerSec: 320,
    volumeMb: 85,
    threatLevel: 'CRITICAL',
    anomalyDescription: 'Strict periodic heartbeat detected · Known adversary listener',
    anomalyDescriptionAr: 'نبضات إشارة دورية متطابقة · مستمع C2 عدائي معروف',
    beaconJitter: 'Jitter: ±5.2% (12.4s pulse)',
    beaconJitterAr: 'تذبذب: ±5.2% (دورة 12.4ث)',
    sampleIp: '185.220.101.42'
  },
  {
    port: 445,
    protocol: 'TCP/SMB',
    name: 'SMB File Sharing & Lateral Hop',
    nameAr: 'مشاركة ملفات SMB والتحرك الجانبي',
    packetsPerSec: 780,
    volumeMb: 310,
    threatLevel: 'HIGH',
    anomalyDescription: 'Named pipe impersonation & IPC$ administrative scan',
    anomalyDescriptionAr: 'انتحال قنوات أسماء وفحص إداري لخدمات IPC$',
    beaconJitter: 'Internal Sweeps',
    beaconJitterAr: 'مسح شبكي داخلي',
    sampleIp: '10.0.4.15'
  },
  {
    port: 443,
    protocol: 'TCP/HTTPS',
    name: 'Standard Ingress Web & TLS',
    nameAr: 'حركة الويب الآمنة القياسية TLS',
    packetsPerSec: 4890,
    volumeMb: 1850,
    threatLevel: 'HIGH',
    anomalyDescription: 'JA4 fingerprint mismatch on 2 edge API load balancers',
    anomalyDescriptionAr: 'عدم تطابق بصمة JA4 على موزع الأحمال الحدودي',
    beaconJitter: 'Normal Jitter',
    beaconJitterAr: 'تذبذب طبيعي',
    sampleIp: '172.16.0.42'
  },
  {
    port: 3389,
    protocol: 'TCP/RDP',
    name: 'Remote Desktop Protocol Ingress',
    nameAr: 'بروتوكول سطح المكتب البعيد RDP',
    packetsPerSec: 110,
    volumeMb: 45,
    threatLevel: 'ELEVATED',
    anomalyDescription: 'Off-hours brute-force NLA handshake attempts from external ASN',
    anomalyDescriptionAr: 'محاولات تخمين كلمات سر خارج أوقات العمل عبر NLA',
    beaconJitter: 'Occasional',
    beaconJitterAr: 'عرضي متقطع',
    sampleIp: '194.26.29.112'
  },
  {
    port: 22,
    protocol: 'TCP/SSH',
    name: 'Secure Shell Administrative Gateway',
    nameAr: 'بوابة الإدارة الآمنة عبر SSH',
    packetsPerSec: 95,
    volumeMb: 18,
    threatLevel: 'NORMAL',
    anomalyDescription: 'Whitelisted bastion jump-box telemetry · Key-based auth only',
    anomalyDescriptionAr: 'حركة معتمدة لخادم القفز الآمن · مصادقة بمفاتيح تشفير فقط',
    beaconJitter: 'Authorized',
    beaconJitterAr: 'معتمد رسمياً',
    sampleIp: '10.0.1.20'
  }
];

export const PowerBiNetworkPortProtocolVisual: React.FC<Props> = ({ onDrillDown }) => {
  const { theme, isRtl, quickBlockIp, blockedIps } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const [activePort, setActivePort] = useState<number>(53);

  const selected = PORT_METRICS.find(p => p.port === activePort) || PORT_METRICS[0];
  const isBlocked = blockedIps.has(selected.sampleIp);

  const handleDrill = (portData: PortProtocolMetric) => {
    if (!onDrillDown) return;
    onDrillDown({
      title: isRtl ? `فحص حركة المنفذ: ${portData.port} (${portData.protocol})` : `Port & Egress Flow: Port ${portData.port} (${portData.protocol})`,
      subtitle: isRtl
        ? `تحليل تدفق حركة الشبكة · ${portData.nameAr} · ${portData.packetsPerSec} حزمة/ث · ${portData.volumeMb} ميغابايت/ساعة`
        : `Network Flow Analysis · ${portData.name} · ${portData.packetsPerSec} pkts/s · ${portData.volumeMb} MB/hr volume`,
      category: 'source',
      filterKey: isRtl ? 'المنفذ المستهدف' : 'Network Port',
      filterValue: `Port ${portData.port}`,
      metricValue: `${portData.packetsPerSec} pkts/sec`
    });
  };

  return (
    <div className="flex flex-col h-full justify-between space-y-2.5 font-sans">
      {/* Subheader */}
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <Network className="w-3.5 h-3.5 text-[#118dff]" />
          <span>{isRtl ? 'طيف منافذ الشبكة ورصد تسريب C2' : 'Egress NetFlow & Port Anomaly Spectrum'}</span>
        </span>
        <span className="text-[#118dff] font-semibold flex items-center gap-1">
          <Search className="w-3 h-3" />
          <span>{isRtl ? 'اختر المنفذ للتدقيق' : 'Select port for forensics'}</span>
        </span>
      </div>

      {/* Main Port Spectrum Container */}
      <div className="flex flex-col flex-1 space-y-2.5 min-h-0">
        {/* Horizontal Port Slicer Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {PORT_METRICS.map((item) => {
            const isSelected = item.port === activePort;
            return (
              <button
                key={item.port}
                onClick={() => setActivePort(item.port)}
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
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  item.threatLevel === 'CRITICAL' ? 'bg-rose-500' :
                  item.threatLevel === 'HIGH' ? 'bg-amber-500' :
                  item.threatLevel === 'ELEVATED' ? 'bg-yellow-400' :
                  'bg-emerald-400'
                }`} />
                <span className="font-mono text-[11px]">:{item.port}</span>
                <span className={`text-[10px] font-mono tabular-nums opacity-80 ${
                  isSelected ? 'text-[#118dff]' : isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {item.packetsPerSec.toLocaleString()} p/s
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Port Forensic Deep-Dive Panel */}
        <div className={`p-3 rounded-[2px] border flex flex-col justify-between flex-1 min-h-[200px] text-xs font-mono transition-colors ${
          isDark 
            ? 'bg-[#080f1e]/90 border-[#18284c] text-slate-100' 
            : 'bg-slate-50/90 border-slate-200 text-slate-900'
        }`}>
          <div className="space-y-2.5">
            {/* Port Header */}
            <div className="flex items-center justify-between pb-2 border-b border-inherit gap-2">
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-sm text-[#118dff] font-mono">
                  Port {selected.port}
                </span>
                <span className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  ({selected.protocol} · {isRtl ? selected.nameAr : selected.name})
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-[1px] font-bold font-mono text-[10px] shrink-0 ${
                selected.threatLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                selected.threatLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                selected.threatLevel === 'ELEVATED' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {selected.threatLevel}
              </span>
            </div>

            {/* Anomaly & Threat Assessment */}
            <div className="space-y-2 text-[11px]">
              <div>
                <span className="text-[10px] opacity-70 block mb-0.5">
                  {isRtl ? 'تحليل الشذوذ وإشارات الاختراق المرصودة:' : 'Signal Anomaly Assessment:'}
                </span>
                <span className="text-rose-400 font-semibold block leading-tight">
                  {isRtl ? selected.anomalyDescriptionAr : selected.anomalyDescription}
                </span>
              </div>

              {/* Progress Visualizer Bar */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-[10px] opacity-75 mb-1">
                  <span>{isRtl ? 'معدل الحزم بالثانية:' : 'Egress Packet Throughput:'} {selected.packetsPerSec.toLocaleString()} p/s</span>
                  <span>{selected.volumeMb} MB/hr</span>
                </div>
                <div className={`h-1.5 w-full rounded-xs overflow-hidden ${isDark ? 'bg-[#0f1a34]' : 'bg-slate-200'}`}>
                  <div
                    className={`h-full transition-all duration-300 ${
                      selected.threatLevel === 'CRITICAL' ? 'bg-rose-500' :
                      selected.threatLevel === 'HIGH' ? 'bg-amber-500' :
                      selected.threatLevel === 'ELEVATED' ? 'bg-yellow-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, (selected.packetsPerSec / 5000) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-inherit">
                <div>
                  <span className="text-[10px] opacity-70 block mb-0.5">
                    {isRtl ? 'تردد نبضات C2:' : 'Beacon Cadence:'}
                  </span>
                  <span className={`font-medium block truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {isRtl ? selected.beaconJitterAr : selected.beaconJitter}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] opacity-70 block mb-0.5">
                    {isRtl ? 'عنوان المصدر الخارجي:' : 'Adversary Origin IP:'}
                  </span>
                  <bdi dir="ltr" className="font-mono font-bold text-cyan-400 block truncate">
                    {selected.sampleIp}
                  </bdi>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row with zero overflow */}
          <div className="pt-2 mt-2 border-t border-inherit flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={() => handleDrill(selected)}
              className="text-[#118dff] hover:underline text-xs font-semibold flex items-center gap-1 cursor-pointer font-mono"
            >
              <span>{isRtl ? 'سجلات NetFlow' : 'NetFlow Logs'}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => quickBlockIp(selected.sampleIp, `Egress beaconing on Port ${selected.port}`)}
              disabled={isBlocked}
              className={`px-2.5 py-1 text-[11px] rounded-[2px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isBlocked
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
              }`}
            >
              {isBlocked ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تم الحظر' : 'Blocked'}</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'حظر بالفايروول' : 'Quarantine Port IP'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
