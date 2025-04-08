---
sidebar_position: 4
---

# Routing

## routes.go

Keep routing for the app in `/internal/server/routes.go`. This makes it easy to manage all routing from one place.

The Gofs default template ships with routing and handlers for static assets in the _Routes_ method, shown below.

```go
func (s *Server) Routes() {
	// filserver route for assets
	assetMux := http.NewServeMux()
	assetMux.Handle("GET /{path...}", http.StripPrefix("/assets/", handlers.NewHashedAssets(assets.FS)))
	s.r.Handle("GET /assets/{path...}", s.assetsMiddlewares(assetMux))
	...
	// you can start adding your routes here
}
```

## Uniformity

Routes should follow the structure of pages.

```go
func (s *Server) Routes() {
	...
	routesMux := http.NewServeMux()
	routesMux.Handle("GET /{$}", page.Index())
	routesMux.Handle("GET /mysection1/mypage1", page.MySection1MyPage1())
	routesMux.Handle("GET /mysection1/mypage2", page.MySection1MyPage2())
	routesMux.Handle("GET /mysection2/mypage1", page.MySection2MyPage1())

	s.r.Handle("/", s.routeMiddlewares(routesMux()))
	...
}
```

## Example

Lets looks at the mytodo app example we started earlier. There is only one page which is the index page, and there are two action endpoints for adding a todo list and adding an item to a todo list. A complete example of the routing file `/internal/server/routes.go` for mytodo is shown below.

```go
package server

import (
	"net/http"

	"github.com/myorg/mytodo/internal/server/assets"
	"github.com/myorg/mytodo/internal/server/handlers"
	"github.com/myorg/mytodo/internal/ui/pages/lists"
	"github.com/myorg/mytodo/internal/ui/pages/notfound"
)

func (s *Server) Routes() {
	// filserver route for assets
	assetMux := http.NewServeMux()
	assetMux.Handle("GET /{path...}", http.StripPrefix("/assets/", handlers.NewHashedAssets(assets.FS)))
	s.r.Handle("GET /assets/{path...}", s.assetsMiddlewares(assetMux))

	// handlers for normal routes with all general middleware
	routesMux := http.NewServeMux()
	routesMux.Handle("GET /{$}", lists.Index(s.db))
	routesMux.Handle("GET /", notfound.Index())

	routesMux.Handle("GET /lists", lists.Index(s.db))
	routesMux.Handle("POST /list", lists.NewList(s.db))
	routesMux.Handle("POST /list/{id}", lists.NewListItem(s.db))

	s.r.Handle("/", s.routeMiddlewares(routesMux))

	s.srv.Handler = s.r
}
```

:::info
This route

`routesMux.Handle("GET /{$}", lists.Index(s.db))`

will render the lists index at the root page /.

:::
