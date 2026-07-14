import { NextResponse } from "next/server";

export function GET() {
  return new NextResponse("google-site-verification: googlef22990c469a33024.html", {
    headers: { "Content-Type": "text/html" },
  });
}
