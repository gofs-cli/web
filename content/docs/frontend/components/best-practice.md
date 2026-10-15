---
title: "Best Practice"
weight: 1
---

Building frontend features in gofs follows a simple philosophy: **leverage web standards, keep dependencies close to zero, and let the server do what the server does best.**

---

## 1. HTML and CSS First

Always start with standard HTML and modern CSS before reaching for JavaScript:
- **Native Elements**: Use the browser's native `<dialog>` for modals, `<details>`/`<summary>` for disclosures, and `<form>` with standard `method="post"` for data submissions.
- **Modern CSS Baseline**: Modern CSS features—such as CSS nesting, `:has()`, custom properties (variables), cascade layers, and container queries—are Baseline Widely Available. You can handle conditional UI styling, responsive layouts, and animations directly in CSS without JavaScript state toggles or CSS-in-JS runtimes.

```css
/* Example: toggle visibility using pure CSS without JavaScript */
.form-group:has(input[type="checkbox"]:checked) .extra-fields {
  display: block;
}
```

---

## 2. Islands, Not Monolithic SPAs

In a gofs application, the Go server owns the document and renders complete HTML pages. JavaScript is added strictly as **islands**: isolated custom elements placed in the page to handle specific interactive tasks (e.g., live search, autocomplete, optimistic list updates).

- **Strict Component Scope**: An island owns only its internal markup and behavior. It does not dictate page routing, body layout, or global application state.
- **Decoupled Communication**: If two islands need to communicate, they dispatch standard DOM events (`CustomEvent`) with bubbling enabled. Never introduce a global JavaScript state store (such as Redux or Pinia).
- **Question Every Island**: Before creating an island, ask: *Can this interaction be accomplished with a standard `<form>` submission and a server redirect?* Frequently, the native form pattern is simpler, faster, and more accessible.

---

## 3. Web Components & Lit: Standards, Not Frameworks

Islands are built on the W3C [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) standard (Custom Elements). 

Gofs uses [Lit](https://lit.dev) to author web components because:
- **Zero Build Step**: Lit templates (`html`\``...`\``) are standard tagged template literals in plain JavaScript. They run directly in browsers without compilers, Babel, or JSX transpilers.
- **Ultra-Lightweight**: Lit adds minimal overhead (~5 KB gzipped) solely for reactive property observation and efficient DOM diffing.
- **Standard-Aligned**: Lit components extend `LitElement` (which inherits from the browser's native `HTMLElement`). If you ever choose to remove Lit, your component is just a few lines away from a pure vanilla Custom Element.
- **No Framework Lock-In**: Lit has no opinion on routing, data layers, or backend architecture. It does not try to take over your application.

---

## 4. Light DOM vs. Declarative Shadow DOM (DSD)

Gofs provides first-class support for both Light DOM and Declarative Shadow DOM patterns:

### Use Light DOM by Default for In-Page Controls
When an island is an integral part of the page and should inherit the global typography, spacing, and theme colors defined in `/internal/server/assets/app.css`, render into the **Light DOM**:

```js
export class TodoList extends LitElement {
  // Render directly into the light DOM
  createRenderRoot() {
    return this;
  }
}
```

### Use Declarative Shadow DOM for Encapsulated Widgets
When a component requires strict style encapsulation (guaranteeing that global styles cannot distort internal layout, or that component styles cannot leak out) or uses `<slot>` projection, use **Declarative Shadow DOM (DSD)**.

With DSD, the Go server emits `<template shadowrootmode="open">` directly in the page HTML:

```html
<user-badge role="{{ .Role }}">
  <template shadowrootmode="open">
    <style>
      :host { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 4px; }
    </style>
    <slot></slot>
  </template>
  <span>{{ .UserName }}</span>
</user-badge>
```

Lit automatically recognizes and attaches to the server-rendered Declarative Shadow DOM root without re-rendering or causing layout shifts.

---

## 5. Progressive Enhancement

Every island should be resilient:
1. **Server Renders Initial Content**: The Go template renders the complete initial state (including lists, items, and fallback forms).
2. **Immediate Usability**: Users can see the content and submit forms immediately upon page load, even before JavaScript finishes downloading or if network requests fail.
3. **Smooth Upgrade**: When the component's JavaScript module executes, it reads its initial state from the DOM and progressively enhances the experience with background `fetch` calls and instant feedback.

---

## 6. Zero Business Logic in the Client

A web component is responsible for three tasks:
1. Collecting user input
2. Submitting requests to the server
3. Rendering the server's response

**Components do not determine validation rules, permissions, or domain state.** All business logic resides in Go backend packages (`/internal/app/...`). If an item cannot be added because a list is full, the Go backend returns an HTTP 400 error, and the component renders the error message returned by the server.

---

## 7. Zero npm: Immunizing Against Supply Chain Attacks

Managing an `npm` ecosystem introduces severe maintenance overhead, breaking changes, and supply chain vulnerabilities. A single dependency often imports hundreds of transitive packages, opening your build pipeline and runtime to typosquatting, compromised maintainer credentials, and malicious scripts.

In gofs:
- **No `package.json`**: There is no Node.js runtime, no npm CLI, and no `node_modules` directory in your project.
- **Vendored Standard ES Modules**: Lit and `@lit/task` are vendored as single, pinned ES modules into `/internal/server/assets/vendor/` with cryptographically verified checksums in `.gofs/vendor.json`.
- **Embedded & Cache-Busted**: Static assets are embedded directly into the compiled Go binary using `//go:embed` and served with immutable content hashes.

---

## 8. AI-Accelerated Development

Writing semantic HTML, CSS rules, and Web Component boilerplate was once considered more tedious than using monolithic framework scaffolding.

Today, **modern AI coding tools eliminate this friction entirely**. AI excels at generating and refactoring standard Web Components, modern CSS, and Go templates because they adhere to stable, open specifications. You achieve the velocity of a modern frontend framework without any of the architectural baggage, breaking updates, or supply chain exposure.

---

## 9. Baseline Compliance

Follow the [Web Baseline](https://web.dev/baseline) policy:
- **Widely Available**: Features supported across all major browser engines for over 30 months (e.g., Custom Elements, CSS Nesting, `<dialog>`, Declarative Shadow DOM) are used freely.
- **Newly Available**: Features supported in all recent browsers but newer than 30 months are used with simple progressive fallbacks.
- **Limited Availability**: Experimental browser features should be avoided unless strictly necessary.

---

## 10. Security: Never Use `unsafeHTML`

Lit's tagged template literal `html`\``...`\`` automatically sanitizes and contextually escapes all interpolated dynamic expressions, mirroring the security guarantees of Go's `html/template`. 

Never use Lit's `unsafeHTML` directive. If dynamic HTML needs to be rendered, structure it on the server using Go templates where it can be validated and escaped safely.


