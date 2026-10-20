# AGENTS.md

This file provides instructions and guidelines for AI agents working in this repository.

---

## 1. Project Overview

This repository hosts the official product landing page, documentation, and blog for **gofs** ([https://gofs.dev](https://gofs.dev)).

* **Architecture**: Static site generated using **Hugo** (extended).
* **Frontend Philosophy**: Evergreen web standards with native Web Components vendored locally (`static/vendor/snice/`) from Snice.
* **Hard Constraints**:
  * **Zero Node.js / zero npm dependencies**: Never introduce `package.json`, `npm`, `npx`, `pnpm`, or JavaScript bundlers.
  * **No template DSLs**: Hugo templates use standard Go `html/template` syntax.
  * **Dark theme default**: The site uses `data-theme="dark"` with CSS design tokens provided by Snice.

> **Note on CLI**: The `gofs` CLI itself is maintained in a separate repository (`github.com/gofs-cli/gofs`). This repository is strictly for the website.

---

## 2. Development & Build Commands

Ensure Hugo (extended) is installed.

```sh
# Start local development server with hot reload (http://localhost:1313/)
hugo server

# Start development server including draft posts and future-dated posts
hugo server -D -F

# Generate static site into ./public
hugo

# Production minified build (must pass with 0 errors)
hugo --minify
```

---

## 3. How to Add a New Blog Post

All blog articles reside in `content/blog/`.

### Step 1: File Naming Convention
Always follow the date-slug format:
```
content/blog/YYYY-MM-DD-<slug>.md
```
*Example*: `content/blog/2026-10-15-web-standards-in-practice.md`

### Step 2: Front Matter
Every blog post must begin with YAML front matter:
```yaml
---
date: 2026-10-15
slug: web-standards-in-practice
title: "Web Standards in Practice"
authors: [kavi]
tags: [architecture, web-components, standards]
draft: false
---
```
* `date`: ISO date `YYYY-MM-DD`.
* `slug`: Matches the filename suffix and defines the URL `/blog/<slug>/`.
* `title`: Human-readable title.
* `authors`: Array of author keys (e.g., `[kavi]`).
* `tags`: Array of relevant topics (e.g., `[gofs, go, architecture, standards]`).
* `draft`: Set to `false` (or omit) for published posts; set to `true` if work-in-progress.

### Step 3: Summary Excerpt & `<!--more-->`
The opening paragraph serves as the summary teaser on the homepage (`/`) and the blog feed (`/blog/`). You **must** insert `<!--more-->` immediately after the first paragraph:

```markdown
Gofs is designed around the longevity of web standards. Instead of tying full-stack applications to ephemeral frameworks, we leverage native browser APIs and standard Go libraries.

<!--more-->

## The Core Philosophy
...
```

### Step 4: Markdown Formatting & Components
* **Headings**: Use `##` for top-level sections (do not use `#` inside content; `#` is reserved for the post title rendered by the template).
* **Code Blocks**: Always provide language hints: `go`, `html`, `sql`, `sh`, `yaml`.
* **Inline Web Components**: You can use native Web Components directly in Markdown:
  ```html
  <snice-badge variant="success">Recommended</snice-badge>
  <snice-card variant="bordered">
    Structured callout content
  </snice-card>
  ```

### Step 5: Verification
Always verify your post builds cleanly before submitting:
```sh
hugo --minify
```
Check that the post appears on the homepage blog section and `/blog/`.

---

## 4. How to Update Documentation

Documentation lives in `content/docs/`:
* `content/docs/_index.md`: Main docs landing page.
* `content/docs/start.md`: Getting started guide.
* Topic directories:
  * `content/docs/prerequisites/`
  * `content/docs/core/`
  * `content/docs/backend/`
  * `content/docs/frontend/`

When adding a new doc page, ensure it is linked in the sticky documentation sidebar:
* File: `layouts/partials/docs-sidebar.html`

---

## 5. Repository Structure

```
├── .github/workflows/
│   └── deploy.yaml         # GitHub Actions build & deploy to GitHub Pages
├── assets/
│   └── css/
│       └── style.css       # Global styles (processed by Hugo Pipes with minify & fingerprint)
├── content/
│   ├── _index.md           # Homepage metadata & copy
│   ├── blog/               # Markdown blog posts
│   ├── docs/               # Documentation sections
│   └── slides/             # Reveal.js markdown slide decks
├── layouts/
│   ├── _default/
│   │   ├── baseof.html     # HTML5 shell (nav, footer, head)
│   │   ├── list.html       # Generic list template
│   │   └── single.html     # Generic single page template
│   ├── blog/
│   │   ├── list.html       # /blog/ archive view
│   │   └── single.html     # /blog/<slug>/ post template
│   ├── docs/
│   │   ├── list.html       # Docs category view
│   │   └── single.html     # Docs article view with sidebar
│   ├── slides/
│   │   ├── list.html       # /slides/ presentations index
│   │   └── single.html     # /slides/<slug>/ Reveal.js standalone template
│   ├── shortcodes/
│   │   └── reveal.html     # {{< reveal src="..." >}} embed shortcode
│   ├── partials/
│   │   ├── head.html       # <head> meta, snice theme CSS, web components CDN
│   │   ├── header.html     # Main navbar
│   │   ├── footer.html     # Site footer
│   │   └── docs-sidebar.html # Docs navigation tree
│   └── index.html          # Product homepage
├── static/
│   ├── img/                # SVGs, favicons, logos, diagrams
│   ├── CNAME               # Custom domain config (gofs.dev)
│   └── .nojekyll           # Tells GitHub Pages not to invoke Jekyll
├── hugo.toml               # Hugo configuration (baseURL, menus, params)
└── AGENTS.md               # Agent instructions (this file)
```

---

## 6. How to Add a Slide Deck

Slide presentations are built using **Reveal.js** loaded via CDN (zero npm dependencies).

### Creating a Deck
Add a markdown file in `content/slides/<slug>.md`:
```markdown
---
title: "My Presentation"
layout: "slides"
outputs: ["HTML"]
---

# Slide 1
Opening slide content

---

## Slide 2
Horizontal transition

--

### Deep Dive
Vertical transition
```

### Embedding in Pages
Use the `reveal` shortcode:
```html
{{</* reveal src="/slides/my-slug/" title="My Talk" */>}}
```

---

## 7. Design System & Web Components
 
The website integrates the **Snice** component suite vendored locally in `static/vendor/snice/` and loaded in `layouts/partials/head.html`:
* Theme CSS: `/vendor/snice/theme.css`
* Components loaded:
  * `<snice-runtime>` (`/vendor/snice/snice-runtime.min.js`)
  * `<snice-badge>` (`/vendor/snice/snice-badge.min.js`)
  * `<snice-button>` (`/vendor/snice/snice-button.min.js`)
  * `<snice-card>` (`/vendor/snice/snice-card.min.js`)
  * `<snice-tag>` (`/vendor/snice/snice-tag.min.js`)
  * `<snice-terminal>` (`/vendor/snice/snice-terminal.min.js`)

All styles in `assets/css/style.css` consume snice design tokens (e.g., `var(--snice-color-surface)`, `var(--snice-spacing-md)`, `var(--snice-font-family)`). Maintain consistent dark-theme styling when adding new elements.


---

## 8. Deployment & GitHub Actions

* Static hosting: **GitHub Pages** with custom domain `https://gofs.dev`.
* GitHub Pages source in repository settings must be set to **GitHub Actions** (not "Deploy from a branch").
* Pipeline: `.github/workflows/deploy.yaml` runs Hugo on `ubuntu-latest` with native Node 24 actions and publishes `./public`.
* Always keep `static/CNAME` and `static/.nojekyll` present so Hugo outputs them to `public/`.
