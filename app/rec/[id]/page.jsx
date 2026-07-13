"use client";

import { useEffect, useState, use } from "react";
import LikeButton from "@/components/LikeButton";

export default function RecPage({ params }) {
  const { id } = use(params);
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRec() {
      const res = await fetch(`http://localhost:4000/api/recs/${id}`);
      const data = await res.json();
      setRec(data.rec);
      setLoading(false);
    }
    fetchRec();
  }, [id]);

  if (loading) {
    return (
      <main style={styles.main}>
        <p style={styles.muted}>loading...</p>
      </main>
    );
  }

  if (!rec) {
    return (
      <main style={styles.main}>
        <p style={styles.muted}>rec not found</p>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      {/* Back link */}
      <a href="/" style={styles.back}>
        ← back to coffer
      </a>

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.badge}>{rec.category}</span>
        <h1 style={styles.title}>{rec.title}</h1>
        <p style={styles.by}>
          added by <strong>{rec.submitter_name}</strong> ·{" "}
          {new Date(rec.submitted_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* OG Image */}
      {rec.og_image && (
        <img src={rec.og_image} alt={rec.title} style={styles.ogImage} />
      )}

      {/* Description */}
      <div style={styles.body}>
        <p style={styles.description}>{rec.description}</p>
        {rec.one_word && (
          <span style={styles.oneWord}>{rec.one_word}</span>
        )}
        {rec.link && (
          <a href={rec.link} target="_blank" rel="noopener noreferrer" style={styles.link}>
            visit link →
          </a>
        )}
      </div>

      {/* Like button */}
      <div style={styles.likeRow}>
        <LikeButton recId={rec.id} />
      </div>
    </main>
  );
}

const styles = {
  main: {
    padding: "48px 32px",
    maxWidth: "720px",
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
  },
  badge: {
    fontSize: "9px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--gold)",
    border: "1px solid var(--gold)",
    padding: "3px 7px",
    display: "inline-block",
    marginBottom: "12px",
  },
  title: {
    fontFamily: "Playfair Display, serif",
    fontSize: "32px",
    fontWeight: "700",
    lineHeight: "1.2",
    marginBottom: "10px",
  },
  by: {
    fontSize: "11px",
    color: "var(--ink-muted)",
  },
  ogImage: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "cover",
    marginBottom: "24px",
    border: "var(--rule-faint)",
  },
  body: {
    marginBottom: "24px",
  },
  description: {
    fontSize: "14px",
    lineHeight: "1.9",
    marginBottom: "16px",
  },
  oneWord: {
    display: "inline-block",
    fontSize: "9px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--gold)",
    marginBottom: "16px",
    marginRight: "12px",
  },
  link: {
    display: "block",
    fontSize: "11px",
    color: "var(--gold)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  likeRow: {
    borderTop: "var(--rule-faint)",
    paddingTop: "20px",
  },
  muted: {
    fontSize: "12px",
    color: "var(--ink-muted)",
  },
};