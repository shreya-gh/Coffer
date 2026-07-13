"use client";

import { useRouter } from "next/navigation";

const CATEGORIES = [
  { name: "music", glyph: "♫" },
  { name: "broadcast", glyph: "◻" },
  { name: "literature", glyph: "✦" },
  { name: "animation", glyph: "⬡" },
  { name: "art", glyph: "◈" },
  { name: "attire", glyph: "◇" },
  { name: "games", glyph: "⊕" },
   { name: "photography", glyph: "⦿" },
  { name: "other", glyph: "∿" },
];

export default function CategoryGrid() {
  const router = useRouter();

  return (
    <div style={styles.grid}>
      {CATEGORIES.map((cat) => (
        <div
          key={cat.name}
          style={styles.cat}
          onClick={() => router.push(`/category/${cat.name}`)}
        >
          <em style={styles.glyph}>{cat.glyph}</em>
          <span style={styles.name}>{cat.name}</span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "flex",
    flexDirection: "column",
    borderTop: "var(--rule)",
  },
  cat: {
    borderBottom: "var(--rule)",
    padding: "16px 12px",
    cursor: "pointer",
    transition: "background 0.12s",
  },
  glyph: {
    fontSize: "16px",
    marginBottom: "4px",
    display: "block",
    fontStyle: "normal",
  },
  name: {
    fontSize: "10px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    display: "block",
  },
};