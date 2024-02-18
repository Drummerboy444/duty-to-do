// import { Axiom } from "@axiomhq/js";
// import { env } from "~/env";

// const axiom = new Axiom({
//   token: env.AXIOM_TOKEN,
//   orgId: env.AXIOM_ORG_ID,
// });

export const log = (event: {
  level: "INFO" | "ERROR";
  message: string;
  userId: string | undefined;
  additionalData?: unknown;
}) => {
  // axiom.ingest(env.AXIOM_DATASET, event);
};

export const flushLogs = async () => {
  // await axiom.flush();
};
