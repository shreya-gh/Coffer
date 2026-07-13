"use client";

import { useEffect, useState } from "react";
import { getOrCreateUserId } from "@/lib/identity";
import RecCard from "@/components/RecCard";

export default function MyRecsPage() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getOrCreateUserId();
    fetch(`/api/recs/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setRecs(data.recs || []);
        setLoading(false);
      });
  }, []);

  return (
    <main style={styles.main}>
      <a href="/" style={styles.back}>← Home </a>

      <div style={styles.header}>
        <h1 style={styles.title}>Personal Library</h1>
        <p style={styles.count}>
          {loading ? "..." : `${recs.length} rec${recs.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      <div style={styles.feed}>
        {loading ? (
          <p style={styles.empty}>loading...</p>
        ) : recs.length === 0 ? (
          <p style={styles.empty}>
            you haven't added anything yet —{" "}
            <a href="/" style={{ color: "var(--gold)" }}>
              add your first entry
            </a>
          </p>
        ) : (
          recs.map((rec) => (
            <RecCard key={rec.id} rec={rec} />
          ))
        )}
      </div>
    </main>
  );
}

const styles = {
  main: {
    padding: "48px 32px",
    maxWidth: "900px",
  },
  back: {
    fontSize: "11px",
    color: "var(--ink-muted)",
    textDecoration: "none",
    letterSpacing: "0.05em",
    display: "block",
    marginBottom: "32px",
  },
  header: {
    borderBottom: "var(--rule)",
    paddingBottom: "24px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Playfair Display, serif",
    fontSize: "32px",
    fontWeight: "700",
  },
  count: {
    fontSize: "11px",
    color: "var(--ink-muted)",
  },
  feed: {
    marginTop: "8px",
  },
  recWrapper: {
    position: "relative",
  },
  statusApproved: {
    position: "absolute",
    right: "0",
    top: "18px",
    fontSize: "9px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#4a7c59",
    border: "1px solid #4a7c59",
    padding: "2px 6px",
  },
  statusPending: {
    position: "absolute",
    right: "0",
    top: "18px",
    fontSize: "9px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--gold)",
    border: "1px solid var(--gold)",
    padding: "2px 6px",
  },
  statusRejected: {
    position: "absolute",
    right: "0",
    top: "18px",
    fontSize: "9px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#c0392b",
    border: "1px solid #c0392b",
    padding: "2px 6px",
  },
  empty: {
    fontSize: "12px",
    color: "var(--ink-muted)",
    padding: "20px 0",
  },
};