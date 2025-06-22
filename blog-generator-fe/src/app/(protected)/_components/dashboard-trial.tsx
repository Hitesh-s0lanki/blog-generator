"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MAX_FREE_BLOG } from "@/constant";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { RocketIcon } from "lucide-react";
import Link from "next/link";

export const DashboardTrial = () => {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.blogs.getCount.queryOptions());

  if (!data) return null;

  return (
    <div className="border border-border/10 rounded-lg w-full bg-black/5 flex flex-col gap-y-2">
      <div className="p-3 flex flex-col gap-y-4">
        <div className="flex items-center gap-2">
          <RocketIcon className="size-5" />
          <p className="text-sm font-medium">Free Trial</p>
        </div>
        <div className="flex flex-col gap-y-2">
          <p className="text-xs">
            {data.count}/{MAX_FREE_BLOG} blogs.
          </p>
          <Progress value={(data.count / MAX_FREE_BLOG) * 100} />
        </div>
      </div>
      <Button
        className="bg-transparent border-t border-border/10 hover:bg-white/10 rounded-t-none text-black"
        asChild>
        <Link href="/upgrade">Upgrade (Not Available)</Link>
      </Button>
    </div>
  );
};
