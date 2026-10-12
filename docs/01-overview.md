---
sidebar_position: 1
---

# Overview

Gofs (Go Full Stack) is a lightweight Go module template for building web apps. The server is written in Go using only the standard library. Pages are rendered on the server with Go's `html/template`. Interactivity is added with small, standards-based web components written with [Lit](https://lit.dev). Data lives in Postgres and is queried with plain SQL through [sqlc](https://sqlc.dev). The gofs cli scaffolds the project, and includes reusable middleware, components and productivity tools to streamline development.

Gofs is designed with minimal dependencies. It leverages Go's stability and standard library on the server, and the browser's own component model on the client, providing best-practice code as a starting point.

# Philosophy

### Tackling Volatility

Modern development is burdened by fast-changing technologies. Upgrades in frameworks (e.g. .NET Framework to Core) and languages (e.g. Python 2 to 3) can force costly rewrites. Gofs avoids this by relying on technologies with a backward-compatibility commitment: Go on the server, and the web platform itself in the browser. Browsers do not break the web; a custom element written today will run unchanged in browsers for decades.

### Minimizing dependencies

Excessive dependencies introduce security risks and compatibility issues. Gofs keeps the stack lean, eliminating [dependency hell](https://en.wikipedia.org/wiki/Dependency_hell) common in ecosystems like Node.js. A gofs app has no Node.js, no npm and no bundler. The two small browser libraries it uses (Lit and its Task controller) are vendored into the app and served from the Go binary.

Gofs distinguishes between _runtime dependencies_ and _development tools_. Runtime dependencies ship in your binary or to your users' browsers, and are counted and kept as close to zero as possible. Development tools such as gofs itself and sqlc are pinned with Go's tool directive, and are judged by one rule: their output must be plain code that would keep working if the tool disappeared tomorrow.

### Avoiding Bloated Frameworks

Frameworks often become bloated, hiding simple logic behind complex abstractions. They obscure core principles, leading developers—particularly juniors—to rely on abstractions rather than learning core concepts. Often the code they hide is simple to write, and by writing the code, a developer can include only the parts of code they need while maintaining full control and understanding of the codebase.

This is why gofs apps are written in Go, HTML, CSS, SQL and JavaScript, and not in a framework's dialect of them. Lit is a library, not a framework: it has no router, no state store and no data layer, and its templates are plain JavaScript that needs no compile step.

### Standards First

The browser is the most backward-compatible runtime there is, but only if you use what it provides. Gofs apps start with HTML and CSS, use native elements such as `<form>` and `<dialog>` before reaching for JavaScript, and add JavaScript as small _islands_ inside server-rendered pages rather than as a single page application. To decide which browser features to use, gofs follows the [Baseline](https://web.dev/baseline) status: _Widely available_ features are used freely, _Newly available_ features are used with a fallback, and _Limited availability_ features need a strong reason.

# Gofs

Gofs is a response to these problems. It is more than a template or toolset—it's a mindset that empowers developers to continuously learn and write beautiful code.
