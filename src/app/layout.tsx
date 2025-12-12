import type { Metadata } from "next";

import { Providers } from "./providers";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
