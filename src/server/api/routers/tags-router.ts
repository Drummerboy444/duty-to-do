import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { ACCESS_DENIED, SUCCESS } from "../utils/generic-responses";
import { isUniqueConstraintViolation } from "../utils/db-violations";

export const tagsRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        activityCollectionId: z.string(),
        name: z.string(),
        activityId: z.string().optional(),
      }),
    )
    .mutation(
      async ({
        ctx: { db, userId },
        input: { activityCollectionId, name, activityId },
      }) => {
        const preprocessedName = name.trim();
        if (preprocessedName === "") return { type: "EMPTY_NAME" as const };

        const activityCollection = await db.activityCollection.findUnique({
          where: { id: activityCollectionId },
        });

        if (activityCollection === null)
          return {
            type: "NO_ACTIVITY_COLLECTION_FOUND" as const,
          };

        const canCreateTag = activityCollection.ownerId === userId;

        if (!canCreateTag) return ACCESS_DENIED;

        if (activityId !== undefined) {
          const activity = await db.activity.findUnique({
            where: { id: activityId },
            include: { activityCollection: true },
          });

          if (activity === null) return { type: "NO_ACTIVITY_FOUND" as const };

          if (activity.activityCollectionId !== activityCollection.id)
            return { type: "ACTIVITY_NOT_IN_COLLECTION" as const };
        }

        try {
          return {
            ...SUCCESS,
            tag: await db.tag.create({
              data: {
                activityCollectionId,
                name: preprocessedName,
                ...(activityId === undefined
                  ? {}
                  : { activities: { connect: { id: activityId } } }),
              },
            }),
          };
        } catch (error) {
          if (isUniqueConstraintViolation(error)) {
            return { type: "TAG_ALREADY_EXISTS" as const };
          }

          throw error;
        }
      },
    ),
});
