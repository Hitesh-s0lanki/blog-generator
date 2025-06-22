import { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ErrorBoundary } from "react-error-boundary";
import { BlogLoadingView } from "./_components/blog-loading-view";
import Blogs from "./_components/blogs";
import { ErrorState } from "@/components/error-state";
import { auth } from "@clerk/nextjs/server";

const Page = async () => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.blogs.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<BlogLoadingView />}>
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Something went wrong"
              description="Please try again later"
            />
          }>
          <Blogs />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
