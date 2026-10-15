---
title: "Persisting Data"
weight: 2
---

Postgres driver is not included as a dependency since not all apps require a database. Start by getting the Postgres driver.

```bash
go get github.com/jackc/pgx/v5
go mod tidy
```

Add the driver to `/internal/db/db.go`

```go
import (
	...
	_ "github.com/jackc/pgx/v5/stdlib"
)
```

The Gofs template includes functions to initialize, migrate and create database transactions.

## Server

The server will look for the environment variable _DSN_ on startup. If it is set, the server will connect to the local Postgres instance.

> **Tip:** Gofs ships with a local database initialization in `/internal/server.go`. You will need to extend this for **test** and **prod** environments.

```go
func (s *Server) initDb() (db.DB, error) {
	switch {
	case s.conf.Env.Local() && s.conf.DSN != "":
		return db.LocalPG(s.conf.DSN)
	default:
		log.Println("server: no database connection")
		return db.DB{}, nil
	}
}
```

## Json serialization

You should use your preferred persistence strategy appropriate for your use case.

We recommend persisting objects using a hybrid relational and nosql model where nosql data is stored as json blobs in a relational database. We have written a blog post on why we recommend using a hybrid approach [Sql DB, NoSql Schema](/blog/nosql).

Fields that you need to search, sort or index on are exposed as Postgres [generated columns](https://www.postgresql.org/docs/current/ddl-generated-columns.html) computed from the blob. The blob stays the single source of truth for the object, and the generated columns give the database (and sqlc) real typed columns to work with.

## Example

In the previous example we stored todo lists in the server object. This means that every time the server is restarted, the todo lists are lost. In order to persist todo lists permanently we need to store them in a database.

Remove the lists map from the server struct in the previous example.

Uncomment the _DSN_ line in the `.env` file.

```bash
HOST=localhost
PORT=8080
ENV=local
DSN=postgres://user:password@localhost:5432/dev?sslmode=disable
# TRACING=http://localhost:9411/api/v2/spans
# METRICS=true
```

### Prepare for serialization

In the file `/internal/app/list/list.go` lets prepare the _List_ struct for persistence by adding a few more fields and json serialization annotations.

```go
type List struct {
	ID    string   `json:"id"`
	Name  string   `json:"name"`
	Items []string `json:"items"`
}
```

### Create a table

Add the create table sql statement to the database migration that is performed at server startup. The migrations can be found at `/internal/db/migrations/migrations.sql`. The `name` column is generated from the blob so that lists can be sorted and searched by name.

```sql
CREATE TABLE IF NOT EXISTS lists (
    id   TEXT PRIMARY KEY,
    blob JSONB NOT NULL,
    name TEXT GENERATED ALWAYS AS (blob->>'name') STORED
);
CREATE INDEX IF NOT EXISTS lists_name_idx ON lists (name);
```

### Write the queries

Create a file `/internal/app/list/queries.sql`. Each query has a name and a result annotation that sqlc uses to generate a Go function. See [sqlc](./sqlc) for details.

```
mytodo
|--internal
|  |--app
|     |--list
|        |--list.go
|        |--queries.sql
```

```sql
-- name: CreateList :exec
INSERT INTO lists (id, blob) VALUES ($1, $2);

-- name: GetList :one
SELECT blob FROM lists WHERE id = $1;

-- name: GetLists :many
SELECT blob FROM lists ORDER BY name;

-- name: UpdateList :exec
UPDATE lists SET blob = $2 WHERE id = $1;
```

Run `make generate` (or `go generate ./...`). sqlc creates the `/internal/app/list/query` package with a function for each query.

```
mytodo
|--internal
|  |--app
|     |--list
|        |--list.go
|        |--queries.sql
|        |--query
|           |--db.go
|           |--models.go
|           |--queries.sql.go
```

> **Note:** Database access is a private implementation detail of the package. Only the `list` package should import `list/query`. It should be exposed through the package's API.
### Create an API

Create an api.go file which will contain the package's public functions. IDs are generated with `rand.Text` from the standard library.

```
mytodo
|--internal
|  |--app
|     |--list
|        |--list.go
|        |--queries.sql
|        |--api.go
|        |--query
```

```go
package list

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/json"

	"github.com/myorg/mytodo/internal/app/list/query"
)

func NewList(ctx context.Context, tx *sql.Tx, name string) (*List, error) {
	l := &List{
		ID:   rand.Text(),
		Name: name,
	}
	blob, err := json.Marshal(l)
	if err != nil {
		return nil, err
	}
	err = query.New(tx).CreateList(ctx, query.CreateListParams{ID: l.ID, Blob: blob})
	if err != nil {
		return nil, err
	}
	return l, nil
}

func GetList(ctx context.Context, tx *sql.Tx, id string) (*List, error) {
	blob, err := query.New(tx).GetList(ctx, id)
	if err != nil {
		return nil, err
	}
	var l List
	return &l, json.Unmarshal(blob, &l)
}

func GetLists(ctx context.Context, tx *sql.Tx) ([]List, error) {
	blobs, err := query.New(tx).GetLists(ctx)
	if err != nil {
		return nil, err
	}
	lists := make([]List, 0, len(blobs))
	for _, blob := range blobs {
		var l List
		if err := json.Unmarshal(blob, &l); err != nil {
			return nil, err
		}
		lists = append(lists, l)
	}
	return lists, nil
}

func NewListItem(ctx context.Context, tx *sql.Tx, id, item string) (*List, error) {
	l, err := GetList(ctx, tx, id)
	if err != nil {
		return nil, err
	}
	if err := l.AddItem(item); err != nil {
		return nil, err
	}
	blob, err := json.Marshal(l)
	if err != nil {
		return nil, err
	}
	return l, query.New(tx).UpdateList(ctx, query.UpdateListParams{ID: l.ID, Blob: blob})
}
```

### Run

Run the app

```bash
make
```


