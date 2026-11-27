import { z } from "zod";
import {
  ageSchema,
  emailSchema,
  genderSchema,
  nameSchema,
  pastDateSchema,
  phoneSchema,
} from "../../../../../utils/schemas";

export const doctordetailSchema = z.object({
  name: nameSchema,
  departmentId: z.string().nonempty({ message: "Department is required" }),
  active: z.boolean(),
  gender: genderSchema,
  type: z.enum(["full-time", "part-time", "visiting"], {
    message: "Enter valid staff type",
  }),
  age: ageSchema,
  email: emailSchema,
  phoneNo: phoneSchema.or(z.literal("")),
  dateOfBirth: pastDateSchema,
  qualifications: z
    .string()
    .array()
    .nonempty({ message: "Fill at least one qualification" }),
});
