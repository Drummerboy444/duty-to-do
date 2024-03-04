import { adminProcedure, createTRPCRouter } from "../trpc";

export const adminRouter = createTRPCRouter({
  statistics: adminProcedure.query(() => {
    return "some-random-data";
  }),
});
