import { NextRequest, NextResponse } from "next/server";
import { generateRoomPlanPdf, PdfPayload } from "@/lib/generatePdf";

export async function POST(req: NextRequest) {
  try {
    const payload: PdfPayload = await req.json();

    const pdfBytes = await generateRoomPlanPdf(payload);

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="bejger-manufaktura-plan.pdf"',
      },
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 },
    );
  }
}
