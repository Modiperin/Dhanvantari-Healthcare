import { z } from "zod";
import {
  ageSchema,
  departmentSchema,
  doctorPasswordSchema,
  emailSchema,
  futureDateSchema,
  genderSchema,
  nameSchema,
  // passwordSchema,
  pastDateSchema,
  phoneSchema,
  usernameSchema,
} from "../../../utils/schemas";

export const userSchema = z.object({
  name: nameSchema,
  departmentId: departmentSchema,
  active: z.boolean(),
  dateOfBirth: pastDateSchema,
  gender: genderSchema,
  age: ageSchema,
  userName: z.union([emailSchema, phoneSchema, usernameSchema]),
  password: doctorPasswordSchema.or(z.literal("")),
  profileId: z.string().min(1, { message: "Profile is required" }),
  accessType: z.enum(["P", "T"], {
    message: "Enter valid access type",
    //p->permenant,t->temporary
  }),
  accessEndTime: futureDateSchema.or(z.literal("")),
});

export const defaultValueForUser = {
  name: "",
  departmentId: "",
  active: true,
  dateOfBirth: "",
  gender: "",
  age: "",
  userName: "",
  password: "",
  profileId: "",
  accessType: "P",
  accessEndTime: "",
};
