# NULL / Operator Portfolio

[Live website](https://woshiraphael.github.io/cybersecurity-portfolio/) · [GitHub repository](https://github.com/WoshiRaphael/cybersecurity-portfolio)

A cinematic, responsive portfolio for an offensive security professional. The interface uses an illustrated operations room, dense dashboard panels, angular illuminated borders, and green, cyan, and red lighting. Built with Next.js, React, TypeScript, Tailwind CSS, Motion, and Lucide icons. Designed for GitHub Pages with a static export and no server requirement.

The interface includes a skippable startup sequence, an operations dashboard, filterable skills, research previews, a command palette, and a simulated terminal. Custom artwork is bundled in `public/images/operations-room.webp` and `public/images/operator-avatar.webp`; circuit textures and technical previews are rendered locally with CSS and SVG. Keyboard navigation and reduced-motion preferences are supported. All fonts are bundled locally; the website makes no Google Fonts requests.

## Run locally

Use a current Node.js 22 release (22.13 or newer), or a newer supported LTS release. The reproducible dependency lock uses pnpm 11.25.0. Open a terminal in the project folder:

```sh
corepack enable
pnpm install
pnpm dev
```

Open [localhost:3000](http://localhost:3000). To check the production build:

```sh
pnpm build
pnpm preview
```

The static website is generated in `out/`. The preview command serves that production output locally. `npm install` and `npm run dev` are also supported for local development; the deployment workflow uses the committed pnpm lockfile.

If your Node.js installation does not include Corepack, install the pinned package manager with `npm install --global pnpm@11.25.0`, then run the pnpm commands above.

## Make it yours

Start with `src/data/profile.ts`. The public name is Raphael. Replace `[YOUR BIO]`, `[YOUR LOCATION]`, specialization, and the content collections with your own information. Add only professional contact details you are comfortable publishing.

All example operations, research, certifications, and outcomes are editable sample content. They do not represent real engagements, findings, qualifications, or achievements. Keep placeholder labels until you have replaced an item with verified information. Publish only work you are authorized to disclose.

Resume access is by request and personal approval. The website opens a restricted Google Drive file page configured in `profile.resumeAccessUrl`. Visitors sign in to Google, request access, and wait for Raphael's approval. Keep **General access → Restricted** and grant only the specific accounts you approve. A Google account verifies account control; it does not establish a person's identity or trustworthiness.

Never add the resume PDF to this public repository, `public/`, `out/`, or downloadable source packages. GitHub Pages serves static files publicly; a hidden link or browser-only challenge does not protect them. The build checks for PDF files, renamed PDF content, and public resume documents, and stops if any are found. Until a valid protected request URL is configured, the request dialog offers no document link.

See [the customization guide](docs/CUSTOMIZATION.md) for details.

The layout starts with a full-width illustrated hero, followed by spacious sections for the operator profile, projects, skills, certifications, research, terminal, and contact. Readable typography, generous spacing, and touch-friendly controls carry through desktop, tablet, and mobile. Replace the bundled artwork or adjust its framing in `src/app/globals.css` to change the visual identity without changing portfolio content.

The two custom illustrations were created with image generation; their prompts are recorded in `docs/artwork-prompts.json`. The source includes editable profile, project, research, qualification, and contact placeholders. Replace them with your own accurate information before publishing. The private resume is managed outside the public website.

## Publish with GitHub Pages

1. Create a GitHub repository and put this project's contents at its root, including the hidden `.github` folder and `pnpm-lock.yaml`.
2. Push the files to the `main` branch.
3. In the repository, open **Settings → Pages**. Set **Build and deployment → Source** to **GitHub Actions**.
4. Open **Actions → Deploy portfolio to GitHub Pages**. It runs when `main` changes, or you can choose **Run workflow**.
5. Once the workflow succeeds, use the deployment URL shown by GitHub.

The workflow uses Node.js 22 and pnpm 11.25.0, installs the locked dependencies with `pnpm install --frozen-lockfile`, builds the static website, uploads `out/`, and deploys through GitHub Pages. It sets the correct asset base path automatically:

- A repository named `YOUR-USERNAME.github.io` uses the domain root.
- Any other repository uses `/REPOSITORY-NAME`.

If your default branch has another name, update the `branches` entry in `.github/workflows/deploy.yml`. A custom domain needs an empty `NEXT_PUBLIC_BASE_PATH`; update the workflow's base-path step and configure the domain in GitHub Pages before using one.

This repository publishes to https://woshiraphael.github.io/cybersecurity-portfolio/ through GitHub Actions whenever `main` changes.

## Contact behavior

The form validates the visitor's details and, when a real email address is configured, opens an email draft in their mail application. The visitor must send that draft themselves. There is no form backend, email delivery service, or claim that a message has been sent. With no configured email address, the form explains that configuration is required.

The portfolio terminal is a frontend simulation. Commands show portfolio content only; they do not execute an operating-system shell or connect to a target.

## License

MIT. Replace `[YOUR NAME]` in [LICENSE](LICENSE) with the copyright holder's name before publishing.
