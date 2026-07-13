import "./globals.css";

export const metadata = {
  title: "Coffer",
  description: "A shared archive of obscure things worth knowing about.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <nav
  style={{
    borderBottom: "var(--rule)",
    padding: "14px 32px",
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    height: "50px",
    background: "rgba(237, 232, 223, 0.92)",
  }}
>
          <span
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "18px",
            }}
          >
            Coffer
          </span>
         
          <li><a href="/my-recs" style={{ color: "var(--ink-muted)", textDecoration: "none", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>My recs</a></li>
        </nav>
        {children}
        
      </body>
    </html>
  );
}