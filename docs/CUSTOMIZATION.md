# Customize your operator portfolio

## Profile and links

Edit `src/data/profile.ts` first. Set your name, bio, location, specialization, and preferred operator alias. The initial `[YOUR NAME]` and other bracketed text are deliberate placeholders.

Set `email` to your real contact address, `github` to your full GitHub profile URL, and `linkedin` to your full LinkedIn profile URL. Empty contact fields are intentionally unconfigured. Use public professional contact information you are comfortable publishing.

The contact form opens a draft in the visitor's email application after validation. They still need to send it. It does not send or store messages on a server.

## Operations and research

Replace sample project and article content with your own work. For every operation, describe the environment, mission, tools, methodology, sanitized observations, and any outcome you can support. Label labs and CTFs explicitly. A report link should point to a real, published report that you are authorized to share.

Keep the sample or placeholder labels until the content is accurate. Do not present example findings, invented clients, or illustrative numbers as real results. Research previews can be replaced with your own articles and defensive lessons.

## Certifications

Add only qualifications you hold. Mark any current study as **In progress** and templates as **Placeholder**. OSCP, CRTO, PNPT, eJPT, Hack The Box, and TryHackMe names in example content are prompts for customization, not claims of completion.

## Resume

Replace `public/resume.txt` with a completed, accurate text resume. For a PDF, place your file at `public/resume.pdf` and set `profile.resumePath` to `/resume.pdf`, `resumeLabel` to `Download resume`, and `resumeFormat` to `PDF` in `src/data/profile.ts`. The resume link adds the GitHub Pages base path automatically; do not include the repository name in `resumePath`.

## Visual design

The site's shared styling, responsive type sizes, and touch-friendly controls are in `src/app/globals.css`. Change its color tokens to keep the background, accent glow, borders, and text consistent. The default palette uses near-black, neon green, electric cyan, and restrained red highlights.

The custom illustrated hero is `public/images/operations-room.webp`; the dossier portrait is `public/images/operator-avatar.webp`. Replace these files with your own compressed artwork while keeping their names, or update the image references in `src/app/page.tsx`. Preserve the existing GitHub Pages base-path prefix on public asset URLs. For the hero, keep the scene's focal point toward the right so the left-hand headline stays readable. For the portrait, use a vertical composition with a clear face or symbol.

The bundled illustrations were created with image generation. Their generation prompts are recorded in `docs/artwork-prompts.json` so you can understand the composition or create related replacement artwork. The avatar is an imaginary character, not a portrait of the portfolio owner.

Circuit textures and technical thumbnails are local SVG files in `public/images/`: `circuit-frame.svg`, `identity-network.svg`, `web-research.svg`, and `red-team-map.svg`. The page combines them with CSS treatments and live HTML terminal previews. Their references are in `src/app/page.tsx` and styling in `globals.css`; they do not rely on external image services. Keep text and controls as real HTML rather than baking them into replacement images.

The compact dashboard is arranged in multiple columns on wide screens and reflows vertically on smaller screens. Keep the responsive breakpoints when changing panel sizes so the operator profile, projects, tools, qualifications, writeups, terminal, and contact form remain usable.

Preserve visible focus states, legible contrast, and reduced-motion support when changing animation or color. Test your changes at narrow mobile widths as well as a desktop viewport.

Fonts are bundled locally, so the website does not call Google Fonts. Keep replacement fonts in the project if you want to preserve this behavior.

## GitHub Pages

Use a current Node.js 22 release (22.13 or newer), or a newer supported LTS release. The deployment workflow is `.github/workflows/deploy.yml`. It builds with the current Node.js 22 release and pnpm 11.25.0, runs `pnpm install --frozen-lockfile`, and publishes the static `out/` directory. Keep `pnpm-lock.yaml` committed so installation is reproducible.

The workflow sets `GITHUB_PAGES=true` and calculates `NEXT_PUBLIC_BASE_PATH` from your repository name. Configure **Settings → Pages → Source → GitHub Actions** in your repository. If your default branch is not `main`, change the workflow's branch filter.

Before publishing, check your name, contact links, resume, page title and description, sample labels, and the copyright holder in `LICENSE`. Run `pnpm build` and confirm the build completes, then use `pnpm preview` to inspect the production output locally.
