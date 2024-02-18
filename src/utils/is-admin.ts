export const isAdmin = (metadata: Record<string, unknown>) =>
  Array.isArray(metadata.roles) && metadata.roles.includes("admin");
