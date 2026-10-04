import { DetectionRule, IncidentAlert, LogEntry, Playbook, AttackScenario } from '../types/siem';

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-1091',
    timestamp: new Date(Date.now() - 1000 * 25).toISOString(),
    level: 'CRITICAL',
    source: 'CrowdStrike EDR',
    eventId: 'EDR-9041',
    eventName: 'CobaltStrike Beacon Injection into svchost.exe',
    eventNameAr: 'حقن إشارة CobaltStrike داخل عملية svchost.exe',
    host: 'fin-srv-db01.corp.internal',
    user: 'SYSTEM',
    sourceIp: '185.220.101.5',
    destIp: '10.14.2.80',
    geoIp: { country: 'Netherlands', countryCode: 'NL', city: 'Amsterdam', asn: 'AS200052' },
    mitreTechniqueId: 'T1055.001',
    mitreTactic: 'Defense Evasion',
    mitreTacticAr: 'التهرب الدفاعي',
    signature: 'ProcessInjection:svchost.exe:ReflectiveDLL',
    signatureAr: 'حقن العمليات: svchost.exe عبر Reflective DLL',
    rawPayload: {
      process_id: 1104,
      parent_process: 'powershell.exe',
      injected_target: 'C:\\Windows\\System32\\svchost.exe',
      memory_protection: 'PAGE_EXECUTE_READWRITE',
      hash_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      edr_action: 'ALERT_ONLY'
    }
  },
  {
    id: 'log-1090',
    timestamp: new Date(Date.now() - 1000 * 42).toISOString(),
    level: 'CRITICAL',
    source: 'Linux Syslog',
    eventId: 'PAM-AUTH-FAIL',
    eventName: 'SSH Repeated Authentication Failures & Root Escalation',
    eventNameAr: 'فشل مصادقة متكرر عبر SSH ومحاولة تصعيد صلاحيات root',
    host: 'k8s-prod-worker-03',
    user: 'root',
    sourceIp: '194.26.29.112',
    destIp: '10.240.12.18',
    geoIp: { country: 'Russia', countryCode: 'RU', city: 'Moscow', asn: 'AS44050' },
    mitreTechniqueId: 'T1110.001',
    mitreTactic: 'Credential Access',
    mitreTacticAr: 'الوصول لبيانات الاعتماد',
    signature: 'SSH:BruteForce:ExceededLimit',
    signatureAr: 'هجوم القوة الغاشمة لـ SSH: تجاوز الحد المسموح',
    rawPayload: {
      auth_method: 'publickey_failed_then_password',
      attempts_last_minute: 247,
      target_port: 22,
      service: 'sshd',
      client_agent: 'libssh2_1.9.0'
    }
  },
  {
    id: 'log-1089',
    timestamp: new Date(Date.now() - 1000 * 68).toISOString(),
    level: 'ERROR',
    source: 'AWS CloudTrail',
    eventId: 'AWS-IAM-019',
    eventName: 'AssumeRoleWithWebIdentity Spike from Tor Exit Node',
    eventNameAr: 'ارتفاع مشبوه في طلبات انتحال الأدوار عبر عقدة خروج Tor',
    host: 'aws:iam::882910394012',
    user: 'devops-automation-role',
    sourceIp: '198.51.100.44',
    geoIp: { country: 'Germany', countryCode: 'DE', city: 'Frankfurt', asn: 'AS24940' },
    mitreTechniqueId: 'T1078.004',
    mitreTactic: 'Initial Access',
    mitreTacticAr: 'الوصول الأولي',
    signature: 'CloudTrail:UnauthorizedTokenIssuance',
    signatureAr: 'إصدار رموز وصول غير مصرح بها عبر CloudTrail',
    rawPayload: {
      action: 'sts:AssumeRole',
      arn: 'arn:aws:iam::882910394012:role/DevOpsProductionAdmin',
      session_name: 'bot-session-override',
      user_agent: 'aws-sdk-go/v1.38.49 (go1.16.3; linux; amd64)'
    }
  },
  {
    id: 'log-1088',
    timestamp: new Date(Date.now() - 1000 * 95).toISOString(),
    level: 'WARN',
    source: 'Cloudflare WAF',
    eventId: 'WAF-SQLI-BLOCK',
    eventName: 'SQL Injection in /api/v2/customer/lookup',
    eventNameAr: 'هجوم حقن SQL على واجهة برمجة التطبيقات /customer/lookup',
    host: 'api.enterprise-gateway.net',
    user: 'anonymous',
    sourceIp: '45.154.255.89',
    geoIp: { country: 'Bulgaria', countryCode: 'BG', city: 'Sofia', asn: 'AS58061' },
    mitreTechniqueId: 'T1190',
    mitreTactic: 'Initial Access',
    mitreTacticAr: 'الوصول الأولي',
    signature: 'WAF:RuleID:942100:LibInjectionSQL',
    signatureAr: 'جدار الحماية WAF: حظر محاولة حقن قواعد البيانات',
    rawPayload: {
      http_uri: '/api/v2/customer/lookup?id=1%27%20UNION%20SELECT%20password_hash,salt%20FROM%20users--',
      status_code: 403,
      action: 'block',
      waf_confidence: 99
    }
  },
  {
    id: 'log-1087',
    timestamp: new Date(Date.now() - 1000 * 120).toISOString(),
    level: 'WARN',
    source: 'Okta SSO',
    eventId: 'OKTA-MFA-DENIED',
    eventName: 'MFA Push Fatigue Bombing Detected',
    eventNameAr: 'رصد إغراق بطلبات التحقق الثنائي (MFA Fatigue)',
    host: 'identity.auth.internal',
    user: 'sarah.jenkins@enterprise.com',
    sourceIp: '185.190.141.22',
    geoIp: { country: 'Romania', countryCode: 'RO', city: 'Bucharest', asn: 'AS43754' },
    mitreTechniqueId: 'T1621',
    mitreTactic: 'Credential Access',
    mitreTacticAr: 'الوصول لبيانات الاعتماد',
    signature: 'Okta:MultiFactorPromptBombing',
    signatureAr: 'أوكتا: إجهاد المستخدم بطلبات المصادقة المتتالية',
    rawPayload: {
      consecutive_pushes: 14,
      user_action: 'REJECTED_REPORTED_FRAUD',
      browser: 'Chrome 122 on Windows',
      client_ip: '185.190.141.22'
    }
  },
  {
    id: 'log-1086',
    timestamp: new Date(Date.now() - 1000 * 150).toISOString(),
    level: 'INFO',
    source: 'Kubernetes Audit',
    eventId: 'K8S-POD-EXEC',
    eventName: 'Interactive Shell Executed in Pod redis-replica-0',
    eventNameAr: 'تنفيذ صدفة تفاعلية داخل حاوية redis-replica-0',
    host: 'cluster-prod-eu-west1',
    user: 'cluster-admin-serviceaccount',
    sourceIp: '10.240.0.12',
    destIp: '10.244.3.49',
    mitreTechniqueId: 'T1609',
    mitreTactic: 'Execution',
    mitreTacticAr: 'التنفيذ البرمجي',
    signature: 'K8sAudit:PodExecCommand',
    signatureAr: 'تدقيق K8s: أمر تنفيذ تفاعلي داخل الحاوية',
    rawPayload: {
      namespace: 'production-data',
      pod_name: 'redis-replica-0',
      container: 'redis',
      command: ['/bin/sh', '-c', 'cat /etc/passwd']
    }
  },
  {
    id: 'log-1085',
    timestamp: new Date(Date.now() - 1000 * 180).toISOString(),
    level: 'ERROR',
    source: 'Zeek Network',
    eventId: 'ZEEK-DNS-TUNNEL',
    eventName: 'Suspicious High-Entropy TXT Query Exfiltration',
    eventNameAr: 'تسريب بيانات مشبوه عبر استعلامات DNS TXT عالية الإنتروبيا',
    host: 'gw-core-01.corp.internal',
    user: 'netdaemon',
    sourceIp: '194.26.29.112',
    geoIp: { country: 'Russia', countryCode: 'RU', city: 'Moscow', asn: 'AS44050' },
    mitreTechniqueId: 'T1048.003',
    mitreTactic: 'Exfiltration',
    mitreTacticAr: 'تسريب البيانات',
    signature: 'Zeek:DNS:HighEntropyTunneling',
    signatureAr: 'زيك: رصد قناة نفقية لنظام أسماء النطاقات',
    rawPayload: {
      query: 'a8f3b29c104.c2-exfil-sink.baddomain.org',
      qtype: 'TXT',
      entropy_score: 4.89,
      response_bytes: 512
    }
  },
  {
    id: 'log-1084',
    timestamp: new Date(Date.now() - 1000 * 210).toISOString(),
    level: 'INFO',
    source: 'Windows Security',
    eventId: 'SEC-4624',
    eventName: 'Successful Domain Administrator Logon (Type 10 RDP)',
    eventNameAr: 'تسجيل دخول ناجح لمسؤول النطاق (نوع 10 RDP)',
    host: 'dc01.corp.internal',
    user: 'CORP\\admin.wright',
    sourceIp: '10.14.0.15',
    destIp: '10.14.0.2',
    mitreTechniqueId: 'T1078.002',
    mitreTactic: 'Defense Evasion',
    mitreTacticAr: 'التهرب الدفاعي',
    signature: 'WinEvent:LogonType10:DomainAdmin',
    signatureAr: 'أحداث ويندوز: وصول إداري عن بعد لـ DC',
    rawPayload: {
      logon_type: 10,
      workstation_name: 'SEC-OPS-STATION',
      process_name: 'C:\\Windows\\System32\\winlogon.exe'
    }
  },
  {
    id: 'log-1083',
    timestamp: new Date(Date.now() - 1000 * 240).toISOString(),
    level: 'CRITICAL',
    source: 'Suricata IDS',
    eventId: 'SURICATA-ET-PRO',
    eventName: 'ActiveMQ RCE (CVE-2023-46604) Exploitation Attempt',
    eventNameAr: 'محاولة استغلال ثغرة تنفيذ التعليمات عن بُعد لـ ActiveMQ (CVE-2023-46604)',
    host: 'msg-broker-02.prod.aws',
    user: 'activemq',
    sourceIp: '193.142.146.88',
    geoIp: { country: 'Seychelles', countryCode: 'SC', city: 'Victoria', asn: 'AS398324' },
    mitreTechniqueId: 'T1203',
    mitreTactic: 'Execution',
    mitreTacticAr: 'التنفيذ البرمجي',
    signature: 'ET EXPLOIT Apache ActiveMQ OpenWire Remote Code Execution',
    signatureAr: 'استغلال ثغرة خطيرة في وسيط الرسائل ActiveMQ',
    rawPayload: {
      dest_port: 61616,
      payload_signature: 'ClassPathXmlApplicationContext',
      tcp_flags: 'PSH,ACK'
    }
  },
  {
    id: 'log-1082',
    timestamp: new Date(Date.now() - 1000 * 270).toISOString(),
    level: 'WARN',
    source: 'Cloudflare WAF',
    eventId: 'WAF-PATH-TRAVERSAL',
    eventName: 'Directory Traversal Attempt /etc/shadow',
    eventNameAr: 'محاولة اجتياز مسار المجلدات لقراءة /etc/shadow',
    host: 'api.enterprise-gateway.net',
    user: 'anonymous',
    sourceIp: '103.208.220.14',
    geoIp: { country: 'China', countryCode: 'CN', city: 'Beijing', asn: 'AS4808' },
    mitreTechniqueId: 'T1190',
    mitreTactic: 'Initial Access',
    mitreTacticAr: 'الوصول الأولي',
    signature: 'WAF:RuleID:930110:PathTraversalLFI',
    signatureAr: 'جدار الحماية WAF: محاولة تضمين ملفات محلية خبيثة',
    rawPayload: {
      http_uri: '/download?file=../../../../../../etc/shadow',
      status_code: 403,
      action: 'block'
    }
  }
];

export const INITIAL_RULES: DetectionRule[] = [
  {
    id: 'rule-edr-injection',
    name: 'Suspicious Memory Process Injection into System Binary',
    nameAr: 'حقن ذاكرة مشبوه داخل عمليات النظام التنفيذية',
    severity: 'CRITICAL',
    mitreTechnique: 'T1055.001',
    mitreTactic: 'Defense Evasion',
    mitreTacticAr: 'التهرب الدفاعي',
    query: 'source:CrowdStrike AND eventName:*Injection* AND memory_protection:PAGE_EXECUTE_READWRITE',
    threshold: 1,
    timeWindowSeconds: 60,
    enabled: true,
    triggeredCount: 4,
    automatedPlaybookId: 'pb-host-containment',
    description: 'Detects shellcode or DLL injection into legitimate Windows binaries (svchost, lsass) common in CobaltStrike and Metasploit C2 beacons.',
    descriptionAr: 'يرصد حقن الشيفرات الخبيثة أو ملفات DLL في عمليات ويندوز المشروعة (مثل svchost و lsass) الشائعة في برمجيات التحكم المعادية مثل CobaltStrike.',
    tags: ['EDR', 'MemoryForensics', 'C2']
  },
  {
    id: 'rule-ssh-bruteforce',
    name: 'Rapid SSH Authentication Failure Burst',
    nameAr: 'طوفان من محاولات فشل مصادقة SSH المتسارعة',
    severity: 'CRITICAL',
    mitreTechnique: 'T1110.001',
    mitreTactic: 'Credential Access',
    mitreTacticAr: 'الوصول لبيانات الاعتماد',
    query: 'source:LinuxSyslog AND eventId:PAM-AUTH-FAIL GROUP_BY sourceIp COUNT > 20',
    threshold: 20,
    timeWindowSeconds: 60,
    enabled: true,
    triggeredCount: 19,
    automatedPlaybookId: 'pb-ip-blocklist',
    description: 'Triggers when a single external IP address generates more than 20 SSH authentication rejections within 60 seconds.',
    descriptionAr: 'يتم إطلاقه عندما يولد عنوان IP خارجي أكثر من 20 محاولة مصادقة فاشلة عبر منفذ SSH خلال 60 ثانية.',
    tags: ['Linux', 'SSH', 'BruteForce']
  },
  {
    id: 'rule-tor-cloudtrail',
    name: 'AWS High-Privilege API Invocation via Anonymization Network',
    nameAr: 'استدعاء صلاحيات إدارية سحابية عبر شبكة إخفاء الهوية (Tor)',
    severity: 'HIGH',
    mitreTechnique: 'T1078.004',
    mitreTactic: 'Initial Access',
    mitreTacticAr: 'الوصول الأولي',
    query: 'source:CloudTrail AND action:sts:AssumeRole AND sourceIp IN tor_exit_nodes',
    threshold: 1,
    timeWindowSeconds: 300,
    enabled: true,
    triggeredCount: 2,
    automatedPlaybookId: 'pb-iam-revocation',
    description: 'Alerts when administrator IAM roles are assumed from recognized Tor nodes or proxy networks.',
    descriptionAr: 'يطلق إنذاراً عند محاولة انتحال أدوار المشرف الإداري لـ AWS IAM من خلال عقد شبكة Tor أو بروكسي معتم.',
    tags: ['AWS', 'CloudTrail', 'Anonymizer']
  },
  {
    id: 'rule-dns-tunneling',
    name: 'DNS High-Entropy Exfiltration Channel',
    nameAr: 'قناة تسريب بيانات مشبوهة عبر استعلامات DNS عالية الإنتروبيا',
    severity: 'HIGH',
    mitreTechnique: 'T1071.004',
    mitreTactic: 'Exfiltration',
    mitreTacticAr: 'تسريب البيانات',
    query: 'source:ZeekNetwork AND qtype:TXT AND entropy_score > 4.5',
    threshold: 5,
    timeWindowSeconds: 120,
    enabled: true,
    triggeredCount: 7,
    automatedPlaybookId: 'pb-ip-blocklist',
    description: 'Identifies TXT query bursts containing serialized binary or base64-encoded strings typical of DNS exfiltration utilities.',
    descriptionAr: 'يكتشف التدفقات المكثفة لاستعلامات TXT التي تحتوي سلاسل نصوص مشفرة تشير إلى محاولات تسريب بيانات حساسة عبر أنفاق DNS.',
    tags: ['Network', 'Zeek', 'DNS']
  },
  {
    id: 'rule-mfa-fatigue',
    name: 'MFA Push Bombing & Rapid Re-prompting',
    nameAr: 'إجهاد المستخدم بطلبات التحقق الثنائي المتكررة (MFA Push Bombing)',
    severity: 'MEDIUM',
    mitreTechnique: 'T1621',
    mitreTactic: 'Credential Access',
    mitreTacticAr: 'الوصول لبيانات الاعتماد',
    query: 'source:OktaSSO AND consecutive_pushes > 5 AND user_action:REJECTED',
    threshold: 5,
    timeWindowSeconds: 300,
    enabled: true,
    triggeredCount: 11,
    automatedPlaybookId: 'pb-iam-revocation',
    description: 'Detects repeated Okta verify push requests directed at an individual employee over a short duration.',
    descriptionAr: 'يرصد إرسال طلبات مصادقة متتالية لموظف محدد لدفع المستخدم لقبول الطلب عن طريق الخطأ أو الإجهاد.',
    tags: ['Identity', 'Okta', 'MFA']
  },
  {
    id: 'rule-cve-activemq',
    name: 'Exploitation Attempt of CVE-2023-46604 (ActiveMQ RCE)',
    nameAr: 'محاولة استغلال ثغرة التنفيذ عن بُعد لـ ActiveMQ (CVE-2023-46604)',
    severity: 'CRITICAL',
    mitreTechnique: 'T1203',
    mitreTactic: 'Execution',
    mitreTacticAr: 'التنفيذ البرمجي',
    query: 'source:SuricataIDS AND signature:*ActiveMQ* AND dest_port:61616',
    threshold: 1,
    timeWindowSeconds: 60,
    enabled: true,
    triggeredCount: 3,
    automatedPlaybookId: 'pb-host-containment',
    description: 'Suricata signature alerting on malicious OpenWire serialized XML payloads targeting ActiveMQ message brokers.',
    descriptionAr: 'توقيع Suricata ينبه إلى حمولات XML خبيثة تستهدف منفذ OpenWire في وسائط الرسائل لإسقاط الأوامر عن بُعد.',
    tags: ['Suricata', 'Exploit', 'CVE-2023-46604']
  }
];

export const INITIAL_PLAYBOOKS: Playbook[] = [
  {
    id: 'pb-host-containment',
    name: 'Autonomous Endpoint Network Isolation',
    nameAr: 'العزل الآلي الفوري للجهاز المصاب عن الشبكة',
    description: 'Rapidly severs all inbound and outbound network traffic to the compromised host via agent-level firewalling, leaving only the SOC telemetry port open for forensic capture.',
    descriptionAr: 'يقطع فوراً كافة حركات المرور الصادرة والواردة عن الأصل المخترق عبر جدار حماية الوكيل، مع الإبقاء فقط على قناة القياس الجنائي مفتوحة للمحللين.',
    triggerType: 'AUTOMATIC_ON_CRITICAL',
    runsCount: 14,
    lastRunTimestamp: new Date(Date.now() - 1000 * 3600 * 3).toISOString(),
    targetScope: 'Endpoints & Virtual Machines',
    targetScopeAr: 'نقاط النهاية والأجهزة الافتراضية',
    steps: [
      {
        id: 'step-1',
        name: 'Verify Host Agent Liveness & Telemetry Status',
        nameAr: 'التحقق من حيوية وكيل الجهاز وحالة القياس عن بُعد',
        actionType: 'SNAPSHOT_MEMORY',
        targetDescription: 'Target Host Agent Daemon',
        targetDescriptionAr: 'خدمة وكيل الجهاز المستهدف',
        timeoutSeconds: 5,
        status: 'COMPLETED',
        outputMessage: 'Agent PID 4410 responded. Heartbeat OK. Forensic volatile memory snapshot initiated (4.2GB).',
        outputMessageAr: 'استجاب الوكيل بنجاح. النبض سليم. جاري حفظ نسخة من الذاكرة المتطايرة للتحليل الجنائي (4.2 جيجابايت).'
      },
      {
        id: 'step-2',
        name: 'Apply Kernel EDR Network Quarantine Filter',
        nameAr: 'تطبيق مرشح العزل الشبكي على مستوى النواة EDR',
        actionType: 'ISOLATE_HOST',
        targetDescription: 'Host Network Interfaces (eth0, eth1)',
        targetDescriptionAr: 'واجهات شبكة المضيف (eth0, eth1)',
        timeoutSeconds: 8,
        status: 'COMPLETED',
        outputMessage: 'Enforced iptables isolation matrix. All TCP/UDP dropped except port 8443 (Aegis SOC Telemetry).',
        outputMessageAr: 'تم تطبيق مصفوفة عزل iptables. تم إسقاط كل الحزم باستثناء المنفذ 8443 الخاص باتصال SOC.'
      },
      {
        id: 'step-3',
        name: 'Terminate Spawned Malicious Subprocess Tree',
        nameAr: 'إنهاء شجرة العمليات الفرعية الخبيثة المنبثقة',
        actionType: 'KILL_PROCESS',
        targetDescription: 'Unverified child processes of svchost.exe',
        targetDescriptionAr: 'العمليات غير الموثوقة المنبثقة من svchost.exe',
        timeoutSeconds: 6,
        status: 'COMPLETED',
        outputMessage: 'Terminated injected PID 1104, 1109. Memory pages dumped to /var/log/forensics/dump_1104.raw.',
        outputMessageAr: 'تم إنهاء العمليات المخترقة PID 1104 و 1109 وتفريغ صفحات الذاكرة في ملف السجل الجنائي.'
      },
      {
        id: 'step-4',
        name: 'Dispatch P1 Alert to Incident Commander',
        nameAr: 'إرسال تنبيه عاجل من الدرجة الأولى لقائد الحوادث',
        actionType: 'NOTIFY_PAGERDUTY',
        targetDescription: 'SOC On-Call Tier 2 Schedule',
        targetDescriptionAr: 'جدول مناوبة فرق الاستجابة للمستوى الثاني',
        timeoutSeconds: 3,
        status: 'COMPLETED',
        outputMessage: 'Dispatched PagerDuty incident INC-99214. Slack channel #soc-p1-containment created.',
        outputMessageAr: 'تم إرسال إشعار PagerDuty برقم INC-99214 وإنشاء غرفة التنسيق المباشر #soc-p1-containment.'
      }
    ]
  },
  {
    id: 'pb-ip-blocklist',
    name: 'Edge Perimeter Threat IP Blockade',
    nameAr: 'حظر عناوين IP المهاجمة على محيط الشبكة والجدران النارية',
    description: 'Synthesizes malicious IP indicators from Suricata, Syslog, and WAF detections and updates ingress filters across Cloudflare WAF, Palo Alto Edge Firewalls, and AWS Security Groups.',
    descriptionAr: 'يجمع مؤشرات IP الخبيثة من أنظمة الحماية ويقوم بتحديث قواعد الحظر الفوري عبر Cloudflare WAF وجدران Palo Alto ومجموعات أمان AWS.',
    triggerType: 'AUTOMATIC_ON_CRITICAL',
    runsCount: 89,
    lastRunTimestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    targetScope: 'Edge Firewalls, WAF & Cloud Perimeter',
    targetScopeAr: 'جدران الحماية المحيطية، WAF والمحيط السحابي',
    steps: [
      {
        id: 'step-ip-1',
        name: 'Propagate Ingress Block to Cloudflare Edge WAF',
        nameAr: 'نشر أمر الحظر إلى جدار حماية Cloudflare المحيطي',
        actionType: 'BLOCK_IP',
        targetDescription: 'Cloudflare IP Access Rules API',
        targetDescriptionAr: 'واجهة قواعد الوصول لعناوين IP في Cloudflare',
        timeoutSeconds: 4,
        status: 'COMPLETED',
        outputMessage: 'Zone rule published. 280+ Edge PoPs enforcing instant HTTP/HTTPS drop for offending IP.',
        outputMessageAr: 'تم تعميم القاعدة على أكثر من 280 مركز حوسبة حافة لحظر حزم HTTP/HTTPS للمعتدي فورياً.'
      },
      {
        id: 'step-ip-2',
        name: 'Update Palo Alto NGFW Dynamic Blacklist (DAG)',
        nameAr: 'تحديث قائمة الحظر الديناميكية في جدران Palo Alto NGFW',
        actionType: 'ENFORCE_FIREWALL_RULE',
        targetDescription: 'Palo Alto Panorama XML API',
        targetDescriptionAr: 'واجهة برمجة Palo Alto Panorama',
        timeoutSeconds: 7,
        status: 'COMPLETED',
        outputMessage: 'Pushed IOC to Dynamic Address Group DAG_Perimeter_Drop. Committed in running config.',
        outputMessageAr: 'تمت إضافة مؤشر الاختراق إلى مجموعة العناوين المحظورة وتثبيتها في التكوين الفعال.'
      },
      {
        id: 'step-ip-3',
        name: 'Broadcast Ingress Block to AWS Security Groups',
        nameAr: 'بث حظر الوصول إلى مجموعات أمان AWS Security Groups',
        actionType: 'BLOCK_IP',
        targetDescription: 'AWS VPC Ingress Network ACL',
        targetDescriptionAr: 'قوائم التحكم في الوصول للشبكة VPC Network ACL',
        timeoutSeconds: 5,
        status: 'COMPLETED',
        outputMessage: 'Appended entry 90 deny rule for CIDR block in all public subnet ingress tables.',
        outputMessageAr: 'تمت إضافة قاعدة الرفض رقم 90 لنطاق المهاجم في كافة جداول النطاقات العامة.'
      }
    ]
  },
  {
    id: 'pb-iam-revocation',
    name: 'Compromised Identity & Token Revocation',
    nameAr: 'إلغاء جلسات ورموز الهوية الرقمية المخترقة',
    description: 'Neutralizes compromised employee or service account credentials across Okta SSO, Azure Active Directory, and AWS IAM STS.',
    descriptionAr: 'يبطل فوراً جلسات ورموز المصادقة للموظفين أو الحسابات الخدمية المخترقة عبر Okta و Azure AD و AWS IAM.',
    triggerType: 'MANUAL_TRIAGE',
    runsCount: 23,
    lastRunTimestamp: new Date(Date.now() - 1000 * 3600 * 24).toISOString(),
    targetScope: 'Identity Providers (Okta, Azure AD, AWS IAM)',
    targetScopeAr: 'مزودو الهوية الرقمية (Okta, Azure AD, AWS IAM)',
    steps: [
      {
        id: 'step-iam-1',
        name: 'Terminate Active Okta SSO & SAML Bearer Sessions',
        nameAr: 'إنهاء الجلسات النشطة في Okta SSO ورموز SAML',
        actionType: 'REVOKE_USER_TOKENS',
        targetDescription: 'Okta Users API /clearUserSessions',
        targetDescriptionAr: 'واجهة مسح جلسات المستخدمين في Okta',
        timeoutSeconds: 4,
        status: 'COMPLETED',
        outputMessage: 'Invalidated 3 active web sessions and 2 OAuth refresh tokens for compromised identity.',
        outputMessageAr: 'تم إبطال 3 جلسات ويب نشطة ورمزين من رموز تحديث OAuth للهوية المستهدفة.'
      },
      {
        id: 'step-iam-2',
        name: 'AWS STS RevokeOlderSessions Policy Attachment',
        nameAr: 'إرفاق سياسة إلغاء الجلسات السابقة في AWS STS',
        actionType: 'ROTATE_CREDENTIALS',
        targetDescription: 'AWS IAM Policy Injection',
        targetDescriptionAr: 'حقن سياسة أمان AWS IAM',
        timeoutSeconds: 6,
        status: 'COMPLETED',
        outputMessage: 'Attached inline policy DenyAllPriorToCurrentTimestamp to user ARN.',
        outputMessageAr: 'تم إرفاق سياسة DenyAllPriorToCurrentTimestamp لحظر أي رمز تم إصداره قبل هذه اللحظة.'
      },
      {
        id: 'step-iam-3',
        name: 'Force Password & FIDO2 Re-enrollment upon Next Auth',
        nameAr: 'فرض إعادة تعيين كلمة المرور والمصادقة الأمنية FIDO2',
        actionType: 'ROTATE_CREDENTIALS',
        targetDescription: 'Directory Service Account Flag',
        targetDescriptionAr: 'علامة حساب دليل المستخدمين',
        timeoutSeconds: 3,
        status: 'COMPLETED',
        outputMessage: 'Flagged status: PASSWORD_EXPIRED. User notified via registered SMS channel.',
        outputMessageAr: 'تم تعيين الحالة: منتهي الصلاحية، وإشعار المستخدم عبر القناة الهاتفية المعتمدة.'
      }
    ]
  }
];

export const INITIAL_INCIDENTS: IncidentAlert[] = [
  {
    id: 'INC-2026-8801',
    title: 'CobaltStrike In-Memory Beacon on Financial Database Host',
    titleAr: 'رصد إشارة تحكم CobaltStrike في ذاكرة قاعدة بيانات المعاملات المالية',
    severity: 'CRITICAL',
    status: 'INVESTIGATING',
    timestamp: new Date(Date.now() - 1000 * 45).toISOString(),
    detectionRuleId: 'rule-edr-injection',
    mitreTactic: 'Defense Evasion',
    mitreTacticAr: 'التهرب الدفاعي',
    mitreTechnique: 'T1055.001',
    mitreTechniqueName: 'Process Injection: Dynamic-link Library Injection',
    mitreTechniqueNameAr: 'حقن العمليات: حقن مكتبات الربط الديناميكي (DLL)',
    confidenceScore: 98,
    affectedHost: 'fin-srv-db01.corp.internal',
    affectedUser: 'SYSTEM',
    attackerIp: '185.220.101.5',
    attackerGeo: { country: 'Netherlands', countryCode: 'NL', city: 'Amsterdam', asn: 'AS200052' },
    summary: 'EDR detected reflective DLL injection into svchost.exe originating from PowerShell invocation. Outbound TLS beacons observed toward known C2 IP.',
    summaryAr: 'رصد نظام EDR حقناً لمكتبة DLL خبيثة داخل svchost.exe منبثقة من أمر PowerShell. تم رصد إشارات TLS دورية صادرة نحو خادم تحكم وسيط معروف.',
    recommendedPlaybookId: 'pb-host-containment',
    timeline: [
      {
        id: 'tl-1',
        timestamp: new Date(Date.now() - 1000 * 90).toISOString(),
        title: 'Initial PowerShell Execution',
        titleAr: 'تنفيذ أولي لأمر PowerShell مشفر',
        description: 'Encoded base64 PowerShell command executed under service account context.',
        descriptionAr: 'تم تشغيل أمر PowerShell مشفر بترميز base64 تحت صلاحيات حساب خدمة النظام.',
        phase: 'INITIAL_ACCESS'
      },
      {
        id: 'tl-2',
        timestamp: new Date(Date.now() - 1000 * 60).toISOString(),
        title: 'Memory Allocation PAGE_EXECUTE_READWRITE',
        titleAr: 'تخصيص ذاكرة تنفيذية بقابلية قراءة وكتابة وتنفيذ',
        description: 'Process allocated executable memory space inside svchost.exe (PID 1104).',
        descriptionAr: 'قامت العملية بحجز مساحة تنفيذية قابلة للكتابة والتنفيذ داخل svchost.exe (PID 1104).',
        phase: 'EXECUTION'
      },
      {
        id: 'tl-3',
        timestamp: new Date(Date.now() - 1000 * 45).toISOString(),
        title: 'Detection Rule Triggered',
        titleAr: 'إطلاق قاعدة الكشف الأمني لـ SIEM',
        description: 'Sigma rule "Suspicious Memory Process Injection" fired with 98% confidence score.',
        descriptionAr: 'تم إطلاق قاعدة سيغما "حقن ذاكرة العمليات المشبوه" بدرجة موثوقية 98%.',
        phase: 'DETECTION'
      }
    ],
    correlatedLogIds: ['log-1091', 'log-1085'],
    responseActionsTaken: [],
    assignedTo: 'SOC Lead (Tier-3 Specialist)',
    assignedToAr: 'قائد التحقيق الأمني (المستوى 3)',
    notes: [
      'Preliminary memory dump indicates beacon configuration using malleable C2 profile.',
      'Host holds sensitive quarterly financial records. Recommend executing Autonomous Host Isolation immediately.'
    ],
    notesAr: [
      'يشير تفريغ الذاكرة الأولي إلى استخدام ملف تعريف تحكم وسيط قابل للتشكيل (Malleable C2).',
      'يحتوي الجهاز على سجلات مالية حساسة للغاية. يوصى بتنفيذ العزل الفوري للجهاز لمنع أي تسريب.'
    ]
  },
  {
    id: 'INC-2026-8798',
    title: 'Distributed SSH Brute Force & Privilege Escalation Attempt',
    titleAr: 'هجوم قوة غاشمة موزع عبر SSH ومحاولة تصعيد الصلاحيات',
    severity: 'CRITICAL',
    status: 'CONTAINED',
    timestamp: new Date(Date.now() - 1000 * 180).toISOString(),
    detectionRuleId: 'rule-ssh-bruteforce',
    mitreTactic: 'Credential Access',
    mitreTacticAr: 'الوصول لبيانات الاعتماد',
    mitreTechnique: 'T1110.001',
    mitreTechniqueName: 'Brute Force: Password Guessing',
    mitreTechniqueNameAr: 'القوة الغاشمة: تخمين كلمات المرور',
    confidenceScore: 94,
    affectedHost: 'k8s-prod-worker-03',
    affectedUser: 'root',
    attackerIp: '194.26.29.112',
    attackerGeo: { country: 'Russia', countryCode: 'RU', city: 'Moscow', asn: 'AS44050' },
    summary: '247 failed authentication attempts over 60 seconds targeting Kubernetes node SSH port. Edge firewall rule automatically engaged.',
    summaryAr: 'تم رصد 247 محاولة مصادقة فاشلة خلال 60 ثانية استهدفت منفذ SSH لعقدة كوبرنيتيس. تم تشغيل قاعدة الحظر الآلي بنجاح.',
    recommendedPlaybookId: 'pb-ip-blocklist',
    timeline: [
      {
        id: 'tl-4',
        timestamp: new Date(Date.now() - 1000 * 240).toISOString(),
        title: 'Inbound SSH Connection Scan',
        titleAr: 'فحص استطلاعي لمنافذ SSH الواردة',
        description: 'Scanner detected open port 22 on k8s-prod-worker-03.',
        descriptionAr: 'قام برنامج مسح المنافذ برصد المنفذ 22 مفتوحاً على العقدة المستهدفة.',
        phase: 'INITIAL_ACCESS'
      },
      {
        id: 'tl-5',
        timestamp: new Date(Date.now() - 1000 * 200).toISOString(),
        title: 'Burst of 200+ Failed Credentials',
        titleAr: 'طوفان من أكثر من 200 محاولة دخول فاشلة',
        description: 'Automated wordlist attack tested common root combinations.',
        descriptionAr: 'اختبر هجوم القاموس الآلي توليفات شائعة لكلمات مرور حساب root.',
        phase: 'EXECUTION'
      },
      {
        id: 'tl-6',
        timestamp: new Date(Date.now() - 1000 * 170).toISOString(),
        title: 'Playbook "Edge Perimeter Threat IP Blockade" Auto-Executed',
        titleAr: 'التنفيذ التلقائي لكتيب "حظر عناوين IP المهاجمة"',
        description: 'IP 194.26.29.112 was blocked globally at Cloudflare & Palo Alto perimeter.',
        descriptionAr: 'تم حظر عنوان IP 194.26.29.112 عالمياً في محيط Cloudflare و Palo Alto.',
        phase: 'CONTAINMENT'
      }
    ],
    correlatedLogIds: ['log-1090'],
    responseActionsTaken: ['BLOCK_IP (Cloudflare Edge)', 'ENFORCE_FIREWALL_RULE (Palo Alto)'],
    assignedTo: 'Automated Response Daemon',
    assignedToAr: 'محرك الاستجابة الآلية (SOAR)',
    notes: [
      'Edge block confirmed active. Zero subsequent connection attempts allowed.'
    ],
    notesAr: [
      'تم تأكيد فاعلية الحظر المحيطي. لم يُسمح بأي اتصال لاحق من هذا العنوان.'
    ]
  },
  {
    id: 'INC-2026-8794',
    title: 'Anomalous AWS Admin Role Assumption from Tor Exit Node',
    titleAr: 'انتحال شاذ لصلاحيات المشرف السحابي عبر عقدة خروج شبكة Tor',
    severity: 'HIGH',
    status: 'NEW',
    timestamp: new Date(Date.now() - 1000 * 300).toISOString(),
    detectionRuleId: 'rule-tor-cloudtrail',
    mitreTactic: 'Initial Access',
    mitreTacticAr: 'الوصول الأولي',
    mitreTechnique: 'T1078.004',
    mitreTechniqueName: 'Valid Accounts: Cloud Accounts',
    mitreTechniqueNameAr: 'الحسابات المصرحة: الحسابات السحابية',
    confidenceScore: 91,
    affectedHost: 'aws:iam::882910394012',
    affectedUser: 'devops-automation-role',
    attackerIp: '198.51.100.44',
    attackerGeo: { country: 'Germany', countryCode: 'DE', city: 'Frankfurt', asn: 'AS24940' },
    summary: 'CloudTrail recorded STS AssumeRole API call from documented Tor exit relay targeting high-privilege DevOps administration role.',
    summaryAr: 'سجلت منصة CloudTrail طلباً لانتحال دور DevOps الإداري عالي الصلاحيات من خلال عقدة خروج Tor مسجلة.',
    recommendedPlaybookId: 'pb-iam-revocation',
    timeline: [
      {
        id: 'tl-7',
        timestamp: new Date(Date.now() - 1000 * 320).toISOString(),
        title: 'Tor Exit Node Connection',
        titleAr: 'اتصال عبر عقدة خروج Tor',
        description: 'IP matched active Tor exit list updated 10 minutes ago.',
        descriptionAr: 'تطابق عنوان IP مع القائمة النشطة لعقد Tor المحدثة قبل قليل.',
        phase: 'INITIAL_ACCESS'
      },
      {
        id: 'tl-8',
        timestamp: new Date(Date.now() - 1000 * 300).toISOString(),
        title: 'STS AssumeRole Call',
        titleAr: 'طلب انتحال الدور STS AssumeRole',
        description: 'Attempt to issue temporary STS keys with administrator access.',
        descriptionAr: 'محاولة استخراج مفاتيح وصول مؤقتة بصلاحيات الإشراف الإداري الكامل.',
        phase: 'EXECUTION'
      }
    ],
    correlatedLogIds: ['log-1089'],
    responseActionsTaken: [],
    assignedTo: 'Cloud Security Analyst',
    assignedToAr: 'محلل أمان السحابة',
    notes: [
      'Account holder contacted out-of-band; confirmed they did not initiate this role session.'
    ],
    notesAr: [
      'تم التواصل المباشر مع صاحب الحساب؛ وأكد عدم قيامه بأي محاولة لتسجيل الدخول.'
    ]
  },
  {
    id: 'INC-2026-8791',
    title: 'High-Entropy DNS Tunneling Payload Exfiltration',
    titleAr: 'تسريب حمولة بيانات مشفرة عبر أنفاق DNS عالية الإنتروبيا',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    timestamp: new Date(Date.now() - 1000 * 450).toISOString(),
    detectionRuleId: 'rule-dns-tunneling',
    mitreTactic: 'Exfiltration',
    mitreTacticAr: 'تسريب البيانات',
    mitreTechnique: 'T1048.003',
    mitreTechniqueName: 'Exfiltration Over Alternative Protocol: DNS',
    mitreTechniqueNameAr: 'التسريب عبر بروتوكول بديل: بروتوكول DNS',
    confidenceScore: 88,
    affectedHost: 'gw-core-01.corp.internal',
    affectedUser: 'netdaemon',
    attackerIp: '194.26.29.112',
    attackerGeo: { country: 'Russia', countryCode: 'RU', city: 'Moscow', asn: 'AS44050' },
    summary: 'Zeek network monitor identified 45 sequential high-entropy TXT records querying c2-exfil-sink.baddomain.org over 2 minutes.',
    summaryAr: 'رصد نظام Zeek عدداً من سجلات TXT المتسلسلة ذات الإنتروبيا العالية تستعلم عن نطاق تحكم مشبوه لتسريب بيانات.',
    recommendedPlaybookId: 'pb-ip-blocklist',
    timeline: [
      {
        id: 'tl-9',
        timestamp: new Date(Date.now() - 1000 * 500).toISOString(),
        title: 'First High-Entropy TXT Query',
        titleAr: 'أول استعلام TXT عالي الإنتروبيا',
        description: 'Query entropy calculated at 4.89 (standard baseline < 3.2).',
        descriptionAr: 'بلغ مقياس الإنتروبيا 4.89 مقارنة بمتوسط الخط الطبيعي البالغ أقل من 3.2.',
        phase: 'DETECTION'
      }
    ],
    correlatedLogIds: ['log-1085'],
    responseActionsTaken: [],
    assignedTo: 'Network Security Team',
    assignedToAr: 'فريق أمان الشبكات',
    notes: [
      'DNS Sinkhole sinkhole.enterprise.internal activated for suspect domain.'
    ],
    notesAr: [
      'تم تفعيل حوض تجميع استعلامات DNS (Sinkhole) للنطاق المعادي.'
    ]
  },
  {
    id: 'INC-2026-8785',
    title: 'Repeated Multi-Factor Push Prompt Bombing',
    titleAr: 'إغراق متكرر بطلبات المصادقة الثنائية (Push Prompt Bombing)',
    severity: 'MEDIUM',
    status: 'CONTAINED',
    timestamp: new Date(Date.now() - 1000 * 700).toISOString(),
    detectionRuleId: 'rule-mfa-fatigue',
    mitreTactic: 'Credential Access',
    mitreTacticAr: 'الوصول لبيانات الاعتماد',
    mitreTechnique: 'T1621',
    mitreTechniqueName: 'Multi-Factor Authentication Request Generation',
    mitreTechniqueNameAr: 'توليد طلبات المصادقة متعددة العوامل',
    confidenceScore: 86,
    affectedHost: 'identity.auth.internal',
    affectedUser: 'sarah.jenkins@enterprise.com',
    attackerIp: '185.190.141.22',
    attackerGeo: { country: 'Romania', countryCode: 'RO', city: 'Bucharest', asn: 'AS43754' },
    summary: '14 consecutive mobile push challenges generated within 3 minutes. Employee flagged the notification as fraudulent.',
    summaryAr: 'تم توليد 14 طلب إشعار هاتف متتالي خلال 3 دقائق. أبلغ الموظف عن الطلبات باعتبارها محاولة احتيال.',
    recommendedPlaybookId: 'pb-iam-revocation',
    timeline: [
      {
        id: 'tl-10',
        timestamp: new Date(Date.now() - 1000 * 720).toISOString(),
        title: 'Threshold Exceeded: 5 Rejections',
        titleAr: 'تجاوز العتبة المحددة: 5 رفض متتالي',
        description: 'Okta rate limiter engaged after repeated push failures.',
        descriptionAr: 'تم تفعيل محدد المعدل في Okta بعد فشل المصادقة المتكرر.',
        phase: 'DETECTION'
      }
    ],
    correlatedLogIds: ['log-1087'],
    responseActionsTaken: ['REVOKE_USER_TOKENS (Okta SSO)'],
    assignedTo: 'IAM Operations Tier-1',
    assignedToAr: 'عمليات إدارة الهوية (المستوى 1)',
    notes: [
      'User password reset forced. FIDO2 hardware token issued.'
    ],
    notesAr: [
      'تم فرض إعادة تعيين كلمة المرور وتفعيل مفتاح أمان مادي FIDO2 للموظف.'
    ]
  }
];

export const ATTACK_SCENARIOS: AttackScenario[] = [
  {
    id: 'sc-c2-beacon',
    name: 'CobaltStrike In-Memory Beacon Strike',
    nameAr: 'هجوم إشارة CobaltStrike داخل الذاكرة',
    description: 'Simulates reflective DLL process injection into svchost.exe, triggers EDR alert, creates P1 incident, and isolates the host.',
    descriptionAr: 'يحاكي حقن مكتبة DLL داخل عملية svchost.exe، ويطلق إنذار EDR، ويفتح حادثاً عالي الأهمية، ويعزل الجهاز فورياً.',
    tactic: 'Defense Evasion',
    tacticAr: 'التهرب الدفاعي',
    targetHost: 'fin-srv-db01.corp.internal',
    attackerIp: '185.220.101.5',
    targetUser: 'SYSTEM',
    mitreId: 'T1055.001',
    expectedPlaybookId: 'pb-host-containment'
  },
  {
    id: 'sc-ssh-flood',
    name: 'Distributed SSH Password Spray Campaign',
    nameAr: 'حملة هجوم القوة الغاشمة الموزعة عبر SSH',
    description: 'Generates a rapid burst of 200+ failed SSH logins from Russian adversary IP to trigger edge perimeter blocking.',
    descriptionAr: 'يولد طوفاناً سريعاً من أكثر من 200 محاولة دخول فاشلة لتفعيل الحظر الفوري على الجدران النارية المحيطية.',
    tactic: 'Credential Access',
    tacticAr: 'الوصول لبيانات الاعتماد',
    targetHost: 'k8s-prod-worker-03',
    attackerIp: '194.26.29.112',
    targetUser: 'root',
    mitreId: 'T1110.001',
    expectedPlaybookId: 'pb-ip-blocklist'
  },
  {
    id: 'sc-tor-admin',
    name: 'Cloud Administrator Tor Access Spike',
    nameAr: 'محاولة انتحال إدارة السحابة عبر عقد شبكة Tor',
    description: 'Simulates STS AssumeRole API calls from documented Tor exit relay against AWS production infrastructure.',
    descriptionAr: 'يحاكي طلبات STS AssumeRole الإدارية من خلال عقد خروج Tor ضد البنية التحتية السحابية لـ AWS.',
    tactic: 'Initial Access',
    tacticAr: 'الوصول الأولي',
    targetHost: 'aws:iam::882910394012',
    attackerIp: '198.51.100.44',
    targetUser: 'devops-automation-role',
    mitreId: 'T1078.004',
    expectedPlaybookId: 'pb-iam-revocation'
  },
  {
    id: 'sc-activemq-rce',
    name: 'ActiveMQ RCE (CVE-2023-46604) Exploitation',
    nameAr: 'استغلال ثغرة التنفيذ عن بُعد لـ ActiveMQ (CVE-2023-46604)',
    description: 'Simulates malicious OpenWire serialized XML payloads triggering Suricata critical alarm and automatic containment.',
    descriptionAr: 'يحاكي حمولات برمجية خبيثة تستهدف منفذ ActiveMQ لتوليد إنذار Suricata الحرج والاحتواء التلقائي.',
    tactic: 'Execution',
    tacticAr: 'التنفيذ البرمجي',
    targetHost: 'msg-broker-02.prod.aws',
    attackerIp: '193.142.146.88',
    targetUser: 'activemq',
    mitreId: 'T1203',
    expectedPlaybookId: 'pb-host-containment'
  }
];
