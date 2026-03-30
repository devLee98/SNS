"use server";

import { createClient } from "@/lib/server";
import { cookies } from "next/headers";

export async function uploadImageAction({
  file,
  filePath,
}: {
  file: File;
  filePath: string;
}) {
  const supabase = createClient(await cookies());
  const { error } = await supabase.storage
    .from("uploads")
    .upload(filePath, file);
  if (error) {
    throw new Error(error.message);
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from("uploads").getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteImageAction(filePath: string) {
  const supabase = createClient(await cookies());
  const { data, error: fetchFilesError } = await supabase.storage
    .from("uploads")
    .list(filePath);

  if (!data || data.length === 0) return;
  if (fetchFilesError) throw new Error(fetchFilesError);

  const { error } = await supabase.storage
    .from("uploads")
    .remove(data.map((file) => `${filePath}/${file.name}`));
  if (error) throw new Error(error.message);
}
