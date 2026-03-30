import { getUserAction } from "@/actions/auth";
import { fetchProfileAction } from "@/actions/profile";
import PostFeedClient from "@/components/post/post-feed-client";
import ProfileInfo from "@/components/profile/profile-info";
import { fetchPostsServer } from "@/lib/server-queries/post";
import { redirect } from "next/navigation";
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const authorId = id; //프로필 작성자의 아이디
  if (!authorId) {
    redirect("/");
  }
  const profile = await fetchProfileAction(authorId);
  const userId = await getUserAction(); //현재 로그인한 사용자의 아이디

  const { posts, nextCursor } = await fetchPostsServer({
    cursor: null,
    limit: 5,
    userId: userId!.id,
    authorId,
  });
  return (
    <div className="flex flex-col gap-10">
      <ProfileInfo {...profile} userId={userId!.id} />
      <div className="border-b"></div>
      <PostFeedClient
        initialPosts={posts}
        initialNextCursor={nextCursor}
        userId={userId!.id}
        authorId={authorId}
      />
    </div>
  );
}
