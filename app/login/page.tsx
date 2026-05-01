"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Bell } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import client from "@/lib/api/client";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: res, error: resError } = await client.POST("/api/auth/login", {
        body: data,
      });
      if (resError) throw resError;
      return res;
    },
    onSuccess: (data: any) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      }
    },
    onError: (err: any) => {
      setError(err?.message || "Login gagal. Periksa email dan password Anda.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate(formData);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-8">
      {/* Illustration Area */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4">
        <div className="relative h-48 w-48 overflow-hidden rounded-full bg-secondary/30">
          <Image
            src="/login-illustration.png"
            alt="Welcome back"
            fill
            className="object-contain p-2"
          />
        </div>
        <div className="mt-6 space-y-1 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Selamat Datang!
          </h1>
          <p className="text-sm text-muted-foreground">
            Masuk ke akun Anda
          </p>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          {error && (
            <div className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                placeholder="nama@email.com"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-4"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="Masukkan password"
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
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-opacity-70"
            >
              Ingat saya
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Lupa password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="h-12 w-full rounded-2xl text-base font-semibold shadow-lg shadow-primary/20"
        >
          {loginMutation.isPending ? "Masuk..." : "Masuk"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              atau masuk dengan
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button type="button" variant="outline" className="h-12 rounded-2xl gap-2 font-medium">
            <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={20} height={20} alt="Google" />
            Google
          </Button>
          <Button type="button" variant="outline" className="h-12 rounded-2xl gap-2 font-medium">
            <svg width="20" height={20} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.062 14.125c.026 2.593 2.25 3.454 2.277 3.465-.021.069-.354 1.211-1.164 2.394-.7 1.023-1.428 2.042-2.572 2.063-1.124.02-1.488-.665-2.773-.665-1.284 0-1.686.645-2.753.686-1.104.04-1.948-.958-2.653-1.98-1.442-2.083-2.544-5.885-1.054-8.471.74-1.284 2.06-2.094 3.488-2.115 1.083-.02 2.104.726 2.769.726.666 0 1.914-.904 3.204-.772.541.021 2.062.217 3.041 1.647-.079.049-1.815 1.056-1.79 3.022zm-3.003-9.066c.583-.706.974-1.688.866-2.669-.843.033-1.86.562-2.464 1.268-.542.631-.884 1.637-.761 2.595.94.073 1.776-.488 2.359-1.194z" />
            </svg>
            Apple
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
