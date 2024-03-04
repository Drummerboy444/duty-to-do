import { clerkClient } from "@clerk/nextjs";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const adminRouter = createTRPCRouter({
  statistics: adminProcedure.query(async ({ ctx: { db } }) => {
    const activityCollectionCount = await db.activityCollection.count();
    const activityCount = await db.activity.count();
    const tagCount = await db.tag.count();
    const userCount = await clerkClient.users.getCount();

    return {
      activityCollectionCount,
      activityCount,
      tagCount,
      userCount,
    };
  }),
});
