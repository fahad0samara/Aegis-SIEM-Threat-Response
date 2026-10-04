import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSiem } from '../../context/SiemContext';
import { WORLD_COUNTRY_PATHS, WorldCountryPath } from './worldMapPaths';
import { LogSourceDrillDownData } from '../PowerBiLogDrillDownModal';
import { THEMES } from '../../types/theme';
import { LogEntry, LogSeverity } from '../../types/siem';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell,
  ReferenceLine 
} from 'recharts';
import { 
  Flame, 
  ShieldCheck, 
  ShieldAlert,
  Zap, 
  Globe, 
  BarChart3,
  Search,
  X,
  Clock,
  ExternalLink
} from '../icons/SocIcons';

export interface GeoHeatThreatPoint {
  id: string;
  country: string;
  countryAr: string;
  countryCode: string;
  iso3: string;
  city: string;
  cityAr: string;
  region: 'na' | 'eu' | 'apac' | 'mea' | 'latam';
  ip: string;
  asn: string;
  threatVector: string;
  threatVectorAr: string;
  category: 'c2' | 'bruteforce' | 'rce' | 'exfil' | 'ddos';
  mitreTactic: string;
  mitreTacticAr: string;
  mitreId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  svgX: number; // Projected X on 1000x500 canvas
  svgY: number; // Projected Y on 1000x500 canvas
  eventsCount: number;
  activeIncidents: number;
  heatIndex: number;
  isBlocked: boolean;
}

export interface ActiveThreatTooltipData {
  id: string;
  country: string;
  countryAr: string;
  countryCode: string;
  iso3: string;
  city: string;
  cityAr: string;
  ip: string;
  asn: string;
  threatVector: string;
  threatVectorAr: string;
  mitreTactic: string;
  mitreTacticAr: string;
  mitreId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  heatIndex: number;
  eventsCount: number;
  activeIncidents: number;
  isBlocked: boolean;
  anchorX: number;
  anchorY: number;
  isPinned: boolean;
}

export interface ThreatLogSummaryItem {
  id: string;
  timestamp: string;
  relativeTime: string;
  level: LogSeverity;
  source: string;
  eventName: string;
  eventNameAr: string;
  sourceIp: string;
  destIp?: string;
  host: string;
  user: string;
  mitreTechniqueId?: string;
  signature?: string;
}

const BASELINE_HOTSPOTS: Omit<GeoHeatThreatPoint, 'isBlocked' | 'heatIndex'>[] = [
  {
    id: 'geo-nl',
    country: 'Netherlands',
    countryAr: 'هولندا',
    countryCode: 'NL',
    iso3: 'NLD',
    city: 'Amsterdam',
    cityAr: 'أمستردام',
    region: 'eu',
    ip: '185.220.101.5',
    asn: 'AS200052 (Tor Exit Node Relay)',
    threatVector: 'CobaltStrike C2 Beacon Injection',
    threatVectorAr: 'حقن إشارات CobaltStrike C2 خبيثة',
    category: 'c2',
    mitreTactic: 'Command & Control',
    mitreTacticAr: 'القيادة والتحكم',
    mitreId: 'T1071.001',
    severity: 'CRITICAL',
    svgX: 513.6,
    svgY: 104.5,
    eventsCount: 485,
    activeIncidents: 1
  },
  {
    id: 'geo-ru',
    country: 'Russia',
    countryAr: 'روسيا',
    countryCode: 'RU',
    iso3: 'RUS',
    city: 'Moscow',
    cityAr: 'موسكو',
    region: 'eu',
    ip: '194.26.29.112',
    asn: 'AS44050 (Hosting Solutions JSC)',
    threatVector: 'Distributed SSH Brute Force & PAM Hijack',
    threatVectorAr: 'هجوم القوة الغاشمة على SSH واختطاف PAM',
    category: 'bruteforce',
    mitreTactic: 'Credential Access',
    mitreTacticAr: 'الوصول لبيانات الاعتماد',
    mitreId: 'T1110.001',
    severity: 'CRITICAL',
    svgX: 604.5,
    svgY: 95.1,
    eventsCount: 394,
    activeIncidents: 1
  },
  {
    id: 'geo-de',
    country: 'Germany',
    countryAr: 'ألمانيا',
    countryCode: 'DE',
    iso3: 'DEU',
    city: 'Frankfurt',
    cityAr: 'فرانكفورت',
    region: 'eu',
    ip: '198.51.100.44',
    asn: 'AS24940 (Hetzner Online)',
    threatVector: 'AWS AssumeRole Token Impersonation',
    threatVectorAr: 'انتحال رمز تصريح دور AWS AssumeRole',
    category: 'c2',
    mitreTactic: 'Initial Access',
    mitreTacticAr: 'الوصول الأولي',
    mitreId: 'T1078.004',
    severity: 'HIGH',
    svgX: 524.1,
    svgY: 110.8,
    eventsCount: 210,
    activeIncidents: 1
  },
  {
    id: 'geo-gb',
    country: 'United Kingdom',
    countryAr: 'المملكة المتحدة',
    countryCode: 'GB',
    iso3: 'GBR',
    city: 'London',
    cityAr: 'لندن',
    region: 'eu',
    ip: '51.89.144.20',
    asn: 'AS16276 (OVH SAS)',
    threatVector: 'Ransomware Double-Extortion Stager',
    threatVectorAr: 'محمل برمجيات الفدية والابتزاز المزدوج',
    category: 'exfil',
    mitreTactic: 'Exfiltration',
    mitreTacticAr: 'تسريب البيانات',
    mitreId: 'T1048.003',
    severity: 'CRITICAL',
    svgX: 499.6,
    svgY: 106.9,
    eventsCount: 340,
    activeIncidents: 1
  },
  {
    id: 'geo-bg',
    country: 'Bulgaria',
    countryAr: 'بلغاريا',
    countryCode: 'BG',
    iso3: 'BGR',
    city: 'Sofia',
    cityAr: 'صوفيا',
    region: 'eu',
    ip: '45.154.255.89',
    asn: 'AS58061 (DataWeb Global)',
    threatVector: 'SQLi WAF Bypass & Schema Enumeration',
    threatVectorAr: 'تخطي WAF عبر حقن SQL واستعراض الجداول',
    category: 'rce',
    mitreTactic: 'Initial Access',
    mitreTacticAr: 'الوصول الأولي',
    mitreId: 'T1190',
    severity: 'HIGH',
    svgX: 564.8,
    svgY: 131.4,
    eventsCount: 275,
    activeIncidents: 1
  },
  {
    id: 'geo-ro',
    country: 'Romania',
    countryAr: 'رومانيا',
    countryCode: 'RO',
    iso3: 'ROU',
    city: 'Bucharest',
    cityAr: 'بوخارست',
    region: 'eu',
    ip: '185.190.141.22',
    asn: 'AS43754 (Voxility S.R.L.)',
    threatVector: 'Okta SSO MFA Push Fatigue Bombing',
    threatVectorAr: 'هجوم إرهاق إشعارات MFA في Okta SSO',
    category: 'bruteforce',
    mitreTactic: 'Credential Access',
    mitreTacticAr: 'الوصول لبيانات الاعتماد',
    mitreId: 'T1621',
    severity: 'HIGH',
    svgX: 572.5,
    svgY: 126.6,
    eventsCount: 168,
    activeIncidents: 1
  },
  {
    id: 'geo-us',
    country: 'United States',
    countryAr: 'الولايات المتحدة',
    countryCode: 'US',
    iso3: 'USA',
    city: 'Silicon Valley',
    cityAr: 'وادي السيليكون',
    region: 'na',
    ip: '10.14.2.80',
    asn: 'AS15169 (Enterprise Cloud Core)',
    threatVector: 'High-Entropy DNS Tunneling Exfiltration',
    threatVectorAr: 'تسريب بيانات عبر أنفاق DNS عالية الإنتروبيا',
    category: 'exfil',
    mitreTactic: 'Command & Control',
    mitreTacticAr: 'القيادة والتحكم',
    mitreId: 'T1071.004',
    severity: 'HIGH',
    svgX: 160.9,
    svgY: 146.1,
    eventsCount: 360,
    activeIncidents: 1
  },
  {
    id: 'geo-ca',
    country: 'Canada',
    countryAr: 'كندا',
    countryCode: 'CA',
    iso3: 'CAN',
    city: 'Toronto',
    cityAr: 'تورونتو',
    region: 'na',
    ip: '142.93.18.99',
    asn: 'AS14061 (DigitalOcean Canada)',
    threatVector: 'Kerberoasting Ticket Granting Exploit',
    threatVectorAr: 'استغلال تذاكر Kerberoasting لرفع الصلاحيات',
    category: 'bruteforce',
    mitreTactic: 'Privilege Escalation',
    mitreTacticAr: 'رفع الامتيازات',
    mitreId: 'T1558.003',
    severity: 'MEDIUM',
    svgX: 279.5,
    svgY: 128.7,
    eventsCount: 132,
    activeIncidents: 0
  },
  {
    id: 'geo-sc',
    country: 'Seychelles',
    countryAr: 'سيشل',
    countryCode: 'SC',
    iso3: 'SYC',
    city: 'Victoria',
    cityAr: 'فيكتوريا',
    region: 'mea',
    ip: '193.106.191.80',
    asn: 'AS39351 (Offshore VPS Network)',
    threatVector: 'Mirai IoT Volumetric SYN Flood (14.2 Gbps)',
    threatVectorAr: 'هجوم حجب خدمة فيضاني Mirai IoT (14.2 Gbps)',
    category: 'ddos',
    mitreTactic: 'Impact',
    mitreTacticAr: 'التأثير والتخريب',
    mitreId: 'T1498.001',
    severity: 'CRITICAL',
    svgX: 654.0,
    svgY: 262.8,
    eventsCount: 420,
    activeIncidents: 1
  },
  {
    id: 'geo-ae',
    country: 'UAE',
    countryAr: 'الإمارات',
    countryCode: 'AE',
    iso3: 'ARE',
    city: 'Dubai',
    cityAr: 'دبي',
    region: 'mea',
    ip: '94.200.12.77',
    asn: 'AS5384 (Emirates Telecom)',
    threatVector: 'Fast-Flux C2 Reverse Proxy',
    threatVectorAr: 'خادم وكيل عكسي Fast-Flux C2 مراوغ',
    category: 'c2',
    mitreTactic: 'Command & Control',
    mitreTacticAr: 'القيادة والتحكم',
    mitreId: 'T1071',
    severity: 'MEDIUM',
    svgX: 653.5,
    svgY: 180.0,
    eventsCount: 95,
    activeIncidents: 0
  },
  {
    id: 'geo-in',
    country: 'India',
    countryAr: 'الهند',
    countryCode: 'IN',
    iso3: 'IND',
    city: 'Mumbai',
    cityAr: 'مومباي',
    region: 'apac',
    ip: '103.21.244.0',
    asn: 'AS13335 (Cloudflare Ingress Edge)',
    threatVector: 'API Rate Limit Abuse & Credential Stuffing',
    threatVectorAr: 'إساءة استغلال معدل واجهات API وحشو الاعتماد',
    category: 'bruteforce',
    mitreTactic: 'Initial Access',
    mitreTacticAr: 'الوصول الأولي',
    mitreId: 'T1110',
    severity: 'HIGH',
    svgX: 702.4,
    svgY: 197.0,
    eventsCount: 180,
    activeIncidents: 0
  },
  {
    id: 'geo-cn',
    country: 'China',
    countryAr: 'الصين',
    countryCode: 'CN',
    iso3: 'CHN',
    city: 'Shanghai',
    cityAr: 'شنغهاي',
    region: 'apac',
    ip: '202.108.22.5',
    asn: 'AS4134 (Chinanet Backbone)',
    threatVector: 'WebLogic Deserialization Exploit',
    threatVectorAr: 'استغلال إلغاء التسلسل في WebLogic',
    category: 'rce',
    mitreTactic: 'Lateral Movement',
    mitreTacticAr: 'التحرك الجانبي',
    mitreId: 'T1210',
    severity: 'CRITICAL',
    svgX: 837.4,
    svgY: 163.2,
    eventsCount: 310,
    activeIncidents: 1
  },
  {
    id: 'geo-jp',
    country: 'Japan',
    countryAr: 'اليابان',
    countryCode: 'JP',
    iso3: 'JPN',
    city: 'Tokyo',
    cityAr: 'طوكيو',
    region: 'apac',
    ip: '133.242.0.1',
    asn: 'AS9370 (SAKURA Internet)',
    threatVector: 'SSH Reverse Tunneling',
    threatVectorAr: 'أنفاق SSH عكسية سرية للمحافظة على التواجد',
    category: 'c2',
    mitreTactic: 'Persistence',
    mitreTacticAr: 'الاستدامة والتواجد',
    mitreId: 'T1572',
    severity: 'MEDIUM',
    svgX: 887.9,
    svgY: 150.9,
    eventsCount: 88,
    activeIncidents: 0
  },
  {
    id: 'geo-sg',
    country: 'Singapore',
    countryAr: 'سنغافورة',
    countryCode: 'SG',
    iso3: 'SGP',
    city: 'Singapore',
    cityAr: 'سنغافورة',
    region: 'apac',
    ip: '128.199.200.10',
    asn: 'AS14061 (DigitalOcean SG)',
    threatVector: 'Automated Port Scanner & Shodan Probe',
    threatVectorAr: 'مسح منافذ آلي واستطلاع خوادم Shodan',
    category: 'rce',
    mitreTactic: 'Reconnaissance',
    mitreTacticAr: 'الاستطلاع والاستكشاف',
    mitreId: 'T1595',
    severity: 'HIGH',
    svgX: 788.4,
    svgY: 246.2,
    eventsCount: 154,
    activeIncidents: 0
  },
  {
    id: 'geo-au',
    country: 'Australia',
    countryAr: 'أستراليا',
    countryCode: 'AU',
    iso3: 'AUS',
    city: 'Sydney',
    cityAr: 'سيدني',
    region: 'apac',
    ip: '139.130.4.5',
    asn: 'AS1221 (Telstra Global)',
    threatVector: 'Cryptominer CoinHive Injection',
    threatVectorAr: 'حقن برمجيات تعدين العملات المشفرة CoinHive',
    category: 'exfil',
    mitreTactic: 'Impact',
    mitreTacticAr: 'التأثير والتخريب',
    mitreId: 'T1496',
    severity: 'MEDIUM',
    svgX: 920.0,
    svgY: 344.1,
    eventsCount: 112,
    activeIncidents: 0
  },
  {
    id: 'geo-br',
    country: 'Brazil',
    countryAr: 'البرازيل',
    countryCode: 'BR',
    iso3: 'BRA',
    city: 'São Paulo',
    cityAr: 'ساو باولو',
    region: 'latam',
    ip: '177.18.200.4',
    asn: 'AS28573 (Claro Brasil)',
    threatVector: 'Banking Trojan C2 Callback',
    threatVectorAr: 'حصان طروادة مصرفي واستدعاء C2 مشبوه',
    category: 'c2',
    mitreTactic: 'Command & Control',
    mitreTacticAr: 'القيادة والتحكم',
    mitreId: 'T1071',
    severity: 'HIGH',
    svgX: 370.5,
    svgY: 315.4,
    eventsCount: 195,
    activeIncidents: 0
  }
];

const PROTECTED_CORE = {
  nameEn: 'SOC CORE [PROTECTED]',
  nameAr: 'مركز العمليات [محمي]',
  x: 284.8,
  y: 141.5
};

interface Props {
  onDrillDown?: (target: LogSourceDrillDownData) => void;
}

export const PowerBiGeoHeatMapVisual: React.FC<Props> = ({ onDrillDown }) => {
  const { logs, incidents, blockedIps, theme, isRtl, quickBlockIp, setSelectedLog } = useSiem();
  const currentTheme = THEMES[theme] || THEMES.dark;
  const isDark = currentTheme.isDarkBase;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipCloseTimer = useRef<NodeJS.Timeout | null>(null);

  const [activeView, setActiveView] = useState<'combined' | 'map' | 'chart'>('combined');
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'na' | 'eu' | 'apac' | 'mea' | 'latam'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'critical' | 'c2' | 'bruteforce' | 'rce' | 'exfil'>('all');
  const [showTrajectories, setShowTrajectories] = useState<boolean>(true);
  const [heatMode, setHeatMode] = useState<'thermal' | 'points'>('thermal');

  // Interactive SVG Tooltip State
  const [activeTooltip, setActiveTooltip] = useState<ActiveThreatTooltipData | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (tooltipCloseTimer.current) {
        clearTimeout(tooltipCloseTimer.current);
      }
    };
  }, []);

  const threatPoints = useMemo(() => {
    const points: GeoHeatThreatPoint[] = BASELINE_HOTSPOTS.map(base => {
      const isBlocked = blockedIps.has(base.ip);
      const matchingIncident = incidents.find(
        inc => inc.attackerIp === base.ip || inc.title.toLowerCase().includes(base.country.toLowerCase())
      );

      let heat = 40;
      if (base.severity === 'CRITICAL') heat = 90;
      else if (base.severity === 'HIGH') heat = 75;
      else heat = 55;

      if (matchingIncident) {
        if (matchingIncident.status !== 'RESOLVED') heat = Math.min(100, heat + 15);
        if (matchingIncident.status === 'RESOLVED') heat = Math.max(10, heat - 45);
      }
      if (isBlocked) heat = 15;

      return {
        ...base,
        activeIncidents: matchingIncident && matchingIncident.status !== 'RESOLVED' ? 1 : base.activeIncidents,
        heatIndex: heat,
        isBlocked
      };
    });

    return points
      .filter(p => {
        if (selectedRegion !== 'all' && p.region !== selectedRegion) return false;
        if (selectedCategory === 'critical') return p.severity === 'CRITICAL';
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        return true;
      })
      .sort((a, b) => b.heatIndex - a.heatIndex);
  }, [incidents, blockedIps, selectedRegion, selectedCategory]);

  const threatPointByIso = useMemo(() => {
    const map = new Map<string, GeoHeatThreatPoint>();
    threatPoints.forEach(p => {
      map.set(p.iso3, p);
    });
    return map;
  }, [threatPoints]);

  const threatIsoSet = useMemo(() => {
    return new Set(threatPoints.map(p => p.iso3));
  }, [threatPoints]);

  const activeFocus = useMemo(() => {
    if (activeTooltip) return activeTooltip;
    if (selectedPointId) return threatPoints.find(p => p.id === selectedPointId) || null;
    return threatPoints[0] || null;
  }, [activeTooltip, selectedPointId, threatPoints]);

  const getHeatColor = (heat: number, isBlocked: boolean) => {
    if (isBlocked) return '#10b981'; // Green for quarantined
    if (heat >= 85) return '#f43f5e'; // Critical Red
    if (heat >= 70) return '#fb923c'; // High Orange
    if (heat >= 50) return '#facc15'; // Medium Yellow
    return '#38bdf8'; // Low Blue
  };

  const getSeverityBgColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL': return '#f43f5e';
      case 'ERROR':
      case 'HIGH': return '#fb923c';
      case 'WARN':
      case 'MEDIUM': return '#eab308';
      default: return '#38bdf8';
    }
  };

  const formatRelativeTime = (isoString: string): string => {
    try {
      const diffSeconds = Math.max(1, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
      if (diffSeconds < 60) return isRtl ? `منذ ${diffSeconds}ث` : `${diffSeconds}s ago`;
      const diffMinutes = Math.floor(diffSeconds / 60);
      if (diffMinutes < 60) return isRtl ? `منذ ${diffMinutes}د` : `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      return isRtl ? `منذ ${diffHours}س` : `${diffHours}h ago`;
    } catch {
      return isRtl ? 'الآن' : 'just now';
    }
  };

  // Convert SVG Mouse Event to 1000x500 ViewBox Coordinates
  const getSvgCoordinates = (e: React.MouseEvent<SVGElement>): { x: number; y: number } => {
    const svg = svgRef.current;
    if (!svg) return { x: 500, y: 250 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 500, y: 250 };
    const svgP = pt.matrixTransform(ctm.inverse());
    return {
      x: Math.max(10, Math.min(990, svgP.x)),
      y: Math.max(10, Math.min(490, svgP.y))
    };
  };

  // Baseline domain threat logs synthesizer for adversary hubs
  const getHotspotBaselineLogs = (loc: {
    country: string;
    countryCode: string;
    city: string;
    ip: string;
    threatVector: string;
    threatVectorAr?: string;
    mitreTactic: string;
    mitreTacticAr?: string;
    mitreId: string;
    severity: string;
    asn?: string;
  }): ThreatLogSummaryItem[] => {
    const code = loc.countryCode.toUpperCase();
    const now = Date.now();

    const items: ThreatLogSummaryItem[] = [
      {
        id: `synth-${code}-1`,
        timestamp: new Date(now - 14 * 1000).toISOString(),
        relativeTime: isRtl ? 'منذ 14ث' : '14s ago',
        level: loc.severity === 'CRITICAL' ? 'CRITICAL' : 'ERROR',
        source: 'CrowdStrike EDR',
        eventName: loc.threatVector,
        eventNameAr: loc.threatVectorAr || loc.threatVector,
        sourceIp: loc.ip,
        destIp: '10.14.2.80',
        host: 'fin-srv-db01.corp.internal',
        user: 'SYSTEM',
        mitreTechniqueId: loc.mitreId,
        signature: `${loc.mitreId}:${loc.threatVector.split(' ')[0]}`
      },
      {
        id: `synth-${code}-2`,
        timestamp: new Date(now - 48 * 1000).toISOString(),
        relativeTime: isRtl ? 'منذ 48ث' : '48s ago',
        level: loc.severity === 'CRITICAL' ? 'ERROR' : 'WARN',
        source: 'Zeek Network',
        eventName: `Encrypted Ingress Burst via ${loc.asn?.split(' ')[0] || 'Peer Gateway'}`,
        eventNameAr: `تدفق مشفر ومشبوه عبر موجه ${loc.asn?.split(' ')[0] || 'الشبكة'}`,
        sourceIp: loc.ip,
        destIp: '10.240.12.18',
        host: 'gw-ingress-edge.prod',
        user: 'netdaemon',
        mitreTechniqueId: 'T1071.001',
        signature: 'Zeek:TLS:HighFrequencyHandshake'
      },
      {
        id: `synth-${code}-3`,
        timestamp: new Date(now - 110 * 1000).toISOString(),
        relativeTime: isRtl ? 'منذ دقيقة' : '1m ago',
        level: 'WARN',
        source: 'Cloudflare WAF',
        eventName: `Edge Signature Anomaly Alert (${loc.mitreTactic})`,
        eventNameAr: `إنذار استثناء أمني عند الحافة (${loc.mitreTacticAr || loc.mitreTactic})`,
        sourceIp: loc.ip,
        host: 'api.enterprise-gateway.net',
        user: 'anonymous',
        mitreTechniqueId: 'T1190',
        signature: 'WAF:Behavioral:AdversarySpike'
      }
    ];

    return items;
  };

  // Retrieve matching threat logs for the hovered location
  const getRecentThreatLogs = (loc: ActiveThreatTooltipData): ThreatLogSummaryItem[] => {
    const liveMatches = logs.filter(log => {
      const codeMatch = log.geoIp?.countryCode?.toUpperCase() === loc.countryCode.toUpperCase();
      const countryMatch = log.geoIp?.country?.toLowerCase() === loc.country.toLowerCase();
      const ipMatch = loc.ip && (log.sourceIp === loc.ip || log.destIp === loc.ip);
      const cityMatch = loc.city && log.geoIp?.city?.toLowerCase() === loc.city.toLowerCase();
      return codeMatch || countryMatch || ipMatch || cityMatch;
    });

    liveMatches.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const result: ThreatLogSummaryItem[] = [];

    liveMatches.slice(0, 4).forEach(log => {
      result.push({
        id: log.id,
        timestamp: log.timestamp,
        relativeTime: formatRelativeTime(log.timestamp),
        level: log.level,
        source: log.source,
        eventName: log.eventName,
        eventNameAr: log.eventNameAr || log.eventName,
        sourceIp: log.sourceIp,
        destIp: log.destIp,
        host: log.host,
        user: log.user,
        mitreTechniqueId: log.mitreTechniqueId,
        signature: log.signature
      });
    });

    if (result.length < 3) {
      const baseline = getHotspotBaselineLogs(loc);
      for (const item of baseline) {
        if (result.length >= 3) break;
        result.push(item);
      }
    }

    return result;
  };

  // Point centroid hover handlers
  const handlePointMouseEnter = (point: GeoHeatThreatPoint) => {
    if (tooltipCloseTimer.current) {
      clearTimeout(tooltipCloseTimer.current);
      tooltipCloseTimer.current = null;
    }

    setActiveTooltip({
      id: point.id,
      country: point.country,
      countryAr: point.countryAr,
      countryCode: point.countryCode,
      iso3: point.iso3,
      city: point.city,
      cityAr: point.cityAr,
      ip: point.ip,
      asn: point.asn,
      threatVector: point.threatVector,
      threatVectorAr: point.threatVectorAr,
      mitreTactic: point.mitreTactic,
      mitreTacticAr: point.mitreTacticAr,
      mitreId: point.mitreId,
      severity: point.severity,
      heatIndex: point.heatIndex,
      eventsCount: point.eventsCount,
      activeIncidents: point.activeIncidents,
      isBlocked: point.isBlocked,
      anchorX: point.svgX,
      anchorY: point.svgY,
      isPinned: activeTooltip?.isPinned && activeTooltip.id === point.id ? true : false
    });
  };

  const handlePointMouseLeave = () => {
    if (activeTooltip?.isPinned) return;
    tooltipCloseTimer.current = setTimeout(() => {
      setActiveTooltip(null);
    }, 280);
  };

  const handlePointClick = (point: GeoHeatThreatPoint) => {
    if (activeTooltip?.id === point.id && activeTooltip.isPinned) {
      // Toggle unpin
      setActiveTooltip(null);
      setSelectedPointId(null);
    } else {
      setSelectedPointId(point.id);
      setActiveTooltip({
        id: point.id,
        country: point.country,
        countryAr: point.countryAr,
        countryCode: point.countryCode,
        iso3: point.iso3,
        city: point.city,
        cityAr: point.cityAr,
        ip: point.ip,
        asn: point.asn,
        threatVector: point.threatVector,
        threatVectorAr: point.threatVectorAr,
        mitreTactic: point.mitreTactic,
        mitreTacticAr: point.mitreTacticAr,
        mitreId: point.mitreId,
        severity: point.severity,
        heatIndex: point.heatIndex,
        eventsCount: point.eventsCount,
        activeIncidents: point.activeIncidents,
        isBlocked: point.isBlocked,
        anchorX: point.svgX,
        anchorY: point.svgY,
        isPinned: true
      });
    }
  };

  // World map country path hover handlers
  const handleCountryMouseEnter = (country: WorldCountryPath, e: React.MouseEvent<SVGPathElement>) => {
    if (activeTooltip?.isPinned) return;
    if (tooltipCloseTimer.current) {
      clearTimeout(tooltipCloseTimer.current);
      tooltipCloseTimer.current = null;
    }

    const matchingPoint = threatPointByIso.get(country.id);

    if (matchingPoint) {
      handlePointMouseEnter(matchingPoint);
    } else {
      const coords = getSvgCoordinates(e);
      const countryLogs = logs.filter(l => 
        l.geoIp?.country?.toLowerCase() === country.name.toLowerCase() ||
        l.geoIp?.countryCode?.toUpperCase() === country.id.toUpperCase()
      );

      const hasEvents = countryLogs.length > 0;
      const calculatedHeat = hasEvents ? Math.min(60, 20 + countryLogs.length * 8) : 8;

      setActiveTooltip({
        id: `country-${country.id}`,
        country: country.name,
        countryAr: country.name,
        countryCode: country.id,
        iso3: country.id,
        city: isRtl ? 'المحيط الإقليمي' : 'Regional Perimeter',
        cityAr: 'المحيط الإقليمي',
        ip: countryLogs[0]?.sourceIp || '192.0.2.14',
        asn: countryLogs[0]?.geoIp?.asn || 'AS13335 (Edge Transit)',
        threatVector: hasEvents 
          ? (isRtl ? 'حركة مرور مرصودة عبر بوابات الحافة' : 'Monitored Edge Traffic Flow') 
          : (isRtl ? 'محيط أمني نظيف - لا توجد خروقات' : 'Perimeter Clean - No Threats Active'),
        threatVectorAr: hasEvents 
          ? 'حركة مرور مرصودة عبر بوابات الحافة' 
          : 'محيط أمني نظيف - لا توجد خروقات',
        mitreTactic: countryLogs[0]?.mitreTactic || 'Reconnaissance',
        mitreTacticAr: countryLogs[0]?.mitreTacticAr || 'الاستطلاع',
        mitreId: countryLogs[0]?.mitreTechniqueId || 'T1595',
        severity: countryLogs.some(l => l.level === 'CRITICAL') ? 'CRITICAL' : hasEvents ? 'HIGH' : 'LOW',
        heatIndex: calculatedHeat,
        eventsCount: hasEvents ? countryLogs.length * 16 : 12,
        activeIncidents: 0,
        isBlocked: false,
        anchorX: coords.x,
        anchorY: coords.y,
        isPinned: false
      });
    }
  };

  const handleCountryMouseLeave = () => {
    if (activeTooltip?.isPinned) return;
    tooltipCloseTimer.current = setTimeout(() => {
      setActiveTooltip(null);
    }, 280);
  };

  const handleCountryClick = (country: WorldCountryPath, e: React.MouseEvent<SVGPathElement>) => {
    const matchingPoint = threatPointByIso.get(country.id);
    if (matchingPoint) {
      handlePointClick(matchingPoint);
    } else {
      handleCountryMouseEnter(country, e);
      setActiveTooltip(prev => prev ? { ...prev, isPinned: true } : null);
    }
  };

  // Tooltip mouse grace handlers
  const handleTooltipMouseEnter = () => {
    if (tooltipCloseTimer.current) {
      clearTimeout(tooltipCloseTimer.current);
      tooltipCloseTimer.current = null;
    }
  };

  const handleTooltipMouseLeave = () => {
    if (activeTooltip?.isPinned) return;
    tooltipCloseTimer.current = setTimeout(() => {
      setActiveTooltip(null);
    }, 200);
  };

  const toggleTooltipPin = () => {
    setActiveTooltip(prev => prev ? { ...prev, isPinned: !prev.isPinned } : null);
  };

  const closeTooltip = () => {
    setActiveTooltip(null);
    setSelectedPointId(null);
  };

  // Tooltip actions
  const handleInstantQuarantine = (ip: string, e: React.MouseEvent) => {
    e.stopPropagation();
    quickBlockIp(ip, isRtl ? 'عزل أمني تلقائي من خريطة التهديدات الجغرافية' : 'Automated SOC Geo Heatmap Threat Containment');
    setActiveTooltip(prev => prev ? { ...prev, isBlocked: true, heatIndex: 15 } : null);
  };

  const handleDrillDown = (target: ActiveThreatTooltipData, e: React.MouseEvent) => {
    e.stopPropagation();
    onDrillDown?.({
      title: isRtl ? `مصدر التهديد: ${target.countryAr} (${target.countryCode})` : `Origin: ${target.country} (${target.countryCode})`,
      subtitle: isRtl 
        ? `ناقل الهجوم: ${target.threatVectorAr} · IP المهاجم: ${target.ip} · ASN: ${target.asn}`
        : `Threat Vector: ${target.threatVector} · Attacker IP: ${target.ip} · ASN: ${target.asn}`,
      category: 'country',
      filterKey: isRtl ? 'دولة المهاجم' : 'Attacker Country',
      filterValue: target.countryCode,
      metricValue: `${target.heatIndex}/100 Heat Index`
    });
  };

  const handleLogClick = (log: ThreatLogSummaryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLog(log as unknown as LogEntry);
    onDrillDown?.({
      title: isRtl ? `سجل التهديد: ${log.eventNameAr}` : `Threat Log: ${log.eventName}`,
      subtitle: isRtl 
        ? `المصدر: ${log.source} · عنوان IP: ${log.sourceIp} · التكتيك: ${log.mitreTechniqueId || 'TTP'}`
        : `Source: ${log.source} · Attacker IP: ${log.sourceIp} · MITRE: ${log.mitreTechniqueId || 'TTP'}`,
      category: 'source',
      filterKey: isRtl ? 'المصدر' : 'Log Source',
      filterValue: log.source,
      metricValue: log.level
    });
  };

  // Tooltip smart boundary positioning math on 1000x500 canvas
  const tooltipDimensions = { width: 320, height: 265 };
  const tooltipCoords = useMemo(() => {
    if (!activeTooltip) return { x: 0, y: 0, edgeX: 0, edgeY: 0 };
    const { anchorX, anchorY } = activeTooltip;
    const { width, height } = tooltipDimensions;

    let x = anchorX > 660 ? anchorX - width - 18 : anchorX + 18;
    let y = anchorY > 260 ? anchorY - height + 20 : anchorY - 20;

    // Strict clamping within canvas boundaries
    x = Math.max(10, Math.min(1000 - width - 10, x));
    y = Math.max(10, Math.min(500 - height - 10, y));

    // Calculate nearest edge for leader line
    const edgeX = x > anchorX ? x : x + width;
    const edgeY = Math.max(y + 10, Math.min(y + height - 10, anchorY));

    return { x, y, edgeX, edgeY };
  }, [activeTooltip]);

  const activeTooltipColor = activeTooltip ? getHeatColor(activeTooltip.heatIndex, activeTooltip.isBlocked) : '#118dff';
  const tooltipLogs = useMemo(() => {
    if (!activeTooltip) return [];
    return getRecentThreatLogs(activeTooltip);
  }, [activeTooltip, logs]);

  const criticalCount = threatPoints.filter(p => p.heatIndex >= 85 && !p.isBlocked).length;
  const quarantinedCount = threatPoints.filter(p => p.isBlocked).length;

  return (
    <div className={`w-full h-full flex flex-col p-2 space-y-2 select-none font-sans text-xs ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Streamlined Visual Controls Toolbar */}
      <div className={`p-1.5 rounded-[2px] border space-y-1 text-xs font-mono ${
        isDark ? 'bg-[#080f1e]/90 border-[#18284c]' : 'bg-slate-50 border-slate-200'
      }`}>
        {/* Row 1: View Modes, Threat Category Filters & Layer Toggles */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* View Switcher: Split / Full Map / Rankings */}
          <div className={`flex items-center p-0.5 rounded-[2px] border shrink-0 ${
            isDark ? 'bg-[#060c18] border-[#18284c]' : 'bg-white border-slate-300'
          }`}>
            <button
              onClick={() => setActiveView('combined')}
              className={`px-2 py-0.5 rounded-[2px] text-[10px] font-medium transition-all cursor-pointer ${
                activeView === 'combined'
                  ? 'bg-[#118dff] text-white font-bold'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isRtl ? 'عرض مزدوج' : 'Split View'}
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`px-2 py-0.5 rounded-[2px] text-[10px] font-medium transition-all cursor-pointer ${
                activeView === 'map'
                  ? 'bg-[#118dff] text-white font-bold'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isRtl ? 'الخريطة الكاملة' : 'Full Map'}
            </button>
            <button
              onClick={() => setActiveView('chart')}
              className={`px-2 py-0.5 rounded-[2px] text-[10px] font-medium transition-all cursor-pointer ${
                activeView === 'chart'
                  ? 'bg-[#118dff] text-white font-bold'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isRtl ? 'تصنيف الدول' : 'Rankings'}
            </button>
          </div>

          {/* Threat Category Filters */}
          <div className="flex items-center gap-1 shrink-0 overflow-x-auto">
            <span className={`text-[10px] uppercase font-bold tracking-wider mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {isRtl ? 'النوع:' : 'Threat:'}
            </span>
            {[
              { id: 'all', labelEn: 'All', labelAr: 'الكل' },
              { id: 'critical', labelEn: 'Critical', labelAr: 'حرج' },
              { id: 'c2', labelEn: 'C2', labelAr: 'C2' },
              { id: 'bruteforce', labelEn: 'Brute', labelAr: 'قوة غاشمة' },
              { id: 'rce', labelEn: 'RCE', labelAr: 'RCE' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-1.5 py-0.5 rounded-[2px] text-[10px] transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#118dff] text-white font-semibold'
                    : isDark ? 'text-slate-400 hover:text-white bg-[#0f1a34]' : 'text-slate-600 hover:text-slate-900 bg-slate-200'
                }`}
              >
                {isRtl ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Layer Toggles */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowTrajectories(prev => !prev)}
              className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                showTrajectories 
                  ? 'bg-[#118dff]/20 text-[#118dff] border border-[#118dff]/40 font-semibold' 
                  : isDark ? 'text-slate-400 bg-[#0f1a34]/60' : 'text-slate-400 bg-slate-100'
              }`}
              title={isRtl ? 'تبديل مسارات الليزر المتحركة للهجمات' : 'Toggle Animated Laser Attack Trajectories'}
            >
              <Zap className="w-3 h-3" />
              <span className="hidden sm:inline">{isRtl ? 'مسارات الهجوم' : 'Arcs'}</span>
            </button>

            <button
              onClick={() => setHeatMode(curr => curr === 'thermal' ? 'points' : 'thermal')}
              className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                heatMode === 'thermal' 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-semibold' 
                  : isDark ? 'text-slate-400 bg-[#0f1a34]/60' : 'text-slate-400 bg-slate-100'
              }`}
              title={isRtl ? 'تبديل هالة الكثافة الحرارية' : 'Toggle Thermal Kernel Density Aura'}
            >
              <Flame className="w-3 h-3" />
              <span className="hidden sm:inline">{isRtl ? 'الهالة الحرارية' : 'Aura'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Region Filter Pills Bar */}
        <div className={`flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5 border-t ${
          isDark ? 'border-[#18284c]' : 'border-slate-200'
        }`}>
          <span className={`text-[10px] uppercase font-bold tracking-wider mr-1 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isRtl ? 'المنطقة:' : 'Region:'}
          </span>
          {[
            { id: 'all', labelEn: 'Global', labelAr: 'عالمي' },
            { id: 'na', labelEn: 'North America', labelAr: 'أمريكا الشمالية' },
            { id: 'eu', labelEn: 'Europe', labelAr: 'أوروبا' },
            { id: 'apac', labelEn: 'Asia-Pacific', labelAr: 'آسيا' },
            { id: 'mea', labelEn: 'MEA & LatAm', labelAr: 'الشرق الأوسط' }
          ].map(reg => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id as any)}
              className={`px-2 py-0.5 rounded-[2px] text-[10px] transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedRegion === reg.id
                  ? isDark ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'bg-[#118dff] text-white font-bold'
                  : isDark ? 'text-slate-400 hover:text-white bg-[#0f1a34]' : 'text-slate-600 hover:text-slate-900 bg-slate-200'
              }`}
            >
              {isRtl ? reg.labelAr : reg.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area: SVG World Map & Recharts Bar Chart */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-3 relative">
        {/* Geographic Heat Map Canvas */}
        {(activeView === 'map' || activeView === 'combined') && (
          <div className={`${activeView === 'combined' ? 'xl:col-span-8' : 'col-span-12'} relative w-full rounded-[2px] border overflow-hidden flex flex-col justify-center ${
            isDark ? 'bg-[#060b14] border-[#18284c]' : 'bg-slate-100 border-slate-200'
          }`}>
            {/* Top Info Banner inside Map */}
            <div className={`absolute top-2 ${isRtl ? 'right-2' : 'left-2'} z-10 text-[9.5px] font-mono pointer-events-none flex items-center flex-wrap gap-1.5 px-2 py-1 rounded-[2px] border backdrop-blur-md shadow-sm ${
              isDark ? 'bg-[#080f1e]/85 border-[#18284c]/80 text-slate-300' : 'bg-white/90 border-slate-300 text-slate-700'
            }`}>
              <span className="font-semibold text-[#118dff] flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>{isRtl ? 'إحداثيات التهديد' : 'CYLINDRICAL MAP'}</span>
                <bdi dir="ltr" className="text-[#38bdf8] font-bold">WGS-84</bdi>
              </span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span className="text-rose-400 font-bold"><bdi dir="ltr">{criticalCount}</bdi> {isRtl ? 'حرج' : 'CRIT'}</span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span className="text-emerald-400 font-bold"><bdi dir="ltr">{quarantinedCount}</bdi> {isRtl ? 'معزول' : 'CONTAINED'}</span>
              <span aria-hidden="true" className="opacity-40 hidden sm:inline">·</span>
              <span className="text-slate-400 hidden sm:inline">
                {isRtl ? 'مرر الفأرة للتفاصيل' : 'Hover for telemetry'}
              </span>
            </div>

            {/* REAL SVG WORLD MAP: 176 Authentic Country Outlines - Guaranteed 2:1 Aspect Ratio */}
            <div className="relative w-full aspect-[2/1] min-h-[300px] sm:min-h-[350px] flex items-center justify-center">
              <svg
                ref={svgRef}
                viewBox="0 0 1000 500"
                className="w-full h-full block select-none"
                preserveAspectRatio="xMidYMid meet"
              >
              <defs>
                <filter id="thermal-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="12" result="blur1" />
                  <feGaussianBlur stdDeviation="5" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur1" />
                    <feMergeNode in="blur2" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {threatPoints.map(point => {
                  const baseColor = getHeatColor(point.heatIndex, point.isBlocked);
                  return (
                    <radialGradient
                      key={`radial-${point.id}`}
                      id={`heat-grad-${point.id}`}
                      cx="50%"
                      cy="50%"
                      r="50%"
                      fx="50%"
                      fy="50%"
                    >
                      <stop offset="0%" stopColor={baseColor} stopOpacity={point.isBlocked ? 0.35 : 0.75} />
                      <stop offset="50%" stopColor={baseColor} stopOpacity={point.isBlocked ? 0.15 : 0.35} />
                      <stop offset="100%" stopColor={baseColor} stopOpacity="0" />
                    </radialGradient>
                  );
                })}
              </defs>

              {/* Graticule Grid */}
              <g className="graticules" opacity={isDark ? 0.12 : 0.08} stroke={isDark ? '#38bdf8' : '#000000'} strokeWidth="0.8" strokeDasharray="3 3">
                <line x1="0" y1="125" x2="1000" y2="125" />
                <line x1="0" y1="250" x2="1000" y2="250" />
                <line x1="0" y1="375" x2="1000" y2="375" />
                <line x1="200" y1="0" x2="200" y2="500" />
                <line x1="400" y1="0" x2="400" y2="500" />
                <line x1="600" y1="0" x2="600" y2="500" />
                <line x1="800" y1="0" x2="800" y2="500" />
              </g>

              {/* 176 Authentic Real World Country Vectors with Interactive Hover */}
              <g className="world-countries-layer">
                {WORLD_COUNTRY_PATHS.map(country => {
                  const isProtectedHQ = country.id === 'USA';
                  const isThreatOrigin = threatIsoSet.has(country.id);
                  const isHoveredOrActive = activeTooltip?.iso3 === country.id;

                  let fillColor = isDark ? '#111d33' : '#cbd5e1';
                  let strokeColor = isDark ? '#1e293b' : '#94a3b8';

                  if (isProtectedHQ) {
                    fillColor = isDark ? '#143048' : '#bfdbfe';
                    strokeColor = '#10b981';
                  } else if (isHoveredOrActive) {
                    fillColor = isDark ? '#2a2233' : '#fecdd3';
                    strokeColor = '#f43f5e';
                  } else if (isThreatOrigin) {
                    fillColor = isDark ? '#192640' : '#e2e8f0';
                    strokeColor = isDark ? '#334155' : '#94a3b8';
                  }

                  return (
                    <path
                      key={country.id}
                      d={country.d}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isHoveredOrActive ? 1.4 : 0.6}
                      className="transition-colors duration-150 cursor-pointer hover:opacity-90"
                      onMouseEnter={(e) => handleCountryMouseEnter(country, e)}
                      onMouseLeave={handleCountryMouseLeave}
                      onClick={(e) => handleCountryClick(country, e)}
                    >
                      <title>{country.name} - {isThreatOrigin ? (isRtl ? 'مصدر تهديد نشط' : 'Active Threat Origin') : (isRtl ? 'منطقة جغرافية' : 'Geo Region')}</title>
                    </path>
                  );
                })}
              </g>

              {/* Thermal Heat Aura Overlays */}
              {heatMode === 'thermal' && (
                <g className="thermal-heat-layer pointer-events-none">
                  {threatPoints.map(point => {
                    const haloRadius = Math.max(24, (point.heatIndex / 100) * 48);
                    return (
                      <g key={`aura-${point.id}`}>
                        <circle
                          cx={point.svgX}
                          cy={point.svgY}
                          r={haloRadius * 1.2}
                          fill={`url(#heat-grad-${point.id})`}
                          filter="url(#thermal-glow-filter)"
                        />
                        <circle
                          cx={point.svgX}
                          cy={point.svgY}
                          r={haloRadius * 0.6}
                          fill={`url(#heat-grad-${point.id})`}
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Laser Attack Trajectory Arcs */}
              {showTrajectories && (
                <g className="laser-trajectories pointer-events-none">
                  {threatPoints.map(p => {
                    if (p.isBlocked) return null;
                    const startX = p.svgX;
                    const startY = p.svgY;
                    const endX = PROTECTED_CORE.x;
                    const endY = PROTECTED_CORE.y;

                    const midX = (startX + endX) / 2;
                    const midY = Math.min(startY, endY) - 40;

                    const isHighRisk = p.heatIndex >= 80;
                    const strokeColor = isHighRisk ? '#f43f5e' : '#fb923c';

                    return (
                      <g key={`traj-${p.id}`} opacity={isHighRisk ? 0.8 : 0.5}>
                        <path
                          d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={isHighRisk ? 1.6 : 1.1}
                          strokeDasharray={isHighRisk ? "5 3" : "4 4"}
                        />
                        <circle
                          cx={(startX * 0.65 + endX * 0.35)}
                          cy={(startY * 0.65 + endY * 0.35) - 20}
                          r={isHighRisk ? 2.5 : 1.8}
                          fill={strokeColor}
                          className="animate-ping"
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Protected Enterprise Cloud & Datacenter Core Node */}
              <g transform={`translate(${PROTECTED_CORE.x}, ${PROTECTED_CORE.y})`} className="pointer-events-none">
                <circle r="16" fill="none" stroke="#118dff" strokeWidth="1" strokeDasharray="3 3" />
                <circle r="10" fill="none" stroke="#10b981" strokeWidth="1.5" />
                <circle r="4.5" fill="#10b981" />
                <text x="14" y="4" fill={isDark ? '#6ee7b7' : '#10b981'} fontSize="9" fontFamily="monospace" fontWeight="bold">
                  {isRtl ? PROTECTED_CORE.nameAr : PROTECTED_CORE.nameEn}
                </text>
              </g>

              {/* THREAT CENTROID NODES */}
              <g className="threat-centroid-nodes">
                {threatPoints.map(point => {
                  const isSelected = selectedPointId === point.id;
                  const isHovered = activeTooltip?.id === point.id;
                  const pointColor = getHeatColor(point.heatIndex, point.isBlocked);
                  const nodeRadius = Math.max(5.5, (point.heatIndex / 100) * 10);
                  const displayCity = isRtl ? point.cityAr : point.city;

                  const isCriticalThreat = point.severity === 'CRITICAL' || point.heatIndex >= 80;
                  const isHighThreat = point.severity === 'HIGH' || point.heatIndex >= 65;
                  const pulseSpeed = isCriticalThreat ? '1.5s' : isHighThreat ? '2.2s' : '3.0s';
                  const pulseDelay = isCriticalThreat ? '0.5s' : isHighThreat ? '0.7s' : '1.0s';

                  return (
                    <g
                      key={`node-${point.id}`}
                      transform={`translate(${point.svgX}, ${point.svgY})`}
                      className="cursor-pointer"
                      onMouseEnter={() => handlePointMouseEnter(point)}
                      onMouseLeave={handlePointMouseLeave}
                      onClick={() => handlePointClick(point)}
                    >
                      {/* REAL-TIME MULTI-WAVE PULSE ANIMATION EFFECT FOR ACTIVE THREATS */}
                      {!point.isBlocked && (
                        <g className="threat-pulse-waves pointer-events-none">
                          {/* Concentric Primary Shockwave Ring */}
                          <circle
                            cx="0"
                            cy="0"
                            r={nodeRadius}
                            fill="none"
                            stroke={pointColor}
                            strokeWidth={isCriticalThreat ? 2 : 1.5}
                          >
                            <animate
                              attributeName="r"
                              from={nodeRadius}
                              to={nodeRadius * (isCriticalThreat ? 3.4 : 2.6)}
                              dur={pulseSpeed}
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.9;0.45;0"
                              keyTimes="0;0.55;1"
                              dur={pulseSpeed}
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="stroke-width"
                              values={isCriticalThreat ? "2.2;1.1;0.4" : "1.8;0.9;0.3"}
                              dur={pulseSpeed}
                              repeatCount="indefinite"
                            />
                          </circle>

                          {/* Secondary Outward Ripple (Phase-Delayed Echo) */}
                          <circle
                            cx="0"
                            cy="0"
                            r={nodeRadius}
                            fill="none"
                            stroke={pointColor}
                            strokeWidth="1.2"
                          >
                            <animate
                              attributeName="r"
                              from={nodeRadius}
                              to={nodeRadius * (isCriticalThreat ? 4.8 : 3.6)}
                              begin={pulseDelay}
                              dur={pulseSpeed}
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.75;0.3;0"
                              keyTimes="0;0.5;1"
                              begin={pulseDelay}
                              dur={pulseSpeed}
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="stroke-width"
                              values="1.5;0.7;0.2"
                              begin={pulseDelay}
                              dur={pulseSpeed}
                              repeatCount="indefinite"
                            />
                          </circle>

                          {/* Soft Core Breathing Aura */}
                          <circle
                            cx="0"
                            cy="0"
                            r={nodeRadius * 1.3}
                            fill={pointColor}
                            opacity="0.3"
                          >
                            <animate
                              attributeName="r"
                              values={`${nodeRadius * 1.1};${nodeRadius * (isCriticalThreat ? 1.7 : 1.45)};${nodeRadius * 1.1}`}
                              dur={pulseSpeed}
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values={isCriticalThreat ? "0.45;0.1;0.45" : "0.32;0.08;0.32"}
                              dur={pulseSpeed}
                              repeatCount="indefinite"
                            />
                          </circle>

                          {/* Rotating Tactical Alert Ring for Active Ongoing Incidents */}
                          {point.activeIncidents > 0 && (
                            <circle
                              cx="0"
                              cy="0"
                              r={nodeRadius * 2.2}
                              fill="none"
                              stroke={isDark ? '#f43f5e' : '#e11d48'}
                              strokeWidth="1.2"
                              strokeDasharray="3 3"
                            >
                              <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0"
                                to="360"
                                dur="6s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          )}
                        </g>
                      )}

                      {/* Solid Core Node */}
                      <circle
                        r={isHovered || isSelected ? nodeRadius * 1.35 : nodeRadius}
                        fill={pointColor}
                        stroke={isDark ? '#060b14' : '#ffffff'}
                        strokeWidth="1.8"
                        className="transition-all duration-150"
                      />

                      {/* Center White Beacon Core with Dynamic Live Pulse */}
                      <circle r={isCriticalThreat && !point.isBlocked ? "2.5" : "2"} fill="#ffffff">
                        {!point.isBlocked && isCriticalThreat && (
                          <animate
                            attributeName="r"
                            values="1.8;2.8;1.8"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                        )}
                      </circle>

                      {/* Small node label if no active interactive tooltip is displayed for this node */}
                      {!activeTooltip && point.heatIndex >= 88 && (
                        <g transform={`translate(0, ${nodeRadius + 14})`} className="pointer-events-none">
                          <rect
                            x="-50"
                            y="-9"
                            width="100"
                            height="18"
                            rx="2"
                            fill={isDark ? '#0f172a' : '#ffffff'}
                            stroke={pointColor}
                            strokeWidth="1"
                            opacity="0.95"
                          />
                          <text
                            textAnchor="middle"
                            y="3.5"
                            fill={isDark ? '#f8fafc' : '#0f172a'}
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {point.countryCode}: {displayCity} [{point.heatIndex}]
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* INTERACTIVE SVG TOOLTIP FUNCTIONALITY FOR HEATMAP REGIONS */}
              {activeTooltip && (
                <g className="interactive-svg-tooltip-group" style={{ zIndex: 100 }}>
                  {/* Tactical Reticle & Dynamic Leader Line */}
                  <g className="pointer-events-none">
                    <circle
                      cx={activeTooltip.anchorX}
                      cy={activeTooltip.anchorY}
                      r="13"
                      fill="none"
                      stroke={activeTooltipColor}
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                      className="animate-spin"
                    />
                    <circle
                      cx={activeTooltip.anchorX}
                      cy={activeTooltip.anchorY}
                      r="7"
                      fill="none"
                      stroke={activeTooltipColor}
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={activeTooltip.anchorX}
                      cy={activeTooltip.anchorY}
                      r="2.5"
                      fill={activeTooltipColor}
                    />
                    {/* Dashed Tactical Leader Connection to Tooltip Card */}
                    <line
                      x1={activeTooltip.anchorX}
                      y1={activeTooltip.anchorY}
                      x2={tooltipCoords.edgeX}
                      y2={tooltipCoords.edgeY}
                      stroke={activeTooltipColor}
                      strokeWidth="1.2"
                      strokeDasharray="4 3"
                      opacity="0.85"
                    />
                  </g>

                  {/* High-Fidelity Interactive Tooltip via SVG foreignObject */}
                  <foreignObject
                    x={tooltipCoords.x}
                    y={tooltipCoords.y}
                    width={tooltipDimensions.width}
                    height={tooltipDimensions.height}
                    className="overflow-visible pointer-events-auto"
                    onMouseEnter={handleTooltipMouseEnter}
                    onMouseLeave={handleTooltipMouseLeave}
                  >
                    <div
                      dir={isRtl ? 'rtl' : 'ltr'}
                      className={`w-[320px] rounded-[3px] border shadow-2xl backdrop-blur-md p-2.5 font-mono text-xs select-auto transition-all ${
                        isDark
                          ? 'bg-[#080f1e]/98 border-[#18284c] text-slate-100 shadow-black/80'
                          : 'bg-white/98 border-slate-300 text-slate-800 shadow-slate-400/50'
                      }`}
                      style={{ pointerEvents: 'auto' }}
                    >
                      {/* Tooltip Header: Flag/Pin, Country, City, Severity Tag, Pin Button, Close Button */}
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-500/20">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-sm shrink-0">📍</span>
                          <span className="font-bold text-[12px] truncate">
                            {isRtl ? activeTooltip.countryAr : activeTooltip.country}
                          </span>
                          <span className="text-[10px] opacity-70 truncate">
                            ({isRtl ? activeTooltip.cityAr : activeTooltip.city})
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded-[2px] font-bold text-white uppercase tracking-wider"
                            style={{ backgroundColor: activeTooltipColor }}
                          >
                            {activeTooltip.isBlocked
                              ? (isRtl ? 'معزول' : 'QUARANTINED')
                              : activeTooltip.severity}
                          </span>

                          {/* Pin toggle button */}
                          <button
                            onClick={() => toggleTooltipPin()}
                            className={`p-0.5 rounded hover:bg-slate-500/20 transition-colors cursor-pointer text-[10px] ${
                              activeTooltip.isPinned ? 'text-amber-400 font-bold' : 'opacity-60 hover:opacity-100'
                            }`}
                            title={activeTooltip.isPinned ? (isRtl ? 'إلغاء التثبيت' : 'Unpin Tooltip') : (isRtl ? 'تثبيت البطاقة' : 'Pin Tooltip')}
                          >
                            📌
                          </button>

                          {/* Close button */}
                          <button
                            onClick={() => closeTooltip()}
                            className="p-0.5 rounded hover:bg-slate-500/20 transition-colors cursor-pointer opacity-60 hover:opacity-100"
                            title={isRtl ? 'إغلاق' : 'Close'}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Key Threat Metadata Strip */}
                      <div className="py-1.5 space-y-1 text-[10.5px] border-b border-slate-500/20">
                        <div className="flex justify-between items-center">
                          <span className="opacity-75">{isRtl ? 'مؤشر الكثافة الحرارية:' : 'Thermal Heat Index:'}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1.5 bg-slate-700/40 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${Math.min(100, activeTooltip.heatIndex)}%`,
                                  backgroundColor: activeTooltipColor
                                }}
                              />
                            </div>
                            <span className="font-bold tabular-nums" style={{ color: activeTooltipColor }}>
                              {activeTooltip.heatIndex}/100
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="opacity-75">{isRtl ? 'عنوان IP المهاجم:' : 'Attacker IP:'}</span>
                          <bdi dir="ltr" className="font-semibold text-[#118dff] font-mono select-all">
                            {activeTooltip.ip}
                          </bdi>
                        </div>

                        <div className="flex justify-between items-center text-[10px] opacity-80">
                          <span className="truncate max-w-[170px]" title={activeTooltip.asn}>
                            {activeTooltip.asn}
                          </span>
                          {activeTooltip.mitreId && (
                            <bdi dir="ltr" className="font-mono text-amber-400 font-semibold shrink-0">
                              {activeTooltip.mitreId}
                            </bdi>
                          )}
                        </div>
                      </div>

                      {/* RECENT DETECTED THREAT LOGS SUMMARY SECTION */}
                      <div className="py-1.5 space-y-1">
                        <div className="flex items-center justify-between text-[10.5px]">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                            </span>
                            <span>{isRtl ? 'أحدث سجلات التهديدات المرصودة:' : 'Recent Detected Threat Logs:'}</span>
                          </div>
                          <span className="text-[9.5px] opacity-70 tabular-nums">
                            {tooltipLogs.length} {isRtl ? 'سجلات' : 'events'}
                          </span>
                        </div>

                        <div className="space-y-1 max-h-[82px] overflow-y-auto pr-0.5">
                          {tooltipLogs.map((log, idx) => (
                            <div
                              key={log.id || idx}
                              onClick={(e) => handleLogClick(log, e)}
                              className={`p-1 rounded-[2px] border text-[9.5px] transition-colors cursor-pointer ${
                                isDark 
                                  ? 'bg-[#0f1a34]/80 hover:bg-[#152244] border-[#1e3466]/60' 
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                              }`}
                              title={isRtl ? 'انقر لمعاينة تفاصيل السجل في لوحة الفحص' : 'Click to inspect log details in drill-down modal'}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <div className="flex items-center gap-1 truncate">
                                  <span
                                    className="px-1 py-0.2 rounded-[1px] text-[8px] font-bold text-white shrink-0"
                                    style={{ backgroundColor: getSeverityBgColor(log.level) }}
                                  >
                                    {log.level}
                                  </span>
                                  <span className="font-semibold truncate">
                                    {isRtl ? (log.eventNameAr || log.eventName) : log.eventName}
                                  </span>
                                </div>
                                <span className="text-[8.5px] opacity-65 shrink-0 tabular-nums font-mono">
                                  {log.relativeTime}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[8.5px] opacity-75 mt-0.5">
                                <span className="text-[#38bdf8] truncate">{log.source}</span>
                                <bdi dir="ltr" className="truncate opacity-70">
                                  {log.host ? `${log.host}` : log.sourceIp}
                                </bdi>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions: Drill-Down & Instant Quarantine */}
                      <div className="pt-1.5 border-t border-slate-500/20 flex gap-1.5">
                        <button
                          onClick={(e) => handleDrillDown(activeTooltip, e)}
                          className={`flex-1 py-1 rounded-[2px] text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                            isDark 
                              ? 'bg-[#0f1a34] hover:bg-[#152244] text-[#38bdf8] border-[#1e3466]' 
                              : 'bg-slate-100 hover:bg-slate-200 text-[#118dff] border-slate-300'
                          }`}
                        >
                          <Search className="w-3 h-3" />
                          <span>{isRtl ? 'استعراض السجلات' : 'Drill Down'}</span>
                        </button>

                        <button
                          onClick={(e) => handleInstantQuarantine(activeTooltip.ip, e)}
                          disabled={activeTooltip.isBlocked}
                          className={`flex-1 py-1 rounded-[2px] text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            activeTooltip.isBlocked
                              ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/40 cursor-not-allowed'
                              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                          }`}
                        >
                          {activeTooltip.isBlocked ? (
                            <>
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              <span>{isRtl ? 'معزول بنجاح' : 'Quarantined'}</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3 h-3 text-amber-300" />
                              <span>{isRtl ? 'عزل IP عبر SOAR' : 'Quarantine IP'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </foreignObject>
                </g>
              )}
            </svg>
            </div>

            {/* Bottom Status Ribbon when no interactive tooltip is active */}
            {!activeTooltip && activeFocus && (
              <div className={`absolute bottom-2.5 ${isRtl ? 'right-2.5 text-right' : 'left-2.5 text-left'} z-20 px-2.5 py-1 rounded-[2px] border text-[10.5px] font-mono flex items-center gap-2 backdrop-blur-md ${
                isDark ? 'bg-[#080f1e]/90 border-[#18284c] text-slate-300' : 'bg-white/90 border-slate-300 text-slate-700'
              }`}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getHeatColor(activeFocus.heatIndex, activeFocus.isBlocked) }} />
                <span className="font-semibold">{isRtl ? activeFocus.countryAr : activeFocus.country} ({isRtl ? activeFocus.cityAr : activeFocus.city})</span>
                <span className="opacity-60">·</span>
                <bdi dir="ltr" className="font-bold tabular-nums" style={{ color: getHeatColor(activeFocus.heatIndex, activeFocus.isBlocked) }}>
                  {activeFocus.heatIndex}/100
                </bdi>
                <span className="opacity-60">·</span>
                <span className="text-[10px] opacity-70">
                  {isRtl ? 'مرر الفأرة فوق أي موقع لعرض سجلات التهديدات · انقر للتثبيت' : 'Hover any location for threat logs · Click to pin'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Recharts Origin Heat Ranking Bar Chart */}
        {(activeView === 'chart' || activeView === 'combined') && (
          <div className={`${activeView === 'combined' ? 'xl:col-span-4' : 'col-span-12'} rounded-[2px] border flex flex-col justify-between p-2.5 min-h-[260px] ${
            isDark ? 'bg-[#080f1e]/90 border-[#18284c]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-1 border-b border-inherit">
              <div className="flex items-center gap-1 text-[11px] font-bold font-mono">
                <BarChart3 className="w-3.5 h-3.5 text-[#118dff]" />
                <span>{isRtl ? 'ترتيب مصادر الهجوم' : 'Origin Ingress Ranking'}</span>
              </div>
              <span className={`text-[10px] font-mono flex items-center gap-1 ${isDark ? 'text-cyan-400' : 'text-[#118dff]'}`}>
                <Search className="w-2.5 h-2.5" />
                <span>{isRtl ? 'انقر للتصفية' : 'Click to filter'}</span>
              </span>
            </div>

            {/* Recharts Horizontal Heat Density Bar Chart */}
            <div className="w-full flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={threatPoints.slice(0, activeView === 'combined' ? 5 : 8)}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 2, bottom: 6 }}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={{ stroke: isDark ? '#18284c' : '#cbd5e1' }}
                    tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 9, fontFamily: 'monospace' }}
                  />
                  <YAxis
                    dataKey="countryCode"
                    type="category"
                    tickLine={false}
                    axisLine={{ stroke: isDark ? '#18284c' : '#cbd5e1' }}
                    tick={{ fill: isDark ? '#e2e8f0' : '#1e293b', fontSize: 10, fontFamily: 'monospace', fontWeight: 600 }}
                    width={28}
                  />
                  <ReferenceLine x={75} stroke="#f43f5e" strokeDasharray="3 3" />
                  <RechartsTooltip
                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const pt = payload[0].payload as GeoHeatThreatPoint;
                      return (
                        <div className={`p-2 rounded-[2px] border shadow-lg text-xs font-mono min-w-[175px] ${
                          isDark ? 'bg-[#060c18] border-[#18284c] text-white' : 'bg-white border-slate-200 text-slate-800'
                        }`}>
                          <div className="font-bold text-[11px] pb-1 border-b border-inherit flex justify-between">
                            <span>{isRtl ? pt.countryAr : pt.country} ({pt.countryCode})</span>
                            <span className="font-mono text-[11px]" style={{ color: getHeatColor(pt.heatIndex, pt.isBlocked) }}>
                              {pt.eventsCount.toLocaleString()} {isRtl ? 'حدث' : 'events'}
                            </span>
                          </div>
                          <div className="pt-1 text-[10.5px] space-y-0.5">
                            <div>{isRtl ? 'المدينة:' : 'City:'} {isRtl ? pt.cityAr : pt.city}</div>
                            <div>{isRtl ? 'الحالة:' : 'Status:'} {pt.isBlocked ? (isRtl ? 'معزول' : 'Quarantined') : pt.severity}</div>
                          </div>
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDrillDown?.({
                                title: isRtl ? `مصدر التهديد: ${pt.countryAr} (${pt.countryCode})` : `Origin: ${pt.country} (${pt.countryCode})`,
                                subtitle: isRtl 
                                  ? `ناقل الهجوم: ${pt.threatVectorAr} · IP المهاجم: ${pt.ip} · ASN: ${pt.asn}`
                                  : `Threat Vector: ${pt.threatVector} · Attacker IP: ${pt.ip} · ASN: ${pt.asn}`,
                                category: 'country',
                                filterKey: isRtl ? 'دولة المهاجم' : 'Attacker Country',
                                filterValue: pt.countryCode,
                                metricValue: `${pt.eventsCount.toLocaleString()} ${isRtl ? 'حدث' : 'Events'}`
                              });
                            }}
                            className="mt-1.5 pt-1 border-t border-inherit flex items-center justify-between text-[10px] text-[#118dff] font-bold cursor-pointer"
                          >
                            <span>{isRtl ? 'تصفية سجلات المصدر' : 'Filter telemetry logs'}</span>
                            <Search className="w-3 h-3" />
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="heatIndex"
                    name={isRtl ? 'ضغط التهديد' : 'Ingress Pressure'}
                    radius={[0, 2, 2, 0]}
                    barSize={14}
                    animationDuration={400}
                  >
                    {threatPoints.slice(0, activeView === 'combined' ? 5 : 8).map((entry) => (
                      <Cell
                        key={`cell-${entry.id}`}
                        fill={getHeatColor(entry.heatIndex, entry.isBlocked)}
                        opacity={selectedPointId && selectedPointId !== entry.id ? 0.35 : 1}
                        onClick={() => {
                          setSelectedPointId(curr => curr === entry.id ? null : entry.id);
                          onDrillDown?.({
                            title: isRtl ? `مصدر التهديد: ${entry.countryAr} (${entry.countryCode})` : `Origin: ${entry.country} (${entry.countryCode})`,
                            subtitle: isRtl 
                              ? `ناقل الهجوم: ${entry.threatVectorAr} · IP المهاجم: ${entry.ip} · ASN: ${entry.asn}`
                              : `Threat Vector: ${entry.threatVector} · Attacker IP: ${entry.ip} · ASN: ${entry.asn}`,
                            category: 'country',
                            filterKey: isRtl ? 'دولة المهاجم' : 'Attacker Country',
                            filterValue: entry.countryCode,
                            metricValue: `${entry.eventsCount.toLocaleString()} ${isRtl ? 'أحداث' : 'Events'}`
                          });
                        }}
                        className="cursor-pointer transition-opacity"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Slicer Legend */}
            <div className={`pt-1 border-t text-[10px] font-mono flex items-center justify-between ${
              isDark ? 'border-[#18284c] text-slate-400' : 'border-slate-200 text-slate-500'
            }`}>
              <span>{isRtl ? 'الخط المتقطع: عتبة الإنذار الحرج' : 'Red line: High Alert Threshold'}</span>
              <span className="text-[#118dff] font-semibold">{isRtl ? 'قياس مباشر' : 'Active Telemetry'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
