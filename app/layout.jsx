import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Coffer",
  description: "Web repository to explore different media across the Internet through user contributions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
       <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
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