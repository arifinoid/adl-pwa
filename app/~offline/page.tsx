import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <WifiOff className="h-12 w-12" />
      </div>
      <div className="mb-10 space-y-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Koneksi Terputus
        </h1>
        <p className="mx-auto max-w-[300px] text-[15px] leading-relaxed text-muted-foreground">
          Aplikasi memerlukan koneksi internet untuk memuat data terbaru. Periksa koneksi Wi-Fi atau data seluler kamu.
        </p>
      </div>
      <Button
        asChild
        className="h-14 w-full max-w-xs rounded-2xl text-base font-bold shadow-lg shadow-primary/20"
      >
        <Link href="/">Muat Ulang Halaman</Link>
      </Button>
      <p className="mt-6 text-xs text-muted-foreground">
        Beberapa fitur mungkin tetap tersedia secara offline.
      </p>
    </div>
  );
}
