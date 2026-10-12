---
sidebar_position: 4
---

# Modal

A modal does not need a component. The browser's [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) element handles opening, closing, focus, the Escape key and the backdrop.

## Confirmation

A confirmation modal is a `<dialog>` containing a form. With `method="dialog"` the form closes the dialog without a request; with a real `action` it submits to the server.

```html
<button type="button" commandfor="confirm-delete" command="show-modal">Delete list</button>

<dialog id="confirm-delete">
  <form method="post" action="/list/{{ .ID }}/delete">
    <p>Delete <b>{{ .Name }}</b>? This cannot be undone.</p>
    <button type="button" commandfor="confirm-delete" command="close">Cancel</button>
    <button>Delete</button>
  </form>
</dialog>
```

The `command` and `commandfor` attributes open and close the dialog with no JavaScript. They are Baseline _Newly available_, so the template includes a few lines in `app.js` that do the same for older browsers:

```js
document.addEventListener("click", (e) => {
  const button = e.target.closest("[commandfor]");
  if (!button || "command" in button) return; // native support
  const dialog = document.getElementById(button.getAttribute("commandfor"));
  button.getAttribute("command") === "show-modal" ? dialog.showModal() : dialog.close();
});
```

## Styling

Style the dialog and its backdrop in the app stylesheet:

```css
dialog {
  border: none;
  border-radius: var(--radius);
  padding: var(--space-4);

  &::backdrop {
    background: rgb(0 0 0 / 0.5);
  }
}
```

## When a component is needed

Wrap a dialog in a component only when what is inside it needs JavaScript: a form that submits in place, or content that is fetched when the dialog opens. Keep the `<dialog>` and let the component own the form, as in the [todo-list example](./element).
