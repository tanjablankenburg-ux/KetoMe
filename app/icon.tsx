import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{
        width: 512, height: 512,
        backgroundColor: "#0a0a0a",
        borderRadius: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}>
        {/* Avocado Emoji groß */}
        <div style={{ fontSize: 260, lineHeight: 1, marginBottom: -10 }}>🥑</div>
        {/* Text */}
        <div style={{
          fontSize: 80,
          fontWeight: 900,
          color: "#22c55e",
          letterSpacing: -2,
          marginTop: 8,
        }}>KetoMe</div>
      </div>
    ),
    { ...size }
  );
}
