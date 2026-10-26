# Pothik Roy - portfolio

A small editorial portfolio for Pothik Roy's video editing, filmmaking, television, writing, and publication design work. Built with semantic HTML, CSS, and a little progressive JavaScript. No package installation, framework, external fonts, analytics, or server is required in production.

## Publishing

GitHub Pages serves the repository root on the existing `master` branch:

https://pothikroy.github.io/portfolio/

Generated HTML and assets are committed, so Pages does not need a custom build workflow. `.nojekyll` keeps the static files intact. All public paths use `/portfolio/`.

## Editing

- `content/projects.json`: all nine project URLs, exact production credits, editorial display labels, roles, and home-page selection. The current display labels describe contributions; they are not asserted to be original film titles. Replace them with supplied project titles when available.
- `scripts/build.mjs`: common header/footer, page copy, metadata, and page templates.
- `assets/style.css`: shared layout, typography, responsive behavior, focus states, and print styles.
- `assets/site.js`: mobile navigation, project filters, and progressive email-copy behavior.
- `assets/images/pothik-roy.jpg`: original portrait extracted from the CV provided by Pothik. Replace with a new portrait at the same path, or update template references.

After editing templates or project data, regenerate the pages:

```sh
node scripts/build.mjs
node scripts/check.mjs
```

For a local preview at the same base path as GitHub Pages:

```sh
node scripts/preview.mjs
```

Open http://127.0.0.1:4173/portfolio/ . The preview server is a development helper and is not used by GitHub Pages.

## Content

The initial copy is based on Pothik's supplied CV and portfolio content brief. It includes BSS/MSS education, D.U. TV production experience, freelance and academic editing, TFP club roles, Subtext co-design, conference reporting, and a research proposal clearly marked as in development.

Project links retain the credits from the CV, including shared roles. No speculative film titles, invented clients, awards, testimonials, or audience metrics are included. Personal identifiers, birth date, phone number, detailed address, application form, full CV PDF, and private planning notes are not published.

## Adding photographs and video later

Keep media in `assets/images/` or `assets/video/`, use descriptive filenames and alt text, and keep aspect ratios consistent. Add stills next to their actual credited projects. Use poster images and controls for video; avoid autoplay with sound. Keep full project credits intact when expanding the work entries into individual case studies.

Only the `pothikroy/portfolio` repository is in scope for this site.
