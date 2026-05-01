"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import client from "@/lib/api/client";
import { components } from "@/lib/api/types";

type UpdateActivityBody = components["schemas"]["activity.update"];

export default function EditActivityPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const id = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    isCompleted: false,
  });
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title,
        description: activity.description || "",
        scheduledAt: activity.scheduledAt ? new Date(activity.scheduledAt as string).toISOString().substring(0, 16) : "",
        isCompleted: activity.isCompleted,
      });
    }
  }, [activity]);

  const updateMutation = useMutation({
    mutationFn: async (body: UpdateActivityBody) => {
      const { data, error: resError } = await client.PATCH("/api/activities/{id}", {
        params: { path: { id } },
        body,
      });
      if (resError) throw resError;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["activity", id] });
      router.push(`/activities/${id}`);
    },
    onError: (err: any) => {
      setError(err?.message || "Gagal memperbarui aktivitas.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    updateMutation.mutate({
      title: formData.title,
      description: formData.description,
      scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : undefined,
      isCompleted: formData.isCompleted,
    });
  };

  if (isLoading) return <div className="flex min-h-screen items-center justify-center italic text-muted-foreground">Memuat data...</div>;

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-8">
      {/* Header */}
      <header className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Edit Aktivitas</h1>
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
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border bg-card p-4">
            <div className="space-y-0.5">
              <Label>Selesai</Label>
              <p className="text-xs text-muted-foreground">Tandai jika aktivitas sudah dilakukan</p>
            </div>
            <Switch
              checked={formData.isCompleted}
              onCheckedChange={(checked) => setFormData({ ...formData, isCompleted: checked })}
            />
          </div>
        </div>

        <div className="mt-auto space-y-3 pt-8">
          <Button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="h-12 w-full rounded-2xl gap-2 font-semibold shadow-lg shadow-primary/20"
          >
            <Save className="h-5 w-5" />
            {updateMutation.isPending ? "Memperbarui..." : "Simpan Perubahan"}
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
