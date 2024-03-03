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
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx: { db, userId }, input: { id, name } }) => {
      const preprocessedName = name.trim();
      if (preprocessedName === "") return { type: "EMPTY_NAME" as const };

      const activity = await db.activity.findUnique({
        where: { id },
        include: { activityCollection: true },
      });

      if (activity === null) return { type: "NO_ACTIVITY_FOUND" as const };

      const canEditActivity = activity.activityCollection.ownerId === userId;

      if (!canEditActivity) return ACCESS_DENIED;

      try {
        return {
          ...SUCCESS,
          activity: await db.activity.update({
            where: { id },
            data: { name: preprocessedName },
          }),
        };
      } catch (error) {
        if (isUniqueConstraintViolation(error))
          return { type: "ACTIVITY_ALREADY_EXISTS" as const };

        throw error;
      }
    }),

  addTag: privateProcedure
    .input(
      z.object({
        activityId: z.string(),
        tagId: z.string(),
      }),
    )
    .mutation(async ({ ctx: { db, userId }, input: { activityId, tagId } }) => {
      const activity = await db.activity.findUnique({
        where: { id: activityId },
        include: { activityCollection: true },
      });

      if (activity === null) return { type: "NO_ACTIVITY_FOUND" as const };

      const canAccessActivity = activity.activityCollection.ownerId === userId;

      if (!canAccessActivity) return ACCESS_DENIED;

      const tag = await db.tag.findUnique({
        where: { id: tagId },
        include: { activityCollection: true },
      });

      if (tag === null) return { type: "NO_TAG_FOUND" as const };

      const canAccessTag = tag.activityCollection.ownerId === userId;

      if (!canAccessTag) return ACCESS_DENIED;

      if (activity.activityCollectionId !== tag.activityCollectionId)
        return { type: "IN_DIFFERENT_COLLECTIONS" as const };

      return {
        ...SUCCESS,
        activity: await db.activity.update({
          where: { id: activityId },
          data: { tags: { connect: { id: tagId } } },
        }),
      };
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
