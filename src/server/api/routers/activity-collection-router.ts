import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { ACCESS_DENIED, SUCCESS } from "../utils/generic-responses";

export const activityCollectionRouter = createTRPCRouter({
  get: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx: { db, userId }, input: { id } }) => {
      const activityCollection = await db.activityCollection.findUnique({
        where: { id },
      });

      if (activityCollection === null)
        return { type: "NO_ACTIVITY_COLLECTION_FOUND" as const };

      const canAccessActivityCollection = activityCollection.ownerId === userId;

      if (!canAccessActivityCollection) return ACCESS_DENIED;

      return { ...SUCCESS, activityCollection };
    }),

  getAll: privateProcedure.query(async ({ ctx: { db, userId } }) => {
    return {
      activityCollections: await db.activityCollection.findMany({
        where: { ownerId: userId },
      }),
    };
  }),
});
