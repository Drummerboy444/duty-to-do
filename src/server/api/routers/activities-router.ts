import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { ACCESS_DENIED, SUCCESS } from "../utils/generic-responses";
import { isUniqueConstraintViolation } from "../utils/db-violations";

export const activitiesRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        activityCollectionId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx: { db, userId },
        input: { activityCollectionId, name },
      }) => {
        const preprocessedName = name.trim();
        if (preprocessedName === "") return { type: "EMPTY_NAME" as const };

        const activityCollection = await db.activityCollection.findUnique({
          where: { id: activityCollectionId },
        });

        if (activityCollection === null) {
          return { type: "NO_ACTIVITY_COLLECTION_FOUND" as const };
        }

        const canCreateActivity = activityCollection.ownerId === userId;

        if (!canCreateActivity) return ACCESS_DENIED;

        try {
          return {
            ...SUCCESS,
            activity: await db.activity.create({
              data: {
                activityCollectionId,
                name: preprocessedName,
              },
            }),
          };
        } catch (error) {
          if (isUniqueConstraintViolation(error)) {
            return { type: "ACTIVITY_ALREADY_EXISTS" as const };
          }

          throw error;
        }
      },
    ),
});
