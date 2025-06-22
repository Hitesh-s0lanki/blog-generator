"use client";

import React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Book } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import ClientDate from "./client-date";

const Blogs = () => {
  const router = useRouter();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.blogs.getMany.queryOptions());

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
      {data.items.map((blog) => (
        <Card
          key={blog.id}
          className="overflow-hidden border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 pt-0"
          onClick={() => router.push(`/blog/${blog.id}`)}>
          <div className="aspect-video overflow-hidden h-full">
            <Image
              src={blog.imageUrl || "/not-found.png"}
              alt={blog.title}
              height={180}
              width={80}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col gap-6 justify-between h-full">
            <CardHeader className="px-4 py-0">
              <CardTitle className="text-lg text-gray-800 line-clamp-2">
                {blog.title}
              </CardTitle>
              <CardDescription className="text-gray-600 line-clamp-3">
                {blog.content.slice(0, 100)}
              </CardDescription>
            </CardHeader>
            <CardFooter className="px-5">
              <div className="w-full flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <ClientDate isoDate={blog.createdAt} />
                </div>
                <div className="flex items-center space-x-1">
                  <Book className="w-4 h-4" />
                  <span>7 min</span>
                </div>
              </div>
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Blogs;
