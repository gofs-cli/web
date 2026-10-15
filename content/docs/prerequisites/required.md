---
title: "Required Tools"
weight: 1
---

# Required Tools

To build applications with gofs, you need only standard tools. Gofs avoids the complex dependencies and build chains common in modern full-stack development.

These docs assume you have basic familiarity with Go. If you are new to Go, the official [Getting Started Tutorial](https://go.dev/doc/tutorial/getting-started) and the [Tour of Go](https://tour.golang.org/welcome/1) provide great starting points.

You should also be comfortable with standard HTML, modern CSS, and plain SQL. Gofs applications use these directly rather than through intermediary framework abstractions.

---

## 1. Go (1.24+)

[Download and install Go](https://go.dev/dl/) following the [official installation instructions](https://go.dev/doc/install).

Verify your Go installation by running:

```bash
go version
```

Ensure that `$GOPATH/bin` (typically `$HOME/go/bin` on macOS/Linux or `%USERPROFILE%\go\bin` on Windows) is included in your system `PATH` so you can execute installed command-line tools.

---

## 2. Make

Gofs templates include a standard `Makefile` for developer workflow convenience (`make`, `make dbup`, `make generate`).

Verify whether Make is installed:

```bash
make --version
```

If Make is not installed, follow the instructions for your operating system:

> **Info:** ### macOS
Make is included with Xcode Command Line Tools. Install it by running:

```bash
xcode-select --install
```

> **Info:** ### Linux (Debian / Ubuntu / Fedora)
Install Make using your distribution's package manager:

```bash
sudo apt-get install make   # Debian/Ubuntu
sudo dnf install make       # Fedora
```

> **Info:** ### Windows
On Windows, you can install Make via [GNU Make](https://www.gnu.org/software/make/) or through package managers like Chocolatey (`choco install make`) or Scoop (`scoop install make`).

---

## What is NOT Required: The Zero-npm Guarantee

You do **not** need:
- **Node.js**
- **npm / pnpm / yarn**
- **Webpack / Vite / esbuild / Turbopack**
- **Babel / SWC**

### Why Gofs Excludes Node.js and npm
Excluding the JavaScript build ecosystem is an intentional architectural decision to protect your application from the primary sources of modern software fragility:

1. **Immunity from Supply Chain Attacks**: Modern npm dependency trees often pull in thousands of transitive packages from unvetted authors, exposing projects to typosquatting, token theft, and malicious postinstall hooks. With gofs, there is no `package.json` and zero unvetted runtime scripts.
2. **Freedom from Dependency Hell**: You never have to resolve peer-dependency conflicts, handle incompatible bundler plugins, or suffer broken builds when an npm package updates.
3. **True Backward Compatibility**: By relying on the Go standard library on the backend and native W3C web standards (Web Components, Declarative Shadow DOM, modern CSS Baseline) in the browser, your application remains evergreen and functional for years to come.

The small browser libraries gofs uses (Lit and its Task controller) are vendored as static, checksummed files directly in `/internal/server/assets/vendor/` and served from the embedded Go binary.


