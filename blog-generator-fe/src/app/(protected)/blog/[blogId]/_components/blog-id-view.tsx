"use client";

import React from "react";
import { useTRPC } from "@/trpc/client";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Share2Icon } from "lucide-react";

interface BlogIdViewProps {
  id: string;
}

export const BlogIdView: React.FC<BlogIdViewProps> = ({ id }) => {
  const trpc = useTRPC();

  // Fetch blog data
  const { data } = useSuspenseQuery(trpc.blogs.getOne.queryOptions({ id: id }));

  // Share handler: Web Share API or clipboard fallback
  const handleShare = () => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/public-blog/${id}`;
    if (navigator.share) {
      navigator.share({ title: data?.title, url }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="prose px-10 md:px-40 lg:px-40 py-8 flex flex-col gap-5 bg-white">
      <div className="w-full flex gap-1 items-start align-top h-full justify-between">
        <Markdown
          components={{
            h1: (props) => (
              <h1 className="text-2xl font-medium mb-6" {...props} />
            ),
            h2: (props) => (
              <h2 className="text-xl font-medium mb-6" {...props} />
            ),
            h3: (props) => (
              <h3 className="text-lg font-medium mb-6" {...props} />
            ),
            h4: (props) => (
              <h4 className="text-base font-medium mb-6" {...props} />
            ),
            p: (props) => <p className="mb-6 leading-relaxed" {...props} />,
            ul: (props) => (
              <ul className=" list-disc list-inside mb-6" {...props} />
            ),
            ol: (props) => (
              <ol className=" list-decimal list-inside mb-6" {...props} />
            ),
            li: (props) => <li className=" mb-1" {...props} />,
            strong: (props) => <strong className=" font-semibold" {...props} />,
            code: (props) => (
              <code className=" bg-gray-100 px-1 py-0.5 rounded" {...props} />
            ),
            blockquote: (props) => (
              <blockquote className=" border-l-4 pl-4 italic my-4" {...props} />
            ),
          }}>
          {data.title}
        </Markdown>

        <Button
          variant="secondary"
          onClick={handleShare}
          className=" hover:bg-black/10 cursor-pointer">
          <Share2Icon />
        </Button>
      </div>

      <Image
        src={data.imageUrl || "/not-found.png"}
        alt="blog image"
        height={824}
        width={1792}
      />

      <div className="mt-5">
        <Markdown
          components={{
            h1: (props) => (
              <h1 className="text-2xl font-medium mb-6" {...props} />
            ),
            h2: (props) => (
              <h2 className="text-xl font-medium mb-6" {...props} />
            ),
            h3: (props) => (
              <h3 className="text-lg font-medium mb-6" {...props} />
            ),
            h4: (props) => (
              <h4 className="text-base font-medium mb-6" {...props} />
            ),
            p: (props) => <p className="mb-6 leading-relaxed" {...props} />,
            ul: (props) => (
              <ul className=" list-disc list-inside mb-6" {...props} />
            ),
            ol: (props) => (
              <ol className=" list-decimal list-inside mb-6" {...props} />
            ),
            li: (props) => <li className=" mb-1" {...props} />,
            strong: (props) => <strong className=" font-semibold" {...props} />,
            code: (props) => (
              <code className=" bg-gray-100 px-1 py-0.5 rounded" {...props} />
            ),
            blockquote: (props) => (
              <blockquote className=" border-l-4 pl-4 italic my-4" {...props} />
            ),
          }}>
          {data.content}
        </Markdown>
      </div>
    </div>
  );
};
