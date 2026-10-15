---
title: "IDE (optional)"
weight: 4
---

# IDE (optional)

Gofs comes with a language server compliant with
[Language Server Protocol](https://microsoft.github.io/language-server-protocol/).

```bash
gofs lsp
```

## VSCode extension

A [VSCode extension](https://marketplace.visualstudio.com/items?itemName=gofs-cli.gofs-vscode) is available for gofs. It lets you navigate from a route literal such as `"/list"` in a Go handler, an HTML template or a component's JavaScript to the matching entry in `routes.go`.

Search for _gofs_ in VSCode extensions and install it.

> **Tip:** To type-check component JavaScript without a build step, add `// @ts-check` at the top of the file. VSCode's built-in TypeScript support will then check the file against the Lit type definitions that gofs vendors alongside the library.
## Neovim

Neovim lsp install instructions are [here](https://neovim.io/doc/user/lsp.html)


