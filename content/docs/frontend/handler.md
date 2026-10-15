---
title: "Adding a Handler"
weight: 3
---

# Adding a Handler

Handlers are responsible for accepting incoming requests, validating requests, calling the relevant backend functions, and then constructing a response back to the client. Handlers should be called with relevant server objects they need, for example the database connection, storage bucket, etc.

A handler responds in one of three ways:

- render a page, for `GET` requests to a route that has a page
- redirect, for a plain form `POST` (so that a browser refresh does not resubmit the form)
- return JSON, for a request from a component (an island) that will update the page in place

## Folders

Place your handlers close to the pages that they handle. For example

```
root
|--internal
|  |--ui
|     |--pages                     // frontend pages
|        |--section                // website section
|           |--handlers.go         // section handlers
|           |--index.html          // section page
```

## Database

Apps that use database persistence should pass a database object into handlers that use persistence. Handlers are responsible for wrapping operations in database transactions and handling errors.

## Example

Lets start by creating a `/internal/ui/pages/lists/handlers.go` file.

```
mytodo
|--internal
|  |--ui
|     |--pages
|        |--lists
|           |--index.html
|           |--handlers.go
```

We need a handler for the index page, one for the new todo list end point and one for the new todo list item end point.

The new list end point is only called by a plain form, so it redirects back to the index page. The new list item end point is called by the plain form before JavaScript loads, and by the `<todo-list>` component after. The component asks for JSON with an `Accept` header, so the handler returns the updated list as JSON when asked and redirects otherwise.

```go
package lists

import (
	"database/sql"
	"net/http"
	"strings"

	"github.com/myorg/mytodo/internal/ui"

	l "github.com/myorg/mytodo/internal/app/list"
	"github.com/myorg/mytodo/internal/db"
)

type indexData struct {
	ui.Data
	Lists []l.List
}

func Index(db db.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var lists []l.List
		var err error
		err = db.Transaction(r.Context(), func(tx *sql.Tx) error {
			lists, err = l.GetLists(r.Context(), tx)
			return err
		})
		if err != nil {
			http.Error(w, "error getting lists", http.StatusInternalServerError)
			return
		}
		ui.Render(w, "lists/index", indexData{Data: ui.Data{Title: "Todo lists"}, Lists: lists})
	})
}

func NewList(db db.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		name := r.PostFormValue("todo-list-name")
		if name == "" {
			http.Error(w, "missing list name", http.StatusBadRequest)
			return
		}
		err := db.Transaction(r.Context(), func(tx *sql.Tx) error {
			_, err := l.NewList(r.Context(), tx, name)
			return err
		})
		if err != nil {
			http.Error(w, "error creating list", http.StatusInternalServerError)
			return
		}
		http.Redirect(w, r, "/lists", http.StatusSeeOther)
	})
}

func NewListItem(db db.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		item := r.PostFormValue("todo-list-item")
		if item == "" {
			http.Error(w, "missing list item", http.StatusBadRequest)
			return
		}
		var list *l.List
		var err error
		err = db.Transaction(r.Context(), func(tx *sql.Tx) error {
			list, err = l.NewListItem(r.Context(), tx, id, item)
			return err
		})
		if err != nil {
			http.Error(w, "error adding item", http.StatusInternalServerError)
			return
		}
		if strings.Contains(r.Header.Get("Accept"), "application/json") {
			ui.JSON(w, list)
			return
		}
		http.Redirect(w, r, "/lists", http.StatusSeeOther)
	})
}
```

> **Info:** `ui.Render` and `ui.JSON` are small helpers in the template. `ui.JSON` sets the content type and encodes the value with `encoding/json`. Errors are returned with `http.Error` and a plain text message; components show the message as returned.
> **Warning:** The handlers contain logic for processing inputs and outputs. They should not contain any business logic. Business logic should be in the backend. The same rule applies to components: a component fetches, submits and renders; it does not decide what is valid.


