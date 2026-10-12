---
sidebar_position: 3
---

# sqlc

Gofs apps query the database with SQL. [sqlc](https://sqlc.dev) reads your schema and your queries, checks the queries against the schema, and generates a Go function for each one with typed parameters and results. You write SQL; sqlc writes the boilerplate.

sqlc fits the gofs philosophy because it is a development tool, not a runtime dependency. The generated code imports only `database/sql` and `encoding/json` from the standard library. It is committed to your repository, and your app builds and runs without sqlc installed. If sqlc disappeared tomorrow, the generated code would keep working and you could maintain it by hand.

## Configuration

The template ships with a `sqlc.yaml` at the project root. Each backend package that has queries gets an entry. The schema is read from the migrations folder, so the queries are checked against the same SQL that creates your tables.

```yaml
version: "2"
sql:
  - engine: "postgresql"
    schema: "internal/db/migrations"
    queries: "internal/app/list/queries.sql"
    gen:
      go:
        package: "query"
        out: "internal/app/list/query"
        sql_package: "database/sql"
```

The template's Makefile runs `go generate ./...`, and the generate directive lives in `/internal/db/db.go`:

```go
//go:generate go tool sqlc generate
```

## Writing queries

Queries live in a `queries.sql` file inside the package that owns them. Each query is preceded by a comment with its name and the shape of its result: `:one`, `:many`, `:exec` or `:execrows`.

```sql
-- name: SearchLists :many
SELECT blob FROM lists
WHERE name ILIKE '%' || sqlc.arg(term)::text || '%'
ORDER BY name;
```

This generates

```go
func (q *Queries) SearchLists(ctx context.Context, term string) ([]json.RawMessage, error)
```

The sqlc docs cover [inserting](https://docs.sqlc.dev/en/latest/howto/insert.html), [updating](https://docs.sqlc.dev/en/latest/howto/update.html), [named parameters](https://docs.sqlc.dev/en/latest/howto/named_parameters.html) and more.

## Using generated code

The generated `query.New` accepts anything that satisfies its `DBTX` interface, which includes `*sql.Tx`. Use it inside the transaction helper from the template:

```go
err := db.Transaction(r.Context(), func(tx *sql.Tx) error {
	lists, err = query.New(tx).GetLists(r.Context())
	return err
})
```

## Conventions

- Keep each package's queries in its own `queries.sql`, and its generated code in a `query` subpackage. Only the owning package imports its `query` package; handlers call the package API, never `query` directly.
- Never edit generated files. Change the SQL and regenerate.
- Commit generated code so the build does not depend on sqlc.
- Expose fields you need to search, sort or index as [generated columns](https://www.postgresql.org/docs/current/ddl-generated-columns.html) computed from the blob. Queries that reach into the blob with `->>` directly cannot be typed by sqlc and will not use indexes.
- Pin sqlc with the Go tool directive so that everyone on the team generates the same code.

:::tip
`go tool sqlc vet` can check queries against a running database and flag common mistakes. It is a useful CI step once your app has grown.
:::
