"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950 text-black dark:text-white">
      <p className="text-sm text-neutral-500">Redirecting...</p>
    </div>
  );
}
