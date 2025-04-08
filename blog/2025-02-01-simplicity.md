---
slug: simplicity
title: Simplicity
authors: [kavi]
tags: [gofs, coding, simplicity]
---

At the heart of well written code is a principle that's often overlooked: simplicity. Simple code is easier to understand, test, debug, and maintain. This post explores the importance of code simplicity, the risks of over-engineering, and how to make better decisions around when to build in-house and when to depend on external tools.

<!-- truncate -->

![simplicity](./img/simplicity.jpg)

## Code

Developers should aim to write code that is easy to read, not just for machines, but for other humans—including their future selves. Avoid overly clever constructs, deeply nested logic, or chaining too many operations in a single line. While powerful language features can offer brevity, they often obscure intent and make debugging more difficult. Prioritize readability over brevity by using descriptive variable names, straightforward control structures, and modular functions with clear responsibilities. Simple code is not only easier to understand and maintain, but also fosters better collaboration across teams and reduces the cognitive load for everyone involved. Clean syntax is a form of documentation in itself.

I was once called out by a senior developer for writing the code below. His comment was "There were once two minds who understood what was happening in this code: God and Kavi", and honestly I couldn't tell you what this code is supposed to do:

```
for (int k = 0; k < TEAMS; k++) {
    int r = k;
    if (r == i)
        r = j;
    else if (r == j)
        r = i;
    for (int l = 0; l < WEEKS - 1; l++) {
        int val = fixture[r * WEEKS + l];
        if (val == i + 1)
            val = j + 1;
        else if (val == (i + 1) * -1)
            val = (j + 1) * -1;
        else if (val == j + 1)
            val = i + 1;
        else if (val == (j + 1) * -1)
            val = (i + 1) * -1;
        fprintf(fp, "%3d,", val);
    }
    int val = fixture[r * WEEKS + WEEKS - 1];
    if (val == i + 1)
        val = j + 1;
    else if (val == (i + 1) * -1)
        val = (j + 1) - 1;
    else if (val == j + 1)
        val = i + 1;
    else if (val == (j + 1) * -1)
        val = (i + 1) * -1;
    fprintf(fp, "%3d\n", val);
}
```

## Internal Structure

Always write code to meet current, well-understood requirements. Designing for hypothetical future use cases often leads to over-engineered systems that are harder to maintain, extend, and debug. This tendency is especially common among senior engineers, who—motivated by past pain—may try to "future-proof" systems by adding abstractions that aren't yet necessary.

We’re particularly fond of Eric Lau’s satirical project [hello world](https://github.com/eric19960304/hello-world-overengineering), which uses a complex class hierarchy and the factory pattern just to print a single line. It’s a brilliant (and humorous) reminder that simplicity should remain a guiding principle, no matter how experienced you are.

Keep your architecture as simple as possible for as long as possible. Refactor when complexity becomes a requirement—not a default.

## Functionality

Research consistently shows that a large proportion of features—up to 80% in many systems—are rarely or never used. At companies like Google and Bing, internal studies have revealed that 80–90% of launched features either go unused or negatively impact key performance metrics.

Often, feature requests arrive with a pre-defined solution instead of a clear articulation of the underlying problem. When developers implement these requests without fully understanding the business need, the result is bloated software that is harder to test, maintain, and evolve.

To avoid this, developers should adopt a problem-first mindset. Collaborate with stakeholders to dig into the “why” behind each request. The goal should be to find the simplest viable solution—not just to deliver the requested functionality, but to solve the right problem.

## Final Thoughts

Simplicity in code isn’t about writing fewer lines—it’s about writing code that’s easier to reason about, easier to test, and easier to maintain. Every abstraction, library, or feature should be scrutinized not just for its immediate value, but for its long-term impact on the health of the system.

Code simplicity is not a lack of ambition—it's a sign of mature engineering.
