---
sidebar_position: 2
---

# Indirection

Keeping indirection in pages to a minimum. For example, the code below uses tailwind to capture the formatting of a header. It is much easier to read and maintain than the same code with indirection (heading component) shown below it.

```templ
templ Page() {
    <h2 class="mt-2 text-2xl font-extrabold">New section</h2>
}
```

```templ
templ Page() {
    @SomeHeadingComponent(SomePropsComponent{
        Text: "New section",
        Size: "2xl",
        Font: "extrabold",
    })
}
```

_@SomeHeadingComponent_ renders the same heading but it is not clear how it is implemented unless you inspect it. _@SomeHeadingComponent_ is a risk of bloating as it caters for more and more different types of headings.

:::tip
This means that sometimes it is better to repeat code than abstract it away, as in the example above (header formatting would be repeated). There are many tools that will help you manage repeated code. The goal is to make the code as easy to read and maintain as possible.
:::
