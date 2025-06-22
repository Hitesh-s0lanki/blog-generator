import { blogsRouter } from '@/modules/blogs/server/procedures';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
    blogs: blogsRouter
});

export type AppRouter = typeof appRouter;