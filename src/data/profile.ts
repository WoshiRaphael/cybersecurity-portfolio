// Your portfolio's single source of truth. Empty links stay visibly unconfigured.
export const profile = {
  name: "[YOUR NAME]",
  alias: "NULL",
  role: "Red Team Operator",
  specialization: "Offensive security. Defensive impact.",
  location: "[YOUR LOCATION]",
  email: "", // e.g. hello@yourdomain.com
  github: "", // full https://github.com/... URL
  linkedin: "", // full https://www.linkedin.com/in/... URL
  available: true,
  bio: "I explore how systems break to help build a world where they don’t. My focus is adversary simulation, web application security, and turning complex attack paths into practical defenses.",
  journey:
    "[YOUR BIO] Replace this paragraph with your cybersecurity journey, the environments you work in, and the problems you enjoy solving. Every assessment begins with explicit authorization and ends with actionable improvement.",
  resumePath: "/resume.txt", // Replace with /resume.pdf after adding your actual resume.
  resumeLabel: "Download resume template", // Use "Download resume" for your own file.
  resumeFormat: "TXT", // Update to "PDF" if you replace the template with a PDF.
};

export const navigation = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "operations", label: "Operations" },
  { id: "arsenal", label: "Arsenal" },
  { id: "certifications", label: "Certifications" },
  { id: "writeups", label: "Writeups" },
  { id: "contact", label: "Contact" },
];

export const operations = [
  {
    id: "ghost-protocol",
    code: "OP—001",
    title: "Ghost Protocol",
    category: "Active Directory",
    label: "AD SECURITY",
    color: "green",
    objective: "Tracing the paths a hidden adversary could take.",
    description:
      "An isolated Active Directory lab exploring identity relationships, privilege boundaries, and opportunities to improve detection.",
    tools: ["BloodHound", "Impacket", "PowerShell"],
    diagram: "network",
    findings:
      "Illustrative finding: an over-permissioned service account creates an indirect path to a privileged group. This is a lab scenario, not a reported client vulnerability.",
    methodology:
      "Define scope → enumerate relationships → validate in the isolated lab → document the attack path → recommend and retest controls.",
    outcome:
      "Deliverable: a reproducible attack-path diagram, least-privilege recommendations, and a detection checklist. Add verified metrics from your own lab here.",
  },
  {
    id: "broken-trust",
    code: "OP—002",
    title: "Broken Trust",
    category: "Web Security",
    label: "WEB APPLICATION",
    color: "cyan",
    objective: "Examining the boundary between access and trust.",
    description:
      "A deliberately vulnerable local application used to study authorization controls and strengthen application trust boundaries.",
    tools: ["Burp Suite", "Python", "OWASP WSTG"],
    diagram: "web",
    findings:
      "Illustrative finding: object-level authorization is inconsistent between two sample API routes. Only synthetic accounts and local lab data are used.",
    methodology:
      "Map application roles → build an authorization test matrix → test permitted lab accounts → document reproduction → validate server-side controls.",
    outcome:
      "Deliverable: a sanitized test matrix, a sample remediation plan, and regression checks. No real production vulnerability is claimed.",
  },
  {
    id: "cloudfall",
    code: "OP—003",
    title: "Cloudfall",
    category: "Cloud Security",
    label: "CLOUD SECURITY",
    color: "violet",
    objective: "Mapping exposure across the cloud attack surface.",
    description:
      "A sandbox cloud configuration review focused on identity policies, resource exposure, and useful security telemetry.",
    tools: ["Prowler", "AWS CLI", "Python"],
    diagram: "cloud",
    findings:
      "Illustrative finding: a sandbox IAM policy grants permissions beyond the test workload’s needs. No external infrastructure is scanned.",
    methodology:
      "Inventory owned sandbox resources → review policy relationships → evaluate exposure → propose least-privilege changes → verify logging.",
    outcome:
      "Deliverable: a prioritized configuration review and a hardened example policy. Replace this sample with your own authorized work.",
  },
];

export const skillCategories = [
  "All tools",
  "Recon & OSINT",
  "Web Security",
  "Network",
  "Active Directory",
  "Cloud",
  "Methodology",
  "Automation",
  "Reporting",
];
export const skills = [
  {
    name: "Nmap",
    glyph: "Nm",
    category: "Recon & OSINT",
    description:
      "Discover hosts and map exposed services within an authorized scope.",
  },
  {
    name: "Burp Suite",
    glyph: "B>",
    category: "Web Security",
    description:
      "Intercept, inspect, and assess web application requests and trust boundaries.",
  },
  {
    name: "BloodHound",
    glyph: "Bh",
    category: "Active Directory",
    description:
      "Visualize identity relationships and investigate potential attack paths.",
  },
  {
    name: "Wireshark",
    glyph: "Ws",
    category: "Network",
    description:
      "Analyze packet captures to understand network behavior and investigate anomalies.",
  },
  {
    name: "Metasploit",
    glyph: "Ms",
    category: "Network",
    description:
      "Validate security controls in explicitly authorized testing environments.",
  },
  {
    name: "Python",
    glyph: "Py",
    category: "Automation",
    description:
      "Build reproducible utilities, parse evidence, and automate repetitive tasks.",
  },
  {
    name: "Linux / Bash",
    glyph: ">_",
    category: "Automation",
    description:
      "Work efficiently with Linux environments and transparent shell automation.",
  },
  {
    name: "AWS / Prowler",
    glyph: "Aw",
    category: "Cloud",
    description:
      "Review sandbox cloud configuration, identity policy, and security posture.",
  },
  {
    name: "MITRE ATT&CK",
    glyph: "M!",
    category: "Methodology",
    description:
      "Map adversary behaviors to assessment objectives and detection opportunities.",
  },
  {
    name: "OWASP WSTG",
    glyph: "Ow",
    category: "Web Security",
    description:
      "Structure repeatable web security assessments with clear coverage.",
  },
  {
    name: "Maltego",
    glyph: "Mg",
    category: "Recon & OSINT",
    description:
      "Organize public-source relationships and document the context of findings.",
  },
  {
    name: "Threat Modeling",
    glyph: "Tm",
    category: "Reporting",
    description:
      "Translate system assumptions and attack paths into prioritized improvements.",
  },
];

// All qualifications are examples. Change status only for qualifications you hold.
export const certifications = [
  {
    name: "OSCP",
    issuer: "OffSec",
    area: "Penetration testing",
    status: "Not configured",
    mark: "OS",
  },
  {
    name: "CRTO",
    issuer: "Zero-Point Security",
    area: "Red team operations",
    status: "Not configured",
    mark: "CR",
  },
  {
    name: "PNPT",
    issuer: "TCM Security",
    area: "Practical network testing",
    status: "Not configured",
    mark: "PN",
  },
  {
    name: "eJPT",
    issuer: "INE Security",
    area: "Junior penetration testing",
    status: "Not configured",
    mark: "eJ",
  },
  {
    name: "Hack The Box",
    issuer: "Practice labs",
    area: "Lab & CTF experience",
    status: "Not configured",
    mark: "HT",
  },
  {
    name: "TryHackMe",
    issuer: "Learning platform",
    area: "Guided learning paths",
    status: "Not configured",
    mark: "TH",
  },
];

export const articles = [
  {
    id: "attack-paths",
    category: "Lab walkthroughs",
    title: "An attack path is a story. Learn to read it.",
    shortTitle: "Reading an attack path",
    description:
      "A lab-first approach to understanding identity relationships, assumptions, and the controls that break the chain.",
    minutes: "6 min",
    tag: "ACTIVE DIRECTORY",
    code: [
      "const attackPath = {",
      '  scope: "isolated_lab",',
      '  objective: "validate_trust",',
      '  outcome: "better_defenses"',
      "};",
    ],
    body: [
      "Start with the scope, not the tool. In a deliberately isolated directory lab, record the accounts, machines, and relationships you are permitted to assess.",
      "Model the relationships as a graph. Separate what an account can directly access from the privileges it can reach indirectly. A useful diagram explains each assumption in the chain.",
      "Test one relationship at a time using synthetic data, then capture the evidence needed to reproduce the result. Document uncertainty and avoid treating a graph edge as proof of exploitability.",
      "Close with the defensive view: reduce excessive permissions, separate sensitive identities, and verify whether the relevant activity appears in telemetry. This is an illustrative article placeholder; replace it with your own verified walkthrough.",
    ],
  },
  {
    id: "authorization",
    category: "Research",
    title: "Testing the trust between the endpoints.",
    shortTitle: "Testing endpoint trust",
    description:
      "Why an authorization matrix belongs in every application security assessment.",
    minutes: "4 min",
    tag: "WEB SECURITY",
    code: [
      "// Authorization test matrix",
      "roles.forEach(role => {",
      "  verifyAccess(role, resource);",
      "  documentExpectedBehavior();",
      "});",
    ],
    body: [
      "Authentication answers who is making a request. Authorization answers whether that identity should be allowed to perform the specific action on the specific resource.",
      "Build a matrix of roles, actions, and resource ownership for a local or explicitly authorized application. Record the expected outcome before running a test.",
      "Use separate test accounts and synthetic records. Compare the server response with expected access, and verify the result without accessing real third-party data.",
      "Recommend server-side checks for every resource access and regression tests for the documented boundary. This sample article does not disclose or claim a real vulnerability.",
    ],
  },
  {
    id: "ctf-notes",
    category: "CTF notes",
    title: "From a solved challenge to a useful lesson.",
    shortTitle: "From CTF to field notes",
    description:
      "Turning a local CTF exercise into a clear, reproducible technical writeup.",
    minutes: "3 min",
    tag: "CTF NOTES",
    code: [
      "# A useful lab notebook",
      "01  Record the assumptions",
      "02  Preserve the evidence",
      "03  Explain the root cause",
      "04  Connect the defense",
    ],
    body: [
      "A useful writeup makes the reasoning visible. State the challenge environment and permitted scope, then explain which observations guided the next step.",
      "Record commands and outputs only when they help another learner reproduce the reasoning in their own lab. Remove tokens, flags, and unnecessary identifying information.",
      "Describe the underlying weakness and the assumptions that made it possible. A solved challenge is more valuable when the lesson transfers to a defensive control.",
      "Finish with what you would test next and what remains uncertain. This is editable example content, not a claim of a competition result or rank.",
    ],
  },
];
