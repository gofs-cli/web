---
sidebar_position: 2
---

# Http server

Gofs apps use the go [net/http](https://pkg.go.dev/net/http) server. The server implementation is found in `/internal/server`.

```
root
|--internal
|  |--server
|  |  |--assets         Static assets
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
