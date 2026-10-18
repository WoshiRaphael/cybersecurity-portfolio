# Customize your operator portfolio

## Profile and links

Edit `src/data/profile.ts` first. The public name is Raphael. Set your bio, location, specialization, and preferred operator alias. Remaining bracketed text is deliberate placeholder content.

Set `email` to your real contact address, `github` to your full GitHub profile URL, and `linkedin` to your full LinkedIn profile URL. Empty contact fields are intentionally unconfigured. Use public professional contact information you are comfortable publishing.

The contact form opens a draft in the visitor's email application after validation. They still need to send it. It does not send or store messages on a server.

## Operations and research

Replace sample project and article content with your own work. For every operation, describe the environment, mission, tools, methodology, sanitized observations, and any outcome you can support. Label labs and CTFs explicitly. A report link should point to a real, published report that you are authorized to share.

Keep the sample or placeholder labels until the content is accurate. Do not present example findings, invented clients, or illustrative numbers as real results. Research previews can be replaced with your own articles and defensive lessons.

## Certifications

Add only qualifications you hold. Mark any current study as **In progress** and templates as **Placeholder**. OSCP, CRTO, PNPT, eJPT, Hack The Box, and TryHackMe names in example content are prompts for customization, not claims of completion.

## Resume

Keep the resume in a private Google Drive file with **General access → Restricted**. Set `profile.resumeAccessUrl` to that file's normal `https://drive.google.com/file/d/FILE_ID/view` page URL. The two resume buttons open an explanatory dialog, then send visitors to Google to sign in and request access. They cannot download until you approve their account in Drive. Review each request and grant Viewer access only to people you choose. You can revoke access through Drive later.

The request page URL may appear in public source; it is an identifier, not an access credential. Google Drive's server-side file permissions enforce access. Never set the file to Anyone with the link, publish the PDF, use a direct public-download URL, or put the file in this repository, `public/`, `out/`, or delivery archives. Google sign-in confirms account control, not that a requester is trustworthy. Ask for their company and purpose and assess the request before approving it.

The build runs `scripts/check-private-files.mjs` before compilation and after static export. It rejects PDFs (including renamed files with a PDF header) and resume documents in public/export folders. Empty or invalid resume request configuration fails closed: the dialog shows that requests are being set up and provides no download fallback.

## Visual design

The site's shared styling, responsive type sizes, and touch-friendly controls are in `src/app/globals.css`. Change its color tokens to keep the background, accent glow, borders, and text consistent. The default palette uses near-black, neon green, electric cyan, and restrained red highlights.

The custom illustrated hero is `public/images/operations-room.webp`; the dossier portrait is `public/images/operator-avatar.webp`. Replace these files with your own compressed artwork while keeping their names, or update the image references in `src/app/page.tsx`. Preserve the existing GitHub Pages base-path prefix on public asset URLs. For the hero, keep the scene's focal point toward the right so the left-hand headline stays readable. For the portrait, use a vertical composition with a clear face or symbol.

The bundled illustrations were created with image generation. Their generation prompts are recorded in `docs/artwork-prompts.json` so you can understand the composition or create related replacement artwork. The avatar is an imaginary character, not a portrait of the portfolio owner.

Circuit textures and technical thumbnails are local SVG files in `public/images/`: `circuit-frame.svg`, `identity-network.svg`, `web-research.svg`, and `red-team-map.svg`. The page combines them with CSS treatments and live HTML terminal previews. Their references are in `src/app/page.tsx` and styling in `globals.css`; they do not rely on external image services. Keep text and controls as real HTML rather than baking them into replacement images.

The full-width hero is followed by spacious sections in reading order. Keep the responsive breakpoints when changing panel sizes so the operator profile, projects, tools, qualifications, writeups, terminal, and contact form remain usable.

Preserve visible focus states, legible contrast, and reduced-motion support when changing animation or color. Test your changes at narrow mobile widths as well as a desktop viewport.

Fonts are bundled locally, so the website does not call Google Fonts. Keep replacement fonts in the project if you want to preserve this behavior.

## GitHub Pages

Use a current Node.js 22 release (22.13 or newer), or a newer supported LTS release. The deployment workflow is `.github/workflows/deploy.yml`. It builds with the current Node.js 22 release and pnpm 11.25.0, runs `pnpm install --frozen-lockfile`, and publishes the static `out/` directory. Keep `pnpm-lock.yaml` committed so installation is reproducible.

The workflow sets `GITHUB_PAGES=true` and calculates `NEXT_PUBLIC_BASE_PATH` from your repository name. Configure **Settings → Pages → Source → GitHub Actions** in your repository. If your default branch is not `main`, change the workflow's branch filter.

Before publishing, check your name, contact links, resume, page title and description, sample labels, and the copyright holder in `LICENSE`. Run `pnpm build` and confirm the build completes, then use `pnpm preview` to inspect the production output locally.
