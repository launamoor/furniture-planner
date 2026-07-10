"use client";

export default function ScreenTooSmallWarning() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#F5F2EE",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
        fontFamily: "var(--font-dmsans), 'DM Sans', system-ui, sans-serif",
        zIndex: 100,
      }}
    >
      <span style={{ fontSize: "32px", marginBottom: "12px" }}>🖥️</span>
      <h1
        style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "#2A2622",
          marginBottom: "8px",
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
        }}
      >
        Ekran jest za mały
      </h1>
      <p
        style={{
          fontSize: "13px",
          color: "#928B82",
          maxWidth: "360px",
          lineHeight: 1.6,
        }}
      >
        Planer pomieszczeń to narzędzie, które wymaga szerszego ekranu. Prosimy
        o skorzystanie z komputera lub laptopa, aby móc w pełni korzystać z
        narzędzia.
      </p>
    </div>
  );
}
