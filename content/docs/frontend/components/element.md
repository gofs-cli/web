---
title: "Writing a Component"
weight: 2
---

## Folder Organization

Every custom component lives in its own dedicated folder under `/internal/ui/components`, named to match the custom element's tag name.

```
root
|--internal
|  |--ui
|     |--components
|        |--todo-list
|           |--element.js
|           |--element.css      // Optional, only needed for shadow DOM components
```

The layout's island loader automatically imports `/components/<tag-name>/element.js` for any custom element detected on the page. You do not need to register components in a central JavaScript registry.

---

## Pattern 1: Light DOM Island (Recommended for Most In-Page Features)

Let's examine the `<todo-list>` island from our application example. 

The Go server renders the existing items and a standard `<form>` directly inside the element. When the component's JavaScript connects, it reads the server-rendered items from the DOM and intercepts form submissions to update the UI dynamically without reloading the page.

Create `/internal/ui/components/todo-list/element.js`:

```js
// @ts-check
import { LitElement, html } from "lit";
import { Task, TaskStatus } from "@lit/task";

export class TodoList extends LitElement {
  static properties = {
    listId: { attribute: "list-id" },
    items: { state: true },
  };

  // Render into the Light DOM so global app.css styles apply directly
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    // Read the server-rendered initial HTML before the first Lit render
    this.items = [...this.querySelectorAll("li")].map((li) => li.textContent ?? "");
    super.connectedCallback();
  }

  // Handle data submission with Task
  _add = new Task(this, {
    autoRun: false,
    task: async ([item], { signal }) => {
      const res = await fetch(`/list/${this.listId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams({ "todo-list-item": item }),
        signal,
      });
      if (!res.ok) throw new Error(await res.text());
      this.items = (await res.json()).items;
    },
  });

  _submit(e) {
    e.preventDefault();
    const form = e.target;
    this._add.run([form.elements["todo-list-item"].value]);
    form.reset();
  }

  render() {
    return html`
      <ul>
        ${this.items.map((item) => html`<li>${item}</li>`)}
      </ul>
      <form method="post" action=${`/list/${this.listId}`} @submit=${this._submit}>
        <input name="todo-list-item" required />
        <button ?disabled=${this._add.status === TaskStatus.PENDING}>Add Item</button>
      </form>
      ${this._add.render({ error: (e) => html`<p class="error">${e.message}</p>` })}
    `;
  }
}

customElements.define("todo-list", TodoList);
```

### Key Elements of the Light DOM Island:
1. **`createRenderRoot() { return this; }`**: Renders into the light DOM, allowing classes from `/internal/server/assets/app.css` to style the component effortlessly.
2. **`connectedCallback()`**: Hydrates initial state from the server-rendered HTML. Because the server already rendered the list, the user experiences zero visual jump or content layout shift.
3. **`_add = new Task(...)`**: The Task controller from `@lit/task` manages loading, success, and error states cleanly without external state management libraries.
4. **Progressive Fallback**: Notice that the form specifies a valid `method="post"` and `action`. If the user submits before the JavaScript finishes downloading, the browser simply falls back to a standard form submission.

---

## Pattern 2: Declarative Shadow DOM (DSD) Island

When an island requires **strict style encapsulation** or uses native `<slot>` elements to project user content into a private template, use Declarative Shadow DOM.

### 1. The Server Template (`/internal/ui/pages/users/index.html`)

The Go template emits the shadow root directly using `<template shadowrootmode="open">`:

```html
<user-profile user-id="{{ .User.ID }}">
  <template shadowrootmode="open">
    <style>
      :host {
        display: block;
        padding: 1.5rem;
        background: var(--color-surface, #fff);
        border-radius: var(--radius, 8px);
        box-shadow: var(--shadow-sm);
      }
      .badge {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-primary);
      }
      h3 { margin: 0.5rem 0; }
    </style>
    <div class="profile-card">
      <span class="badge">{{ .User.Role }}</span>
      <h3>{{ .User.Name }}</h3>
      <slot></slot>
    </div>
  </template>

  <!-- Light DOM content projected into <slot> -->
  <p class="user-bio">{{ .User.Bio }}</p>
</user-profile>
```

### 2. The Lit Component (`/internal/ui/components/user-profile/element.js`)

In Lit, the default `createRenderRoot()` behavior creates or attaches to a shadow root. When Declarative Shadow DOM is emitted by the server, Lit **automatically adopts the existing server-rendered shadow root**:

```js
// @ts-check
import { LitElement, html, css } from "lit";

export class UserProfile extends LitElement {
  static properties = {
    userId: { attribute: "user-id" },
    expanded: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      padding: 1.5rem;
      background: var(--color-surface, #fff);
      border-radius: var(--radius, 8px);
      box-shadow: var(--shadow-sm);
    }
    .badge {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-primary);
    }
    h3 { margin: 0.5rem 0; }
    button { margin-top: 1rem; cursor: pointer; }
  `;

  render() {
    return html`
      <div class="profile-card">
        <slot></slot>
        <button @click=${() => this.expanded = !this.expanded}>
          ${this.expanded ? "Show Less" : "Show More"}
        </button>
        ${this.expanded ? html`<p class="extra-info">Active user since 2024</p>` : ""}
      </div>
    `;
  }
}

customElements.define("user-profile", UserProfile);
```

### Why Declarative Shadow DOM Wins:
- **No Client Hydration Delay**: Browsers render the encapsulated shadow tree instantly during HTML parsing, with no Flash of Unstyled Content (FOUC).
- **Style Isolation**: Styles defined inside the shadow root cannot leak into other parts of the page, making complex interactive widgets completely safe from unintended side effects.
- **Native Standard**: Supported natively across all modern browser engines without JavaScript polyfills.

---

## Communicating Between Islands: DOM Events

When two islands on a page need to communicate (e.g. adding a todo item updates a summary counter elsewhere on the page), **dispatch standard DOM events** instead of introducing a global state manager:

```js
// Inside <todo-list>:
this.dispatchEvent(
  new CustomEvent("item-added", {
    bubbles: true,
    composed: true, // Allows the event to cross shadow DOM boundaries
    detail: { listId: this.listId, itemCount: this.items.length }
  })
);
```

Other components or top-level scripts can listen for this event with native `window.addEventListener("item-added", ...)` or in Lit with `@item-added=${this._onItemAdded}`.

---

## Type Safety Without a Build Step

Add `// @ts-check` at the very top of each `element.js` file.

When using VSCode or an LSP-equipped editor, TypeScript's type checker verifies your component code against the vendored Lit type definitions located in `/internal/server/assets/vendor/`—providing complete compile-time type validation with **zero build step and zero npm packages**.

---

## AI-Assisted Component Authoring

Because Lit adheres directly to the W3C Web Components standard and plain ES modules, AI coding assistants can generate, refactor, and test full components accurately on demand. You can ask an AI assistant:

> *"Generate a Lit web component island `<item-filter>` that takes a `category` attribute, renders an input with `@input` debouncing, and dispatches an `item-filter-changed` event."*

The resulting component will be standard, clean, and immediately functional without any framework-specific setup or toolchain dependencies.


