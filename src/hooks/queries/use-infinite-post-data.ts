import { fetchPostsClient } from "@/lib/client-queries/post";
import { QUERY_KEYS } from "@/lib/constants";
import { Post } from "@/lib/types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

type UseInfinitePostDataParams = {
  initialPosts: Post[];
  initialNextCursor: number | null;
  userId: string;
  authorId?: string;
};

export default function useInfinitePostData({
  initialPosts,
  initialNextCursor,
  userId,
  authorId,
}: UseInfinitePostDataParams) {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: !authorId
      ? QUERY_KEYS.post.list
      : QUERY_KEYS.post.authorList(authorId),
    queryFn: async ({ pageParam }: { pageParam: number | null }) => {
      const data = await fetchPostsClient({
        cursor: pageParam,
        limit: 5,
        userId,
        authorId,
      });
      data.posts.forEach((post) => {
        queryClient.setQueryData(QUERY_KEYS.post.byId(post.id), post);
      });
      return {
        postIds: data.posts.map((post) => post.id),
        nextCursor: data.nextCursor,
      };
    },
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined, //이코드의 값이 PageParam으로 전달됨
    //서버에서 받은 데이터를 초기 데이터로 설정(하이브리드 방식에서 초기 데이터를 설정하는 방법)
    initialData: {
      pages: [
        {
          postIds: initialPosts.map((post) => post.id),
          nextCursor: initialNextCursor,
        },
      ],
      pageParams: [null as number | null],
    },
    staleTime: Infinity,
    refetchOnMount: "always",
  });
}
