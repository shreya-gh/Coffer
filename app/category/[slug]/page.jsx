"use client";

import { useEffect, useState, use } from "react";
import RecCard from "@/components/RecCard";
import categoryThemes from "@/lib/categoryThemes";

const GLYPHS = {
  music: "♫",
  broadcast: "◻",
  literature: "✦",
  animation: "⬡",
  art: "◈",
  attire: "◇",
  games: "⊕",
  photography: "⦿",
  other: "∿",
};

export default function CategoryPage({ params }) {
  const { slug } = use(params);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const theme = slug ? (categoryThemes[slug] || categoryThemes.other) : categoryThemes.other;

  if (!slug) return null;

  useEffect(() => {
    async function fetchRecs() {
      const res = await fetch(
  `${window.location.origin}/api/recs?category=${slug}`
);
      const data = await res.json();
      setRecs(data.recs || []);
      setLoading(false);
    }
    fetchRecs();
  }, [slug]);

  return (
    <main style={{
      ...styles.main,
      background: theme.bg,
      height: "100dvh",
      overflow: "hidden",
    }}>
      {/* Left half — recs */}
      <div style={{
        padding: "48px 32px",
        borderRight: `1px solid ${theme.accent}44`,
        height: "100dvh",
        overflowY: "auto",
      }}>
        <a href="/" style={{ ...styles.back, color: theme.accent }}>
          ← Home 
        </a>

        <div style={{ ...styles.header, borderBottom: `1px solid ${theme.accent}` }}>
          <em style={styles.glyph}>{GLYPHS[slug] || "✦"}</em>
          <h1 style={{ ...styles.title, color: "white" }}>
            {slug.charAt(0).toUpperCase() + slug.slice(1)}
          </h1>
          <p style={{ ...styles.count, color: theme.accent }}>
            {loading ? "..." : `${recs.length} rec${recs.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div style={styles.feed}>
          {loading ? (
            <p style={{ ...styles.empty, color: theme.text }}>loading...</p>
          ) : recs.length === 0 ? (
            <p style={{ ...styles.empty, color: theme.text }}>
              nothing in {slug} yet — be the first to add one
            </p>
          ) : (
            recs.map((rec) => <RecCard key={rec.id} rec={rec} />)
          )}
        </div>
      </div>

      {/* Right half — quote + background */}
      <div style={{
        padding: "48px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: theme.image ? `url('${theme.image}')` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100dvh",
        position: "sticky",
        top: "0",
      }}>
        {mounted && (
          <blockquote style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "24px",
            lineHeight: "1.7",
            color: theme.text,
            textAlign: "center",
            maxWidth: "400px",
            fontStyle: "italic",
            opacity: 0.9,
          }}>
            {theme.quote}
          </blockquote>
        )}
      </div>
    </main>
  );
}

const styles = {
  main: {
    padding: "0",
    minHeight: "100dvh",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
  back: {
    fontSize: "11px",
    textDecoration: "none",
    letterSpacing: "0.05em",
    display: "block",
    marginBottom: "32px",
  },
  header: {
    paddingBottom: "24px",
    marginBottom: "24px",
  },
  glyph: {
    fontSize: "32px",
    display: "block",
    fontStyle: "normal",
    marginBottom: "8px",
  },
  title: {
    fontFamily: "Playfair Display, serif",
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "6px",
  },
  count: {
    fontSize: "11px",
  },
  feed: {
    marginTop: "8px",
  },
  empty: {
    fontSize: "12px",
    padding: "20px 0",
  },
};