"use client";

import { Bell, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import client from "@/lib/api/client";
import { components } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type Activity = components["schemas"]["activity.response"];

export default function DashboardPage() {
  // Fetch activities to calculate summary and show recent ones
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data, error } = await client.GET("/api/activities/");
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate summary stats
  const total = activities.length;
  const completed = activities.filter((a) => a.isCompleted).length;
  const achievement = total > 0 ? Math.round((completed / total) * 100) : 0;
  const pending = total - completed;

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background/80 px-6 py-4 backdrop-blur-md">
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 px-6 pt-2">
        {/* Date Display */}
        <div className="mb-6">
          <div className="inline-flex items-center rounded-xl bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            Hari ini, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Summary Section */}
        <section className="mb-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Ringkasan
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <SummaryCard label="Aktivitas" value={total} color="bg-indigo-50" textColor="text-indigo-600" />
            <SummaryCard label="Selesai" value={completed} color="bg-green-50" textColor="text-green-600" />
            <SummaryCard label="Pencapaian" value={`${achievement}%`} color="bg-purple-50" textColor="text-purple-600" />
            <SummaryCard label="Belum" value={pending} color="bg-rose-50" textColor="text-rose-600" />
          </div>
        </section>

        {/* Recent Activities Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Aktivitas Terakhir
            </h2>
            <Button variant="link" className="h-auto p-0 text-xs font-semibold text-primary">
              Lihat Semua
            </Button>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="py-10 text-center text-sm text-muted-foreground italic">Memuat aktivitas...</div>
            ) : activities.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground italic">Belum ada aktivitas hari ini.</div>
            ) : (
              activities.slice(0, 5).map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function SummaryCard({ label, value, color, textColor }: { label: string; value: string | number; color: string; textColor: string }) {
  return (
    <Card className="border-none shadow-none">
      <CardContent className={`${color} flex flex-col items-center justify-center rounded-2xl p-6 text-center`}>
        <span className="text-sm font-medium text-muted-foreground/70">{label}</span>
        <span className={`mt-1 text-3xl font-bold ${textColor}`}>{value}</span>
      </CardContent>
    </Card>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:border-primary/30 active:scale-[0.98]">
      <div className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
        activity.isCompleted ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
      )}>
        {activity.isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
      </div>

      <div className="flex-1 overflow-hidden">
        <h3 className="truncate font-semibold text-foreground">{activity.title}</h3>
        <p className="truncate text-xs text-muted-foreground">
          {activity.scheduledAt ? new Date(activity.scheduledAt as string).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : "--:--"} • {activity.isCompleted ? "Selesai" : "Belum Selesai"}
        </p>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
    </div>
  );
}
