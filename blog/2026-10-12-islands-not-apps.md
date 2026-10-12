---
slug: islands-not-apps
title: Islands, Not Apps
authors: [kavi]
tags: [architecture, standards]
---

In 2025 MDN, the site that documents the web platform, replaced its React single-page application with server-rendered pages and small web components. Their engineering write-up, [Under the hood of MDN's new frontend](https://developer.mozilla.org/en-US/blog/mdn-front-end-deep-dive/), is the clearest account we have read of why that architecture wins for most business applications, and it is the architecture gofs v2 uses.

{/* truncate */}

## The wrapper problem

MDN is mostly static text. Their old frontend shipped a full React application to render it. In their words, "the React app boundary essentially ended where our documentation began": the framework wrapped the content but could not read it, so simple interactions like a copy button on a code block had to be written outside React with raw DOM APIs, and sometimes twice. The tooling had been "ejected" from a starter kit years earlier and nobody fully understood the build. Styles leaked between components. The dev server took two minutes to start.

None of this was a React problem as such. It was the cost of a framework that needs to own the whole page in order to work, applied to a page that did not need owning.

Most business applications are like MDN in this respect. A page lists some records, shows one, offers a form. Very little of it needs to be an application. Making all of it one is where the weight comes from.

## Islands

MDN's new frontend renders pages on the server and places web components, written with Lit, where interaction is needed: an inline code playground, a dropdown, an embedded screencast that loads only when clicked. Each is a custom element, a browser standard. "There's no higher-level 'app' that needs to understand the state of the entire page," they write, "so there never could be a 'wrapper' problem."

Two details of their approach are worth copying, and gofs v2 copies both.

The first is that components are loaded by name. A small script scans the page for custom elements and imports the matching file. A page with no components loads no JavaScript; a page with one loads one file. Their benchmarks found that with HTTP/2 this was as fast as bundling everything, so they did not.

The second is progressive enhancement by default. Their dropdown renders as a CSS-only control and becomes a JavaScript one when its definition loads. The page is usable before the script arrives and stays usable if it never does. In gofs the same principle means the server renders a working `<form>` inside every island, and the component takes over from there.

## Where gofs goes further

MDN still runs Node, a bundler and a 650-line build configuration, because they render their Lit components on the server with the same JavaScript. We do not. gofs renders pages with Go's `html/template`, and the only JavaScript in a gofs app is the components themselves, served as plain ES modules from the Go binary. There is no `package.json`. The dev server is `make`.

The price is that an island's first render on the client is the client's job. The server gives it the initial HTML, the component reads its state from that HTML, and renders the same thing. For a form or a list this is a few lines; for a page that is mostly islands it is a sign the page should not be.

## A policy for the platform

The last thing to take from MDN is how they decide which browser features to use. They follow [Baseline](https://web.dev/baseline): widely available features are used freely, newly available ones with a fallback, limited ones only with a reason. It is a compatibility policy for the browser in the same spirit as Go's for the language, and gofs adopts it as written.

MDN's engineers closed by saying it had been "a privilege to be able to use new web technologies to build the website that documents them". We would put it less grandly. The platform has caught up with what frameworks were for. For most of what a business application does, the browser is enough, and the server can do the rest.
