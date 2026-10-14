---
sidebar_position: 1
---

# Overview & Philosophy

**Gofs** (Go Full Stack) is a lightweight architectural template and CLI for building evergreen web applications. The server is written in Go using only the standard library. Pages are rendered on the server with Go's `html/template`. Interactivity is delivered through small, standards-based web components written with [Lit](https://lit.dev). Data lives in PostgreSQL and is queried with plain SQL through [sqlc](https://sqlc.dev).

Gofs is designed around a single guiding premise: **minimize runtime dependencies and build on stable, backward-compatible standards.** It leverages Go's backward compatibility promise on the server and the web platform's permanence in the browser to deliver applications that remain maintainable for decades without relentless upgrade churn.

---

## The Evolution of Gofs

### The Original Vision: Escaping Heavy JS Frameworks

Gofs originally set out to solve a pervasive problem in modern software engineering: the suffocating complexity of heavy single-page application (SPA) JavaScript frameworks (React, Angular, Vue, Next.js). The original stack combined **Go**, **templ**, **htmx**, and **Tailwind**.

The goal was noble: run a Go backend, generate HTML via templ, add dynamic behavior using htmx, and style with utility CSS, freeing developers from managing massive client-side state stores, client routers, and heavy npm build pipelines.

### What Changed: The Modern Landscape

While that initial stack proved that server-driven web apps could replace complex SPAs, real-world experience and rapid shifts in the technology landscape revealed new opportunities to eliminate even more friction and fragility:

1. **`sqlc` Bundles Zero Runtime Dependencies**:
   Traditional ORMs (and custom struct-based CRUD generators) introduce heavy runtime abstractions, reflection overhead, and proprietary query DSLs that inevitably break over time. `sqlc` changed the game by compiling raw, standard SQL into type-safe Go code that depends solely on the Go standard library's `database/sql`. It is a development tool, not a runtime dependency.

2. **Web Components & Declarative Shadow DOM (DSD)**:
   Browser standards evolved significantly. Custom Elements are universally supported in every browser engine without polyfills. Crucially, **Declarative Shadow DOM (`<template shadowrootmode="open">`)** is now Baseline Widely Available across all major browsers. DSD allows the Go server to output encapsulated shadow roots directly in server-rendered HTML. Components gain true style and DOM encapsulation with zero client-side JavaScript execution required for initial render and zero layout shift.

3. **Lit as a Standards-Based Micro-Library**:
   Rather than attempting to force "Go everywhere" or stretching HTML attributes into an ad-hoc client application, modern web standards provide custom elements. [Lit](https://lit.dev) provides a featherweight (~5 KB) reactive layer on top of native Custom Elements, adding reactive properties and tagged template literals (`html`\``...`\``). Lit requires no bundler, no compile step, and zero proprietary framework runtime. It vendors as a single file, serves directly from the Go binary, and natively hydrates Declarative Shadow DOM rendered by Go templates.

4. **AI Eliminates the "Cumbersome HTML" Penalty**:
   Historically, developers justified complex template DSLs (such as `templ` or JSX) or heavy framework abstractions because hand-authoring raw HTML, repetitive form structures, and Go's `html/template` blocks felt verbose and cumbersome. 

   Today, **AI coding assistants have completely inverted this dynamic**. AI excels at generating, refactoring, and verifying standard HTML, modern CSS, SQL, and standard Go templates because web standards and the Go standard library have vast, consistent, stable documentation spanning decades. You no longer need to adopt a bespoke template compiler or a complex framework just to save keystrokes: AI writes the standard boilerplate, and your codebase remains clean, transparent, and dependency-free.

---

## Why Managing Dependencies Increases the Maintenance Burden

In modern software engineering, adding a dependency is often treated as "free functionality." In reality, every external runtime dependency is an ongoing liability.

```
┌─────────────────────────────────────────────────────────────┐
│                   The Dependency Tax                        │
│                                                             │
│  [ New Dependency ] ──► [ Transitive Tree Explodes ]        │
│                               │                             │
│                               ▼                             │
│                     [ Security Advisories ]                 │
│                               │                             │
│                               ▼                             │
│                      [ Breaking Changes ]                   │
│                               │                             │
│                               ▼                             │
│                    [ Costly Upgrade Cycles ]                │
│                               │                             │
│                               ▼                             │
│              80% Time Spent "Standing Still"                │
└─────────────────────────────────────────────────────────────┘
```

### The Upgrade Treadmill & "Standing Still" Costs

When an application relies on heavy third-party frameworks and deep dependency trees, engineering teams quickly find themselves trapped on an upgrade treadmill. Minor and major updates regularly introduce breaking changes, deprecate APIs, or shift underlying paradigms (e.g., Python 2 to 3, .NET Framework to Core, AngularJS to Angular 2+, React Class Components to Hooks to Server Components).

Organizations frequently spend **60% to 80% of their engineering capacity simply "standing still"**—resolving dependency conflicts, patching deprecations, updating bundlers, and fixing broken builds—leaving only a fraction of their budget for delivering actual business value. When budgets tighten and upgrades are deferred, technical debt compounds until systems become unmaintainable legacy anchors.

### Breaking Changes & Ecosystem Volatility

Open-source libraries evolve, pivot, or get abandoned. A framework maintainer may redesign their routing system or state model, forcing every downstream project into a painful rewrite. A custom compiler toolchain (such as an external template language) may lag behind new language releases or alter its syntax, blocking compiler upgrades.

By contrast, code written against rock-solid standards does not suffer from ecosystem volatility. A Go standard library HTTP handler or a standard HTML `<form>` written ten years ago works just as reliably today, without modification.

### Supply Chain Attacks: The Deep Dependency Danger

The modern software supply chain has become a primary attack vector. Incidents involving typosquatting, compromised maintainer credentials, malicious post-install scripts, protestware, and dependency confusion exploit ecosystems with deep, uncontrolled dependency graphs.

A typical single-page application using npm frequently pulls in **thousands of transitive packages** (`node_modules`) written by thousands of anonymous contributors. Every single package in that chain runs code with full developer or runtime permissions.

Gofs combats this at the architectural root:
- **No Node.js, npm, or Bundlers**: A gofs project contains no `package.json` and no `node_modules`.
- **Zero Runtime Dependencies**: The Go backend depends only on Go's standard library. Even the database layer (`sqlc`) produces plain `database/sql` code with zero third-party runtime dependencies.
- **Vendored, Checksummed Client Assets**: The only browser libraries used (Lit and its Task controller) are vendored as single static files, pinned, and checksummed in `.gofs/vendor.json`, served directly from the embedded Go binary with immutable cache headers.

Eliminating third-party runtime dependencies shrinks the software attack surface to near zero.

---

## The Solution: Stable Standards & Backward Compatibility

### Go's Backward Compatibility Promise

Go was engineered from its inception for long-term software engineering at scale. The **Go 1 Compatibility Promise** guarantees that any program written for Go 1 will compile and run correctly on any future Go 1.x release.

By building the entire server with Go's standard library (`net/http`, `html/template`, `database/sql`, `crypto/rand`, `embed`), a gofs application inherits this guarantee. You can upgrade the Go compiler to capture security fixes, performance enhancements, and platform optimizations without fearing that your application's routing, templating, or database code will break.

### The Web Platform: "Don't Break the Web"

The browser is the most backward-compatible runtime environment in human history. The fundamental principle of the W3C and WHATWG web standards bodies is **"Don't break the web."** An HTML page or custom script written in 1995 still renders and executes in Chrome, Firefox, Safari, and Edge today.

Gofs grounds its frontend architecture directly in web standards:
- **Custom Elements**: The browser's native component standard. Components are isolated, interoperable, and recognized directly by the DOM.
- **Declarative Shadow DOM (DSD)**: Native server-side rendering for encapsulated components (`<template shadowrootmode="open">`), combining server performance with client-side component encapsulation.
- **Native HTML Controls**: We reach for `<form>`, `<dialog>`, `<button>`, and semantic HTML before reaching for JavaScript.
- **Modern CSS Baseline**: Modern CSS provides nesting, cascade layers, CSS custom properties (variables), and container queries natively. There is no need for CSS preprocessors, PostCSS, or bundler configurations.
- **Baseline Policy**: Gofs adheres to the [Web Baseline](https://web.dev/baseline) standard. *Widely available* features are used freely, *Newly available* features include graceful fallbacks, and *Limited availability* features require explicit justification.

```
┌─────────────────────────────────────────────────────────────┐
│                 The Gofs Evergreen Stack                    │
│                                                             │
│   SERVER: Go Standard Library (Go 1 Compatibility Promise)  │
│   DATABASE: sqlc (Plain SQL ──► database/sql, 0 Runtime)    │
│   TEMPLATES: html/template + Declarative Shadow DOM (DSD)   │
│   FRONTEND: Web Components (Custom Elements) + Lit (~5 KB)  │
│   STYLING: Modern Baseline CSS (Nesting, Variables, Layers) │
│   TOOLING: AI-Assisted, Zero Build Step, Zero npm           │
└─────────────────────────────────────────────────────────────┘
```

---

## Development Tools vs. Runtime Dependencies

To maintain a lean codebase without sacrificing developer productivity, gofs strictly distinguishes between **runtime dependencies** and **development tools**:

| Category | Definition | Gofs Policy |
| :--- | :--- | :--- |
| **Runtime Dependency** | Code that compiles into your binary or ships to user browsers. | Kept as close to **zero** as possible. Must be small, stable, and built on backward-compatible standards. |
| **Development Tool** | Tools that run during development or CI to generate code (e.g. `gofs`, `sqlc`). | Allowed under one golden rule: **The output must be plain, readable code that continues working even if the tool disappeared tomorrow.** |

Under this rule:
- **`sqlc` is accepted**: It parses SQL and writes plain Go standard library `database/sql` code. The generated code is committed to your repository. Your app builds and runs without `sqlc` installed.
- **`templ` was replaced**: `templ` generated code that depended on an external `templ` runtime library in your binary. If the generator fell behind, the app broke.
- **JavaScript bundlers are rejected**: An app that cannot run without a bundler depends on that bundler at every build forever, bringing along the entire npm ecosystem and its vulnerabilities.

---

## The Role of AI in Evergreen Architecture

For decades, software development followed a recurring cycle: languages and standard libraries were deemed "too verbose," so developers created frameworks and DSLs to abbreviate common tasks. But those frameworks inevitably aged, introduced breaking changes, and accumulated technical debt.

Today, **generative AI and LLM coding assistants break this cycle permanently**:

1. **Standard Code is AI's Native Language**:
   AI coding assistants are trained on decades of standard HTML, CSS, SQL, and standard Go code. They generate standard code with near-perfect accuracy and minimal hallucinations because the specifications are stable and universally documented. Conversely, niche template DSLs and rapidly churning framework APIs frequently confuse AI models.

2. **Zero-Abstraction Velocity**:
   Writing server-rendered Go `html/template` layouts, repetitive form inputs, or Declarative Shadow DOM structures no longer requires typing hundreds of characters by hand. AI assistants generate and update boilerplate in seconds.

3. **Longevity Without Ergonomic Compromise**:
   You get the best of both worlds: the ultra-fast development speed previously promised by high-level frameworks, combined with the rock-solid, evergreen stability of standard Go, standard SQL, and native web standards.

---

## Summary

Gofs is not another framework; it is an architectural mindset. By rejecting the dependency treadmill, anchoring your server in Go's standard library, querying with plain SQL via `sqlc`, leveraging Web Components and Declarative Shadow DOM, and utilizing AI to write clean, standard code, you build systems that:

- **Never break on toolchain upgrades**
- **Have zero supply chain vulnerabilities from third-party package managers**
- **Eliminate costly "standing still" maintenance cycles**
- **Deliver maximum performance and simplicity for developers and end users alike**
