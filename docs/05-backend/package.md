---
sidebar_position: 1
---

# Adding a Package

## The internal/app folder

Backend packages are located in the `/internal/app` folder.

```
root
|--internal
|  |--app
|     |--[package 1]
|     |--[package 2]
|     |--[...]
```

Each package should have its own folder which should contain an exposed API and all the code for the package's internal workings.

## Example

Lets create a simple todo list app called _mytodo_ which will keep track of todo lists. Todo list must have no more than 20 items.

Start by initializing a new project _githib.com/myorg/mytodo_.

Now lets create a folder for our package called _list_ that will contain all the business logic for a todo list.

### Create the list module folder

```
mytodo
|--internal
|  |--app
|     |--list
```

:::info
The `app` folder itself must be created for a newly initialized project.
:::

### Create the list api

Create a new file `/internal/app/list/list.go` with the _List_ struct and function for adding items to the list.

```
mytodo
|--internal
|  |--app
|     |--list
|        |--list.go
```

```go
package list

import "errors"

const MaxItems = 20

type List struct {
	Items []string
}

func (l *List) AddItem(item string) error {
	// Check if the list is full
	if len(l.Items) >= MaxItems {
		return errors.New("todo list is full")
	}

	l.Items = append(l.Items, item)
	return nil
}

func (l *List) IsValid() bool {
	return len(l.Items) <= MaxItems
}
```

### Accessing lists

:::warning
In this example we will store todo lists in the server object for illustration purposes only. To store todo lists correctly in a database, see the next section.
:::

Add a map of lists to the server `/internal/server/server.go` so they can be accessed by the frontend

```go
type Server struct {
	r       *http.ServeMux
	srv     http.Server
	conf    config.Config
	db      db.DB
	closeFn []func(context.Context) error
	lm	map[string]list.List	// todo list map
}

```

Now lists can be accessed from frontend handlers by passing them as a parameter to routes `/internal/server/routes.go`.

```go
func (s *Server) Routes() {
    ...
    http.Handle("/lists", page.All(s.lm))
    ...
}
```
