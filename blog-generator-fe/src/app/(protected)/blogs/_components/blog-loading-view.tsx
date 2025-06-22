import { LoadingState } from "@/components/loading-state";

export const BlogLoadingView = () => {
  return (
    <LoadingState
      title="Loading Blogs"
      description="Please wait while we load the Blogs"
    />
  );
};
