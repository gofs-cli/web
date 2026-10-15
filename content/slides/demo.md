---
title: "Reveal.js Demo Deck"
layout: "slides"
outputs: ["HTML"]
---

# Reveal.js + Hugo
### Interactive Slide Decks on gofs.dev

<p style="font-size: 0.7em; color: #888;">Use <kbd>Space</kbd> or arrow keys to navigate</p>

---

## Evergreen Web Standards

- **Zero Node.js / Zero npm**
- **100% Client-Side CDN**: Loaded directly via jsDelivr
- **Pure Markdown**: Author slides with `---` separators
- **Dark Theme**: Default Reveal.js black theme

---

## Syntax Highlighted Code

```go
package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "Evergreen Go & Web Components")
    })
    http.ListenAndServe(":8080", nil)
}
```

---

## Vertical Slide Stacks

Press <kbd>DOWN</kbd> or <kbd>Space</kbd> to explore deep dive slides:

--

### Deep Dive: Section 1
Vertical slides allow drilling into details without cluttering horizontal flow.

--

### Deep Dive: Section 2
Press <kbd>UP</kbd> to return or <kbd>RIGHT</kbd> to proceed to the next topic.

---

## Presentation Shortcuts

| Key | Action |
|:---:|:---|
| <kbd>Space</kbd> / <kbd>→</kbd> | Next slide |
| <kbd>F</kbd> | Toggle Fullscreen |
| <kbd>Esc</kbd> / <kbd>O</kbd> | Slide Overview Map |
| <kbd>S</kbd> | Speaker Notes View |
| <kbd>?</kbd> | Help & Full Shortcut List |

---

# Built with Hugo
### Zero build steps. Maximum longevity.
