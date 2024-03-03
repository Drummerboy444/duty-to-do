import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { ACCESS_DENIED, SUCCESS } from "../utils/generic-responses";
import { isUniqueConstraintViolation } from "../utils/db-violations";

export const activityCollectionsRouter = createTRPCRouter({
  get: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx: { db, userId }, input: { id } }) => {
      const activityCollection = await db.activityCollection.findUnique({
        where: { id },
        include: { activities: true },
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
        orderBy: { createdAt: "desc" },
      }),
    };
  }),

  create: privateProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx: { db, userId }, input: { name, description } }) => {
      const preprocessedName = name.trim();
      if (preprocessedName === "") return { type: "EMPTY_NAME" as const };

      const preprocessedDescription = description.trim();
      if (preprocessedDescription === "")
        return { type: "EMPTY_DESCRIPTION" as const };

      try {
        return {
          ...SUCCESS,
          activityCollection: await db.activityCollection.create({
            data: {
              ownerId: userId,
              name: preprocessedName,
              description: preprocessedDescription,
            },
          }),
        };
      } catch (error) {
        if (isUniqueConstraintViolation(error)) {
          return { type: "ACTIVITY_COLLECTION_ALREADY_EXISTS" as const };
        }

        throw error;
      }
    }),

  edit: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
      }),
    )
    .mutation(
      async ({ ctx: { db, userId }, input: { id, name, description } }) => {
        const preprocessedName = name.trim();
        if (preprocessedName === "") return { type: "EMPTY_NAME" as const };

        const preprocessedDescription = description.trim();
        if (preprocessedDescription === "")
          return { type: "EMPTY_DESCRIPTION" as const };

        const activityCollection = await db.activityCollection.findUnique({
          where: { id },
        });

        if (activityCollection === null) {
          return { type: "NO_ACTIVITY_COLLECTION_FOUND" as const };
        }

        const canEditActivityCollection = activityCollection.ownerId === userId;

        if (!canEditActivityCollection) return ACCESS_DENIED;

        try {
          return {
            ...SUCCESS,
            activityCollection: await db.activityCollection.update({
              where: { id },
              data: {
                name: preprocessedName,
                description: preprocessedDescription,
              },
            }),
          };
        } catch (error) {
          if (isUniqueConstraintViolation(error)) {
            return { type: "ACTIVITY_COLLECTION_ALREADY_EXISTS" as const };
          }

          throw error;
        }
      },
    ),

  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { db, userId }, input: { id } }) => {
      const activityCollection = await db.activityCollection.findUnique({
        where: { id },
      });

      if (activityCollection === null) {
        return { type: "NO_ACTIVITY_COLLECTION_FOUND" as const };
      }

      const canDeleteActivityCollection = activityCollection.ownerId === userId;

      if (!canDeleteActivityCollection) return ACCESS_DENIED;

      return {
        ...SUCCESS,
        activityCollection: await db.activityCollection.delete({
          where: { id },
        }),
      };
    }),
});
