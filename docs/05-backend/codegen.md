---
sidebar_position: 3
---

# Codegen

Gofs can generate database CRUD functions and table create sql using go templates. This requires gofs annotations on the struct fields and the struct itself.

## Example

Lets prepare _List_ for code generation. The annotation above the struct tell gofs to generate the db helper functions and database create schema for List. The field annotations tell gofs that ID is the primary key and Name is searchable.

```go
//go:generate gofs codegen db sql
type List struct {
	ID    string   `json:"id"    gofs:"pk"`
	Name  string   `json:"name"  gofs:"searchable"`
	Items []string `json:"items"`
}
```

Running codegen will create files with the suffix _\_generated_, specifically `/internal/app/list/list_db_generated.go` with helper functions for the database CRUD operations, and `/internal/db/migrations/lists_generated.sql`. In the mytodo example, once these generated files are created, you will need to remove the hand written `db.go` you added in the previous section.

```
mytodo
|--internal
|  |--app
|  |  |--list
|  |     |--list.go
|  |     |--db.go (delete this file)
|  |     |--api.go
|  |     |--list_db_generated.go
|  |--db
|     |--migrations
|        |--lists_generated.sql
```

### Run

Run the app

```bash
make
```

## Gofs template

Gofs templates can be found in the `.gofs/templates` folder. You can modify these templates to suit your needs. You can also add new templates and use them to generate your app specific code.
