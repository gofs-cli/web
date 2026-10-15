# CLAUDE.md

This file provides guidance when working with code in this repository.

## What this is

The product landing page, documentation, and blog site for **gofs** (https://gofs.dev), a lightweight CLI and architecture for evergreen full-stack Go web applications. 

The site is built with **Hugo** using the **snice.dev** design system and native Web Components via CDN with zero npm dependencies and zero JavaScript build steps. The gofs CLI itself lives in a separate repository (github.com/gofs-cli/gofs).

## Commands

```sh
hugo server         # local development server with hot reload (http://localhost:1313)
hugo server -D      # dev server including draft posts
hugo                # build static site into ./public
hugo --minify       # production minified build into ./public
```

There are no Node.js, npm, or bundler dependencies.

## Structure

- **Content** (`content/`):
  - `_index.md`: Homepage content and metadata.
  - `blog/`: Articles written in markdown with `slug`, `title`, `date`, `authors`, and `tags` front matter. Summaries are separated with `<!--more-->`.
  - `docs/`: Reference documentation and philosophy guides.
- **Theme & Layouts** (`layouts/`):
  - `index.html`: Product landing page featuring philosophy cards, architecture blueprint, quick start, and blog feed.
  - `_default/baseof.html`: Base HTML5 shell with header and footer partials.
  - `blog/`: List and single post templates.
  - `docs/`: Two-column documentation layout with sticky sidebar navigation.
  - `partials/`: Header, footer, head, and doc sidebar partials.
- **Assets** (`assets/`):
  - `css/style.css`: Minimal CSS layout rules powered directly by snice.dev design tokens and dark theme.
- **Static files** (`static/`):
  - `img/`: SVG logos, icons, and blog images.
  - `CNAME`: Domain configuration (`gofs.dev`).
  - `.nojekyll`: GitHub Pages bypass file.

## Deployment

`.github/workflows/deploy.yaml` builds the static site with Hugo and deploys `./public` to GitHub Pages on pushes to `main`.
