import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { ACCESS_DENIED, SUCCESS } from "../utils/generic-responses";
import { isUniqueConstraintViolation } from "../utils/db-violations";
import {
  appendPublicUsers,
  safeGetPublicUser,
  safeGetPublicUsers,
  safeGetUserByUsername,
} from "../utils/users";

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
        include: {
          activities: {
            include: { tags: { orderBy: { name: "asc" } } },
            orderBy: { name: "asc" },
          },
          tags: { orderBy: { name: "asc" } },
          sharedWith: true,
        },
      });

      if (activityCollection === null)
        return { type: "NO_ACTIVITY_COLLECTION_FOUND" as const };

      const canAccessActivityCollection =
        activityCollection.ownerId === userId ||
        activityCollection.sharedWith.some(
          ({ userId: sharedWithUserId }) => sharedWithUserId === userId,
        );

      if (!canAccessActivityCollection) return ACCESS_DENIED;

      return {
        ...SUCCESS,
        activityCollection: {
          ...activityCollection,
          sharedWith: (
            await appendPublicUsers(activityCollection.sharedWith)
          ).sort((sharedWith1, sharedWith2) => {
            const name1 =
              sharedWith1.user !== "UNKNOWN_USER" &&
              sharedWith1.user.username !== null
                ? sharedWith1.user.username.toUpperCase()
                : null;
            const name2 =
              sharedWith2.user !== "UNKNOWN_USER" &&
              sharedWith2.user.username !== null
                ? sharedWith2.user.username.toUpperCase()
                : null;

            if (name1 === null || name2 === null) return 0;

            return name1 < name2 ? -1 : name1 > name2 ? 1 : 0;
          }),
          owner: await safeGetPublicUser(activityCollection.ownerId),
        },
      };
    }),

  getAll: privateProcedure.query(async ({ ctx: { db, userId } }) => {
    const activityCollections = await db.activityCollection.findMany({
      where: {
        OR: [{ ownerId: userId }, { sharedWith: { some: { userId } } }],
      },
      orderBy: { name: "asc" },
    });

    const publicUsers = await safeGetPublicUsers(
      activityCollections.map(({ ownerId }) => ownerId),
    );

    return {
      activityCollections: activityCollections.map((activityCollection) => {
        const owner = publicUsers[activityCollection.ownerId];
        return {
          ...activityCollection,
          owner: owner === undefined ? ("UNKNOWN_USER" as const) : owner,
        };
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

  share: privateProcedure
    .input(
      z.object({
        activityCollectionId: z.string(),
        username: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx: { db, userId },
        input: { activityCollectionId, username },
      }) => {
        const activityCollection = await db.activityCollection.findUnique({
          where: { id: activityCollectionId },
        });

        if (activityCollection === null)
          return { type: "NO_ACTIVITY_COLLECTION_FOUND" as const };

        const canShareActivityCollection =
          activityCollection.ownerId === userId;

        if (!canShareActivityCollection) return ACCESS_DENIED;

        const user = await safeGetUserByUsername(username);

        if (user === "NO_USER_FOUND") return { type: "NO_USER_FOUND" as const };

        try {
          return {
            ...SUCCESS,
            sharedWith: await db.sharedWith.create({
              data: {
                activityCollectionId: activityCollectionId,
                userId: user.id,
              },
            }),
          };
        } catch (error) {
          if (isUniqueConstraintViolation(error)) {
            return { type: "ALREADY_SHARED" as const };
          }

          throw error;
        }
      },
    ),

  unshare: privateProcedure
    .input(z.object({ sharedWithId: z.string() }))
    .mutation(async ({ ctx: { db, userId }, input: { sharedWithId } }) => {
      const sharedWith = await db.sharedWith.findUnique({
        where: { id: sharedWithId },
        include: { activityCollection: true },
      });

      if (sharedWith === null) return { type: "NO_SHARE_WITH_FOUND" as const };

      const canUnshareActivityCollection =
        sharedWith.activityCollection.ownerId === userId;

      if (!canUnshareActivityCollection) return ACCESS_DENIED;

      return {
        ...SUCCESS,
        shareWith: await db.sharedWith.delete({ where: { id: sharedWithId } }),
      };
    }),

  removeMe: privateProcedure
    .input(z.object({ activityCollectionId: z.string() }))
    .mutation(
      async ({ ctx: { db, userId }, input: { activityCollectionId } }) => {
        const maybeSharedWith = await db.sharedWith.findUnique({
          where: {
            userId_activityCollectionId: {
              userId,
              activityCollectionId,
            },
          },
        });

        if (maybeSharedWith === null)
          return { type: "NOT_SHARED_WITH" as const };

        return {
          ...SUCCESS,
          sharedWith: await db.sharedWith.delete({
            where: { id: maybeSharedWith.id },
          }),
        };
      },
    ),
});
