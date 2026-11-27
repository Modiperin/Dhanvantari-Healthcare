import { z } from "zod";

export const profileCreation = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  desc: z.string().or(z.literal("")),
  role: z.enum(["T", "A"], {
    message: "Assign proper role to this profile",
  }),
});
