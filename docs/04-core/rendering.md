---
sidebar_position: 3
---

# Pages and islands

Gofs apps are multi-page apps. Every route returns a complete HTML page rendered on the server with Go's [html/template](https://pkg.go.dev/html/template). Interactivity is added to a page with _islands_: small web components placed in the server-rendered HTML that take over a part of the page once their JavaScript loads.

The Go server owns the document. Components own their islands. Nothing owns both, so there is no client-side router, no global client state, and no framework that needs to understand the whole page.

## Layout

The template ships with a layout at `/internal/ui/layout.html`. It contains the `<html>` skeleton, links the stylesheet, and defines the `content` block that each page fills in.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ .Title }}</title>
    <link rel="stylesheet" href="{{ asset "app.css" }}" />
    <script type="importmap">
      {"imports": {"lit": "{{ asset "vendor/lit.js" }}", "@lit/task": "{{ asset "vendor/task.js" }}"}}
    </script>
    <script type="module">
      // Load the JavaScript for every custom element on this page, and nothing else.
      const tags = new Set([...document.querySelectorAll("*")].map((e) => e.localName).filter((n) => n.includes("-")));
      for (const tag of tags) import(`/components/${tag}/element.js`);
    </script>
  </head>
  <body>
    {{ block "content" . }}{{ end }}
  </body>
</html>
```

The [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) lets component code `import { LitElement, html } from "lit"` exactly as in the Lit documentation, while the files are served from your own binary.

The loader script is the whole of gofs's "build system". It finds the custom elements present on the page and imports their definitions. A page with no islands loads no JavaScript at all.

## Pages

A page is a Go template file that defines the `content` block. Pages live in `/internal/ui/pages` and are rendered by handlers with the `ui.Render` helper from the template.

```html
{{ define "content" }}
<main>
  <h1>Hello</h1>
</main>
{{ end }}
```

```go
func Hello() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ui.Render(w, "hello/index", ui.Data{Title: "Hello"})
	})
}
```

`html/template` escapes everything it interpolates, so values from the database or the request are safe to render.

## Islands

An island is a custom element in the page. The server renders its initial HTML, including a working `<form>` where there is one, so the page is usable before any JavaScript arrives. When the element's definition loads, it takes over its contents and handles interaction in place.

```html
<todo-list list-id="{{ .ID }}">
  <ul>{{ range .Items }}<li>{{ . }}</li>{{ end }}</ul>
  <form method="post" action="/list/{{ .ID }}">
    <input name="todo-list-item" required />
    <button>Add Item</button>
  </form>
</todo-list>
```

See [Components](../frontend/components/best-practice) for how to write one.
