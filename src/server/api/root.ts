import { createTRPCRouter } from "~/server/api/trpc";
import { activitiesRouter } from "./routers/activities-router";
import { activityCollectionsRouter } from "./routers/activity-collections-router";
import { tagsRouter } from "./routers/tags-router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  activityCollections: activityCollectionsRouter,
  activities: activitiesRouter,
  tags: tagsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
