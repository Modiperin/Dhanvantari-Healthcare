import { z } from "zod";
export const departmentSchema = z.object({
  name: z.string().min(1, { message: "Department name is required" }),
  code: z.string().min(1, { message: "Department code is required" }),
  active: z.boolean(),
});

export const defaultValueForDepartment = {
  name: "",
  code: "",
  active: true,
};
