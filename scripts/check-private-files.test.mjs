import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { scanPrivateFiles } from "./check-private-files.mjs";

async function fixture(t, files) {
  const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-private-file-test-"));
  t.after(async () => {
    assert.equal(path.dirname(root), path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith("portfolio-private-file-test-"));
    await rm(root, { recursive: true, force: true });
  });
  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(root, filename);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, content);
  }
  return root;
}

test("rejects PDFs nested in the source, regardless of filename casing", async (t) => {
  const root = await fixture(t, { "docs/private/Raphael.PDF": "fixture only" });
  assert.deepEqual((await scanPrivateFiles(root)).map((file) => file.path), ["docs/private/Raphael.PDF"]);
});

test("rejects a renamed PDF whose signature is inside its first 1024 bytes", async (t) => {
  const signature = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d]);
  const root = await fixture(t, {
    "public/images/portrait.png": Buffer.concat([Buffer.alloc(600, 32), signature, Buffer.from("fixture only")]),
  });
  assert.match((await scanPrivateFiles(root))[0].reason, /PDF content/);
});

test("allows ordinary SVG, JavaScript, and private-access documentation", async (t) => {
  const root = await fixture(t, {
    "public/images/network.svg": '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>',
    "scripts/guard.mjs": 'const signature = Buffer.from([37, 80, 68, 70, 45]);',
    "docs/resume-access.md": "The private resume is stored outside this project.",
  });
  assert.deepEqual(await scanPrivateFiles(root), []);
});

test("ignores dependency, Git, build cache, and export folders in source mode", async (t) => {
  const root = await fixture(t, {
    "node_modules/example/guide.pdf": "fixture only",
    ".git/archive.pdf": "fixture only",
    ".next/cache/preview.pdf": "fixture only",
    "out/resume.pdf": "fixture only",
  });
  assert.deepEqual(await scanPrivateFiles(root), []);
});

test("rejects public resume documents but allows unrelated text files", async (t) => {
  const root = await fixture(t, {
    "public/Raphael-Resume.TXT": "fixture only",
    "public/downloads/cv.docx": "fixture only",
    "public/THIRD_PARTY_NOTICES.txt": "ordinary text",
    "docs/resume.txt": "not a public asset",
  });
  assert.deepEqual((await scanPrivateFiles(root)).map((file) => file.path), [
    "public/downloads/cv.docx", "public/Raphael-Resume.TXT",
  ].sort((a, b) => a.localeCompare(b)));
});

test("export mode checks every folder for PDF content and resume documents", async (t) => {
  const root = await fixture(t, {
    "assets/Resume.rtf": "fixture only",
    "node_modules/hidden.pdf": "fixture only",
    "index.html": "<!doctype html><h1>Raphael</h1>",
  });
  assert.deepEqual((await scanPrivateFiles(root, { exported: true })).map((file) => file.path), [
    "assets/Resume.rtf", "node_modules/hidden.pdf",
  ]);
});
