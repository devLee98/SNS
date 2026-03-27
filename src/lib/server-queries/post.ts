import { createClient } from "@/lib/server";
import { Post } from "@/lib/types";
import { cookies } from "next/headers";

type RawPost = Omit<Post, "isLiked"> & {
  myLiked?: Array<{ id: number; user_id: string }>;
};

function toPostWithIsLiked(post: RawPost): Post {
  const { myLiked, ...rest } = post;
  return {
    ...rest,
    isLiked: (myLiked?.length ?? 0) > 0,
  };
}

export async function fetchPostsServer({
  cursor,
  limit,
  userId,
  authorId,
}: {
  cursor: number | null;
  limit: number;
  userId: string;
  authorId?: string;
}) {
  const supabase = createClient(await cookies());
  let query = supabase
    .from("post")
    .select("*, author: profile!author_id(*), myLiked: like!left(id,user_id)")
    .eq("myLiked.user_id", userId)
    .order("id", { ascending: false })
    .limit(limit + 1);

  if (authorId) {
    query = query.eq("author_id", authorId);
  }

  if (cursor !== null) {
    query = query.lt("id", cursor);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const hasMore = data.length > limit;
  const posts = (hasMore ? data.slice(0, limit) : data).map(toPostWithIsLiked);
  const nextCursor = hasMore ? posts[posts.length - 1].id : null;

  return { posts, nextCursor };
}
