import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";
import { useColorMode } from "@docusaurus/theme-common";

export default function Home(): ReactNode {
  return (
    <Layout title="Home">
      <HomePage />
    </Layout>
  );
}

function HomePage(): ReactNode {
  const { colorMode } = useColorMode();
  return (
    <main className={styles.homecontainer}>
      <section
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: "6rem",
          marginBottom: "4rem",
        }}
      >
        <img
          src={colorMode === "dark" ? "./img/gofs-dark.svg" : "./img/gofs.svg"}
          alt="gofs"
          width="350"
        />
        <p
          style={{
            textAlign: "center",
            paddingTop: "2rem",
            paddingBottom: "1.5rem",
            fontSize: "1.25rem",
            maxWidth: "600px",
            lineHeight: "1.6",
          }}
        >
          Lightweight templates for evergreen full-stack Go apps built on web
          standards, zero runtime dependencies, and AI-accelerated simplicity.
        </p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Link
            className="button button--primary button--lg"
            to="/docs/overview"
          >
            Philosophy & Overview
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/start"
          >
            Quick Start
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: "750px", width: "100%" }}>
        <h2 style={{ color: "#007297", marginTop: "2rem" }}>
          Backward Compatible & Evergreen
        </h2>
        <p>
          Escape the framework upgrade treadmill. Powered by Go's 1.x compatibility
          promise on the backend and W3C web standards in the browser, your code
          compiles, runs, and renders unchanged for decades without costly rewrite
          cycles.
        </p>

        <h2 style={{ color: "#007297", marginTop: "2rem" }}>
          Zero Runtime Dependencies & Supply Chain Resilience
        </h2>
        <p>
          No npm, no <code>node_modules</code>, and no fragile bundler toolchains.
          The backend leverages Go's standard library and <code>sqlc</code> (which
          bundles zero runtime dependencies). Eliminating third-party runtime
          dependencies protects your application from supply chain attacks,
          transitive CVEs, and dependency hell.
        </p>

        <h2 style={{ color: "#007297", marginTop: "2rem" }}>
          Web Standards & Declarative Shadow DOM
        </h2>
        <p>
          Leverage native browser capabilities instead of monolithic JavaScript
          frameworks. Server-render pages with Go's <code>html/template</code>,
          encapsulate components using Declarative Shadow DOM (DSD), and add reactive
          islands with a lightweight Lit wrapper vendored directly into your Go
          binary.
        </p>

        <h2 style={{ color: "#007297", marginTop: "2rem" }}>
          AI-Accelerated Simplicity
        </h2>
        <p>
          Standard HTML, modern CSS, SQL, and Go templates are AI's native
          language. Generative AI eliminates the historic friction of typing
          boilerplate by hand, allowing you to build with maximum speed while
          keeping your codebase flat, transparent, and completely abstraction-free.
        </p>
      </section>
    </main>
  );
}
