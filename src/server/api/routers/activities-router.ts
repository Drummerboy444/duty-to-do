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

  edit: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        tagIds: z.string().array().optional(),
      }),
    )
    .mutation(async ({ ctx: { db, userId }, input: { id, name, tagIds } }) => {
      const activity = await db.activity.findUnique({
        where: { id },
        include: { activityCollection: true },
      });

      if (activity === null) return { type: "NO_ACTIVITY_FOUND" as const };

      const canEditActivity = activity.activityCollection.ownerId === userId;

      if (!canEditActivity) return ACCESS_DENIED;

      if (name !== undefined && name.trim() === "")
        return { type: "EMPTY_NAME" as const };

      if (tagIds !== undefined) {
        const tags = await db.tag.findMany({
          where: { id: { in: tagIds } },
        });

        if (tags.length !== tagIds.length)
          return { type: "INVALID_TAG_IDS" as const };

        if (
          !tags.every(
            (tag) => tag.activityCollectionId === activity.activityCollectionId,
          )
        )
          return { type: "INVALID_TAG_IDS" as const };
      }

      try {
        return {
          ...SUCCESS,
          activity: await db.activity.update({
            where: { id },
            data: {
              ...(name === undefined ? {} : { name: name.trim() }),
              ...(tagIds === undefined
                ? {}
                : { set: tagIds.map((id) => ({ id })) }),
            },
          }),
        };
      } catch (error) {
        if (isUniqueConstraintViolation(error))
          return { type: "ACTIVITY_ALREADY_EXISTS" as const };

        throw error;
      }
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { db, userId }, input: { id } }) => {
      const activity = await db.activity.findUnique({
        where: { id },
        include: { activityCollection: true },
      });

      if (activity === null) return { type: "NO_ACTIVITY_FOUND" as const };

      const canDeleteActivity = activity.activityCollection.ownerId === userId;

      if (!canDeleteActivity) return ACCESS_DENIED;

      return {
        ...SUCCESS,
        activity: await db.activity.delete({ where: { id } }),
      };
    }),
});
