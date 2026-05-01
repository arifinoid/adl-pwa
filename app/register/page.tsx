"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import client from "@/lib/api/client";
import { components } from "@/lib/api/types";

type RegisterBody = components["schemas"]["auth.register"];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterBody) => {
      const { data: res, error: resError } = await client.POST("/api/auth/register", {
        body: data,
      });
      if (resError) throw resError;
      return res;
    },
    onSuccess: () => {
      router.push("/login?registered=true");
    },
    onError: (err: any) => {
      setError(err?.message || "Registrasi gagal. Silakan coba lagi.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    registerMutation.mutate({
      username: formData.name,
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-8">
      {/* Illustration Area */}
      <div className="flex flex-col items-center justify-center pt-4 pb-2">
        <div className="relative h-40 w-40 overflow-hidden rounded-full bg-secondary/30">
          <Image
            src="/register-illustration.png"
            alt="Join us"
            fill
            className="object-contain p-2"
          />
        </div>
        <div className="mt-4 space-y-1 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Buat Akun Baru
          </h1>
          <p className="text-sm text-muted-foreground">
            Daftar untuk mulai memantau aktivitas si kecil
          </p>
        </div>
      </div>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {error && (
          <div className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              placeholder="Nama lengkap Anda"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="nama@email.com"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="Minimal 6 karakter"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                placeholder="Ulangi password"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="h-12 w-full rounded-2xl text-base font-semibold shadow-lg shadow-primary/20"
        >
          {registerMutation.isPending ? "Mendaftar..." : "Daftar"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Masuk di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
