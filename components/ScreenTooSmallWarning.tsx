"use client";

export default function ScreenTooSmallWarning() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#faf8f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
        fontFamily: "sans-serif",
        zIndex: 100,
      }}
    >
      <span style={{ fontSize: "32px", marginBottom: "12px" }}>🖥️</span>
      <h1
        style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "#2c1f0e",
          marginBottom: "8px",
        }}
      >
        Ekran jest za mały
      </h1>
      <p
        style={{
          fontSize: "13px",
          color: "#7a6a5a",
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
