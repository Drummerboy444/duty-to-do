import { createTRPCRouter, privateProcedure } from "../trpc";

export const activityCollectionRouter = createTRPCRouter({
  test: privateProcedure.query(() => ({ value: "Something" })),
});
