import { api } from "@workspace/backend/convex/_generated/api";

export const reddiActions = {
  generateStatements: api.reddi.generateStatements,
} as const;
