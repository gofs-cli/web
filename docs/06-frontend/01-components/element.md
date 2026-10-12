---
sidebar_position: 2
---

# Writing a Component

## Folders

Each component lives in its own folder under `/internal/ui/components`, named after its tag. The folder contains `element.js` and, if the component needs styles of its own, `element.css`.

```
root
|--internal
|  |--ui
|     |--components
|        |--todo-list
|           |--element.js
|           |--element.css
```

The layout's loader script imports `/components/<tag>/element.js` for every custom element it finds on the page, so a component needs no registration beyond this folder.

## Example

Lets write the `<todo-list>` island from the [page](../page) example. The server renders the list items and a plain form inside the element. The component reads the items from that HTML when it connects, and takes over the form so that adding an item updates the list in place instead of reloading the page.

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

  // Render into the page, not a shadow root, so app.css applies.
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    // Read the initial state from the server-rendered HTML.
    this.items = [...this.querySelectorAll("li")].map((li) => li.textContent);
    super.connectedCallback();
  }

  // Submits a new item. Runs only when asked (autoRun: false).
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

Walking through it:

- `static properties` declares the reactive properties. `listId` is read from the `list-id` attribute the server set; `items` is internal state. Changing either re-renders the component.
- `createRenderRoot` returns the element itself, so the component renders into the page (see [light DOM](./best-practice#light-dom-by-default)).
- `connectedCallback` runs when the element is added to the page, before Lit's first render. It reads the items the server already rendered, so the first render shows the same thing and nothing flashes.
- `_add` is a [Task](./data): the component's one request, with its pending, complete and error states managed for us.
- `render` returns the same markup the server rendered. The `action` attribute is kept so the form still works as a form; `@submit` takes over when JavaScript is present. The button is disabled while the request is pending, and an error from the handler is shown beneath the form.

:::tip
`// @ts-check` at the top of the file turns on type checking in VSCode with no build step.
:::

:::info
Note what the component does not do. It does not check that the list has fewer than 20 items; the backend does, and the handler returns the error. It does not know about other lists or the "Add List" form. It does not import anything but Lit.
:::

## Styles

Put styles for a component in the app stylesheet, scoped to its tag:

```css
todo-list {
  display: block;

  .error {
    color: var(--color-danger);
  }
}
```

Only when a component renders into a shadow root does it need its own `element.css`.

## Events

When a component needs to tell the page something, dispatch an event:

```js
this.dispatchEvent(new CustomEvent("item-added", { bubbles: true, detail: { listId: this.listId } }));
```

The page, or another island, can listen for it with `addEventListener`. This keeps islands independent of each other.
