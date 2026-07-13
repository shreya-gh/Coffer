"use client";

import { useEffect, useState } from "react";
import { getOrCreateUserId } from "@/lib/identity";


export default function RecCard({ rec }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const userId = getOrCreateUserId();
    fetch(
      `/api/likes/${rec.id}?user_id=${userId}`
    )
      .then((res) => res.json())
      .then((data) => setCount(data.count));
  }, [rec.id]);
  
  return (

<a href={`/rec/${rec.id}`} style={styles.row}>
<div>
        <span style={styles.badge}>{rec.category}</span>
      </div>
      <div>
        <div style={styles.title}>{rec.title}</div>
        {rec.one_word && (
          <span style={styles.oneWord}>{rec.one_word}</span>
        )}
      </div>
      <div style={styles.by}>
        added by<span style={styles.byName}>{rec.submitter_name}</span>
      </div>
      <div style={styles.likes}>♥ {count}</div>
    </a>
  );
}

const styles = {
  row: {
    display: "grid",
    gridTemplateColumns: "80px 1fr 100px 50px",
    alignItems: "start",
    gap: "20px",
    padding: "18px 12px",
    borderBottom: "var(--rule-faint)",
    cursor: "pointer",
    textDecoration: "none",
    color: "var(--ink)",
    background: "rgba(237, 232, 223, 0.75)",
  },
  badge: {
    fontSize: "9px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--gold)",
    border: "1px solid var(--gold)",
    padding: "3px 7px",
    display: "inline-block",
    marginTop: "3px",
  },
  title: {
    fontFamily: "Playfair Display, serif",
    fontSize: "16px",
    fontWeight: "700",
    lineHeight: "1.2",
    marginBottom: "4px",
  },
  desc: {
    fontSize: "11px",
    color: "var(--ink-muted)",
    lineHeight: "1.6",
  },
  oneWord: {
    display: "inline-block",
    fontSize: "9px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--gold)",
    marginTop: "6px",
  },
  by: {
    fontSize: "10px",
    color: "var(--ink-muted)",
    paddingTop: "4px",
  },
  byName: {
    display: "block",
    color: "var(--ink)",
    fontSize: "11px",
  },
  likes: {
    fontSize: "10px",
    color: "var(--ink-muted)",
    paddingTop: "4px",
    textAlign: "right",
  },
};