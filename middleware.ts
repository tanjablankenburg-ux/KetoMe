import { NextRequest, NextResponse } from "next/server";

const LAUNCH_DATUM = new Date("2026-07-12T00:00:00Z");
const OEFFENTLICHE_ROUTEN = ["/auth", "/agb", "/api/", "/coming-soon", "/admin", "/.well-known/"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const istOeffentlich = OEFFENTLICHE_ROUTEN.some(r => pathname.startsWith(r));
  if (istOeffentlich) return NextResponse.next();

  const token = req.cookies.get("ketome_token")?.value;

  // Vor Launch: Sperre aktiv
  const vorLaunch = new Date() < LAUNCH_DATUM;
  if (vorLaunch && !token) {
    return NextResponse.redirect(new URL("/coming-soon", req.url));
  }

  // Nach Launch: normale Auth-Prüfung
  if (!token) {
    const loginUrl = new URL("/auth", req.url);
    loginUrl.searchParams.set("weiter", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|icon|apple-icon|sw.js).*)"],
};
