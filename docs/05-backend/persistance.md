---
sidebar_position: 2
---

# Persisting Data

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

:::tip
Gofs ships with a local database initialization in `/internal/server.go`. You will need to extend this for **test** and **prod** environments.

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

:::

## Json serialization

You should use your preferred persistence strategy appropriate for your use case.

We recommend persisting objects using a hybrid relational and nosql model where nosql data is stored as json blobs in a relational database. We have written a blog post on why we recommend using a hybrid approach [Sql DB, NoSql Schema](/blog/nosql).

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

## Create a table

Add the create table sql statement to the database migration that is performed at server startup. The migrations can be found at `/internal/db/migrations/migrations.sql`

```sql
CREATE TABLE IF NOT EXISTS lists (
    id TEXT PRIMARY KEY,
    blob JSONB NOT NULL,
);
```

### Database CRUD functions

Lets create a new file called `/internal/app/list/db.go` for the database functions.

```
mytodo
|--internal
|  |--app
|     |--list
|        |--list.go
|        |--db.go
```

The database functions will take a context and transaction, and execute sql commands to perform database operations. Here is an example of `/internal/app/list/db.go`.

:::note
Database functions should be private implementation details of the package. They should be exposed through an API.
:::

```go
package list

import (
	"context"
	"database/sql"
	"encoding/json"
)

func createList(ctx context.Context, tx *sql.Tx, list *List) error {
	jsonb, err := json.Marshal(&list)
	if err != nil {
		return err
	}
	_, err = tx.ExecContext(ctx, `INSERT INTO lists (
			id,
			blob
		) VALUES (
		 	$1, $2
		)`,
		list.ID,
		jsonb,
	)
	return err
}

func getListByID(ctx context.Context, tx *sql.Tx, ID string) (*List, error) {
	var data []byte
	err := tx.QueryRowContext(ctx, `SELECT blob
		FROM lists
		WHERE id = $1`,
		ID).Scan(&data)
	if err != nil {
		return nil, err
	}
	var v List
	return &v, json.Unmarshal(data, &v)
}

```

### Create an API

Create an api.go file which will contain the package's public functions.

```
mytodo
|--internal
|  |--app
|     |--list
|        |--list.go
|        |--db.go
|        |--api.go
```

:::note
You will have to import the Google uuid package with

```bash
go get github.com/google/uuid
go mod tidy
```

:::

```go
package list

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/google/uuid"
)

func NewList(ctx context.Context, tx *sql.Tx, name string) (*List, error) {
	l := &List{
		ID:   uuid.NewString(),
		Name: name,
	}

	err := createList(ctx, tx, l) // call the private persistence function
	if err != nil {
		return nil, err
	}

	return l, nil
}

func GetList(ctx context.Context, tx *sql.Tx, id string) (*List, error) {
	return getListByID(ctx, tx, id)
}
```

### Run

Run the app

```bash
make
```
