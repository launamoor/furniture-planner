"use client";

import { useState } from "react";

export type QuoteFormData = {
  imie: string;
  email: string;
  telefon: string;
  rodzajProjektu: string;
  opisProjektu: string;
};

const PROJECT_TYPES = [
  { value: "kuchnia", label: "Kuchnia" },
  { value: "schody", label: "Schody" },
  { value: "garderoba", label: "Garderoba" },
  { value: "lazienka", label: "Łazienka" },
  { value: "inne", label: "Inne" },
];

type QuoteRequestModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: QuoteFormData) => Promise<void>;
};

const initialForm: QuoteFormData = {
  imie: "",
  email: "",
  telefon: "",
  rodzajProjektu: "kuchnia",
  opisProjektu: "",
};

export default function QuoteRequestModal({
  open,
  onClose,
  onSubmit,
}: QuoteRequestModalProps) {
  const [form, setForm] = useState<QuoteFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<QuoteFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const validate = (): boolean => {
    const next: Partial<QuoteFormData> = {};
    if (!form.imie.trim()) next.imie = "Podaj imię";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Podaj poprawny adres e-mail";
    if (!form.telefon.trim()) next.telefon = "Podaj numer telefonu";
    if (!form.opisProjektu.trim()) next.opisProjektu = "Opisz projekt";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      setForm(initialForm);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    fontSize: "13px",
    border: "1px solid #d8d0c4",
    borderRadius: "4px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: "#faf8f5",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: 600,
    color: "#7a6a5a",
    display: "block",
    marginBottom: "4px",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "10px",
    color: "#b5442e",
    marginTop: "3px",
    display: "block",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#f5f1eb",
          borderRadius: "8px",
          padding: "28px",
          width: "420px",
          maxWidth: "90vw",
          maxHeight: "85vh",
          overflowY: "auto",
          fontFamily: "sans-serif",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#2c1f0e",
            marginBottom: "4px",
          }}
        >
          Zapytaj o wycenę
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#7a6a5a",
            marginBottom: "18px",
            lineHeight: 1.5,
          }}
        >
          Wypełnij formularz, a my skontaktujemy się z Tobą w sprawie wyceny.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Imię</label>
            <input
              type="text"
              value={form.imie}
              onChange={(e) => setForm({ ...form, imie: e.target.value })}
              style={inputStyle}
              placeholder="np. Jan Kowalski"
            />
            {errors.imie && <span style={errorStyle}>{errors.imie}</span>}
          </div>

          <div>
            <label style={labelStyle}>E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
              placeholder="np. jan@przyklad.pl"
            />
            {errors.email && <span style={errorStyle}>{errors.email}</span>}
          </div>

          <div>
            <label style={labelStyle}>Telefon</label>
            <input
              type="tel"
              value={form.telefon}
              onChange={(e) => setForm({ ...form, telefon: e.target.value })}
              style={inputStyle}
              placeholder="np. 600 000 000"
            />
            {errors.telefon && <span style={errorStyle}>{errors.telefon}</span>}
          </div>

          <div>
            <label style={labelStyle}>Rodzaj projektu</label>
            <select
              value={form.rodzajProjektu}
              onChange={(e) =>
                setForm({ ...form, rodzajProjektu: e.target.value })
              }
              style={inputStyle}
            >
              {PROJECT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Opis projektu</label>
            <textarea
              value={form.opisProjektu}
              onChange={(e) =>
                setForm({ ...form, opisProjektu: e.target.value })
              }
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
              placeholder="Opisz swój projekt, oczekiwania, preferowany rodzaj drewna itp."
            />
            {errors.opisProjektu && (
              <span style={errorStyle}>{errors.opisProjektu}</span>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "22px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            disabled={submitting}
            style={{
              padding: "9px 16px",
              background: "transparent",
              color: "#7a6a5a",
              border: "1px solid #d8d0c4",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            Anuluj
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: "9px 18px",
              background: "#2c1f0e",
              color: "#f5f1eb",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? "Wysyłanie..." : "Wyślij zapytanie"}
          </button>
        </div>
      </div>
    </div>
  );
}
