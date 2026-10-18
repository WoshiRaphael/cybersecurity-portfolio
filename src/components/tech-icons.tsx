import type { ReactNode } from "react";

type TechIconProps = { name: string; size?: number };

/** Small original pictograms, kept local so the toolkit works offline. */
export default function TechIcon({ name, size = 34 }: TechIconProps) {
  const key = name.toLowerCase().replace(/[\s_-]/g, "");
  let graphic: ReactNode;

  if (key.includes("nmap")) {
    graphic = (
      <>
        <path
          d="M3 20s9-11 17-11S37 20 37 20 28 31 20 31 3 20 3 20Z"
          stroke="#c0ecff"
          strokeWidth="1.8"
          fill="#062335"
        />
        <path d="M6 20s7-7 14-7 14 7 14 7" stroke="#5dc8e7" fill="none" />
        <circle cx="20" cy="20" r="7" fill="#b9f7ff" />
        <circle cx="20" cy="20" r="4.4" fill="#063248" />
        <circle cx="21.5" cy="18" r="1.5" fill="white" />
        <path
          d="m5 12 4 3m22 0 4-3M20 4v4"
          stroke="#04e7dd"
          strokeWidth="1.3"
        />
      </>
    );
  } else if (key.includes("burp")) {
    graphic = (
      <>
        <path d="M10 4h23v31H7V10Z" fill="#f2542a" />
        <path d="M18 7h9l-6 10h6l-9 16h-7l6-11h-5l6-10h-4Z" fill="#fff4e7" />
        <path d="M10 4 7 10h5" fill="#ff9a45" />
      </>
    );
  } else if (key.includes("metasploit")) {
    graphic = (
      <>
        <path
          d="m20 2 15 6-3 21-12 9L8 29 5 8Z"
          fill="#0f8cda"
          stroke="#92dbff"
          strokeWidth="1.3"
        />
        <path d="m20 6 10 4-2 16-8 7-8-7-2-16Z" fill="#15418d" />
        <path d="M13 27V12l7 6 7-6v15h-4v-9l-3 3-3-3v9Z" fill="#e9faff" />
      </>
    );
  } else if (key.includes("bloodhound")) {
    graphic = (
      <>
        <path
          d="m6 7 7 5 5-1 6 6 8 3 4 8-8-2-4 3-6-2-6 5-6-1 7-7-3-7Z"
          fill="#351019"
          stroke="#ff3651"
          strokeWidth="1.2"
        />
        <path
          d="m11 12 2 9 7 1m-2-10 2 9 8 5m-4-9-1 6M6 31l9-3m-6-1 7-3m11-3 8 4"
          stroke="#e92c45"
          fill="none"
          strokeWidth=".9"
        />
        <path d="m22 17 3 2-3 1Z" fill="#ff8292" />
      </>
    );
  } else if (key.includes("wireshark")) {
    graphic = (
      <>
        <path
          d="M5 32C12 21 17 7 31 4c-8 11-7 22 2 28Z"
          fill="#058cdd"
          stroke="#7cdaff"
          strokeWidth="1.2"
        />
        <path
          d="M5 32h28M31 4C23 18 22 25 26 32"
          stroke="#004d89"
          fill="none"
        />
        <path d="M7 35h27" stroke="#20d7ff" strokeWidth="1.5" />
      </>
    );
  } else if (key.includes("python")) {
    graphic = (
      <>
        <path
          d="M20 3c-8 0-9 2-9 7v4h12v2H8c-5 0-6 3-6 8s3 7 7 7h3v-6c0-5 3-7 8-7h9V9c0-4-3-6-9-6Z"
          fill="#3f9bcd"
        />
        <path
          d="M20 37c8 0 9-2 9-7v-4H17v-2h15c5 0 6-3 6-8s-3-7-7-7h-3v6c0 5-3 7-8 7h-9v9c0 4 3 6 9 6Z"
          fill="#ffd457"
        />
        <circle cx="16" cy="8" r="1.6" fill="#06121f" />
        <circle cx="24" cy="32" r="1.6" fill="#705e21" />
      </>
    );
  } else if (key.includes("linux")) {
    graphic = (
      <>
        <path
          d="M20 3c-7 0-7 8-8 12-2 5-6 11-5 15 1 4 7 5 13 5s12-1 13-5c1-4-3-10-5-15-1-4-1-12-8-12Z"
          fill="#d5f0ec"
          stroke="#6f8b91"
          strokeWidth=".8"
        />
        <path
          d="M20 3c-7 0-7 8-8 12l-4 10 5 3c1-3 0-8 2-11-1-3 1-4 1-4h8s2 1 1 4c2 3 1 8 2 11l5-3-4-10c-1-4-1-12-8-12Z"
          fill="#121d26"
        />
        <path d="m15 13 5 5 5-5-5-2Z" fill="#ffc343" />
        <ellipse cx="10" cy="33" rx="7" ry="3" fill="#f1b927" />
        <ellipse cx="30" cy="33" rx="7" ry="3" fill="#f1b927" />
        <ellipse cx="17" cy="10" rx="2" ry="3" fill="white" />
        <ellipse cx="23" cy="10" rx="2" ry="3" fill="white" />
        <circle cx="17.5" cy="10.5" r="1" fill="#152731" />
        <circle cx="22.5" cy="10.5" r="1" fill="#152731" />
      </>
    );
  } else if (key.includes("bash") || key.includes("powershell")) {
    graphic = (
      <>
        <path
          d="m20 2 16 9v18l-16 9L4 29V11Z"
          fill="#0e1a23"
          stroke="#bfdae0"
          strokeWidth="1.5"
        />
        <path
          d="m14 14 7 6-7 6m8 0h7"
          stroke="#d8f7ee"
          strokeWidth="2.1"
          fill="none"
        />
        <path
          d="m4 11 16 9 16-9M20 20v18"
          stroke="#668b91"
          strokeWidth=".7"
          opacity=".5"
        />
      </>
    );
  } else if (key.includes("docker")) {
    graphic = (
      <>
        <path
          d="M4 20h29c1 0 4-2 4-5 3 6-1 10-5 11-4 8-23 10-28-1Z"
          fill="#0aa9ed"
        />
        <path
          d="M9 13h5v5H9Zm7 0h5v5h-5Zm7 0h5v5h-5ZM16 6h5v5h-5Zm7 0h5v5h-5ZM2 13h5v5H2Z"
          fill="#52d1fa"
        />
        <circle cx="10" cy="23" r="1" fill="#032f51" />
      </>
    );
  } else if (key.includes("vscode") || key.includes("visualstudio")) {
    graphic = (
      <>
        <path
          d="m28 2 10 5v26l-10 5-17-14-7 5-4-4 9-8-9-8 4-4 7 5ZM15 20l13 10V10Z"
          fill="#169ce5"
        />
        <path d="m28 2 10 5v26l-10 5Z" fill="#26b4fb" />
      </>
    );
  } else if (key.includes("sql")) {
    graphic = (
      <>
        <path
          d="M16 4h8v32h-8Z"
          fill="#2e0b14"
          stroke="#ff3449"
          strokeWidth="1.5"
        />
        <path
          d="M12 11h16v18H12Z"
          fill="none"
          stroke="#ff3449"
          strokeWidth="1.5"
        />
        <path
          d="M20 1v8m0 22v8m8-23h5v8h-5m-16-8H7v8h5"
          fill="none"
          stroke="#ff3449"
          strokeWidth="1.5"
        />
      </>
    );
  } else if (key.includes("impacket")) {
    graphic = (
      <>
        <path
          d="M20 4c7 0 8 8 8 11 7 0 7 15 1 16l-4-4v-9h-3v17h-4V18h-3v9l-4 4c-6-1-6-16 1-16 0-3 1-11 8-11Z"
          fill="#003b40"
          stroke="#05ead0"
          strokeWidth="1.5"
        />
        <path
          d="M20 7v8m-4-6 4 3 4-3m-10 8-4 10m16-10 4 10"
          stroke="#00c2bc"
          fill="none"
        />
      </>
    );
  } else if (
    key.includes("aws") ||
    key.includes("prowler") ||
    key.includes("cloud")
  ) {
    graphic = (
      <>
        <path
          d="M10 28C0 28 1 15 10 14c2-13 22-13 25 0 8 1 7 14-1 14Z"
          fill="#09212b"
          stroke="#2edbf1"
          strokeWidth="1.5"
        />
        <path
          d="m13 22 5-5m-5 5 5 5m8-10-5 10m7-10 5 5-5 5"
          stroke="#99eeff"
          fill="none"
          strokeWidth="1.5"
        />
        <path
          d="M11 34c8 4 18 2 22-2"
          stroke="#ffb342"
          strokeWidth="2"
          fill="none"
        />
      </>
    );
  } else if (key.includes("mitre")) {
    graphic = (
      <>
        <path
          d="m20 2 17 18-17 18L3 20Z"
          fill="#061e2b"
          stroke="#29d8fc"
          strokeWidth="1.5"
        />
        <path d="m20 9 10 11-10 11L10 20Z" stroke="#2b728d" fill="none" />
        <path
          d="M14 25V15l6 6 6-6v10"
          stroke="#adf3ff"
          strokeWidth="2"
          fill="none"
        />
      </>
    );
  } else if (key.includes("owasp")) {
    graphic = (
      <>
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="#071f2c"
          stroke="#39c8dd"
          strokeWidth="1.4"
        />
        <ellipse cx="20" cy="20" rx="8" ry="16" stroke="#248b9c" fill="none" />
        <path d="M4 20h32M7 11h26M7 29h26M20 4v32" stroke="#248b9c" />
        <path d="m25 15 2 3 4-1-3 4 1 5-4-2-4 3 1-5-3-3 5-1Z" fill="#94f9ef" />
      </>
    );
  } else if (
    key.includes("maltego") ||
    key.includes("threat") ||
    key.includes("model")
  ) {
    graphic = (
      <>
        <path
          d="m7 8 13 12L33 7M20 20 8 33m12-13 13 13M7 8l26-1M8 33h25"
          stroke="#358c9c"
          strokeWidth="1.2"
        />
        <circle
          cx="20"
          cy="20"
          r="6"
          fill="#0b3e46"
          stroke="#08efc4"
          strokeWidth="1.6"
        />
        {[
          [7, 8],
          [33, 7],
          [8, 33],
          [33, 33],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3.5"
            fill="#082631"
            stroke={i === 3 ? "#ed5871" : "#31c8e5"}
            strokeWidth="1.4"
          />
        ))}
      </>
    );
  } else if (key.includes("git")) {
    graphic = (
      <>
        <path d="m20 2 18 18-18 18L2 20Z" fill="#f16443" />
        <path d="m13 11 13 13m-6-6v11" stroke="#071b25" strokeWidth="2.4" />
        <circle cx="13" cy="11" r="3" fill="#071b25" />
        <circle cx="26" cy="24" r="3" fill="#071b25" />
        <circle cx="20" cy="29" r="3" fill="#071b25" />
      </>
    );
  } else {
    graphic = (
      <>
        <path
          d="m20 2 16 9v18l-16 9L4 29V11Z"
          fill="#062b2c"
          stroke="#00e8af"
          strokeWidth="1.4"
        />
        <path
          d="m12 15 7 5-7 5m10 0h7"
          stroke="#a9ffee"
          strokeWidth="2"
          fill="none"
        />
      </>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0 }}
    >
      {graphic}
    </svg>
  );
}
