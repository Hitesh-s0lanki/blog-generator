"use client";

import React from "react";
import { useTRPC } from "@/trpc/client";
import Markdown from "react-markdown";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";

interface BlogIdViewProps {
  id: string;
}

export const BlogIdView: React.FC<BlogIdViewProps> = ({ id }) => {
  const trpc = useTRPC();

  // Fetch blog data
  const { data } = useSuspenseQuery(trpc.blogs.getOne.queryOptions({ id: id }));

  return (
    <div className="prose  px-8 md:px-40 lg:px-40  py-8 flex flex-col gap-5 bg-white">
      <div className="w-full flex flex-col md:flex-row lg:flex-row gap-1 items-start align-top h-full justify-between">
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
