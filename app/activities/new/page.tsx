"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import client from "@/lib/api/client";
import { components } from "@/lib/api/types";

type CreateActivityBody = components["schemas"]["activity.create"];

export default function NewActivityPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    frequency: "Setiap hari", // Placeholder for frequency
    status: true,
  });
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: async (body: CreateActivityBody) => {
      const { data, error: resError } = await client.POST("/api/activities/", {
        body,
      });
      if (resError) throw resError;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      router.push("/activities");
    },
    onError: (err: any) => {
      setError(err?.message || "Gagal membuat aktivitas. Silakan coba lagi.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    createMutation.mutate({
      title: formData.title,
      description: formData.description,
      scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : undefined,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-8">
      {/* Header */}
      <header className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Buat Aktivitas Baru</h1>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col space-y-6">
        {error && (
          <div className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nama Aktivitas</Label>
            <Input
              id="title"
              placeholder="Contoh: Makan"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <textarea
              id="description"
              className="flex min-h-[100px] w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
              placeholder="Deskripsi aktivitas si kecil"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="datetime">Waktu & Tanggal</Label>
            <Input
              id="datetime"
              type="datetime-local"
              required
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              className="block"
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border bg-card p-4">
            <div className="space-y-0.5">
              <Label>Status</Label>
              <p className="text-xs text-muted-foreground">Aktifkan untuk mulai memantau</p>
            </div>
            <Switch
              checked={formData.status}
              onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
            />
          </div>
        </div>

        <div className="mt-auto space-y-3 pt-8">
          <Button 
            type="submit" 
            disabled={createMutation.isPending}
            className="h-12 w-full rounded-2xl gap-2 font-semibold shadow-lg shadow-primary/20"
          >
            <Save className="h-5 w-5" />
            {createMutation.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
            className="h-12 w-full rounded-2xl font-semibold"
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
