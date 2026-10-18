"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { ArrowUpRight, CornerDownLeft, Minus, X } from "lucide-react";
import { certifications, operations, skills } from "@/data/profile";

type OperatorTerminalProps = {
  name: string;
  specialization: string;
  email: string;
};

type TerminalEntry = {
  id: number;
  kind: "command" | "response" | "intro";
  text: string;
  href?: string;
  linkLabel?: string;
};

type TerminalResponse = Omit<TerminalEntry, "id" | "kind">;

const commandList = [
  "help",
  "whoami",
  "skills",
  "projects",
  "certs",
  "contact",
  "clear",
];

export default function OperatorTerminal({
  name,
  specialization,
  email,
}: OperatorTerminalProps) {
  const inputId = useId();
  const outputId = useId();
  const [entries, setEntries] = useState<TerminalEntry[]>([
    {
      id: 0,
      kind: "intro",
      text: "Welcome to my interactive portfolio terminal.\nType a command to explore:\n\nhelp      Show available commands\nwhoami    Read the operator profile\nskills    View the technical arsenal\nprojects  Explore sample operations\ncerts     Check qualification status\ncontact   Establish a connection\nclear     Clear the terminal",
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [response, setResponse] = useState<TerminalResponse | null>(null);
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const [ready, setReady] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setReady(true);
    return () => {
      if (delayRef.current) clearTimeout(delayRef.current);
    };
  }, []);

  useEffect(() => {
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [entries, visibleCharacters, busy]);

  useEffect(() => {
    if (!response) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let position = 0;
    const finish = () => {
      setEntries((previous) => [
        ...previous,
        { ...response, id: nextId.current++, kind: "response" },
      ]);
      setAnnouncement(response.text);
      setResponse(null);
      setVisibleCharacters(0);
      setBusy(false);
    };
    if (reducedMotion) {
      finish();
      return;
    }
    const timer = setInterval(() => {
      position = Math.min(position + 5, response.text.length);
      setVisibleCharacters(position);
      if (position >= response.text.length) {
        clearInterval(timer);
        finish();
      }
    }, 12);
    return () => clearInterval(timer);
  }, [response]);

  const getResponse = (command: string): TerminalResponse => {
    switch (command) {
      case "help":
        return {
          text: "AVAILABLE COMMANDS\n\nwhoami     Operator profile\nskills     Explore the technical arsenal\nprojects   View sample operations\ncerts      Qualification status\ncontact    Open a communication channel\nclear      Reset this terminal\n\n↑ / ↓  command history · Tab  autocomplete\nFrontend simulation. No commands execute on a system.",
        };
      case "whoami":
        return {
          text: `OPERATOR PROFILE\n\nName       ${name}\nFocus      ${specialization}\nPrinciple  Permission first. Evidence always.\n\nThis portfolio uses editable sample content.`,
          href: "#about",
          linkLabel: "Access operator dossier",
        };
      case "skills":
        return {
          text: `ARSENAL INDEX\n\n${skills.map((skill) => `${skill.name} / ${skill.category}\n  ${skill.description}`).join("\n\n")}\n\nEditable toolkit; proficiency is not independently verified.`,
          href: "#arsenal",
          linkLabel: "Explore the arsenal",
        };
      case "projects":
        return {
          text: `OPERATIONS INDEX\n\n${operations.map((operation) => `${operation.code} / ${operation.title}\n${operation.category}\n${operation.objective}`).join("\n\n")}\n\nThese are editable demonstration projects in isolated\nenvironments. No real client engagement or discovered\nvulnerability is claimed by this sample portfolio.`,
          href: "#operations",
          linkLabel: "Open operations dashboard",
        };
      case "certs": {
        const configured = certifications.some(
          (certification) => certification.status !== "Not configured",
        );
        return {
          text: `QUALIFICATIONS STATUS\n\n${configured ? "Status as configured in this operator profile." : "UNCONFIGURED — no certifications are claimed."}\n\n${certifications.map((certification) => `${certification.name} / ${certification.status}\n  ${certification.issuer} · ${certification.area}`).join("\n\n")}\n\nUnconfigured entries are editable examples. Lab platforms\nare listed separately from professional qualifications.`,
          href: "#certifications",
          linkLabel: "View qualifications",
        };
      }
      case "contact":
        return {
          text: `COMMUNICATION CHANNEL\n\nEmail      ${email}\nPurpose    Authorized assessments, research & collaboration\n\nUse the contact panel to compose a message.`,
          href: "#contact",
          linkLabel: "Establish a connection",
        };
      default:
        return {
          text: `Command not recognized: ${command}\n\nType help for the available portfolio commands.\nThis is a safe frontend simulation, not a system shell.`,
        };
    }
  };

  const runCommand = (rawCommand: string) => {
    if (busy || !rawCommand.trim()) return;
    const command = rawCommand.trim().toLowerCase();
    setHistory((previous) => [...previous, rawCommand.trim()]);
    setHistoryIndex(-1);
    setDraft("");
    setInput("");
    if (command === "clear") {
      setEntries([]);
      setAnnouncement("Terminal cleared.");
      return;
    }
    setEntries((previous) => [
      ...previous.slice(-35),
      { id: nextId.current++, kind: "command", text: rawCommand.trim() },
    ]);
    setBusy(true);
    setAnnouncement("Processing portfolio command.");
    delayRef.current = setTimeout(
      () => {
        setResponse(getResponse(command));
        delayRef.current = null;
      },
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220,
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runCommand(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp" && history.length > 0) {
      event.preventDefault();
      if (historyIndex === -1) setDraft(input);
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setInput(history[history.length - 1 - next]);
    } else if (event.key === "ArrowDown" && historyIndex >= 0) {
      event.preventDefault();
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setInput(next < 0 ? draft : history[history.length - 1 - next]);
    } else if (event.key === "Tab" && input.trim()) {
      const matches = commandList.filter((command) =>
        command.startsWith(input.trim().toLowerCase()),
      );
      if (matches.length === 1) {
        event.preventDefault();
        setInput(matches[0]);
      }
    } else if (event.key === "Escape") {
      setInput("");
      setHistoryIndex(-1);
    }
  };

  return (
    <div className="term-panel">
      <div className="term-header">
        <div className="term-window-controls" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="term-window-title">
          <span>root@portfolio</span>:~$
        </span>
        <span className="term-environment">
          <span /> FRONTEND SIMULATION
        </span>
        <span className="term-window-actions" aria-hidden="true">
          <Minus size={12} /> <X size={12} />
        </span>
      </div>
      <div className="term-body">
        <div className="term-main">
          <div
            className="term-output"
            id={outputId}
            ref={outputRef}
            role="region"
            aria-label="Terminal command output"
            aria-busy={busy}
            tabIndex={0}
          >
            <div className="term-session-label" aria-hidden="true">
              <span>root@portfolio</span>:~$ help
            </div>
            {entries.map((entry) => (
              <div key={entry.id} className={`term-entry term-${entry.kind}`}>
                {entry.kind === "command" && (
                  <span className="term-command-prefix" aria-hidden="true">
                    root@portfolio<span>:~</span>${" "}
                  </span>
                )}
                <span>{entry.text}</span>
                {entry.href && (
                  <a href={entry.href} className="term-output-link">
                    {entry.linkLabel}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                )}
              </div>
            ))}
            {busy && (
              <div className="term-active-output" aria-hidden="true">
                {response
                  ? response.text.slice(0, visibleCharacters)
                  : "connecting"}
                <span className="term-cursor" />
              </div>
            )}
          </div>
          <noscript>
            <p className="term-nojs">
              Enable JavaScript to use this simulated terminal, or{" "}
              <a href="#about">read the operator profile</a>.
            </p>
          </noscript>
          <form
            className="term-input-row"
            onSubmit={handleSubmit}
            onClick={() => inputRef.current?.focus()}
          >
            <label htmlFor={inputId} className="term-input-prompt">
              <span className="term-prompt-long">root@portfolio</span>
              <span className="term-prompt-path">:~</span>
              <span>$</span>
              <span className="term-sr-only">Enter a portfolio command</span>
            </label>
            <input
              ref={inputRef}
              id={inputId}
              className="term-input"
              type="text"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setHistoryIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder={busy ? "Receiving response…" : "Type help…"}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={180}
              aria-controls={outputId}
              aria-describedby={`${inputId}-hint`}
              readOnly={busy}
              disabled={!ready}
            />
            <button
              className="term-run"
              type="submit"
              disabled={!ready || busy || !input.trim()}
              aria-label="Run portfolio command"
            >
              <CornerDownLeft size={15} aria-hidden="true" />
            </button>
          </form>
        </div>
        <aside
          className="term-system"
          aria-label="Simulated terminal environment"
        >
          <div className="term-sys-top">
            <span /> SYS INFO
          </div>
          <pre className="term-ascii" aria-hidden="true">{`     ..---..  .--.
  .-'::::::'--::::'-.   .
 /::::::..::::::::::'-'::.
 ':::.   '::::::..::::::'
   '::.  .::::::'  '::'
    '::..:::::'     ::.
      ':::::'       '::
       '::'          '
        '`}</pre>
          <dl>
            <div>
              <dt>Runtime:</dt>
              <dd>Browser</dd>
            </div>
            <div>
              <dt>Access:</dt>
              <dd>Simulated</dd>
            </div>
            <div>
              <dt>Profile:</dt>
              <dd>Placeholder</dd>
            </div>
            <div>
              <dt>Shell:</dt>
              <dd>None</dd>
            </div>
          </dl>
          <span className="term-sys-online">
            <i /> INTERFACE ONLINE
          </span>
        </aside>
      </div>
      <div className="term-footer" id={`${inputId}-hint`}>
        <span>
          <span className="term-footer-dot" /> SIMULATED · NO SYSTEM ACCESS
        </span>
        <span className="term-key-hint">
          TRY{" "}
          <button
            type="button"
            onClick={() => {
              runCommand("help");
              inputRef.current?.focus();
            }}
            disabled={!ready || busy}
          >
            help
          </button>
          <span className="term-footer-separator"> / </span>↑ ↓ HISTORY
        </span>
      </div>
      <div
        className="term-sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <style jsx>{`
        .term-panel {
          container-type: inline-size;
          position: relative;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(110deg, #020b10ed, #02080bec);
          border: 1px solid #1a5b65;
          border-radius: 3px;
          color: #b7dce6;
          font-family:
            "JetBrains Mono", ui-monospace, SFMono-Regular, Consolas, monospace;
          font-size: 12px;
          box-shadow:
            0 0 18px #00d9ff09,
            inset 0 0 25px #00d9ff04;
          isolation: isolate;
        }
        .term-panel::before {
          content: "";
          position: absolute;
          top: -1px;
          left: 13px;
          height: 1px;
          width: 62px;
          background: #00e7bd;
          box-shadow: 0 0 8px #00ff9c66;
        }
        .term-header {
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 30px;
          padding: 0 11px;
          border-bottom: 1px solid #103139;
          background: #020b0e9c;
        }
        .term-window-controls {
          display: flex;
          gap: 5px;
        }
        .term-window-controls span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ff364c;
        }
        .term-window-controls span:nth-child(2) {
          background: #ffcb29;
        }
        .term-window-controls span:nth-child(3) {
          background: #00f59e;
        }
        .term-window-title {
          display: inline-flex;
          align-items: center;
          gap: 0;
          color: #c6e5ea;
          font-size: 10px;
          letter-spacing: 0.035em;
        }
        .term-window-title > span {
          color: #00ffb0;
        }
        .term-window-actions {
          display: flex;
          gap: 12px;
          color: #33717a;
        }
        .term-environment {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: auto;
          color: #498782;
          font-size: 8px;
          letter-spacing: 0.035em;
        }
        .term-environment > span {
          height: 4px;
          width: 4px;
          border-radius: 50%;
          background: #00ff9c;
          box-shadow: 0 0 8px #00ff9c55;
        }
        .term-body {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 172px;
          gap: 12px;
          padding-right: 12px;
        }
        .term-main {
          min-width: 0;
        }
        .term-output {
          height: 224px;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 10px 13px 6px;
          scrollbar-width: thin;
          scrollbar-color: #145452 transparent;
          line-height: 1.5;
          outline-offset: -3px;
        }
        .term-output:focus-visible {
          outline: 1px solid #00ff9c;
        }
        .term-session-label {
          color: #c4dfe8;
          font-size: 10px;
          letter-spacing: 0;
          margin-bottom: 7px;
        }
        .term-session-label > span {
          color: #00ffae;
        }
        .term-entry {
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          margin-bottom: 10px;
          line-height: 1.5;
        }
        .term-intro {
          color: #a9d5e2;
        }
        .term-intro::first-line {
          color: #d0e7ed;
        }
        .term-command {
          color: #d7e2e8;
          margin-bottom: 6px;
        }
        .term-command-prefix {
          color: #00ff9c;
        }
        .term-command-prefix > span {
          color: #00d9ff;
        }
        .term-response {
          color: #a4c6d2;
        }
        .term-output-link {
          display: flex;
          align-items: center;
          gap: 7px;
          width: fit-content;
          margin-top: 7px;
          color: #00ff9c;
          text-decoration: none;
          border-bottom: 1px solid #00ff9c44;
          transition:
            border-color 0.2s,
            color 0.2s;
        }
        .term-output-link:hover {
          color: #b1ffde;
          border-color: #00ff9c;
        }
        .term-output-link:focus-visible {
          outline: 2px solid #00ff9c;
          outline-offset: 4px;
        }
        .term-active-output {
          white-space: pre-wrap;
          color: #a4c6d2;
          overflow-wrap: anywhere;
        }
        .term-cursor {
          display: inline-block;
          vertical-align: -2px;
          width: 6px;
          height: 13px;
          margin-left: 3px;
          background: #00ff9c;
          animation: term-blink 1s step-end infinite;
        }
        .term-input-row {
          display: flex;
          align-items: center;
          gap: 5px;
          min-height: 39px;
          margin: 0 12px;
          padding: 0;
          border-top: 1px solid #0a2c30;
          cursor: text;
        }
        .term-input-prompt {
          display: flex;
          align-items: center;
          gap: 0;
          white-space: nowrap;
          color: #00ff9c;
        }
        .term-prompt-path {
          color: #00d9ff;
        }
        .term-input {
          flex: 1;
          min-width: 0;
          padding: 8px 0;
          color: #d9e7ec;
          caret-color: #00ff9c;
          background: none;
          border: 0;
          outline: none;
          font: inherit;
          font-size: 11px;
        }
        .term-input::placeholder {
          color: #518491;
        }
        .term-input-row:focus-within {
          border-top-color: #00ff9c77;
        }
        .term-input:focus-visible {
          outline: none;
        }
        .term-run {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 29px;
          height: 27px;
          background: #04221c;
          border: 1px solid #135347;
          border-radius: 1px;
          color: #00ff9c;
          cursor: pointer;
          transition: background 0.2s;
        }
        .term-run:hover:not(:disabled) {
          background: #1b3c30;
        }
        .term-run:disabled {
          opacity: 0.35;
          cursor: default;
        }
        .term-run:focus-visible {
          outline: 2px solid #00ff9c;
          outline-offset: 3px;
        }
        .term-system {
          position: relative;
          align-self: stretch;
          margin: 12px 0;
          padding: 11px;
          overflow: hidden;
          background: #0010127a;
          border: 1px solid #144147;
          box-shadow: inset 0 0 15px #00ff9c03;
          font-size: 10px;
        }
        .term-system::before,
        .term-system::after {
          content: "";
          position: absolute;
          left: 5px;
          right: 5px;
          height: 5px;
          border-left: 1px solid #00bda4;
          border-right: 1px solid #00bda4;
        }
        .term-system::before {
          top: 4px;
          border-top: 1px solid #00bda4;
        }
        .term-system::after {
          bottom: 4px;
          border-bottom: 1px solid #00bda4;
        }
        .term-sys-top {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #00ffce;
          font-size: 10px;
          letter-spacing: 0.06em;
        }
        .term-sys-top > span {
          width: 4px;
          height: 4px;
          background: #00ffce;
          box-shadow: 0 0 8px #00ff9c66;
        }
        .term-ascii {
          margin: 12px 0 8px;
          color: #176674;
          font-size: 7px;
          line-height: 1.15;
          white-space: pre;
          overflow: hidden;
        }
        .term-system dl {
          margin: 8px 0 12px;
        }
        .term-system dl > div {
          display: flex;
          gap: 6px;
          margin-top: 7px;
        }
        .term-system dt {
          color: #00c5a0;
        }
        .term-system dd {
          color: #a8d2dd;
          margin: 0;
        }
        .term-sys-online {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #00dcb1;
          font-size: 8px;
          letter-spacing: 0.04em;
        }
        .term-sys-online i {
          display: block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #00ff9c;
          box-shadow: 0 0 8px #00ff9c55;
        }
        .term-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px 12px;
          border-top: 1px solid #0c2d33;
          padding: 5px 13px;
          background: #00101180;
          color: #5c969b;
          font-size: 8px;
          letter-spacing: 0.03em;
        }
        .term-footer > span {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .term-footer-dot {
          width: 4px;
          height: 4px;
          background: #00ff9c;
          border-radius: 50%;
          opacity: 0.6;
        }
        .term-key-hint {
          white-space: nowrap;
        }
        .term-key-hint button {
          padding: 2px;
          border: 0;
          background: none;
          color: #00d3a5;
          font: inherit;
          font-size: 9px;
          cursor: pointer;
        }
        .term-key-hint button:hover {
          color: #00ff9c;
        }
        .term-key-hint button:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .term-key-hint button:focus-visible {
          outline: 1px solid #00ff9c;
          outline-offset: 3px;
        }
        .term-footer-separator {
          color: #526472;
        }
        .term-nojs {
          padding: 8px 13px;
          color: #a2b3bf;
          font-size: 12px;
        }
        .term-nojs a {
          color: #00ff9c;
          text-decoration: underline;
        }
        .term-sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
          padding: 0;
        }
        @keyframes term-blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
        @container (max-width: 540px) {
          .term-body { display: block; padding-right: 0; }
          .term-system { display: none; }
          .term-environment { display: none; }
          .term-window-actions { margin-left: auto; }
        }
        @media (max-width: 600px) {
          .term-header {
            gap: 10px;
            padding: 0 11px;
          }
          .term-body {
            display: block;
            padding-right: 0;
          }
          .term-system {
            display: none;
          }
          .term-window-actions {
            margin-left: auto;
          }
          .term-environment {
            display: none;
          }
          .term-window-title {
            font-size: 10px;
          }
          .term-output {
            padding: 11px 13px;
            height: 238px;
            font-size: 11px;
          }
          .term-input-row {
            gap: 5px;
            margin: 0 12px;
            min-height: 44px;
          }
          .term-prompt-long {
            display: none;
          }
          .term-input {
            font-size: 16px;
          }
          .term-run {
            width: 33px;
            height: 32px;
          }
          .term-footer {
            padding: 5px 12px;
            font-size: 7px;
          }
          .term-key-hint {
            font-size: 8px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .term-cursor {
            animation: none;
          }
          .term-output-link,
          .term-run {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
