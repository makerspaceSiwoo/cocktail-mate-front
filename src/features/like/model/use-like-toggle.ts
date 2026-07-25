"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

import { likeApis, likeQueries } from "@/entities/like";

interface UseLikeToggleOptions {
  cocktailId: number;
  initialLiked: boolean;
  onChanged?: (isLiked: boolean) => void;
}

export function useLikeToggle({ cocktailId, initialLiked, onChanged }: UseLikeToggleOptions) {
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isLiked = optimisticLiked ?? initialLiked;

  const mutation = useMutation({
    mutationFn: (nextLiked: boolean) =>
      nextLiked ? likeApis.like(cocktailId) : likeApis.unlike(cocktailId),
    onMutate: (nextLiked) => {
      setErrorMessage(null);
      setOptimisticLiked(nextLiked);
      return { previousLiked: isLiked };
    },
    onSuccess: (response) => {
      setOptimisticLiked(response.isLiked);
      setLikeCount(response.likeCount);
      onChanged?.(response.isLiked);
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ["cocktail"] }),
        queryClient.invalidateQueries({ queryKey: likeQueries._all() }),
      ]);
    },
    onError: (error, _nextLiked, context) => {
      setOptimisticLiked(context?.previousLiked ?? initialLiked);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        sessionStorage.setItem("returnTo", pathname);
        router.push("/sign-in");
        return;
      }

      setErrorMessage("좋아요 상태를 변경하지 못했습니다. 다시 시도해 주세요.");
    },
  });

  return {
    isLiked,
    likeCount,
    errorMessage,
    isPending: mutation.isPending,
    toggle: () => mutation.mutate(!isLiked),
  };
}
