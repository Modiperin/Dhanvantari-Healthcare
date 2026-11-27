import { z } from "zod";
import { doctorPasswordSchema } from "../../../utils/schemas";

export const resetPasswordSchema = z
  .object({
    password: doctorPasswordSchema,
    confirmPassword: z.string(),
    superAdminPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match. Please try again.",
  });