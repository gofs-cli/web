---
title: "Adding a Page"
weight: 1
---

## The internal/ui folder

Frontend pages are located in the `/internal/ui/pages` folder. Pages are Go [html/template](https://pkg.go.dev/html/template) files.

```
root
|--internal
|  |--ui
|     |--components     // web components (islands)
|     |--pages          // frontend pages
|     |--layout.html    // the app's page layout
```

> **Tip:** The pages folder structure should mirror the structure of your website.
> **Tip:** Keep handlers in the same folder as their pages (close together).
## Example

Lets continue the simple todo list app (mytodo) we started in backend. The design of mytodo frontend has a lists page showing all the todo lists and their items.

### Display todo lists

Lets start by creating a `/internal/ui/pages/lists` folder.

```
mytodo
|--internal
|  |--ui
|     |--pages
|        |--lists
```

Create a `/internal/ui/pages/lists/index.html` file. The page takes a slice of todo lists and renders them.

```html
{{ define "content" }}
<main>
  {{ range .Lists }}
  <h2>{{ .Name }}</h2>
  <ul>
    {{ range .Items }}<li>{{ . }}</li>{{ end }}
  </ul>
  {{ end }}
</main>
{{ end }}
```

This is a complete, working page. The server renders it, the browser displays it, and no JavaScript is involved.

### Adding a form

Lets add a form to create a new todo list. A plain HTML form posts to the `"/list"` end point; the handler creates the list and redirects back to this page. This needs no JavaScript either.

```html
{{ define "content" }}
<main>
  {{ range .Lists }}
  <h2>{{ .Name }}</h2>
  <ul>
    {{ range .Items }}<li>{{ . }}</li>{{ end }}
  </ul>
  {{ end }}
  <form method="post" action="/list">
    <input name="todo-list-name" required />
    <button>Add List</button>
  </form>
</main>
{{ end }}
```

> **Tip:** If you are using the Gofs VSCode extension, you can hover over `"/list"` and navigate to the `routes.go` entry or the handler.
### Adding interactivity

Adding an item to a list should not reload the whole page. This is a job for an _island_: a web component that the server renders the initial HTML for, and that takes over once its JavaScript loads.

Wrap each list in a `<todo-list>` element. Inside it, render the items and a plain form that posts to `"/list/{id}"`. Before the component loads, the form works as a normal form; after it loads, the component submits in the background and updates the list in place.

```html
{{ define "content" }}
<main>
  {{ range .Lists }}
  <h2>{{ .Name }}</h2>
  <todo-list list-id="{{ .ID }}">
    <ul>
      {{ range .Items }}<li>{{ . }}</li>{{ end }}
    </ul>
    <form method="post" action="/list/{{ .ID }}">
      <input name="todo-list-item" required />
      <button>Add Item</button>
    </form>
  </todo-list>
  {{ end }}
  <form method="post" action="/list">
    <input name="todo-list-name" required />
    <button>Add List</button>
  </form>
</main>
{{ end }}
```

> **Info:** The layout's loader script sees the `<todo-list>` tag on the page and imports `/components/todo-list/element.js`. The component is written in the [Components](./components/element) section.
> **Tip:** Writing server-rendered Go `html/template` files and web component island tags is fast and effortless with modern AI coding assistants. Because HTML and Go templates are stable standards, AI generates and refactors these structures cleanly without the need for custom template compilers or specialized DSLs.
> **Warning:** When forming links, use one of the following methods:

- literals such as `"/list"`
- template actions such as `"/list/{{ .ID }}"`
- in JavaScript, template literals such as `` `/list/${this.listId}` ``

Mixing these methods is less readable and will generate a warning if you are using the Gofs VSCode extension.


