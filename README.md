# Robin James Waje's Portfolio

A responsive personal portfolio built with HTML, CSS, and JavaScript. It presents Robin's background, selected projects, GitHub contributions, and downloadable resume, with motion inspired by [Aadarsh Rai's portfolio](https://aadarshrai.vercel.app/).

**Live website:** [rjems995.github.io/Myportfolio](https://rjems995.github.io/Myportfolio/)

## Selected work

| Project               | Focus                                                                                                                    | Repository                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| **EvacuRosa**         | Capstone research on multi-hazard evacuation decision support for Santa Rosa City. Robin's role focuses on UI/UX design. | [Alenlen1/EvacuRosa](https://github.com/Alenlen1/EvacuRosa)                 |
| **CampusMarketplace** | Student marketplace with listings, search, messaging, reviews, and moderation.                                           | [Rjems995/CampusMarketplace](https://github.com/Rjems995/CampusMarketplace) |
| **SpaceSketch**       | Interior and outdoor space planning with connected 2D floor plans and a 3D editor.                                       | [Rjems995/SpaceSketch](https://github.com/Rjems995/SpaceSketch)             |

Each project has a short preview, project context, technical details, tags, a repository link, and a gallery of three screenshots. On touch layouts, previews remain visible without hovering. Galleries support previous/next buttons, keyboard arrows, swipe navigation, thumbnails, and tap-to-enlarge images.

## Features

- Responsive portrait hero, About section, education card, and resume download.
- Project filters for all work, web apps, and design tools.
- GitHub contribution calendar for `Rjems995`, scaled to fit mobile screens, with a profile link and a loading-error fallback.
- Contact dialog that prepares a Gmail draft, with a default email app link and a copy-address action. Messages are reviewed and sent in the visitor's email client; the portfolio has no email-sending backend.
- Local clock using the `Asia/Manila` timezone.
- Skip-to-content link, visible keyboard focus, dialog labels, and reduced-motion support.

The multilingual introduction cycles through 12 greetings, from "Hello" to "Kumusta." It plays once per browser session, includes a skip button, and is skipped when reduced motion is enabled. Other motion includes scroll reveals, the moving name, magnetic buttons, project previews, parallax, and drawer/dialog transitions. Continuous animation pauses when the page is hidden.

## Preview locally

Open `index.html` directly in a browser. No installation or build step is required to run the website.

For a local HTTP preview, if Python is installed:

```sh
python -m http.server 8000
```

Then open [localhost:8000](http://localhost:8000/).

The site has no frontend framework or runtime package dependencies. Google Fonts and the contribution calendar use external services; fonts fall back to system fonts, and a profile link appears if the calendar cannot load.

## Formatting

Install the locked development dependency:

```sh
npm ci
```

Format the project or check it without changing files:

```sh
npm run format
npm run format:check
```

Prettier is a development tool only. In Windows PowerShell, use `npm.cmd` if the execution policy blocks `npm.ps1`.

## Files and customization

| File or directory                                          | Purpose                                                                                                 |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `index.html`                                               | Page structure, project cards, About content, contact links, resume link, and sharing metadata.         |
| `styles.css`                                               | Layout, typography, components, and responsive styles.                                                  |
| `script.js`                                                | Project data and stories, gallery state, filters, contact drafts, navigation controls, and local clock. |
| `animations.js` / `animations.css`                         | Welcome sequence, scroll effects, hover motion, and animated navigation/dialog behavior.                |
| `enhancements.js`                                          | Touch gallery navigation, screenshot enlargement, and contribution-calendar fallback.                   |
| `favicon.svg`                                              | Circular portrait used as the browser tab icon.                                                         |
| `assets/projects/`                                         | WebP project screenshots.                                                                               |
| `assets/robin-smiling-*.webp`                              | Transparent responsive portraits at 540, 800, and 1086 pixels wide.                                     |
| `assets/robin-james-waje-resume.pdf`                       | Current downloadable resume.                                                                            |
| `assets/social-preview.html` / `assets/social-preview.png` | Editable social-preview artwork and its 1200 x 630 exported image.                                      |
| `scripts/set-site-url.cjs`                                 | Updates canonical and social-sharing URLs.                                                              |

When changing selected work, keep the cards in `index.html` aligned with `portfolio.projects`, `projectStories`, `projectOutcomes`, and `extraScreenshots` in `script.js`. Update image paths, captions, alt text, repository URLs, and filter counts together.

Replace `assets/robin-james-waje-resume.pdf` to update the resume download, then adjust the displayed file size in `index.html`. The older `assets/resume.html` layout does not automatically regenerate the current PDF.

Contact details appear in both `index.html` and `script.js`; keep them consistent. Edit the `greetings` array in `animations.js` to change the introduction. The contribution chart URL and GitHub profile links are in `index.html`.

## Screenshot sources

The current galleries were captured on **October 27, 2026**, from local copies of the linked repositories. They are actual application captures, not mockups.

| Project           | Screenshot files in `assets/projects/`                                              | Capture context                                                                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| EvacuRosa         | `evacu-current.webp`, `evacu-details.webp`, `evacu-options.webp`                    | Public map, evacuation-center panel, and hazard-information panel. The operational backend was not connected. OpenStreetMap attribution is retained. |
| CampusMarketplace | `campus-current.webp`, `campus-current-browse.webp`, `campus-current-register.webp` | Updated homepage, browse page, and registration page with an empty local SQLite preview database.                                                    |
| SpaceSketch       | `spacesketch.webp`, `spacesketch-templates.webp`, `spacesketch-login.webp`          | Rendered 3D homepage, starter templates, and sign-in page. Authenticated cloud editing was not used.                                                 |

The contribution calendar loads from `ghchart.rshah.org`. Its refresh timing depends on the external service and GitHub; it is not a real-time commit feed.

## GitHub Pages and sharing

The portfolio uses relative asset paths for its GitHub Pages project URL:

```text
https://rjems995.github.io/Myportfolio/
```

Publish the HTML, CSS, JavaScript, favicon, and `assets` directory through the repository's configured GitHub Pages source. No build output is needed. Local edits become live after you commit, push, and the Pages deployment finishes.

Open Graph and Twitter/X metadata use the public URL and `assets/social-preview.png`. To change the domain or deployment path:

```sh
npm run metadata:url -- https://YOUR-PUBLIC-ADDRESS/
npm run format
```

Pass the full HTTPS site URL, including the repository path when applicable, without a query string or section anchor. The command updates `index.html`; it does not publish the site or regenerate the preview image. Social services may cache earlier previews.

## Checks before publishing

Run `npm run format:check`, then preview the page at phone and desktop sizes. Check project filters, all three images in each gallery, image enlargement, navigation, resume download, and contact draft contents. Verify keyboard access and the reduced-motion setting as well.

Browser emulation helps catch layout issues; scrolling, rendering, and loading should also be checked on physical phones.
