import { createCommentAction } from "@/actions/comment";
import { UseMutationCallback } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

export function useCreateComment(callbacks?: UseMutationCallback) {
  return useMutation({
    mutationFn: createCommentAction,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
    onSettled: () => {
      if (callbacks?.onSettled) callbacks.onSettled();
    },
    onMutate: () => {
      if (callbacks?.onMutate) callbacks.onMutate();
    },
  });
}
