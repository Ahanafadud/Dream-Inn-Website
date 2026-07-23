import { uploadMediaFn } from "@/lib/api/cms.functions";

export async function fileToBase64(file: File) {
  const buffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function isVideoMime(mime: string) {
  return mime.startsWith("video/");
}

export function isImageMime(mime: string) {
  return mime.startsWith("image/");
}

export async function uploadAdminFile(file: File, alt?: string) {
  const base64 = await fileToBase64(file);
  return uploadMediaFn({
    data: {
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      base64,
      alt: alt || file.name,
    },
  });
}
