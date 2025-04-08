---
sidebar_position: 3
---

# Adding a Handler

Handlers are responsible for accepting incoming requests, validating requests, calling the relevant backend functions, and then constructing a response back to the client. Handlers should be called with relevant server objects they need, for example the database connection, storage bucket, etc.

## Folders

Place your handlers close to the pages that they handle. For example

```
root
|--internal
|  |--ui
|     |--pages                     // frontend pages
|        |--section                // website section
|           |--handlers.go         // section handlers
|           |--section_page.templ  // section page
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
|           |--index.templ
|           |--handlers.go
```

We need to add a handler for the index page, and for the new todo list end point as well as the new todo list item end point. These handlers must return the html that the templ component is expecting i.e. a page in the cast of Index, the main element in the case of adding a list, and the html fragment of the updated list in the case of a new list item.

```go
package lists

import (
	"database/sql"
	"net/http"

	"github.com/a-h/templ"

	"github.com/myorg/mytodo/internal/ui"

	l "github.com/myorg/mytodo/internal/app/list"
	"github.com/myorg/mytodo/internal/db"
)

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
		templ.Handler(ui.IndexPage(IndexPage(lists))).ServeHTTP(w, r)
	})
}

func NewList(db db.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		name := r.PostFormValue("todo-list-name")
		if name == "" {
			http.Error(w, "missing list name", http.StatusBadRequest)
			return
		}
		var lists []l.List
		var err error
		err = db.Transaction(r.Context(), func(tx *sql.Tx) error {
			_, err = l.NewList(r.Context(), tx, name)
			if err != nil {
				return err
			}
			lists, err = l.GetLists(r.Context(), tx)
			return err
		})
		if err != nil {
			http.Error(w, "error creating list", http.StatusInternalServerError)
			return
		}
		templ.Handler(IndexPage(lists)).ServeHTTP(w, r)
	})
}

func NewListItem(db db.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		listId := r.PostFormValue("list-id")
		if listId == "" {
			http.Error(w, "missing list id", http.StatusBadRequest)
			return
		}
		item := r.PostFormValue("todo-list-item")
		if item == "" {
			http.Error(w, "missing list item", http.StatusBadRequest)
			return
		}
		var list *l.List
		var err error
		err = db.Transaction(r.Context(), func(tx *sql.Tx) error {
			list, err = l.NewListItem(r.Context(), tx, listId, item)
			return err
		})
		if err != nil || list == nil {
			http.Error(w, "error creating list", http.StatusInternalServerError)
			return
		}
		templ.Handler(List(*list)).ServeHTTP(w, r)
	})
}

```

:::warning
The handlers contain logic for processing inputs and outputs. They should not contain any business logic. Business logic should be in the backend.
:::
