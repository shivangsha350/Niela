import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const cleanName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 30);
    const filename = `${cleanName || "product"}-${Date.now()}.png`;
    const filePath = path.join(uploadsDir, filename);

    // Process to 1024x1024 standard 1:1 square with crystal clarity
    const imageInfo = await sharp(buffer).metadata();
    const hasAlpha = Boolean(imageInfo.hasAlpha);

    const processedBuffer = await sharp(buffer)
      .resize(1024, 1024, {
        fit: "contain",
        background: hasAlpha
          ? { r: 0, g: 0, b: 0, alpha: 0 }
          : { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png({ compressionLevel: 7 })
      .toBuffer();

    fs.writeFileSync(filePath, processedBuffer);

    return NextResponse.json({ url: `/images/uploads/${filename}` });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
