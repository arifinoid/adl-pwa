"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Bell, CheckCircle2, Clock, MoreVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import client from "@/lib/api/client";
import { components } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type Activity = components["schemas"]["activity.response"];

export default function ActivitiesPage() {
  const [search, setSearch] = useState("");

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activities", search],
    queryFn: async () => {
      const { data, error } = await client.GET("/api/activities/", {
        params: {
          query: { search: search || undefined }
        }
      });
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background/80 px-6 py-4 backdrop-blur-md">
        <h1 className="text-xl font-bold text-foreground">Activities</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 px-6">
        {/* Search & Filter */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Cari aktivitas..." 
              className="pl-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 rounded-2xl">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Add Button */}
        <Button asChild className="mb-8 h-12 w-full rounded-2xl gap-2 font-semibold shadow-lg shadow-primary/20">
          <Link href="/activities/new">
            <Plus className="h-5 w-5" />
            Tambah Aktivitas
          </Link>
        </Button>

        {/* List Section */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 text-center text-sm text-muted-foreground italic">Memuat daftar aktivitas...</div>
          ) : activities.length === 0 ? (
            <div className="py-20 text-center text-sm text-muted-foreground italic">
              {search ? "Aktivitas tidak ditemukan." : "Belum ada aktivitas. Klik + untuk menambah."}
            </div>
          ) : (
            activities.map((activity) => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function ActivityListItem({ activity }: { activity: Activity }) {
  return (
    <Link 
      href={`/activities/${activity.id}`}
      className="group flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:border-primary/30 active:scale-[0.98]"
    >
      <div className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
        activity.isCompleted ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
      )}>
        {activity.isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-semibold text-foreground">{activity.title}</h3>
          <Badge variant={activity.isCompleted ? "success" : "warning"} className="px-2 py-0 text-[10px]">
            {activity.isCompleted ? "Selesai" : "Aktif"}
          </Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {activity.scheduledAt ? new Date(activity.scheduledAt as string).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : "--:--"} • {activity.description || "Tidak ada deskripsi"}
        </p>
      </div>

      <MoreVertical className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
    </Link>
  );
}
