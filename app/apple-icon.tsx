import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{
        width: 180, height: 180,
        backgroundColor: "#0a0a0a",
        borderRadius: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}>
        <div style={{ fontSize: 90, lineHeight: 1 }}>🥑</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#22c55e", marginTop: 4 }}>VitaKeto</div>
      </div>
    ),
    { ...size }
  );
}

