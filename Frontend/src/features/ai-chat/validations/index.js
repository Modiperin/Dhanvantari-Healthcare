import { z } from "zod";

export const chatQuerySchema = z.object({
  user_query: z.string().min(1, { message: "Message is required" }),
});
