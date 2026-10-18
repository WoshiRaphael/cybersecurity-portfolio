import { open, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ignoredSourceDirectories = new Set(["node_modules", ".git", ".next", "out"]);
const pdfSignature = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d]);
const documentExtensions = new Set([".txt", ".doc", ".docx", ".rtf"]);

function isResumeDocument(filename) {
  const extension = path.extname(filename).toLowerCase();
  const name = path.basename(filename, path.extname(filename))
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return documentExtensions.has(extension) &&
    /resume|curriculum[\s._-]*vitae|(?:^|[\s._-])cv(?:$|[\s._-])/i.test(name);
}

/** Return file paths and reasons only; never expose document contents. */
export async function scanPrivateFiles(root, { exported = false } = {}) {
  const findings = [];
  const absoluteRoot = path.resolve(root);

  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name);
      const relativePath = path.relative(absoluteRoot, absolutePath).split(path.sep).join("/");
      if (entry.isDirectory()) {
        if (exported || !ignoredSourceDirectories.has(entry.name)) await walk(absolutePath);
        continue;
      }
      if (entry.isSymbolicLink()) {
        findings.push({ path: relativePath, reason: "Symbolic links cannot be checked safely." });
        continue;
      }
      if (!entry.isFile()) continue;
      if (path.extname(entry.name).toLowerCase() === ".pdf") {
        findings.push({ path: relativePath, reason: "PDF files must remain outside the public project." });
        continue;
      }
      const isPublic = relativePath.split("/")[0].toLowerCase() === "public";
      if ((exported || isPublic) && isResumeDocument(entry.name)) {
        findings.push({ path: relativePath, reason: "Resume documents cannot be published as public assets." });
        continue;
      }
      const file = await open(absolutePath, "r");
      try {
        const header = Buffer.alloc(1024);
        const { bytesRead } = await file.read(header, 0, header.length, 0);
        if (header.subarray(0, bytesRead).includes(pdfSignature)) {
          findings.push({ path: relativePath, reason: "PDF content was detected under a different filename." });
        }
      } finally {
        await file.close();
      }
    }
  }

  await walk(absoluteRoot);
  return findings.sort((a, b) => a.path.localeCompare(b.path));
}

async function main() {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.some((argument) => argument !== "--export") || argumentsList.length > 1) {
    throw new Error("Usage: node scripts/check-private-files.mjs [--export]");
  }
  const exported = argumentsList.includes("--export");
  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const findings = await scanPrivateFiles(exported ? path.join(projectRoot, "out") : projectRoot, { exported });
  if (findings.length) {
    console.error("Publication blocked: keep private resumes outside the repository and static website.");
    for (const finding of findings) console.error(`- ${finding.path}: ${finding.reason}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Private-file check passed (${exported ? "static export" : "project source"}).`);
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(`Private-file check failed: ${error.message}`);
    process.exitCode = 1;
  });
}
