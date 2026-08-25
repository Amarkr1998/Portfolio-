import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08090c",
          borderRadius: 6,
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 14,
          color: "#6ee7ff",
        }}
      >
        AK
      </div>
    ),
    size
  );
}
