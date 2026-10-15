---
title: "Http server"
weight: 2
---

Gofs apps use the go [net/http](https://pkg.go.dev/net/http) server. The server implementation is found in `/internal/server`.

```
root
|--internal
|  |--server
|  |  |--assets         Static assets (app.css, vendored libraries)
|  |  |--handlers       Generic handlers, for example for assets
|  |  |--middleware.go  Server middleware
|  |  |--routes.go      Server routes
|  |  |--server.go      Server code
```

## Routing

Gofs apps use the [net/http's router](https://go.dev/blog/routing-enhancements). The router setup should be kept in one file `/internal/server/routes.go` where all the routes for the app can be seen in one place.

## Middleware

Various middleware for the web app such as cors, logging, and so on are setup in `/internal/server/middleware.go`.

Other useful middleware can be found @ [https://github.com/gofs-cli/middleware](https://github.com/gofs-cli/middleware)

## Static assets

All static files are embedded in the binary with [embed](https://pkg.go.dev/embed) and served by the Go server. There are no external files to deploy next to the binary and no CDN.

- `/assets/` serves `/internal/server/assets`: the app stylesheet and the vendored browser libraries (`vendor/lit.js`, `vendor/task.js`). Assets are served with a content hash in the URL so they can be cached forever.
- `/components/` serves `/internal/ui/components`: the JavaScript for your web components.

The vendored libraries are listed with their version and checksum in `.gofs/vendor.json`. Run `gofs vendor` to update them.


