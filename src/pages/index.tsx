import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import styles from "./index.module.css";
import { useColorMode } from "@docusaurus/theme-common";

export default function Home(): ReactNode {
  return (
    <Layout title={`Home`}>
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
          marginTop: "10rem",
        }}
      >
        <img
          src={colorMode === "dark" ? "./img/gofs-dark.svg" : "./img/gofs.svg"}
          alt="gofs"
          width="350"
        />
        <p
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "3rem",
            paddingBottom: "3rem",
          }}
        >
          Lightweight templates for secure full-stack go apps.
        </p>
      </section>
      <section>
        <h1 style={{ color: "#007297" }}>Backward Compatible.</h1>
        <p>
          No more upgrade cycles. Focus your effort on new features instead of
          keeping up with upgrades.
        </p>
        <h1 style={{ color: "#007297" }}>Few Dependencies.</h1>
        <p>Minimize dependency related issues and security vulnerabilities.</p>
        <h1 style={{ color: "#007297" }}>Developer Centric.</h1>
        <p>
          Better developer experience means happier developers, faster time to
          ship, and less bugs.
        </p>
      </section>
      <section>
        <p>
          Gofs apps are built on on top of these popular alternatives to
          heavyweight legacy frameworks. They have no dependencies of their own
          and are being developed with a philosophy of stability and backward
          compatibility similar to ours.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "60px",
          }}
        >
          <a href="https://alpinejs.dev">
            <img height={80} src="./img/alpinejs.svg" aria-label="alpinejs" />
          </a>
          <a
            style={{
              marginBottom: "90px",
              fontSize: "5rem",
              height: "80px",
            }}
            href="https://htmx.org"
          >
            <span>
              &lt;<b style={{ color: "blue" }}>/</b>&gt; htm
              <b style={{ color: "blue" }}>x</b>
            </span>
          </a>
          <a href="https://templ.guide">
            <img height={60} src="./img/templ.svg" aria-label="templ" />
          </a>
        </div>
      </section>
    </main>
  );
}
