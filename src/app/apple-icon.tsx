import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { logoIconLayout } from "@/lib/logo-crop";

export const runtime = "nodejs";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const buffer = await readFile(join(process.cwd(), "public/bayt-logo.png"));
  const src = `data:image/png;base64,${buffer.toString("base64")}`;
  const { box, imgSize, left, top } = logoIconLayout(size.width);

  return new ImageResponse(
    (
      <div
        style={{
          width: box,
          height: box,
          borderRadius: "50%",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#050c08",
          display: "flex",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          width={imgSize}
          height={imgSize}
          alt=""
          style={{
            position: "absolute",
            left,
            top,
            objectFit: "contain",
          }}
        />
      </div>
    ),
    size,
  );
}
