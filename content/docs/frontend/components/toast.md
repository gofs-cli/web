---
title: "Toast"
weight: 5
---

# Toast

A toast shows a short message and goes away. Most of a toast is HTML and CSS; a small component adds the timer.

## Server-rendered

After a plain form submission, the handler redirects. Pass a message in the query string and let the page render it:

```html
{{ if .Message }}
<app-toast role="status">{{ .Message }}</app-toast>
{{ end }}
```

The toast is visible as soon as the page renders, before any JavaScript. The component only removes it after a delay.

Create `/internal/ui/components/app-toast/element.js`:

```js
import { LitElement } from "lit";

export class AppToast extends LitElement {
  static properties = { timeout: { type: Number } };

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => this.remove(), this.timeout ?? 5000);
  }
}

customElements.define("app-toast", AppToast);
```

The component has no `render` method; the server-rendered text is the content.

## From a component

An island can show a toast by adding the element to the page:

```js
const toast = document.createElement("app-toast");
toast.textContent = "Item added";
document.body.append(toast);
```

## Styling

```css
app-toast {
  position: fixed;
  inset-block-end: var(--space-4);
  inset-inline-end: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  background: var(--color-surface-raised);
  box-shadow: var(--shadow);
  animation: toast-in 200ms ease-out;
}

@keyframes toast-in {
  from {
    translate: 0 1rem;
    opacity: 0;
  }
}
```


