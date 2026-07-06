import { PDFDocument, rgb, PDFPage, PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs/promises";
import path from "path";

// AI GENERATED <<<<<<<<<<<<<<<<<<<<<<<<<

type FurnitureLike = {
  name: string;
  width: number; // metres
  height: number; // metres (depth)
  heightCm: number;
  woodType?: string;
  x: number;
  y: number;
  floorOffsetCm?: number;
  ceilingOffsetCm?: number;
};

type ElevationData = {
  image: string; // data URL
  floorItems: FurnitureLike[];
  hangingItems: FurnitureLike[];
};

export type PdfPayload = {
  room: { width: number; height: number; roomHeightCm: number };
  overviewImage: string;
  floorImage: string;
  hangingImage: string;
  floorItems: FurnitureLike[];
  hangingItems: FurnitureLike[];
  elevations: Record<string, ElevationData>;
};

const WALL_LABELS: Record<string, string> = {
  top: "Górna",
  bottom: "Dolna",
  left: "Lewa",
  right: "Prawa",
};

async function embedDataUrlImage(pdfDoc: PDFDocument, dataUrl: string) {
  const base64 = dataUrl.split(",")[1];
  const bytes = Buffer.from(base64, "base64");
  if (dataUrl.startsWith("data:image/png")) {
    return pdfDoc.embedPng(bytes);
  }
  return pdfDoc.embedJpg(bytes);
}

function drawTitle(page: PDFPage, font: PDFFont, text: string, y: number) {
  page.drawText(text, {
    x: 40,
    y,
    size: 16,
    font,
    color: rgb(0.17, 0.13, 0.1),
  });
}

function drawTable(
  page: PDFPage,
  font: PDFFont,
  boldFont: PDFFont,
  items: FurnitureLike[],
  startY: number,
  type: "floor" | "hanging",
): number {
  const headers =
    type === "floor"
      ? ["Nazwa", "Szer.", "Głęb.", "Wys.", "Drewno", "Od podłogi"]
      : ["Nazwa", "Szer.", "Głęb.", "Wys.", "Drewno", "Od sufitu"];

  const colX = [40, 180, 240, 300, 360, 460];
  let y = startY;

  headers.forEach((h, i) => {
    page.drawText(h, {
      x: colX[i],
      y,
      size: 9,
      font: boldFont,
      color: rgb(0.17, 0.13, 0.1),
    });
  });
  y -= 16;

  items.forEach((item) => {
    const row = [
      item.name,
      `${Math.round(item.width * 100)}cm`,
      `${Math.round(item.height * 100)}cm`,
      `${item.heightCm}cm`,
      item.woodType ?? "-",
      type === "floor"
        ? `${item.floorOffsetCm ?? 0}cm`
        : `${item.ceilingOffsetCm ?? 0}cm`,
    ];
    row.forEach((cell, i) => {
      page.drawText(String(cell), {
        x: colX[i],
        y,
        size: 9,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
    });
    y -= 14;
  });

  return y;
}

async function addImagePage(
  pdfDoc: PDFDocument,
  font: PDFFont,
  boldFont: PDFFont,
  title: string,
  imageDataUrl: string,
  table?: { items: FurnitureLike[]; type: "floor" | "hanging" },
) {
  const page = pdfDoc.addPage([595, 842]); // A4 portrait, points
  const { width: pageWidth } = page.getSize();

  drawTitle(page, boldFont, title, 800);

  const img = await embedDataUrlImage(pdfDoc, imageDataUrl);
  const maxImgWidth = pageWidth - 80;
  const scale = Math.min(maxImgWidth / img.width, 400 / img.height);
  const imgW = img.width * scale;
  const imgH = img.height * scale;

  page.drawImage(img, {
    x: (pageWidth - imgW) / 2,
    y: 780 - imgH,
    width: imgW,
    height: imgH,
  });

  if (table && table.items.length > 0) {
    drawTable(page, font, boldFont, table.items, 780 - imgH - 30, table.type);
  }
}

export async function generateRoomPlanPdf(
  payload: PdfPayload,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const regularBytes = await fs.readFile(
    path.join(process.cwd(), "public/fonts/NotoSans-Regular.ttf"),
  );
  const boldBytes = await fs.readFile(
    path.join(process.cwd(), "public/fonts/NotoSans-Bold.ttf"),
  );

  const font = await pdfDoc.embedFont(regularBytes);
  const boldFont = await pdfDoc.embedFont(boldBytes);

  // Cover / room info page
  const coverPage = pdfDoc.addPage([595, 842]);
  drawTitle(
    coverPage,
    boldFont,
    "Bejger Manufaktura — Plan pomieszczenia",
    800,
  );
  coverPage.drawText(`Szerokość: ${Math.round(payload.room.width * 100)} cm`, {
    x: 40,
    y: 760,
    size: 11,
    font,
  });
  coverPage.drawText(`Głębokość: ${Math.round(payload.room.height * 100)} cm`, {
    x: 40,
    y: 745,
    size: 11,
    font,
  });
  coverPage.drawText(`Wysokość: ${payload.room.roomHeightCm} cm`, {
    x: 40,
    y: 730,
    size: 11,
    font,
  });

  // Overview
  await addImagePage(
    pdfDoc,
    font,
    boldFont,
    "Widok ogólny",
    payload.overviewImage,
  );

  // Floor furniture
  await addImagePage(
    pdfDoc,
    font,
    boldFont,
    "Meble stojące",
    payload.floorImage,
    {
      items: payload.floorItems,
      type: "floor",
    },
  );

  // Hanging furniture
  await addImagePage(
    pdfDoc,
    font,
    boldFont,
    "Meble wiszące",
    payload.hangingImage,
    {
      items: payload.hangingItems,
      type: "hanging",
    },
  );

  // Elevations
  for (const [wallKey, data] of Object.entries(payload.elevations)) {
    const label = WALL_LABELS[wallKey] ?? wallKey;
    const allItems = [...data.floorItems, ...data.hangingItems];
    await addImagePage(
      pdfDoc,
      font,
      boldFont,
      `Elewacja — ściana ${label}`,
      data.image,
      {
        items: allItems,
        type: "floor", // mixed table; see note below
      },
    );
  }

  return pdfDoc.save();
}
