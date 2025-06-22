import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { getQueryClient, trpc } from "@/trpc/server";
import { BlogLoadingView } from "../../blogs/_components/blog-loading-view";
import { ErrorState } from "@/components/error-state";
import { BlogIdView } from "./_components/blog-id-view";

type Props = {
  params: Promise<{
    blogId: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { blogId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.blogs.getOne.queryOptions({ id: blogId })
  );

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
          <BlogIdView id={blogId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
