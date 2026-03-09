import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function uploadPaymentProof(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `payment_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const webpFile = await convertToWebP(file);
  
  const { error } = await supabase.storage
    .from("payments")
    .upload(fileName, webpFile, {
      cacheControl: "3600",
      upsert: false,
      contentType: "image/webp",
    });

  if (error) {
    throw new Error(`Error al subir imagen: ${error.message}`);
  }

  return fileName;
}

async function convertToWebP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Error al convertir a WebP"));
          }
        },
        "image/webp",
        0.8
      );
    };

    img.onerror = () => {
      reject(new Error("Error al cargar la imagen"));
    };

    reader.readAsDataURL(file);
  });
}

export function getPaymentProofUrl(fileName: string): string {
  const { data } = supabase.storage.from("payments").getPublicUrl(fileName);
  return data.publicUrl;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Solo se permiten imágenes (JPEG, PNG, WebP, GIF)" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "La imagen no debe superar 5MB" };
  }

  return { valid: true };
}
