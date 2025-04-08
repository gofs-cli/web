---
sidebar_position: 3
---

# Server side rendering

Gofs apps use server side rendering. The http server serves html content generated on the server using [templ](https://templ.guide) components. The templ documentation describes how to do this in [templ server side rendering](https://templ.guide/server-side-rendering/creating-an-http-server-with-templ).

In the example below, the http server will render the hello template and serve it at the server root /.

```go
templ hello() {
	<div>Hello</div>
}
```

```go
func (s *Server) Routes() {
    ...
    http.Handle("/", templ.Handler(hello()))
    ...
}
```
