"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/wochenplan", label: "Plan", icon: "🥗" },
  { href: "/rezepte", label: "Rezepte", icon: "📖" },
  { href: "/einkaufsliste", label: "Einkauf", icon: "🛒" },
  { href: "/mahlzeiten", label: "Favoriten", icon: "⭐" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2 py-2 max-w-[480px] mx-auto"
      style={{ backgroundColor: "#111", borderTop: "1px solid #222" }}>
      {nav.map(n => (
        <Link key={n.href} href={n.href}
          className="flex flex-col items-center gap-0.5 flex-1 py-1 rounded-xl"
          style={{ color: path === n.href ? "#22c55e" : "#666" }}>
          <span className="text-xl">{n.icon}</span>
          <span className="text-[10px] font-medium">{n.label}</span>
        </Link>
      ))}
    </nav>
  );
}
