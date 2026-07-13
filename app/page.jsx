"use client";

import SubmitForm from "@/components/SubmitForm";
import CategoryGrid from "@/components/CategoryGrid";

export default function HomePage() {
  return (
    <div style={styles.wrapper}>
      <main style={styles.main}>
        {/* Left sidebar — categories */}
        <aside style={styles.sidebar}>
          <p style={styles.sidebarLabel}>Browse by category</p>
          <CategoryGrid />
        </aside>

        {/* Center — background image area with floating form */}
        <section style={styles.center}>
          {/* Quote card */}
          <div style={styles.quoteBox}>
           <img src="/box.svg" alt="Coffer quote card"
           style={{
    width: "1000px",
    height: "auto",
  }}
           
          />
          </div>

          {/* Floating form */}
          <div style={styles.floatingForm}>
            <SubmitForm />
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    backgroundImage: "url('/paper.png')",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    height: "calc(100vh - 50px)",
    overflow: "hidden",
  },
  main: {
    display: "grid",
    gridTemplateColumns: "160px 1fr",
    height: "100%",
  },
  sidebar: {
    borderRight: "var(--rule)",
    background: "rgba(237, 232, 223, 0.92)",
    padding: "24px 0",
    overflowY: "auto",
    height: "100%",
  },
  sidebarLabel: {
    fontSize: "9px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--ink-muted)",
    padding: "0 12px 12px",
    borderBottom: "var(--rule-faint)",
    marginBottom: "4px",
    display: "block",
  },
  center: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    overflow: "hidden",
  },
  quoteBox: {
    textAlign: "center",
    width: "500px",
    maxWidth: "500px",
    zIndex: 1,
    transform: "translateX(-120px)",
  },
  quote: {
    fontFamily: "Playfair Display, serif",
    fontSize: "28px",
    lineHeight: "1.5",
    color: "rgba(26, 24, 6, 0.85)",
    textShadow: "0 1px 3px rgba(237, 232, 223, 0.6)",
    fontStyle: "normal",
  },
  floatingForm: {
    position: "absolute",
    top: "50%",
    right: "40px",
    transform: "translateY(-50%)",
    width: "380px",
    background: "rgba(237, 232, 223, 0.82)",
    border: "var(--rule)",
    boxShadow: "4px 4px 24px rgba(0,0,0,0.12)",
    zIndex: 10,
    maxHeight: "90vh",
    overflowY: "auto",
  },
  quoteCard: {
  width: "1000px",
  maxWidth: "90%",
  height: "auto",
  display: "block",
},
};