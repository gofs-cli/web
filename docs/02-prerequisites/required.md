---
sidebar_position: 1
---

# Required

You should have some experience with Go. There are some good tutorials [here](https://go.dev/doc/tutorial/getting-started) and [here](https://tour.golang.org/welcome/1) which you can use to get started if you are new to Go. These docs assume you are familiar with Go.

## Go

[Download go](https://go.dev/dl/) for your OS and install it. The official instructions are [here](https://go.dev/doc/install).

Ensure that _go_ is in your path. You should be able to type the command below in _terminal_ or _cmd_ and see the installed go version.

```bash
go version
```

Once go is installed, you can add the GOPATH to your system path. This is typically your `$HOME/go/bin`. This should also be added to your system PATH to allow you to run installed tools.

## Make

The Gofs template includes a Makefile for convenience. To check if you have make installed, run

```bash
make --version
```

If you dont see a make version printed then you will need to install it with the instructions for your OS below.

:::info

### MacOS

For MacOS, make comes with Xcode command line tools. Run this command in a terminal
to install it

```bash
xcode-select --install
```

:::

:::info

### Linux

For Linux, you can install it with the command below or equivalent for your distro

```bash
sudo apt-get install make
```

:::

:::info

### Windows

On Windows you will need to install a make tool such as
[GNU Make](https://www.gnu.org/software/make/)
:::
