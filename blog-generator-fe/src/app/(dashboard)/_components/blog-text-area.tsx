"use client";

import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { blogInsertSchema } from "@/modules/blogs/schema";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpIcon } from "lucide-react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import Spinner from "./spinner";

interface BlogFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const BlogForm = ({ onSuccess }: BlogFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();

  const { isLoaded, isSignedIn } = useAuth();

  const createBlog = useMutation(
    trpc.blogs.create.mutationOptions({
      onSuccess: async (res) => {
        toast.success("Blog generated Successfully");
        router.push(`/blog/${res.id}`);
        onSuccess?.();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    })
  );

  const form = useForm<z.infer<typeof blogInsertSchema>>({
    resolver: zodResolver(blogInsertSchema),
    defaultValues: {
      topic: "",
    },
  });

  const isPending = createBlog.isPending;

  const onSubmit = (values: z.infer<typeof blogInsertSchema>) => {
    createBlog.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="max-w-4xl mx-auto mb-16 relative">
                  <Textarea
                    placeholder="Sustainable technology trends in 2024, focusing on renewable energy innovations and their impact on climate change..."
                    className="w-full min-w-[320px] max-w-[350px] md:min-w-4xl lg:min-w-4xl min-h-[160px] text-sm  bg-white pr-20"
                    {...field}
                    disabled={isPending}
                  />
                  {isLoaded && !isSignedIn && !isPending && (
                    <SignInButton mode="modal">
                      <Button
                        type="button"
                        size={"sm"}
                        className="absolute bottom-4 right-4 h-8 w-8 text-white px-1 py-1 rounded-full shadow-lg transition-all duration-200"
                        disabled={field.value == ""}>
                        <ArrowUpIcon className="size-4" />
                      </Button>
                    </SignInButton>
                  )}
                  {isLoaded && isSignedIn && !isPending && (
                    <Button
                      type="submit"
                      size={"sm"}
                      className="absolute bottom-4 right-4 h-8 w-8 text-white px-1 py-1 rounded-full shadow-lg transition-all duration-200"
                      disabled={field.value == ""}>
                      <ArrowUpIcon className="size-4" />
                    </Button>
                  )}
                  {isPending && (
                    <Spinner className="absolute bottom-4 right-4" />
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
