# Aegis SIEM & Threat Response
### منظومة إيجيس للأمن السيبراني ورصد التهديدات الاستباقية

> **Official App Name:** **Aegis SIEM & Threat Response**  
> **الاسم الرسمي للمنظومة:** **منظومة إيجيس (Aegis SIEM)**  
> *مستوحى من درع «إيجيس» (Aegis) الأسطوري — رمز الحماية المنيعة والدفاع السيبراني المتقدم ضد التهديدات المعقدة.*

---

## 📖 Overview | نبذة عن المنظومة

**Aegis SIEM & Threat Response** is an enterprise-grade Security Operations Center (SOC) Command & Analytics Platform built with the precision and visual fidelity of **Microsoft Power BI**. 

Engineered for SOC analysts, Tier-3 incident responders, and threat hunters, Aegis unifies distributed multi-cloud telemetry, real-time adversary ingress mapping, diurnal log ingestion outage detection, automated SOAR playbooks, and MITRE ATT&CK kill-chain mapping into a cohesive, sub-second analytical workspace.

---

## 🛡️ Key Features & Capabilities | أبرز مميزات المنظومة

### 1. Executive SOC Command Canvas (Power BI Experience)
- **Panoramic Global Adversary Ingress Map**: Real-time tracking of attack origins, flight vectors, ASN routing networks, and active threat cluster coordinates.
- **Log Ingestion Volume & Outage Detector (24h Area Visual)**: Continuous time-series monitoring (GB/hr & EPS) benchmarked against diurnal baseline bands. Automatically detects log forwarding outages, daemon crashes, and silent sensor dropouts.
- **Top Targeted Fleet Endpoints (Bar Visual)**: Risk-indexed host rankings with real-time risk scores ($0$–$100$) and 1-click autonomous EDR host isolation.
- **Incident Severity Distribution (Donut & KPI Hub Visual)**: Severity ratios linked with MTTR vs. SLA performance benchmarks and containment metrics.
- **Adversary Attack Vectors & Protocol Radar**: Multi-axial radar visualization measuring live port and protocol stress against enterprise baselines.
- **SLA & MTTR Containment Velocity (Composed Trend Visual)**: Tracks Mean-Time-To-Detect (MTTD) and Mean-Time-To-Respond (MTTR) with severity breakdown.
- **Enterprise Ingestion Fabric (Hierarchical Treemap Visual)**: Interactive data fabric breakdown of all telemetry sources with real-time anomaly density ratings.
- **Adversary Subnet Ingress Matrix (Scatter Plot)**: Correlation of CIDR ingress volume against target blast radius.

### 2. Deep Incident Investigation Workbench
- Full incident triage queue with priority slicing (CRITICAL, HIGH, MEDIUM, LOW).
- Chronological forensic event timeline with sub-second timestamps.
- Affected host telemetry, adversary attribution, and threat indicators (IOCs).
- Direct SOAR playbook invocation directly from the incident ticket.

### 3. Forensic Log Explorer & Drill-Down Modal
- DirectQuery streaming log pipeline capturing raw Syslog, Windows Security Events, Firewall NetFlow, and CloudTrail events.
- Modal inspection with formatted JSON payload viewer, raw log dump, and CSV export.
- Regex and multi-field keyword filtering across all ingested fields.

### 4. Autonomous SOAR Response Catalog
- Pre-built automated playbooks for immediate threat containment:
  - *Autonomous Host Network Isolation via EDR*
  - *Active Perimeter Firewall IP/CIDR Blacklisting*
  - *Compromised Identity Token Revocation & Password Invalidation*
  - *Memory Dump & Forensic Volatility Extraction*
- One-click rollback capability to reverse containment safely after incident resolution.

### 5. MITRE ATT&CK® Enterprise Matrix Navigator
- Live coverage mapping across core tactical stages:
  - **Initial Access (TA0001)**
  - **Execution (TA0002)**
  - **Persistence (TA0003)**
  - **Defense Evasion (TA0005)**
  - **Credential Access (TA0006)**
  - **Exfiltration (TA0010)**
- Heatmap density indicating active detection coverage vs. unmonitored blind spots.

### 6. Correlation Rules Engine
- Real-time rule definitions with threshold triggers, sliding time windows, and severity ratings.
- Fast toggle switches to activate or silence detection logic on the fly.

### 7. SOC-Grade Theming & Bilingual RTL/LTR Support
- **5 High-Contrast Thematic Palettes**:
  - `Enterprise Dark`: Midnight cyber navy tailored for 24/7 dark control rooms.
  - `Executive Light`: Crisp, high-clarity corporate white for executive reporting.
  - `Midnight Navy`: Deep maritime blue inspired by Microsoft Sentinel and Power BI.
  - `Matrix Terminal`: High-contrast phosphor green theme for threat hunters.
  - `Crimson OLED`: Low-illumination dark OLED theme with vivid crimson indicators.
- **Seamless English & Arabic Localization**: Instant RTL toggle with typography powered by *Cairo* for Arabic and *JetBrains Mono* for telemetry logs.

---

## 🏗️ Project Architecture

```
├── src/
│   ├── components/
│   │   ├── icons/SocIcons.tsx                  # Vector SOC iconography
│   │   ├── pages/PowerBiOverviewPage.tsx       # Primary Executive SOC command canvas
│   │   ├── visuals/
│   │   │   ├── PowerBiGeoHeatMapVisual.tsx     # Panoramic adversary world heat map
│   │   │   ├── PowerBiBarChart.tsx             # Targeted endpoints & risk index bar visual
│   │   │   ├── PowerBiDonutChart.tsx           # Severity distribution & MTTR donut visual
│   │   │   ├── PowerBiAttackVectorRadarVisual.tsx # Attack vectors & protocol radar
│   │   │   ├── PowerBiLogIngestionOutageVisual.tsx # 24h Log ingestion outage detector
│   │   │   ├── PowerBi24HourTrendChart.tsx     # 24h Telemetry timeline & attack spikes
│   │   │   ├── PowerBiSlaMttrTrendVisual.tsx   # MTTR/MTTD SLA containment velocity
│   │   │   ├── PowerBiLogSourceTreemapVisual.tsx # Telemetry volume & anomaly treemap
│   │   │   ├── PowerBiSubnetScatterRiskVisual.tsx # CIDR ingress & blast radius scatter
│   │   │   ├── PowerBiMitreTacticsVisual.tsx   # MITRE ATT&CK enterprise heatmap
│   │   │   ├── PowerBiLiveSocStreamVisual.tsx  # Live wire DirectQuery pipeline
│   │   │   └── PowerBiExecutiveSlicerBar.tsx   # Unified executive command slicer
│   │   ├── IncidentsView.tsx                   # Case workbench & attack timeline
│   │   ├── LogStreamView.tsx                   # Full SIEM log explorer & inspector
│   │   ├── MitreView.tsx                       # MITRE ATT&CK framework navigator
│   │   ├── PlaybooksView.tsx                   # SOAR playbook runner & rollback station
│   │   ├── RulesView.tsx                       # Correlation rules & detection editor
│   │   ├── PowerBiCardVisual.tsx               # Power BI visual wrapper (Focus, Filter, Spotlight)
│   │   ├── PowerBiFilterPane.tsx               # Collapsible right-hand filter pane
│   │   ├── PowerBiPageTabs.tsx                 # Power BI bottom tab bar & status indicator
│   │   ├── PowerBiRibbon.tsx                   # Power BI top ribbon & quick actions
│   │   └── ThemeSelectorMenu.tsx               # 5-theme switcher dropdown
│   ├── context/SiemContext.tsx                 # Centralized telemetry, filtering, and SOAR state
│   ├── types/
│   │   ├── siem.ts                             # Telemetry, Incident, Rule, and Playbook definitions
│   │   └── theme.ts                            # Semantic color tokens for all 5 themes
│   ├── App.tsx                                 # Root application container & navigation
│   └── main.tsx                                # Entry point
├── index.html                                  # HTML entry point with localized typography
├── metadata.json                               # App metadata & capabilities
└── package.json                                # Dependencies & build scripts
```

---

## 🚀 Getting Started | طريقة التشغيل

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
Starts the Vite development server on port 3000:
```bash
npm run dev
```

### 3. Build for Production
Compiles and generates the optimized production bundle in `/dist`:
```bash
npm run build
```

### 4. Code Quality & Type Checking
Runs TypeScript verification across all components:
```bash
npm run lint
```

---

## 🛡️ Tech Stack

- **Framework**: React 19 (TypeScript)
- **Bundler & Tooling**: Vite 8
- **Styling**: Tailwind CSS 4
- **Data Visualization**: Recharts & Custom SVG Canvas Visuals
- **Typography**: Cairo (Arabic) & JetBrains Mono (Forensics & Code)

---

## 📄 License
MIT License. Built for enterprise cybersecurity operations and mission-critical SOC environments.
