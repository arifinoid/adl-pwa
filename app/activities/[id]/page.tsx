"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import client from "@/lib/api/client";
import { cn } from "@/lib/utils";

export default function ActivityDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id;

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", id],
    queryFn: async () => {
      const { data, error } = await client.GET("/api/activities/{id}", {
        params: { path: { id } },
      });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await client.DELETE("/api/activities/{id}", {
        params: { path: { id } },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      router.push("/activities");
    },
  });

  if (isLoading) return <div className="flex min-h-screen items-center justify-center italic text-muted-foreground">Memuat detail...</div>;
  if (!activity) return <div className="flex min-h-screen items-center justify-center">Aktivitas tidak ditemukan.</div>;

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Detail Aktivitas</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Hero Content */}
      <div className="flex flex-col items-center text-center">
        <div className={cn(
          "mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] shadow-lg shadow-primary/10",
          activity.isCompleted ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
        )}>
          {activity.isCompleted ? <CheckCircle2 className="h-12 w-12" /> : <Clock className="h-12 w-12" />}
        </div>
        <h2 className="text-2xl font-bold text-foreground">{activity.title}</h2>
        <Badge variant={activity.isCompleted ? "success" : "warning"} className="mt-2 px-4 py-1">
          {activity.isCompleted ? "Selesai" : "Aktif"}
        </Badge>
      </div>

      {/* Details Card */}
      <div className="mt-10 space-y-6 rounded-3xl border bg-card p-6 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Deskripsi</h3>
          <p className="text-sm font-medium text-foreground">{activity.description || "Tidak ada deskripsi"}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4 border-t">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3 w-3" /> Tanggal
            </div>
            <p className="text-sm font-medium text-foreground">
              {activity.scheduledAt ? new Date(activity.scheduledAt as string).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' }) : "Setiap hari"}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock className="h-3 w-3" /> Waktu
            </div>
            <p className="text-sm font-medium text-foreground">
              {activity.scheduledAt ? new Date(activity.scheduledAt as string).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : "--:--"}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-3 pt-10">
        <Button asChild className="h-12 w-full rounded-2xl gap-2 font-semibold">
          <Link href={`/activities/${id}/edit`}>
            <Edit2 className="h-5 w-5" />
            Edit Aktivitas
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-12 w-full rounded-2xl gap-2 font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-5 w-5" />
              Hapus Aktivitas
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[90vw] max-w-sm rounded-[2rem] p-8">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold">Hapus Aktivitas?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Apakah Anda yakin ingin menghapus aktivitas ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex flex-col gap-2">
              <AlertDialogAction 
                onClick={() => deleteMutation.mutate()}
                className="h-12 rounded-2xl bg-destructive font-semibold text-destructive-foreground hover:bg-destructive/90"
              >
                Ya, Hapus
              </AlertDialogAction>
              <AlertDialogCancel className="h-12 rounded-2xl border-none font-semibold hover:bg-secondary">
                Batal
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

import Link from "next/link";
