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
          Lightweight templates for evergreen full-stack Go apps.
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
    </main>
  );
}
