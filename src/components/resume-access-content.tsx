import { ArrowUpRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

type ResumeAccessContentProps = {
  name: string;
  requestUrl: string;
};

function protectedDriveUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (
      url.protocol !== "https:" ||
      url.hostname !== "drive.google.com" ||
      url.port !== "" ||
      url.username !== "" ||
      url.password !== "" ||
      url.hash !== "" ||
      !/^\/file\/d\/[A-Za-z0-9_-]+\/view$/.test(url.pathname)
    ) {
      return null;
    }

    const safeParameters: Record<string, RegExp> = {
      usp: /^[A-Za-z0-9_-]{1,80}$/,
      resourcekey: /^[A-Za-z0-9_-]{1,200}$/,
      authuser: /^\d{1,3}$/,
    };
    for (const [key, entry] of url.searchParams) {
      if (
        !Object.prototype.hasOwnProperty.call(safeParameters, key) ||
        !safeParameters[key].test(entry) ||
        url.searchParams.getAll(key).length !== 1
      ) {
        return null;
      }
    }
    return url.href;
  } catch {
    return null;
  }
}

export default function ResumeAccessContent({
  name,
  requestUrl,
}: ResumeAccessContentProps) {
  const owner = name.trim() || "Raphael";
  const destination = protectedDriveUrl(requestUrl);

  return (
    <div className="detail-content resume-access-content">
      <span className="sample-pill" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <LockKeyhole size={14} aria-hidden="true" /> PRIVATE DOCUMENT
      </span>
      <h2>Resume access, by request</h2>
      <p className="detail-lead">
        Interested in working with {owner}? Request permission to view the
        resume. Access is reviewed personally before it is granted.
      </p>

      <ol
        aria-label="How resume access works"
        style={{ listStyle: "none", padding: 0, margin: "28px 0 0" }}
      >
        {[
          {
            Icon: LockKeyhole,
            title: "Sign in with Google",
            description:
              "Open the protected Google Drive page and sign in with the Google account you want to use for access.",
          },
          {
            Icon: Mail,
            title: "Send an access request",
            description:
              "Choose Request access. In the message, include your company or affiliation and why you would like to view the resume.",
          },
          {
            Icon: ShieldCheck,
            title: `${owner} reviews your request`,
            description:
              "Requests are considered individually. If approved, Google Drive will notify the account you used to request access.",
          },
        ].map(({ Icon, title, description }, index) => (
          <li
            key={title}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              padding: "20px 0",
              borderBottom: "1px solid #17434d",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "grid",
                placeItems: "center",
                flex: "0 0 42px",
                height: 42,
                border: "1px solid #227969",
                background: "#06251f",
                color: "#00ff9c",
                borderRadius: 8,
              }}
            >
              <Icon size={20} />
            </span>
            <div style={{ minWidth: 0 }}>
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--sans)",
                  fontSize: 18,
                  lineHeight: 1.5,
                  color: "#f0fbff",
                }}
              >
                <span style={{ color: "#00ff9c" }}>{index + 1}.</span> {title}
              </h3>
              <p style={{ margin: "8px 0 0", fontSize: 16, lineHeight: 1.7 }}>
                {description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {destination ? (
        <>
          <a
            className="primary-action"
            href={destination}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 15, minHeight: 48, whiteSpace: "normal" }}
          >
            Request resume access
            <ArrowUpRight size={18} aria-hidden="true" />
            <span className="sr-only"> (opens Google Drive in a new tab)</span>
          </a>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Opens Google Drive in a new tab. Signing in identifies the Google
            account making the request; access is not automatic.
          </p>
        </>
      ) : (
        <div
          role="status"
          style={{
            marginTop: 28,
            padding: 20,
            border: "1px solid #277184",
            borderRadius: 8,
            background: "#061b26",
          }}
        >
          <strong style={{ fontSize: 17, color: "#e0f5ff" }}>
            Access requests are being set up
          </strong>
          <p style={{ margin: "8px 0 0", fontSize: 16, lineHeight: 1.7 }}>
            {owner}&apos;s resume is currently private. Please check back once
            the access request page is ready.
          </p>
        </div>
      )}
    </div>
  );
}
