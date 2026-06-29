import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const logo_path = path.join(root, "public", "logo.png");

async function make_icon(size, out_name) {
  const corner = Math.round(size * 0.22);
  const padding = Math.round(size * 0.1);
  const inner = size - padding * 2;

  const logo_buf = await sharp(logo_path)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();

  const square = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: logo_buf, gravity: "center" }])
    .png()
    .toBuffer();

  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${corner}" ry="${corner}" fill="white"/></svg>`
  );

  await sharp(square)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toFile(path.join(root, "public", out_name));

  console.log(`Wrote ${out_name}`);
}

await make_icon(512, "icon-512.png");
await make_icon(192, "icon-192.png");
await make_icon(180, "apple-touch-icon.png");
