export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 20% 20%, #111827, #0b1224 45%, #060a16 100%)",
        color: "#e5e7eb",
        fontFamily: "Inter, 'IBM Plex Sans', system-ui, -apple-system, sans-serif",
        padding: "3rem 1.5rem",
      }}
    >
      <section
        style={{
          maxWidth: "720px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          padding: "2.5rem",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.45)",
        }}
      >
        <p
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.5rem 0.95rem",
            borderRadius: "999px",
            background: "rgba(16, 185, 129, 0.12)",
            color: "#34d399",
            fontWeight: 600,
            letterSpacing: "0.01em",
            marginBottom: "1rem",
            fontSize: "0.95rem",
          }}
        >
          FreightReader.io · Early build placeholder
        </p>
        <h1
          style={{
            fontSize: "2.8rem",
            lineHeight: 1.1,
            marginBottom: "1rem",
            color: "#f9fafb",
            letterSpacing: "-0.03em",
          }}
        >
          Turn messy freight PDFs into structured data in seconds.
        </h1>
        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.6,
            color: "rgba(229, 231, 235, 0.8)",
            marginBottom: "1.75rem",
          }}
        >
          This placeholder page confirms the app boots while we wire up uploads,
          background parsing, and export flows. Replace this screen with the
          real interface once the APIs and components land.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            "Upload freight PDFs (BOLs, PODs, rate cons)",
            "OCR + Claude vision for scanned docs",
            "Zod-validated JSON ready for TMS import",
            "React Query polling for job status",
          ].map((item) => (
            <div
              key={item}
              style={{
                padding: "0.9rem 1rem",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                background: "rgba(255, 255, 255, 0.03)",
                fontWeight: 600,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
