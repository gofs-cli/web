---
sidebar_position: 2
---

# Database (optional)

Most applications require a database. If you require a database Gofs templates ship with a _docker-compose_ file to run a local postgres instance.

To run a local postgres you will need a container runtime such as:

- [Docker](https://www.docker.com)
- [Podman](https://podman.io)

Once this is setup and you have initialized a project you can start a Postgres instance with:

```bash
make dbup
```

## sqlc

Gofs apps query the database with plain SQL and use [sqlc](https://sqlc.dev) to generate type-safe Go functions from it. sqlc is a development tool: the code it generates depends only on the standard library's `database/sql`, and is committed to your repository, so sqlc is not needed to build or run your app.

Install sqlc as a Go tool from your project folder:

```bash
go get -tool github.com/sqlc-dev/sqlc/cmd/sqlc@latest
```

:::info
sqlc's Postgres parser uses cgo, so installing it this way needs a C compiler (Xcode command line tools on MacOS, `build-essential` on Debian/Ubuntu, or MSYS2/MinGW on Windows). If you would rather not install a compiler, download a [prebuilt binary](https://docs.sqlc.dev/en/latest/overview/install.html) instead and put it on your PATH.
:::

See [sqlc](../backend/sqlc) in the backend docs for how it is used.
