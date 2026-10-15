---
title: "Interactive Slide Decks"
description: "Interactive presentations powered by Reveal.js, pure Markdown, and zero npm build dependencies."
---

Presentations can be embedded directly into any page or viewed in standalone full-screen presentation mode. 

{{< reveal src="/slides/demo/" title="Demo Presentation" >}}

---

### How to Navigate
* Click inside the frame above and press <kbd>Space</kbd> or the <kbd>→</kbd> arrow to advance.
* Press <kbd>F</kbd> for native fullscreen presentation mode.
* Press <kbd>Esc</kbd> or <kbd>O</kbd> to see an interactive map of all slides.
* You can also open the deck in its own tab: [**Full-Screen Slide View (/slides/demo/)**](/slides/demo/).

### Authoring Slides
To create a new slide presentation, add a `.md` file to `content/slides/` with `layout: "slides"`:

```markdown
---
title: "My Presentation"
layout: "slides"
outputs: ["HTML"]
---

# Slide 1
Intro content

---

## Slide 2
Horizontal slide

--

### Slide 2.1
Vertical slide stack
```
