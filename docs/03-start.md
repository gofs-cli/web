---
sidebar_position: 3
---

# Quick Start

## 1. Install the gofs cli

:::info
You need Go 1.24 or greater. If you don't have Go installed, see [Prerequisites](./prerequisites/required).
:::

Install the latest gofs cli by running the command:

```bash
go install github.com/gofs-cli/gofs@latest
```

:::tip
If you have an existing project, you can install gofs cli with the [tool directive](https://tip.golang.org/doc/modules/managing-dependencies#tools) feature of Go added in v1.24.

To install gofs cli as a tool, use

```bash
go get -tool github.com/gofs-cli/gofs@latest
```

:::

## 2. Initialize a project

Navigate to the folder where you want to initialize your project. Provide gofs with a go module name such as _github.com/myorg/myapp_

If you have created a project folder, from your project folder run

```bash
gofs init github.com/myorg/myapp
```

If you want gofs to create the project folder, run

```bash
gofs init github.com/myorg/myapp myfolder
```

:::tip
If you have an existing project and you installed gofs as a tool, run

```bash
go tool gofs init github.com/myorg/myapp
```

:::

## 3. Run the project

:::info
The Gofs template includes a Makefile for convenience. If you don't have Make installed, see [Prerequisites](./prerequisites/required).
:::

From your project directory run

```bash
make
```
