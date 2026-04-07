"use server";

import { createClient } from "@/lib/server";
import { cookies } from "next/headers";

export async function fetchCommentsAction(postId: number) {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from("comment")
    .select("*, author: profile!author_id(*)")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}
