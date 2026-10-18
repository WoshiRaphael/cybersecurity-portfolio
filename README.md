# NULL / Operator Portfolio

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

Start with `src/data/profile.ts`. Replace `[YOUR NAME]`, `[YOUR BIO]`, `[YOUR LOCATION]`, specialization, and the content collections with your own information. Add your real GitHub URL, LinkedIn URL, and email address.

All example operations, research, certifications, and outcomes are editable sample content. They do not represent real engagements, findings, qualifications, or achievements. Keep placeholder labels until you have replaced an item with verified information. Publish only work you are authorized to disclose.

Replace `public/resume.txt` with your real resume. If you use a PDF instead, add it to `public/`, then set `profile.resumePath` to `/resume.pdf`, `resumeLabel` to `Download resume`, and `resumeFormat` to `PDF` in `src/data/profile.ts`. The included resume is explicitly a template.

See [the customization guide](docs/CUSTOMIZATION.md) for details.

The desktop layout follows a compact operations-console composition. It reflows into readable, touch-friendly sections on smaller screens. Replace the bundled artwork or adjust its framing in `src/app/globals.css` to change the visual identity without changing portfolio content.

The two custom illustrations were created with image generation; their prompts are recorded in `docs/artwork-prompts.json`. The source includes editable profile, project, research, qualification, contact, and resume placeholders. Replace them with your own accurate information before publishing.

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

This package includes the deployment workflow; it has not created a repository or published a website for you.

## Contact behavior

The form validates the visitor's details and, when a real email address is configured, opens an email draft in their mail application. The visitor must send that draft themselves. There is no form backend, email delivery service, or claim that a message has been sent. With no configured email address, the form explains that configuration is required.

The portfolio terminal is a frontend simulation. Commands show portfolio content only; they do not execute an operating-system shell or connect to a target.

## License

MIT. Replace `[YOUR NAME]` in [LICENSE](LICENSE) with the copyright holder's name before publishing.
