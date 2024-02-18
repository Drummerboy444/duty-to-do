/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { getAuth } from "@clerk/nextjs/server";
import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "~/server/db";
import { isAdmin } from "~/utils/is-admin";
import { flushLogs, log } from "./utils/log";
import { safeGetUser } from "./utils/users";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = ({ req }: CreateNextContextOptions) => {
  const { userId } = getAuth(req);
  return { db, userId };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */

const withLogging =
  <
    Args extends {
      ctx: { userId: string | null };
      type: "query" | "mutation" | "subscription";
      path: string;
      rawInput: unknown;
    },
    Result extends { ok: true } | { ok: false; error: Error },
  >(
    fn: (args: Args) => Promise<Result>,
  ) =>
  async (args: Args) => {
    const start = Date.now();
    const result = await fn(args);
    const duration = Date.now() - start;
    const userId = args.ctx.userId === null ? "UNKNOWN_USER" : args.ctx.userId;

    const additionalData = {
      type: args.type,
      path: args.path,
      input: args.rawInput,
      duration,
    };

    if (result.ok) {
      log({
        level: "INFO",
        message: "Successfully resolved request",
        userId,
        additionalData,
      });
    } else {
      log({
        level: "ERROR",
        message: "Error while resolving request",
        userId,
        additionalData: {
          ...additionalData,
          error: {
            cause: result.error.cause,
            message: result.error.message,
            name: result.error.name,
            stack: result.error.stack,
          },
        },
      });
    }

    await flushLogs();

    return result;
  };

const noopMiddleware = t.middleware(withLogging(async ({ next }) => next()));

export const publicProcedure = t.procedure.use(noopMiddleware);

const enforceCurrentUserIsAuthenticated = t.middleware(
  withLogging(async ({ ctx: { userId }, next }) => {
    if (userId === null || userId === undefined) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({ ctx: { userId } });
  }),
);

export const privateProcedure = t.procedure.use(
  enforceCurrentUserIsAuthenticated,
);

const enforceCurrentUserIsAdmin = t.middleware(
  withLogging(async ({ ctx: { userId }, next }) => {
    if (userId === null || userId === undefined) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const user = await safeGetUser(userId);

    if (user === "UNKNOWN_USER") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    if (!isAdmin(user.privateMetadata)) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next({ ctx: { userId } });
  }),
);

export const adminProcedure = t.procedure.use(enforceCurrentUserIsAdmin);
