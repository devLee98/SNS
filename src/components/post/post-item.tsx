"use client";

import Loader from "@/components/loader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { usePostById } from "@/hooks/queries/use-post-by-id";
import type { Post } from "@/lib/types";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Fallback from "../fallback";
import DeleteButton from "./delete-button";
import EditButton from "./edit-button";
import LikePostButton from "./like-post-button";

export default function PostItem({
  postId,
  userId,
  type = "FEED",
  initialPost,
}: {
  postId: number;
  userId: string;
  type?: "FEED" | "DETAIL";
  initialPost?: Post;
}) {
  const {
    data: post,
    isPending,
    error,
  } = usePostById({ postId, type, initialData: initialPost });
  if (isPending) return <Loader />;
  if (error) return <Fallback />;

  return (
    <div
      className={`flex flex-col gap-4 pb-8 ${type === "FEED" && "border-b"}`}
    >
      <div className="flex justify-between">
        <div className="flex items-start gap-4">
          <Link href={`/profile/${post.author.id}`}>
            <Image
              src={post.author.avatar_url || "/default-avatar.png"}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          </Link>
          <div>
            <div className="font-bold hover:underline">
              {post.author.nickname}
            </div>
            <div className="text-muted-foreground text-sm">
              {new Date(post.created_at).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="text-muted-foreground flex text-sm">
          {userId === post.author.id && <EditButton {...post} />}
          {userId === post.author.id && <DeleteButton post={post} />}
        </div>
      </div>

      <div className="flex cursor-pointer flex-col gap-5">
        {type === "FEED" ? (
          <Link href={`/post/${post.id}`}>
            <div className="wrap-break-words line-clamp-2 whitespace-pre-wrap">
              {post.content}
            </div>
          </Link>
        ) : (
          <div className="wrap-break-words whitespace-pre-wrap">
            {post.content}
          </div>
        )}

        <Carousel>
          <CarouselContent>
            {post.image_urls?.map((url, index) => (
              <CarouselItem className={`basis-3/5`} key={index}>
                <div className="overflow-hidden rounded-xl">
                  <Image
                    src={url}
                    alt=""
                    width={300}
                    height={300}
                    className="h-full max-h-[350px] w-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="flex gap-2">
        <LikePostButton
          id={post.id}
          likeCount={post.like_count}
          isLiked={post.isLiked}
        />
        {type === "FEED" && (
          <Link href={`/post/${post.id}`}>
            <div className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-xl border p-2 px-4 text-sm">
              <MessageCircle className="h-4 w-4" />
              <span>댓글 달기</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
