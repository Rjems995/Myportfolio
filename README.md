# Robin James Waje's portfolio

## Formatting

Run `npm install` once to install Prettier, then use `npm run format` to format the project or `npm run format:check` to check formatting without changing files. Prettier is only a development tool; the website still runs without a build step.

A responsive, dependency-free portfolio inspired by the layout and motion of https://aadarshrai.vercel.app/. All implementation and decorative visuals are original; no reference photos or personal details are reused.

Open `index.html` in a browser to preview. No installation or build step is required. Deploy `index.html`, `styles.css`, `script.js`, `animations.css`, `animations.js`, and `favicon.svg` to any static host.

## Personalize

Project screenshots in `assets/projects/` were captured from local copies of the public repositories: Tally's built-in demo dashboard, Campus Marketplace's landing page with an empty temporary SQLite database, and EVACU-ROSA's public map without configured shelters. The map retains OpenStreetMap attribution. These are actual app captures, not mockups. Include these WebP assets when deploying.

- Update your name, role, about text, and page metadata in `index.html`.
- Selected work features Tally, Campus Marketplace, and EVACU-ROSA from your public GitHub repositories. Update the cards in `index.html` and descriptions, tags, and repository links in `script.js` as your projects evolve.
- Your email is configured in `script.js`; your email, phone, and GitHub links are in `index.html`.
- The hero uses `assets/robin-smiling.png`, a transparent cutout from your latest smiling photo. Include the `assets` folder when deploying.
- Change the timezone in `script.js` if needed.

Includes category filtering, project detail dialogs, a mobile menu, a live local clock, keyboard focus styles, and reduced-motion support. Google Fonts is optional; the site uses a system fallback when offline.

Animation includes a curved multilingual welcome curtain, hero entrance, magnetic buttons with rising fills, staggered scroll and text reveals, a direction-aware name marquee, cursor-following project previews, globe rotation, parallax, a curved footer reveal, a sliding navigation drawer, animated project filtering, and dialog transitions. Motion adapts to touch devices and the system reduced-motion setting; continuous animation pauses when the page is hidden.

The opening sequence cycles through greetings in 12 languages, starting with “Hello” and ending with “Kumusta,” before the curved reveal. It replays on reload, including when the URL has a section anchor. Edit the `greetings` array in `animations.js` to change the words or timing.
