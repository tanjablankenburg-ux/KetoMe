"use client";
import { useRouter } from "next/navigation";

export default function AuthStatus() {
  const router = useRouter();

  async function abmelden() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth");
    router.refresh();
  }

  return (
    <button onClick={abmelden}
      className="px-3 py-1.5 rounded-xl text-xs"
      style={{ backgroundColor: "#1a1a1a", color: "#555" }}>
      Abmelden
    </button>
  );
}
