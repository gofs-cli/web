---
sidebar_position: 1
---

# Folder structure

Go is not opinionated about folder structure however go convention (and good practice) states that code should be kept close to where it is used. The gofs template uses the folder structure below.

```
root
|--.github              Github actions configuration
|--.gofs                Gofs configuration
|--.vscode              Vscode configuration
|--cmd                  Command folder
|--docker               Docker compose folder
|--internal
|  |--app               Backend (see backend docs)
|  |--auth              Authentication functions
|  |--config            App config
|  |--data              Test data generation functions
|  |--db                Database functions and migrations
|  |--server
|  |  |--assets         Static assets
|  |  |--handlers       Generic handlers, for example assets
|  |  |--middleware.go  Server middleware
|  |  |--routes.go      Server routes
|  |  |--server.go      Server code
|  |--ui                Frontend (see frontend docs)
|--scripts              Build Scripts
```

:::info
Gofs is not a framework so you can use or modify this as you see fit. If you are using the _gofs vscode plugin_ you need to preserve the location and name of the `routes.go` file.
:::

Gofs apps are not intended to expose library functions and hence all implementation
details are kept in the `internal` folder. Library functions should be kept in a separate module.
