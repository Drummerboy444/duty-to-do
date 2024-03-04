import { clerkClient } from "@clerk/nextjs";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { SUCCESS } from "../utils/generic-responses";
import { log } from "../utils/log";

export const usersRouter = createTRPCRouter({
  deleteMe: privateProcedure.mutation(async ({ ctx: { db, userId } }) => {
    try {
      await db.$transaction(async (tx) => {
        await tx.activityCollection.deleteMany({ where: { ownerId: userId } });
        await clerkClient.users.deleteUser(userId);
      });

      return SUCCESS;
    } catch (error) {
      log({
        level: "ERROR",
        message: "Error while deleting user",
        userId,
        additionalData: { error },
      });

      return { type: "UNKNOWN_ERROR" as const };
    }
  }),
});
