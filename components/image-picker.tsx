"use client";

import * as React from "react";
import { Camera, X, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ImagePickerProps {
  value?: string | null;
  onChange: (url: string) => void;
  onUploading?: (isUploading: boolean) => void;
  type: "avatar" | "activity";
  className?: string;
}

export function ImagePicker({ value, onChange, onUploading, type, className }: ImagePickerProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(value || null);
  const [showError, setShowError] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync preview with external value
  React.useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsUploading(true);
    onUploading?.(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload via proxy backend
      const endpoint = type === "avatar" ? "/api/upload/avatar" : "/api/upload/activity";
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${endpoint}`, {
        method: "POST",
        body: formData,
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      setShowError(true);
      setPreview(value || null);
    } finally {
      setIsUploading(false);
      onUploading?.(false);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <div className={cn("relative group", className)}>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            "relative flex items-center justify-center border-2 border-dashed rounded-3xl overflow-hidden cursor-pointer transition-all hover:border-primary/50 bg-secondary/30",
            type === "avatar" ? "h-24 w-24 rounded-full" : "aspect-video w-full",
            isUploading && "opacity-50 cursor-wait"
          )}
        >
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized={preview.startsWith("blob:")}
                priority={type === "avatar"}
                sizes={type === "avatar" ? "96px" : "(max-width: 768px) 100vw, 800px"}
              />
              {!isUploading && (
                <button 
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              {type === "avatar" ? <Camera className="h-6 w-6" /> : <ImageIcon className="h-8 w-8" />}
              {type === "activity" && <span className="text-xs font-medium">Tambah Foto</span>}
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[2px]">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showError} onOpenChange={setShowError}>
        <AlertDialogContent className="w-[90vw] max-w-sm rounded-[2rem] p-8">
          <AlertDialogHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4 mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-center">Upload Gagal</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-center">
              Terjadi kesalahan saat mengunggah gambar. Silakan periksa koneksi internet Anda dan coba lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="h-12 w-full rounded-2xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
              Coba Lagi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
