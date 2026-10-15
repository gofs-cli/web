---
title: "Loading Data"
weight: 3
---

# Loading Data

Components talk to the server with `fetch`. Lit's [Task](https://lit.dev/docs/data/task/) controller wraps a fetch in the three states every request has (pending, complete, error), re-runs it when its inputs change, discards the result of a request that has been superseded, and gives you an `AbortSignal` to cancel it. It is the only data library a gofs app has.

## Fetching on load

A Task with `args` runs automatically when the component first renders and again whenever an argument changes.

```js
import { LitElement, html } from "lit";
import { Task } from "@lit/task";

export class ListSearch extends LitElement {
  static properties = { term: { state: true } };

  createRenderRoot() {
    return this;
  }

  _search = new Task(this, {
    args: () => [this.term],
    task: async ([term], { signal }) => {
      const res = await fetch(`/lists/search?term=${encodeURIComponent(term ?? "")}`, {
        headers: { Accept: "application/json" },
        signal,
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  render() {
    return html`
      <input type="search" @input=${(e) => (this.term = e.target.value)} />
      ${this._search.render({
        pending: () => html`<p>Searching…</p>`,
        complete: (lists) => html`<ul>${lists.map((l) => html`<li>${l.name}</li>`)}</ul>`,
        error: (e) => html`<p class="error">${e.message}</p>`,
      })}
    `;
  }
}

customElements.define("list-search", ListSearch);
```

Typing in the search box changes `term`, which re-runs the task. If the user types again before the previous request finishes, the previous request is aborted and its result ignored.

## Submitting

A Task with `autoRun: false` runs only when you call `run`, typically from a form's submit handler. See the [todo-list example](./element) for a complete component.

## Live updates

Task is for request/response. For data that changes on the server, use [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) from a Go handler and set a reactive property when a message arrives; Lit re-renders.

```js
connectedCallback() {
  super.connectedCallback();
  this._events = new EventSource(`/list/${this.listId}/events`);
  this._events.onmessage = (e) => (this.items = JSON.parse(e.data).items);
}

disconnectedCallback() {
  this._events.close();
  super.disconnectedCallback();
}
```

## Conventions

- Ask for JSON with `Accept: application/json`. Handlers that also serve a plain form use this header to choose between JSON and a redirect.
- Send form data as `URLSearchParams`, so the same handler reads it with `r.PostFormValue`.
- A task function does three things: fetch, check `res.ok`, parse. Decisions belong in the backend.
- Show errors as the handler returned them. `http.Error` on the server becomes `e.message` in the component.
- Forward the `signal` to `fetch`. Task can only cancel what you let it.


