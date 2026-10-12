---
slug: dev-tools-vs-dependencies
title: Dev Tools Are Not Dependencies
authors: [kavi]
tags: [standards, architecture]
---

"Minimise dependencies" is easy to say and hard to apply, because not everything that appears in a project is the same kind of thing. A rule that treats a code generator the same as a runtime library will either ban useful tools or let in harmful ones. This post describes the distinction gofs uses.

{/* truncate */}

## Two kinds of dependency

A _runtime dependency_ ships. It is linked into your binary or sent to your users' browsers. It runs in production, it is in your supply chain, and when it has a vulnerability you have an incident. When it is abandoned you have a rewrite. When it changes its API you have an upgrade cycle. These are the dependencies our philosophy page is about, and the right number of them is as close to zero as the job allows.

A _development tool_ does not ship. It runs on a developer's machine or in CI, reads some input, and writes some output. gofs is one. The Go compiler is one. sqlc is one.

The two deserve different rules. Counting a development tool as a dependency would mean refusing a compiler. Not counting it at all would mean a build that silently depends on a tool nobody can install in five years.

## The rule for development tools

A development tool is acceptable when its output is plain code that would keep working if the tool disappeared tomorrow.

That is the whole rule, and it does a lot of work. It is why sqlc is in gofs v2: the Go it generates imports only the standard library, is committed to the repository, and could be maintained by hand. It is why templ is not: templ was a generator whose output depended on a templ runtime, so removing the tool would have removed the app. It is why a bundler would fail the test even though it is "only a build tool": a project that cannot be run without being bundled depends on the bundler at every build, forever.

Three practical consequences follow.

Pin the tool. Go's tool directive records the exact version in `go.mod`, so every developer and every CI run generates the same code.

Commit the output. The build must not need the tool. A fresh clone with Go installed should build.

Keep the tool replaceable. If the generated code is readable, and a different tool or a developer could produce it, the tool is a convenience. If the generated code is opaque, the tool has become a runtime dependency with extra steps.

## The rule for runtime dependencies

A runtime dependency is acceptable when it is small, stable, has no transitive dependencies of its own, and is built on something with a backward-compatibility commitment.

On the server this means the standard library and very little else. On the client it means the browser's own APIs, and a library only when it is thin enough to be seen through. Lit passes because it is a few kilobytes over a browser standard, has not broken its API across two major versions, and a component written with it is a short edit from a plain custom element. It is vendored, pinned and checksummed, and served from the binary, so there is no package manager between you and it.

## Why this matters

Our [Evergreen Go](/blog/evergreen-go) post describes organisations spending most of their budget standing still. Nearly all of that cost comes from runtime dependencies: the framework that needs a migration, the library that was abandoned, the ecosystem that changed its mind. Development tools rarely cause it, provided their output outlives them. Drawing the line between the two is how you keep the tools and lose the treadmill.
