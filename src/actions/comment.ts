"use server";
import { createClient } from "@/lib/server";
import { cookies } from "next/headers";

export async function createCommentAction({
  content,
  postId,
}: {
  content: string;
  postId: number;
}) {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("comment")
    .insert({ content, post_id: postId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
