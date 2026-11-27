import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(1, { message: "Department is Required" }),
  code: z.string().min(1, { message: "Code is Required" }),
  active: z.boolean(),
});