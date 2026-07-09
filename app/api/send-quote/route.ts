import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { generateRoomPlanPdf, PdfPayload } from "@/lib/generatePdf";

const resend = new Resend(process.env.RESEND_API_KEY);

const PROJECT_TYPE_LABELS: Record<string, string> = {
  kuchnia: "Kuchnia",
  schody: "Schody",
  garderoba: "Garderoba",
  lazienka: "Łazienka",
  inne: "Inne",
};

type QuoteFormData = {
  imie: string;
  email: string;
  telefon: string;
  rodzajProjektu: string;
  opisProjektu: string;
};

type SendQuoteBody = PdfPayload & {
  formData: QuoteFormData;
};

export async function POST(req: NextRequest) {
  try {
    const body: SendQuoteBody = await req.json();
    const { formData, ...pdfPayload } = body;

    if (!formData?.imie || !formData?.email || !formData?.telefon) {
      return NextResponse.json(
        { error: "Brak wymaganych danych formularza" },
        { status: 400 },
      );
    }

    const pdfBytes = await generateRoomPlanPdf(pdfPayload);

    const projectTypeLabel =
      PROJECT_TYPE_LABELS[formData.rodzajProjektu] ?? formData.rodzajProjektu;

    const emailHtml = `
      <h2>Nowe zapytanie o wycenę</h2>
      <p><strong>Imię:</strong> ${escapeHtml(formData.imie)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(formData.email)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(formData.telefon)}</p>
      <p><strong>Rodzaj projektu:</strong> ${escapeHtml(projectTypeLabel)}</p>
      <p><strong>Opis projektu:</strong></p>
      <p>${escapeHtml(formData.opisProjektu).replace(/\n/g, "<br />")}</p>
      <p>Plan pomieszczenia znajduje się w załączniku PDF.</p>
    `;

    const carpenterEmail = process.env.CARPENTER_EMAIL;
    if (!carpenterEmail) {
      throw new Error("CARPENTER_EMAIL is not set");
    }

    await resend.emails.send({
      from: "Planer Bejger Manufaktura <onboarding@resend.dev>",
      to: carpenterEmail,
      replyTo: formData.email,
      subject: `Nowe zapytanie o wycenę — ${projectTypeLabel} (${formData.imie})`,
      html: emailHtml,
      attachments: [
        {
          filename: "plan-pomieszczenia.pdf",
          content: Buffer.from(pdfBytes),
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send quote failed:", err);
    return NextResponse.json(
      { error: "Nie udało się wysłać zapytania" },
      { status: 500 },
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
