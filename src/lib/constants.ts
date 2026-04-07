export const QUERY_KEYS = {
  post: {
    all: ["posts"],
    list: ["post", "list"],
    authorList: (authorId: string) => ["post", "authorList", authorId],
    byId: (postId: number) => ["post", "byId", postId],
  },
  comment: {
    all: ["comments"],
    list: (postId: number) => ["comment", "list", postId],
  },
};
