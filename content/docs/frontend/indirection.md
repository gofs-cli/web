---
title: "Minimizing Indirection"
weight: 2
---

In web development, unnecessary indirection is one of the most common sources of code bloat, slow rendering, and maintenance headaches. 

In a gofs application, we keep indirection to a strict minimum: **prefer direct, readable HTML and CSS over layers of wrapper abstractions.**

---

## The Wrapper Anti-Pattern

Consider how a simple section heading is formatted. In traditional component-heavy frameworks, developers often wrap every standard element in a custom component:

```html
<!-- Anti-pattern: Unnecessary component wrapper -->
<app-heading text="New section" size="2xl" weight="extrabold"></app-heading>
```

Contrast this with direct, semantic HTML:

```html
<!-- Gofs standard: Direct, semantic HTML -->
<h2 class="section-heading">New section</h2>
```

### Why the Direct Approach Wins:
1. **Zero JavaScript Overhead**: The direct `<h2>` tag renders natively in microseconds with zero JavaScript parsing or execution. `<app-heading>` loads a script just to render what one line of HTML does natively.
2. **Transparency**: Anyone reading the template immediately knows it is an `<h2>` heading with a standard CSS class. With `<app-heading>`, developers must inspect the component's internal source code to understand what HTML tag it generates and how accessibility attributes are handled.
3. **Immunity to Scope Creep**: Wrapper components inevitably accumulate props (`size`, `weight`, `color`, `iconLeft`, `truncate`, `responsiveBreakpoint`) until they become monolithic, bloated micro-frameworks prone to breaking changes.

The same principle applies to Go server templates: avoiding `{{ template "heading" (dict "text" "Hello" "level" 2) }}` when a standard `<h2>Hello</h2>` is simpler and more readable.

---

## Why AI Changes the Abstraction Tradeoff

Historically, developers justified creating wrapper components and template macros because hand-typing repetitive HTML attributes and CSS classes felt tedious and prone to typos.

**Modern AI coding assistants have eliminated this justification:**
- AI tools can generate, update, and refactor semantic HTML elements and CSS classes across an entire project in seconds.
- AI excels at reading transparent, flat HTML/CSS structures far better than navigating deeply nested, proprietary component wrapper hierarchies.
- You no longer need to sacrifice readability or introduce runtime abstractions just to save keystrokes.

---

## When Does a Web Component Earn Its Place?

A Web Component earns its place in a gofs project when it introduces **behavior**, not mere decoration:
- It fetches or submits data asynchronously in the background.
- It intercepts form submissions to provide optimistic updates.
- It manages interactive UI state (e.g. accordion toggles, dropdowns, drag-and-drop).
- It provides strict style encapsulation via Declarative Shadow DOM for a complex embedded widget.

If a component only arranges static HTML and applies a CSS class, **it should not be a component**. Keep it as plain HTML and CSS.


