"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Command,
  Crosshair,
  Github,
  Linkedin,
  LockKeyhole,
  Mail,
  Menu,
  Radar,
  Search,
  ShieldCheck,
  Terminal,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import OperatorTerminal from "@/components/operator-terminal";
import ResumeAccessContent from "@/components/resume-access-content";
import TechIcon from "@/components/tech-icons";
import {
  articles,
  certifications,
  navigation,
  operations,
  profile,
  skillCategories,
  skills,
} from "@/data/profile";

const CyberGlobe = dynamic(() => import("@/components/cyber-globe"), {
  ssr: false,
});
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const asset = (path: string) => `${basePath}${path}`;
const roles = [
  "Red Team Operator",
  "Ethical Hacker",
  "Penetration Tester",
  "Security Researcher",
];
const bootLines = [
  "[+] Initializing system...",
  "[+] Loading modules...",
  "[+] Establishing secure connection...",
  "[+] Access granted.",
  "[+] Red Team Operator Online.",
];
const toolLabels: Record<string, string> = {
  "All tools": "ALL",
  "Recon & OSINT": "RECON",
  "Web Security": "WEB",
  Network: "NETWORK",
  "Active Directory": "ACTIVE DIRECTORY",
  Cloud: "CLOUD",
  Methodology: "RED TEAM",
  Automation: "SCRIPTING",
  Reporting: "REPORTING",
};
const thumbnails = [
  "/images/identity-network.svg",
  "/images/web-research.svg",
  "/images/red-team-map.svg",
];

function NetworkLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 44 44"
      fill="none"
      className="network-logo"
    >
      <path d="m22 3 17 10v19L22 42 5 32V13L22 3Z" />
      <path d="m5 13 34 19M39 13 5 32M22 3v39M5 13l17 7 17-7M5 32l17-12 17 12" />
      <path d="m9 5 26 34M35 5 9 39" opacity=".5" />
      {[
        [22, 3],
        [39, 13],
        [39, 32],
        [22, 42],
        [5, 32],
        [5, 13],
        [22, 20],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.7" />
      ))}
    </svg>
  );
}
function Frame({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`hud-panel ${className}`}>
      <div className="frame-traces" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      {children}
    </section>
  );
}
function PanelTitle({
  number,
  label,
  first,
  second,
  description,
  children,
}: {
  number: string;
  label: string;
  first: string;
  second: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="panel-heading">
      <div className="section-index">
        {number}
        <span>\</span> {label} <span>]</span>
      </div>
      <div className="panel-title-row">
        <h2 aria-label={`${first} ${second}`}>
          <span>{first}</span> {second}
        </h2>
        {children}
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
function Modal({
  open,
  onClose,
  title,
  children,
  compact = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  compact?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLInputElement>("input")?.focus();
    } else if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`modal ${compact ? "compact" : ""}`}
      aria-label={title}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="modal-top">
        <span>
          <span className="status-dot" />
          {title}
        </span>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={19} />
        </button>
      </div>
      {open && children}
    </dialog>
  );
}

export default function Portfolio() {
  const reduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false),
    [boot, setBoot] = useState(false),
    [bootStep, setBootStep] = useState(0);
  const [active, setActive] = useState("home"),
    [menuOpen, setMenuOpen] = useState(false),
    [role, setRole] = useState(roles[0]);
  const [toolFilter, setToolFilter] = useState("All tools"),
    [selectedTool, setSelectedTool] = useState<(typeof skills)[number] | null>(
      null,
    );
  const [certFilter, setCertFilter] = useState("All"),
    [articleFilter, setArticleFilter] = useState("All notes");
  const [selectedOp, setSelectedOp] = useState<
      (typeof operations)[number] | null
    >(null),
    [selectedArticle, setSelectedArticle] = useState<
      (typeof articles)[number] | null
    >(null);
  const [dossierOpen, setDossierOpen] = useState(false),
    [resumeOpen, setResumeOpen] = useState(false),
    [commandOpen, setCommandOpen] = useState(false),
    [commandQuery, setCommandQuery] = useState("");
  const [notice, setNotice] = useState(""),
    [contactState, setContactState] = useState<
      "idle" | "preparing" | "ready" | "unconfigured"
    >("idle"),
    [draftUrl, setDraftUrl] = useState("");
  const heroRef = useRef<HTMLElement>(null);
  const preferredSection = useRef("home");

  useEffect(() => {
    setHydrated(true);
    let visited = false;
    try {
      visited = !!sessionStorage.getItem("null-console-boot-v2");
      sessionStorage.setItem("null-console-boot-v2", "1");
    } catch {}
    if (
      !visited &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      setBoot(true);
  }, []);
  useEffect(() => {
    if (!boot) return;
    const interval = setInterval(() => setBootStep((n) => n + 1), 250),
      end = setTimeout(() => setBoot(false), 1700);
    return () => {
      clearInterval(interval);
      clearTimeout(end);
    };
  }, [boot]);
  useEffect(() => {
    if (reduced) return;
    let index = 0,
      position = roles[0].length,
      deleting = true,
      timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (deleting) {
        position--;
        setRole(roles[index].slice(0, Math.max(0, position)));
        if (position <= 0) {
          deleting = false;
          index = (index + 1) % roles.length;
        }
      } else {
        position++;
        setRole(roles[index].slice(0, position));
        if (position >= roles[index].length) {
          deleting = true;
          timer = setTimeout(tick, 2600);
          return;
        }
      }
      timer = setTimeout(tick, deleting ? 32 : 65);
    };
    timer = setTimeout(tick, 3000);
    return () => clearTimeout(timer);
  }, [reduced]);
  useEffect(() => {
    const update = () => {
      if (window.scrollY < 4) { setActive("home"); return; }
      const point = window.innerHeight * 0.28;
      const visible = navigation
        .map((item) => ({
          id: item.id,
          rect: document.getElementById(item.id)?.getBoundingClientRect(),
        }))
        .filter(
          (item) =>
            item.rect && item.rect.top <= point && item.rect.bottom > 105,
        );
      if (visible.length) {
        visible.sort(
          (a, b) =>
            Math.abs(a.rect!.top - point) - Math.abs(b.rect!.top - point),
        );
        const tied = visible.filter(item => Math.abs(item.rect!.top - visible[0].rect!.top) < 3);
        setActive((previous) =>
          tied.some(item => item.id === preferredSection.current)
            ? preferredSection.current
            : tied.some(
            (item) =>
              item.id === previous &&
              Math.abs(item.rect!.top - visible[0].rect!.top) < 3,
          )
            ? previous
            : visible[0].id,
        );
      }
    };
    const keyboard = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSelectedOp(null);
        setSelectedArticle(null);
        setDossierOpen(false);
        setResumeOpen(false);
        setCommandOpen((v) => !v);
        setCommandQuery("");
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("keydown", keyboard);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("keydown", keyboard);
    };
  }, []);
  useEffect(() => {
    document.body.style.overflow =
      boot || selectedOp || selectedArticle || dossierOpen || resumeOpen || commandOpen
        ? "hidden"
        : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [boot, selectedOp, selectedArticle, dossierOpen, resumeOpen, commandOpen]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);
  const navigate = (id: string) => {
    setCommandOpen(false);
    setMenuOpen(false);
    chooseSection(id);
    requestAnimationFrame(() =>
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "start",
        }),
    );
  };
  const chooseSection = (id: string) => { preferredSection.current = id; setActive(id); };
  const openResumeAccess = () => {
    setDossierOpen(false);
    setCommandOpen(false);
    setMenuOpen(false);
    setResumeOpen(true);
  };
  const openSocial = (url: string, label: string) =>
    url
      ? window.open(url, "_blank", "noopener,noreferrer")
      : setNotice(
          `Add [YOUR ${label.toUpperCase()}] in src/data/profile.ts to enable this link.`,
        );
  const handleContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile.email) {
      setContactState("unconfigured");
      return;
    }
    const form = new FormData(event.currentTarget);
    setContactState("preparing");
    const url = `mailto:${profile.email}?subject=${encodeURIComponent(`[Portfolio] ${form.get("subject")}`)}&body=${encodeURIComponent(`Name: ${form.get("name")}\nReply to: ${form.get("email")}\n\n${form.get("message")}`)}`;
    setDraftUrl(url);
    await new Promise((resolve) => setTimeout(resolve, reduced ? 0 : 600));
    window.location.href = url;
    setContactState("ready");
  };
  const downloadReport = (operation: (typeof operations)[number]) => {
    const text = `# ${operation.title}\n\nEDITABLE SAMPLE — isolated lab only. No client engagement claimed.\n\n## Mission\n${operation.description}\n\n## Methodology\n${operation.methodology}\n\n## Illustrative finding\n${operation.findings}\n\n## Defensive outcome\n${operation.outcome}\n\nTools: ${operation.tools.join(", ")}`;
    const url = URL.createObjectURL(
        new Blob([text], { type: "text/markdown" }),
      ),
      link = document.createElement("a");
    link.href = url;
    link.download = `${operation.id}-sample-report.md`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const filteredSkills = skills.filter(
      (skill) => toolFilter === "All tools" || skill.category === toolFilter,
    ),
    filteredCerts = certifications.filter(
      (cert) => certFilter === "All" || cert.status === certFilter,
    ),
    filteredArticles = articles.filter(
      (article) =>
        articleFilter === "All notes" || article.category === articleFilter,
    );
  const paletteItems = [
    ...navigation,
    { id: "terminal", label: "Interactive terminal" },
  ].filter((item) =>
    item.label.toLowerCase().includes(commandQuery.toLowerCase()),
  );

  return (
    <MotionConfig reducedMotion="user">
      <a inert={boot} href="#main" className="skip-link">
        Skip to content
      </a>
      <AnimatePresence>
        {boot && (
          <motion.div
            className="boot-screen"
            role="dialog"
            aria-modal="true"
            aria-label="Initializing the operator environment"
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.35 }}
          >
            <div className="boot-console">
              <NetworkLogo />
              <p className="boot-id">ROOT@PORTFOLIO:~$ / INITIALIZING</p>
              <div className="boot-output" role="status">
                {bootLines.slice(0, bootStep + 1).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="boot-progress">
                <span
                  style={{ width: `${Math.min(100, (bootStep + 1) * 20)}%` }}
                />
              </div>
              <button
                autoFocus
                onClick={() => setBoot(false)}
                className="outline-action"
              >
                SKIP INITIALIZATION <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="site-shell"
        style={
          {
            "--circuit-image": `url('${asset("/images/circuit-frame.svg")}')`,
          } as CSSProperties
        }
      >
        <header inert={boot} className="top-bar">
          <a
            href="#home"
            className="brand"
            onClick={() => chooseSection("home")}
            aria-label="Portfolio home"
          >
            <NetworkLogo />
            <span>
              <b>root</b>@portfolio:<em>~</em>$
            </span>
          </a>
          <nav aria-label="Main navigation" className="desktop-nav">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => chooseSection(item.id)}
                className={active === item.id ? "active" : ""}
                aria-current={active === item.id ? "location" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="top-actions">
            <button
              onClick={() => {
                setCommandQuery("");
                setCommandOpen(true);
              }}
              className="command-key"
              aria-label="Open command palette"
            >
              <Command size={12} />
              <span>K</span>
            </button>
            <a href="#contact" className="outline-action nav-connect">
              <Terminal size={12} /> CONNECT
            </a>
            <button
              className="icon-button menu-toggle"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
          {menuOpen && (
            <nav className="mobile-menu" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => {
                    setMenuOpen(false);
                    chooseSection(item.id);
                  }}
                >
                  {item.label}
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </nav>
          )}
        </header>
        <main id="main" inert={boot} className="dashboard">
          <section
            id="home"
            className="hero hud-panel"
            ref={heroRef}
            onPointerMove={(event) => {
              if (reduced || event.pointerType === "touch") return;
              const rect = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty(
                "--mx",
                `${event.clientX - rect.left}px`,
              );
              event.currentTarget.style.setProperty(
                "--my",
                `${event.clientY - rect.top}px`,
              );
            }}
          >
            <img
              className="hero-art"
              src={asset("/images/operations-room.webp")}
              alt="Illustrated hooded security operator working in a neon-lit cyber operations room"
              fetchPriority="high"
            />
            <div className="hero-shade" />
            <div className="hero-spotlight" />
            <div className="frame-traces" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="hero-content">
              <div className="inline-boot" aria-label="Environment initialized">
                {bootLines.map((line, i) => (
                  <p key={line} className={i === 4 ? "online-line" : ""}>
                    {line}
                  </p>
                ))}
              </div>
              <h1 className="glitch-heading">
                Think Like an Attacker.
                <br />
                <span>Secure Like a Defender.</span>
              </h1>
              <p className="hero-description">
                Offensive security focused on finding weaknesses
                <br className="desktop-break" /> before real attackers do.
              </p>
              <div className="role-badges">
                {roles.map((name, i) => (
                  <span
                    key={name}
                    className={
                      role === name || (!role && i === 0) ? "current" : ""
                    }
                  >
                    {name}
                  </span>
                ))}
              </div>
              <div className="live-role">
                <span aria-hidden="true">
                  ~/ {role}
                  <i />
                </span>
                <span className="sr-only">{roles.join(", ")}</span>
              </div>
              <div className="hero-actions">
                <a className="primary-action magnetic" href="#operations">
                  <Terminal size={15} /> EXPLORE OPERATIONS{" "}
                  <ArrowUpRight size={14} />
                </a>
                <a className="outline-action magnetic" href="#contact">
                  <Terminal size={14} /> CONTACT ME
                </a>
              </div>
            </div>
            <div className="active-ops" aria-hidden="true">
              <div>
                <Radar size={11} /> ACTIVE OPERATIONS <span>LAB</span>
              </div>
              <p>
                01 Reconnaissance <b>[SCOPED]</b>
              </p>
              <p>
                02 Control validation <b>[LAB]</b>
              </p>
              <p>
                03 Attack-path review <b className="red">[SIMULATED]</b>
              </p>
              <p>
                04 Defensive reporting <b>[READY]</b>
              </p>
              <div className="signal-bars">
                {Array.from({ length: 21 }, (_, i) => (
                  <i key={i} style={{ height: `${8 + ((i * 17) % 19)}px` }} />
                ))}
              </div>
            </div>
            <div className="hero-map" aria-hidden="true">
              <span>GLOBAL THREAT MAP / SIMULATION</span>
              <CyberGlobe />
              <b>ACCESS GRANTED</b>
            </div>
            <div className="hero-bottom">
              <div className="mission-stats">
                <div>
                  <b>{operations.length.toString().padStart(2, "0")}</b>
                  <span>SAMPLE LABS</span>
                </div>
                <div>
                  <b>{skills.length.toString().padStart(2, "0")}</b>
                  <span>TOOLS MAPPED</span>
                </div>
                <div>
                  <b>∞</b>
                  <span>LEARNING</span>
                </div>
                <div>
                  <b>01</b>
                  <span>ETHICAL MISSION</span>
                </div>
              </div>
              <blockquote>
                “The best defense
                <br />
                is a well-informed offense.”
              </blockquote>
            </div>
          </section>
          <Frame id="about" className="about-panel">
            <PanelTitle
              number="01"
              label="ABOUT ME"
              first="OPERATOR"
              second="PROFILE"
              description="A passion for breaking. A purpose for securing."
            />
            <div className="about-layout">
              <div className="operator-copy">
                <p>{profile.bio.split(". ")[0].replace(/\.$/, "")}.</p>
                <p className="operator-principle">
                  Authorized scope. Clear evidence.
                  <br />
                  Stronger defenses.
                </p>
                <button
                  className="small-text-action"
                  onClick={() => setDossierOpen(true)}
                >
                  ACCESS FULL DOSSIER <ChevronRight size={12} />
                </button>
              </div>
              <div className="operator-id">
                <div className="portrait-frame">
                  <img
                    src={asset("/images/operator-avatar.webp")}
                    alt="Illustrated anonymous operator avatar in a black hood with red neon detailing"
                    width={130}
                    height={150}
                  />
                  <span>OP / {profile.alias}</span>
                </div>
                <dl>
                  <div>
                    <dt>ALIAS</dt>
                    <dd>{profile.alias}</dd>
                  </div>
                  <div>
                    <dt>ROLE</dt>
                    <dd>Offensive Security</dd>
                  </div>
                  <div>
                    <dt>NAME</dt>
                    <dd>{profile.name}</dd>
                  </div>
                  <div>
                    <dt>STATUS</dt>
                    <dd className="green">
                      {profile.available
                        ? "Open to Opportunities"
                        : "Profile Online"}
                    </dd>
                  </div>
                  <div>
                    <dt>FOCUS</dt>
                    <dd>Red Teaming / Research</dd>
                  </div>
                </dl>
                <div className="clearance">
                  <span>AUTHORIZATION</span>
                  <div>
                    {Array.from({ length: 11 }, (_, i) => (
                      <i key={i} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="about-actions">
              <button
                className="primary-action"
                onClick={openResumeAccess}
              >
                <LockKeyhole size={15} /> {profile.resumeAccessLabel.toUpperCase()}
              </button>
              <button
                className="outline-action"
                onClick={() => openSocial(profile.github, "GitHub")}
              >
                <Terminal size={12} /> VIEW GITHUB
              </button>
            </div>
          </Frame>
          <Frame id="operations" className="operations-panel">
            <PanelTitle
              number="02"
              label="OPERATIONS"
              first="FEATURED"
              second="PROJECTS"
              description="Lab scenarios. Clear methodology. Practical defenses."
            >
              <button
                className="tiny-action"
                onClick={() => {
                  setCommandQuery("Operations");
                  setCommandOpen(true);
                }}
              >
                OPERATIONS INDEX <ArrowRight size={12} />
              </button>
            </PanelTitle>
            <div className="project-grid">
              {operations.map((op, i) => (
                <button
                  className={`project-card project-${i}`}
                  key={op.id}
                  onClick={() => setSelectedOp(op)}
                  aria-label={`Read ${op.title} sample case study`}
                >
                  <div className="project-thumb">
                    <img src={asset(thumbnails[i % thumbnails.length])} alt="" loading="lazy" />
                    <span>{op.label}</span>
                  </div>
                  <div className="project-content">
                    <span className="sample-pill">LAB / SAMPLE</span>
                    <h3>{op.title}</h3>
                    <p>{op.objective}</p>
                    <span className="project-tools">
                      {op.tools.join(" · ")}
                    </span>
                    <span className="card-action">
                      <ChevronRight size={12} /> VIEW OPERATION
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="truth-label">
              <LockKeyhole size={10} /> ISOLATED LAB EXAMPLES · NO CLIENT CLAIMS
            </p>
          </Frame>
          <div className="dual-panels">
            <Frame id="arsenal" className="arsenal-panel">
              <PanelTitle
                number="03"
                label="ARSENAL"
                first="TOOLS &"
                second="TECHNOLOGIES"
                description="The weapons in my toolkit."
              />
              <div
                className="filters tool-filters"
                aria-label="Filter tools by category"
              >
                {skillCategories.map((category) => (
                  <button
                    key={category}
                    aria-label={category}
                    aria-pressed={toolFilter === category}
                    onClick={() => {
                      setToolFilter(category);
                      setSelectedTool(null);
                    }}
                    className={toolFilter === category ? "selected" : ""}
                  >
                    {toolLabels[category]}
                  </button>
                ))}
              </div>
              <motion.div layout className="tool-grid">
                <AnimatePresence mode="popLayout">
                  {filteredSkills.map((skill) => (
                    <motion.button
                      layout
                      initial={false}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      key={skill.name}
                      className={`tool-card ${selectedTool?.name === skill.name ? "inspected" : ""}`}
                      onClick={() => setSelectedTool(skill)}
                      onFocus={() => setSelectedTool(skill)}
                      onMouseEnter={() => setSelectedTool(skill)}
                      aria-label={`${skill.name}: ${skill.description}`}
                    >
                      <TechIcon name={skill.name} size={31} />
                      <strong>{skill.name}</strong>
                      <span>{skill.category}</span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
              <div className="tool-inspector" role="status">
                <Crosshair size={12} />
                <p>
                  {selectedTool ? (
                    <>
                      <b>{selectedTool.name}</b> / {selectedTool.description}
                    </>
                  ) : (
                    "Select a tool to inspect its role in an authorized assessment."
                  )}
                </p>
              </div>
            </Frame>
            <Frame id="certifications" className="cert-panel">
              <PanelTitle
                number="04"
                label="CERTIFICATIONS"
                first="CERTIFICATIONS &"
                second="ACHIEVEMENTS"
                description="Continuous learning. Always improving."
              />
              <div
                className="filters cert-filters"
                aria-label="Filter certifications"
              >
                {["All", "Completed", "In progress", "Planned"].map(
                  (status) => (
                    <button
                      key={status}
                      aria-pressed={certFilter === status}
                      onClick={() => setCertFilter(status)}
                      className={certFilter === status ? "selected" : ""}
                    >
                      {status}
                    </button>
                  ),
                )}
              </div>
              <div className="cert-grid">
                {filteredCerts.map((cert, i) => (
                  <div className={`cert-card cert-${i}`} key={cert.name}>
                    <div className="cert-top">
                      <span className="cert-insignia">
                        {i > 3 ? <NetworkLogo /> : <ShieldCheck size={26} />}
                      </span>
                      <div>
                        <h3>{cert.name}</h3>
                        <p>{cert.issuer}</p>
                      </div>
                    </div>
                    <span
                      className={`cert-status ${cert.status.toLowerCase().replaceAll(" ", "-")}`}
                    >
                      {cert.status === "Not configured"
                        ? "PLACEHOLDER"
                        : cert.status.toUpperCase()}
                    </span>
                  </div>
                ))}
                {!filteredCerts.length && (
                  <div className="empty-state">
                    <ShieldCheck size={24} />
                    <p>No qualifications marked {certFilter.toLowerCase()}.</p>
                    <span>Add your verified status in the profile file.</span>
                  </div>
                )}
              </div>
              <p className="truth-label">
                <ShieldCheck size={11} /> EDITABLE EXAMPLES · NO QUALIFICATIONS
                CLAIMED
              </p>
            </Frame>
          </div>
          <Frame id="writeups" className="writeups-panel">
            <PanelTitle
              number="05"
              label="WRITEUPS"
              first="TECHNICAL"
              second="WRITEUPS"
              description="Sharing knowledge. Documenting the journey."
            />
            <div
              className="filters article-filters"
              aria-label="Filter articles"
            >
              {["All notes", "Lab walkthroughs", "Research", "CTF notes"].map(
                (category) => (
                  <button
                    key={category}
                    aria-pressed={articleFilter === category}
                    onClick={() => setArticleFilter(category)}
                    className={articleFilter === category ? "selected" : ""}
                  >
                    {category}
                  </button>
                ),
              )}
            </div>
            <div className="article-grid">
              {filteredArticles.map((article) => (
                <button
                  className="article-card"
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  aria-label={`Read ${article.title}`}
                >
                  <div className={`article-thumb article-${article.id}`}>
                    {article.id === "attack-paths" ? (
                      <img
                        src={asset("/images/identity-network.svg")}
                        alt=""
                        loading="lazy"
                      />
                    ) : article.id === "ctf-notes" ? (
                      <img
                        src={asset("/images/red-team-map.svg")}
                        alt=""
                        loading="lazy"
                      />
                    ) : (
                      <pre aria-hidden="true">{article.code.join("\n")}</pre>
                    )}
                    <span>{article.tag}</span>
                  </div>
                  <div className="article-content">
                    <h3>{article.shortTitle || article.title}</h3>
                    <p>{article.description}</p>
                    <div>
                      <span>EXAMPLE NOTE</span>
                      <span>◷ {article.minutes} read</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Frame>
          <Frame id="terminal" className="terminal-panel">
            <div className="terminal-layout">
              <div className="terminal-intro">
                <PanelTitle
                  number="06"
                  label="INTERACTIVE TERMINAL"
                  first="TRY SOME"
                  second="COMMANDS"
                  description="A simulated terminal to explore my portfolio."
                />
                <div className="terminal-instructions">
                  <span>TYPE A COMMAND</span>
                  <code>help</code>
                  <code>whoami</code>
                  <code>skills</code>
                  <code>projects</code>
                  <code>certs</code>
                  <code>contact</code>
                </div>
                <p className="terminal-permission">
                  <LockKeyhole size={11} /> LOCAL SIMULATION
                  <br />
                  NO SYSTEM ACCESS
                </p>
              </div>
              <OperatorTerminal
                name={profile.name}
                specialization={profile.specialization}
                email={profile.email || "[YOUR EMAIL — not configured]"}
              />
            </div>
          </Frame>
          <Frame id="contact" className="contact-panel">
            <div className="contact-layout">
              <div className="contact-copy">
                <PanelTitle
                  number="07"
                  label="CONTACT"
                  first="READY TO"
                  second="COLLABORATE?"
                  description="Establish a secure connection."
                />
                <div className="social-links">
                  <button
                    onClick={() =>
                      profile.email
                        ? (window.location.href = `mailto:${profile.email}`)
                        : setNotice(
                            "Add [YOUR EMAIL] in src/data/profile.ts to enable email.",
                          )
                    }
                  >
                    <Mail size={23} />
                    <span>
                      Email
                      <small>
                        {profile.email || "Let's talk about security."}
                      </small>
                    </span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    onClick={() => openSocial(profile.linkedin, "LinkedIn")}
                  >
                    <Linkedin size={23} />
                    <span>
                      LinkedIn<small>Connect professionally.</small>
                    </span>
                    <ArrowRight size={13} />
                  </button>
                  <button onClick={() => openSocial(profile.github, "GitHub")}>
                    <Github size={23} />
                    <span>
                      GitHub<small>Explore the code.</small>
                    </span>
                    <ArrowRight size={13} />
                  </button>
                </div>
                <span className="connection-status">
                  <span className="status-dot" /> CHANNEL STANDING BY
                </span>
              </div>
              <form className="contact-form" onSubmit={handleContact}>
                <div className="form-header">
                  <h3>SEND A MESSAGE</h3>
                  <p>Start a conversation. Share your mission.</p>
                </div>
                <div className="form-row">
                  <label>
                    <span className="sr-only">Your name</span>
                    <input
                      name="name"
                      autoComplete="name"
                      required
                      maxLength={120}
                      placeholder="Your Name"
                    />
                  </label>
                  <label>
                    <span className="sr-only">Email address</span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={200}
                      placeholder="Your Email"
                    />
                  </label>
                </div>
                <label className="subject-label">
                  <span className="sr-only">Subject</span>
                  <select name="subject" defaultValue="Security collaboration">
                    <option>Security collaboration</option>
                    <option>Career opportunity</option>
                    <option>Authorized assessment</option>
                    <option>Research & community</option>
                  </select>
                </label>
                <label>
                  <span className="sr-only">Your message</span>
                  <textarea
                    required
                    minLength={10}
                    maxLength={4000}
                    name="message"
                    rows={4}
                    placeholder="Your Message"
                  />
                </label>
                <button
                  type="submit"
                  className={`primary-action transmit ${contactState === "preparing" ? "transmitting" : ""}`}
                  disabled={!hydrated || contactState === "preparing"}
                >
                  <Terminal size={14} />
                  {contactState === "preparing"
                    ? "PREPARING DRAFT..."
                    : "COMPOSE TRANSMISSION"}
                  <LockKeyhole size={12} />
                </button>
                <div className="form-status" role="status">
                  {contactState === "unconfigured" ? (
                    <p className="configuration-message">
                      Add your email in <code>src/data/profile.ts</code> to
                      enable drafts. No message was sent.
                    </p>
                  ) : contactState === "ready" ? (
                    <p className="green">
                      <Check size={12} /> Draft ready. Send it from your mail
                      app. <a href={draftUrl}>Open again ↗</a>
                    </p>
                  ) : (
                    <p>Opens your email app. You review and send.</p>
                  )}
                </div>
                <noscript>
                  <p className="form-status">
                    Enable JavaScript to compose an email draft.
                  </p>
                </noscript>
              </form>
            </div>
          </Frame>
        </main>
        <footer inert={boot} className="site-footer">
          <span>
            © {new Date().getFullYear()} {profile.name} <i>/</i> PERMISSION
            FIRST. PRECISION ALWAYS.
          </span>
          <span>
            <span className="status-dot" /> PORTFOLIO ENVIRONMENT ONLINE
          </span>
          <button
            onClick={() => {
              setCommandQuery("");
              setCommandOpen(true);
            }}
          >
            <Command size={11} /> K <i>/</i> COMMAND PALETTE
          </button>
          <a href="#home">RETURN TO SURFACE ↑</a>
        </footer>
      </div>
      <Modal
        open={!!selectedOp}
        onClose={() => setSelectedOp(null)}
        title={selectedOp ? `${selectedOp.code} / OPERATION DOSSIER` : ""}
      >
        {selectedOp && (
          <div className="detail-content">
            <span className="sample-pill">
              ILLUSTRATIVE LAB PROJECT / PLACEHOLDER
            </span>
            <h2>{selectedOp.title}</h2>
            <p className="detail-lead">{selectedOp.description}</p>
            <img
              className="detail-image"
              src={asset(thumbnails[operations.indexOf(selectedOp) % thumbnails.length])}
              alt="Abstract lab attack-path visualization"
            />
            <h3>01 / MISSION & METHODOLOGY</h3>
            <p>{selectedOp.methodology}</p>
            <h3>02 / SANITIZED FINDING</h3>
            <p>{selectedOp.findings}</p>
            <h3>03 / DEFENSIVE OUTCOME</h3>
            <p>{selectedOp.outcome}</p>
            <div className="detail-tags">
              {selectedOp.tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
            <button
              className="primary-action"
              onClick={() => downloadReport(selectedOp)}
            >
              <ArrowDownToLine size={15} /> DOWNLOAD SAMPLE REPORT
            </button>
          </div>
        )}
      </Modal>
      <Modal
        open={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        title="TECHNICAL WRITEUP / READ MODE"
      >
        {selectedArticle && (
          <article className="detail-content">
            <span className="sample-pill">
              {selectedArticle.tag} / EDITABLE EXAMPLE
            </span>
            <h2>{selectedArticle.title}</h2>
            <p className="detail-lead">{selectedArticle.description}</p>
            <pre className="article-detail-code">
              <code>{selectedArticle.code.join("\n")}</code>
            </pre>
            {selectedArticle.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            <p className="truth-label">
              <ShieldCheck size={13} /> DEMONSTRATION CONTENT / REPLACE WITH
              YOUR RESEARCH
            </p>
          </article>
        )}
      </Modal>
      <Modal
        open={dossierOpen}
        onClose={() => setDossierOpen(false)}
        title="OPERATOR PROFILE / FULL DOSSIER"
      >
        <div className="detail-content">
          <span className="section-index">IDENTITY / {profile.alias}</span>
          <h2>{profile.name}</h2>
          <p className="detail-lead">{profile.specialization}</p>
          <p>{profile.bio}</p>
          <p>{profile.journey}</p>
          <h3>PROFESSIONAL PHILOSOPHY</h3>
          <p>
            Explicit permission before every assessment. Reproducible evidence
            for every finding. Clear defensive recommendations, practical
            retesting, and respect for the people behind the systems.
          </p>
          <button
            className="primary-action"
            onClick={openResumeAccess}
          >
            <LockKeyhole size={15} />
            {profile.resumeAccessLabel.toUpperCase()}
          </button>
        </div>
      </Modal>
      <Modal
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        title="RESUME / REQUEST ACCESS"
      >
        <ResumeAccessContent name={profile.name} requestUrl={profile.resumeAccessUrl} />
      </Modal>
      <Modal
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        title="ROOT@PORTFOLIO / QUICK ACCESS"
        compact
      >
        <div className="palette-search">
          <Search size={18} />
          <input
            aria-label="Search sections"
            value={commandQuery}
            onChange={(e) => setCommandQuery(e.target.value)}
            placeholder="Enter a destination..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && paletteItems[0]) {
                e.preventDefault();
                navigate(paletteItems[0].id);
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                e.currentTarget
                  .closest("dialog")
                  ?.querySelector<HTMLButtonElement>(".palette-list button")
                  ?.focus();
              }
            }}
          />
          <kbd>ESC</kbd>
        </div>
        <div className="palette-list">
          {paletteItems.map((item, i) => (
            <button onClick={() => navigate(item.id)} key={item.id}>
              <span>
                <i>{(i + 1).toString().padStart(2, "0")}</i>
                {item.label}
              </span>
              <ChevronRight size={15} />
            </button>
          ))}
          {!paletteItems.length && (
            <p className="empty-state">
              No matching destination. Try “terminal” or “operations”.
            </p>
          )}
        </div>
        <div className="palette-footer">
          CTRL / CMD + K <span>LOCAL PORTFOLIO NAVIGATION</span>
        </div>
      </Modal>
      <AnimatePresence>
        {notice && (
          <motion.div
            role="status"
            className="toast"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
          >
            <Terminal size={17} />
            <span>{notice}</span>
            <button
              className="icon-button"
              aria-label="Dismiss notification"
              onClick={() => setNotice("")}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
