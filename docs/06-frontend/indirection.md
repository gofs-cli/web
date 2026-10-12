---
sidebar_position: 2
---

# Indirection

Keep indirection in pages to a minimum. For example, the code below captures the formatting of a header with a class. It is much easier to read and maintain than the same code with indirection (a heading component) shown below it.

```html
<h2 class="section-heading">New section</h2>
```

```html
<app-heading text="New section" size="2xl" weight="extrabold"></app-heading>
```

`<app-heading>` renders the same heading but it is not clear how it is implemented unless you inspect it, and it loads JavaScript to render what one line of HTML can render on its own. `<app-heading>` is a risk of bloating as it caters for more and more different types of headings.

The same applies to Go templates: a `{{ template "heading" . }}` that takes a map of options hides what a line of HTML would show.

:::tip
This means that sometimes it is better to repeat code than abstract it away, as in the example above (header formatting would be repeated). There are many tools that will help you manage repeated code. The goal is to make the code as easy to read and maintain as possible.
:::

:::tip
A web component earns its place when it has behaviour: it fetches, submits, opens, closes or reacts to input. A component that only arranges static HTML is indirection.
:::
