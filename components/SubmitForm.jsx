"use client";

import { useState, useEffect } from "react";
import { getOrCreateUserId } from "@/lib/identity";

const CATEGORIES = [
  "music",
  "broadcast",
  "literature",
  "animation",
  "art",
  "attire",
  "games",
  "photography",
  "other",
];

export default function SubmitForm({ onSuccess }) {
  const [userId, setUserId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "music",
    submitter_name: "",
    one_word: "",
    description: "",
    link: "",
  });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error' | 'duplicate'
  const [error, setError] = useState(null);
  const [duplicate, setDuplicate] = useState(null);
  const [linkStatus, setLinkStatus] = useState(null); // null | 'checking' | 'valid' | 'invalid'
  const [ogPreview, setOgPreview] = useState(null);

  // get or create browser ID on mount
  useEffect(() => {
    setUserId(getOrCreateUserId());
  }, []);

  // validate link as user types
  useEffect(() => {
    if (!form.link) {
      setLinkStatus(null);
      setOgPreview(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLinkStatus("checking");
      try {
        const res = await fetch(
          `http://localhost:4000/api/og?url=${encodeURIComponent(form.link)}`
        );
        const data = await res.json();

        if (data.error) {
          setLinkStatus("invalid");
          setOgPreview(null);
        } else {
          setLinkStatus("valid");
          setOgPreview(data);
        }
      } catch {
        setLinkStatus("invalid");
      }
    }, 800); // wait 800ms after user stops typing before checking

    return () => clearTimeout(timer);
  }, [form.link]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    setDuplicate(null);

    try {
      const res = await fetch("http://localhost:4000/api/recs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, user_id: userId }),
      });

      const data = await res.json();

      if (res.status === 409) {
        // duplicate detected
        setStatus("duplicate");
        setDuplicate(data);
        return;
      }

      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong");
        return;
      }

      setStatus("success");
      setForm({
        title: "",
        category: "music",
        submitter_name: "",
        description: "",
        link: "",
      });
      setOgPreview(null);
      if (onSuccess) onSuccess(data.rec);
    } catch {
      setStatus("error");
      setError("Could not reach the server");
    }
  }

  return (
    <div style={styles.panel}>
      <p style={styles.panelLabel}>Add a reccomendation</p>

      <form onSubmit={handleSubmit}>
        {/* Name + Category row */}
        <div style={styles.formGrid}>
          <div style={styles.formRow}>
            <label style={styles.label}>Your alias</label>
            <input
              style={styles.input}
              name="submitter_name"
              value={form.submitter_name}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.formRow}>
            <label style={styles.label}>Category</label>
            <select
              style={styles.input}
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        <div style={styles.formRow}>
          <label style={styles.label}>Title - Author</label>
          <input
            style={styles.input}
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

      {/* One word */}
<div style={styles.formRow}>
  <label style={styles.label}>Tag it — this will show up everywhere.</label>
  <input
    style={styles.input}
    name="one_word"
    value={form.one_word}
    onChange={handleChange}
    placeholder="Something like: haunting."
    required
  />
</div>

        {/* Description */}
        <div style={styles.formRow}>
          <label style={styles.label}>What's great and why should they know?</label>
          <input
            style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Example: Who knows? I just like it."
            required
          />
        </div>

        {/* Link */}
        <div style={styles.formRow}>
          <label style={styles.label}>
            Link{" "}
            <span style={{ color: "var(--ink-faint)", fontSize: "10px" }}>
              optional
            </span>
          </label>
          <input
            style={styles.input}
            name="link"
            value={form.link}
            onChange={handleChange}
            placeholder="https://..."
          />
          {/* link status indicator */}
          {linkStatus === "checking" && (
            <p style={styles.linkChecking}>checking link...</p>
          )}
          {linkStatus === "valid" && (
            <p style={styles.linkValid}>✓ valid — website reachable</p>
          )}
          {linkStatus === "invalid" && (
            <p style={styles.linkInvalid}>✗ invalid or unreachable URL</p>
          )}
        </div>

        {/* OG Preview */}
        {ogPreview && ogPreview.og_image && (
          <div style={styles.ogPreview}>
            <img
              src={ogPreview.og_image}
              alt="link preview"
              style={styles.ogImage}
            />
            {ogPreview.og_title && (
              <p style={styles.ogTitle}>{ogPreview.og_title}</p>
            )}
          </div>
        )}

        {/* Duplicate warning */}
        {status === "duplicate" && duplicate && (
          <div style={styles.duplicateWarning}>
            <p>
              ⚠ This looks similar to an existing rec:{" "}
              <strong>{duplicate.matchedTitle}</strong>
            </p>
            <p style={{ marginTop: "6px", fontSize: "11px" }}>
              If yours is genuinely different, rename it to be more specific.
            </p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <p style={styles.errorMsg}>✗ {error}</p>
        )}

        {/* Success */}
        {status === "success" && (
          <p style={styles.successMsg}>✓ Added to Coffer</p>
        )}

        <button
          type="submit"
          style={status === "loading" ? styles.btnLoading : styles.btn}
          disabled={status === "loading" || linkStatus === "invalid"}
        >
          {status === "loading" ? "Adding..." : "Add to Coffer →"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  panel: {
    border: "var(--rule)",
    padding: "24px",
    background: "transparent",
  },
  panelLabel: {
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--gold)",
    marginBottom: "16px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  formRow: {
    marginBottom: "14px",
  },
  label: {
    display: "block",
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--ink-muted)",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.15)",
    border: "none",
    borderBottom: "var(--rule)",
    padding: "8px 4px",
    fontFamily: "DM Mono, monospace",
    fontSize: "12px",
    color: "var(--ink)",
    outline: "none",
  },
  btn: {
    width: "100%",
    background: "var(--ink)",
    color: "var(--bg)",
    border: "none",
    padding: "11px",
    fontFamily: "DM Mono, monospace",
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    cursor: "pointer",
    marginTop: "8px",
  },
  btnLoading: {
    width: "100%",
    background: "var(--ink-muted)",
    color: "var(--bg)",
    border: "none",
    padding: "11px",
    fontFamily: "DM Mono, monospace",
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    cursor: "not-allowed",
    marginTop: "8px",
  },
  linkChecking: {
    fontSize: "10px",
    color: "var(--ink-muted)",
    marginTop: "4px",
  },
  linkValid: {
    fontSize: "10px",
    color: "#4a7c59",
    marginTop: "4px",
  },
  linkInvalid: {
    fontSize: "10px",
    color: "#c0392b",
    marginTop: "4px",
  },
  ogPreview: {
    border: "var(--rule-faint)",
    padding: "10px",
    marginBottom: "12px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  ogImage: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    flexShrink: 0,
  },
  ogTitle: {
    fontSize: "11px",
    color: "var(--ink-muted)",
  },
  duplicateWarning: {
    background: "var(--gold-pale)",
    border: "1px solid var(--gold)",
    padding: "10px 12px",
    fontSize: "12px",
    marginBottom: "10px",
  },
  errorMsg: {
    fontSize: "11px",
    color: "#c0392b",
    marginBottom: "8px",
  },
  successMsg: {
    fontSize: "11px",
    color: "#4a7c59",
    marginBottom: "8px",
  },
};