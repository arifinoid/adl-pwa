"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Bell } from "lucide-react";

const features = [
  "Monitoring aktivitas harian",
  "CRUD Activities (Create, Read, Update, Delete)",
  "Dashboard ringkasan & statistik",
  "PWA Installable",
  "Responsive & Mobile Friendly",
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex min-h-full flex-col bg-background">
      {/* Header / Top Bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <span className="text-lg font-bold text-primary">A</span>
          </div>
          <h1 className="text-lg font-bold text-foreground">
            Activity Daily Living
          </h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center px-6 pt-4 pb-8">
        <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-3xl bg-secondary/50 p-4">
          <Image
            src="/hero-illustration.png"
            alt="Mother and Child Illustration"
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-contain p-4"
            priority
          />
        </div>

        <div className="mt-8 space-y-4 text-center">
          <h2 className="text-[28px] font-bold leading-tight tracking-tight text-foreground">
            Pantau dan dukung perkembangan si kecil setiap hari 💜
          </h2>
          <p className="px-4 text-[15px] leading-relaxed text-muted-foreground">
            Aplikasi Monitoring Aktivitas Harian Anak Balita yang memudahkan Ibu
            memantau tumbuh kembang si kecil.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-4 px-6 pb-24">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Fitur Utama
        </h3>
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Button
            asChild
            className="h-12 w-full rounded-2xl text-base font-semibold"
          >
            <Link href="/login">Mulai Sekarang</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
