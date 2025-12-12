/* eslint-disable react/no-danger */
import type { Metadata } from "next";

import { Providers } from "./providers";
import "./global.css";
import { themeInitScript } from "./themeScript";

export const metadata: Metadata = {
  title: "Freight Reader Dashboard",
  description: "Upload freight documents and track parsing jobs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{
          margin: 0,
          background: "#f8f9fa",
          color: "#0f172a",
          fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        {/* Preload theme to avoid flash */}
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
          suppressHydrationWarning
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
