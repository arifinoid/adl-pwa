"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  Bell,
  Moon,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Camera,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { Skeleton } from "@/components/ui/skeleton";
import { ImagePicker } from "@/components/image-picker";

export default function ProfilePage() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await client.GET("/api/users/profile");
      if (error) throw error;
      return data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (avatarUrl: string) => {
      const { data, error } = await client.PATCH("/api/users/profile", {
        body: { avatarUrl },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await client.POST("/api/auth/logout");
      localStorage.removeItem("token");
    },
    onSuccess: () => {
      router.push("/login");
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold text-foreground">Profile</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      <main className="px-6">
        {isLoading ? (
          <>
            {/* Skeleton User Info */}
            <div className="mb-10 flex flex-col items-center pt-4">
              <Skeleton className="mb-4 h-24 w-24 rounded-full" />
              <Skeleton className="mb-2 h-7 w-48 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded-lg" />
            </div>

            {/* Skeleton Menu Sections */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="mx-2 h-3 w-16" />
                <div className="rounded-3xl border bg-card overflow-hidden">
                  <div className="h-16 border-b p-4">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="h-16 border-b p-4">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="h-16 p-4">
                    <Skeleton className="h-full w-full" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="mx-2 h-3 w-16" />
                <div className="rounded-3xl border bg-card overflow-hidden">
                  <div className="h-16 border-b p-4">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="h-16 p-4">
                    <Skeleton className="h-full w-full" />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* User Info Card */}
            <div className="mb-10 flex flex-col items-center pt-4">
              <div className="relative mb-4">
                <ImagePicker 
                  type="avatar"
                  value={profile?.avatarUrl}
                  onChange={(url) => updateProfileMutation.mutate(url)}
                  onUploading={setIsUploadingImage}
                />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {profile?.username || "User Name"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {profile?.email || "email@example.com"}
              </p>
            </div>

            {/* Menu Section */}
            <section className="space-y-6">
              <div className="space-y-2">
                <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Akun
                </h3>
                <div className="rounded-3xl border bg-card overflow-hidden">
                  <MenuItem
                    icon={<User className="h-5 w-5" />}
                    label="Edit Profil"
                  />
                  <div className="border-t mx-4" />
                  <MenuItem
                    icon={<Bell className="h-5 w-5" />}
                    label="Notifikasi"
                    action={<Switch defaultChecked />}
                  />
                  <div className="border-t mx-4" />
                  <MenuItem
                    icon={<Moon className="h-5 w-5" />}
                    label="Mode Gelap"
                    action={
                      mounted ? (
                        <Switch
                          checked={resolvedTheme === "dark"}
                          onCheckedChange={(checked) =>
                            setTheme(checked ? "dark" : "light")
                          }
                        />
                      ) : (
                        <Skeleton className="h-6 w-11 rounded-full" />
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Lainnya
                </h3>
                <div className="rounded-3xl border bg-card overflow-hidden">
                  <MenuItem
                    icon={<HelpCircle className="h-5 w-5" />}
                    label="Pusat Bantuan"
                  />
                  <div className="border-t mx-4" />
                  <MenuItem
                    icon={<Info className="h-5 w-5" />}
                    label="Tentang Aplikasi"
                  />
                </div>
              </div>
            </section>
          </>
        )}

        {/* Logout Button */}
        <div className="mt-12 pb-8">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                disabled={logoutMutation.isPending || isUploadingImage}
                className="h-12 w-full rounded-2xl gap-2 font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
                {isUploadingImage ? "Mengunggah..." : "Keluar Akun"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[90vw] max-w-sm rounded-[2rem] p-8">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold">
                  Keluar Akun?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  Apakah Anda yakin ingin keluar dari aplikasi ADL? Anda perlu
                  login kembali untuk mengakses data Anda.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6 flex flex-col gap-2">
                <AlertDialogAction
                  onClick={() => logoutMutation.mutate()}
                  className="h-12 rounded-2xl bg-destructive font-semibold text-destructive-foreground hover:bg-destructive/90"
                >
                  Ya, Keluar
                </AlertDialogAction>
                <AlertDialogCancel className="h-12 rounded-2xl border-none font-semibold hover:bg-secondary">
                  Batal
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <p className="mt-4 text-center text-[10px] text-muted-foreground uppercase tracking-widest">
            ADL PWA v0.1.0
          </p>
        </div>
      </main>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-secondary/30">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/50 text-primary">
        {icon}
      </div>
      <span className="flex-1 text-sm font-medium text-foreground">
        {label}
      </span>
      {action ? (
        action
      ) : (
        <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
      )}
    </div>
  );
}
