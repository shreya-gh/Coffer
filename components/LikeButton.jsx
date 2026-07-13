"use client";

import { useEffect, useState } from "react";
import { getOrCreateUserId } from "@/lib/identity";

export default function LikeButton({ recId }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = getOrCreateUserId();
    fetch(`http://localhost:4000/api/likes/${recId}?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setCount(data.count);
        setLiked(data.userLiked);
      });
  }, [recId]);

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    const userId = getOrCreateUserId();
    const res = await fetch("http://localhost:4000/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rec_id: recId, user_id: userId }),
    });

    const data = await res.json();
    setLiked(data.liked);
    setCount((prev) => (data.liked ? prev + 1 : prev - 1));
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      style={liked ? styles.btnLiked : styles.btn}
    >
      ♥ {count}
    </button>
  );
}

const styles = {
  btn: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "none",
    border: "1px solid var(--ink-faint)",
    padding: "4px 10px",
    cursor: "pointer",
    fontFamily: "DM Mono, monospace",
    fontSize: "10px",
    color: "var(--ink-muted)",
    transition: "all 0.12s",
  },
  btnLiked: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "var(--gold-pale)",
    border: "1px solid var(--gold)",
    padding: "4px 10px",
    cursor: "pointer",
    fontFamily: "DM Mono, monospace",
    fontSize: "10px",
    color: "var(--gold)",
    transition: "all 0.12s",
  },
};