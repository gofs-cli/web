# Gofs Website

The product landing page, documentation, and blog for [gofs](https://gofs.dev).

Built with [Hugo](https://gohugo.io/) and native Web Components loaded via CDN. Zero npm dependencies, zero Node.js, and zero JavaScript build steps.

## Local Development

Ensure you have [Hugo](https://gohugo.io/installation/) installed.

```sh
# Start the local development server with hot-reload
hugo server
```

The site will be available at `http://localhost:1313/`.

## Build

```sh
# Generate minified static content into ./public
hugo --minify
```
