---
sidebar_position: 3
---

# Styling (optional)

Gofs apps are styled with plain CSS. The template ships with a single stylesheet at `/internal/server/assets/app.css` that uses modern, [widely available](https://web.dev/baseline) CSS features: custom properties for colours and spacing, nesting, cascade layers and container queries. There is nothing to install and nothing to compile.

## Tailwind

If your team prefers [Tailwind](https://tailwindcss.com), use the [standalone Tailwind CLI](https://tailwindcss.com/blog/standalone-cli). It is a single binary with no Node.js dependency. Download it to your project (or put it on your PATH), and add a Makefile target to compile your stylesheet:

```makefile
css:
	./tailwindcss -i ./internal/server/assets/app.css -o ./internal/server/assets/app.min.css --minify
```

:::warning
Do not add Tailwind through npm. A `package.json` in a gofs app is the first step towards the dependency problems gofs is designed to avoid.
:::
