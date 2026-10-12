---
sidebar_position: 1
---

# Best Practice

## HTML/CSS First

It is always better to start with HTML/CSS where possible. For example instead of using javascript to control modals, we can use `<dialog>` which is built into the browser. A form that creates a record and shows the result can be a plain `<form>` and a redirect.

We can use CSS to control a lot of client side visibility and state. For example, we can use CSS to control the visibility of form elements based on the state of a checkbox, or `:has()` to style a section based on what it contains. This is much easier to read and maintain than using javascript for simple cases.

This will also encourage simple web design that are easy to maintain and scale.

## Islands, not apps

A gofs page is rendered by the server. JavaScript is added as islands: custom elements placed in the HTML that handle one piece of interaction. An island should be small, should own only its own markup, and should not know about other islands. If two islands need to talk, dispatch a DOM event and let the page listen; do not build a global store.

Ask of every island whether a `<form>` and a redirect would do. Often it would.

## Web Components with Lit

Islands are [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components), a browser standard. Gofs uses [Lit](https://lit.dev) to write them: it adds reactive properties and an `html` template literal on top of the standard, and nothing else. Lit templates are plain JavaScript, so there is no compile step and no bundler. Write components close to the standard so that Lit remains a convenience rather than a dependency you cannot leave.

## Light DOM by default

Lit renders into a shadow root by default. A shadow root isolates the component's styles from the page, which also means the app stylesheet does not reach inside it. Islands are part of the page and should look like it, so gofs components render into the light DOM:

```js
createRenderRoot() {
  return this;
}
```

Use a shadow root only for a component that must be isolated from the page, such as a wrapper around a third party widget, or one that needs `<slot>`. Say so in a comment.

## Progressive enhancement

The server renders an island's initial HTML, including a working `<form>` where the island submits something. The component reads its initial state from that HTML when it connects, and takes over from there. The page works before JavaScript loads, and keeps working if it never does.

## No business logic

A component fetches, submits and renders. It does not decide what is valid or what happens next; the backend does, and the handler returns the result. The frontend corollary of "handlers contain no business logic" is "components contain no business logic".

## Baseline

Use browser features that are [Baseline](https://web.dev/baseline) _Widely available_ freely. Use _Newly available_ features with a fallback. Think hard before using anything with _Limited availability_. The MDN page for every web feature shows its Baseline status.

## Never `unsafeHTML`

Lit's `html` template escapes interpolated values, as `html/template` does on the server. Lit's `unsafeHTML` directive turns that off. Do not use it; if the server has HTML to show, render it on the server.

## No npm

Lit and its Task controller are vendored into the app by `gofs vendor` and served from the binary. If you need another browser library, vendor it the same way: a single file, pinned, with its checksum in `.gofs/vendor.json`. A `package.json` is a sign something has gone wrong.
