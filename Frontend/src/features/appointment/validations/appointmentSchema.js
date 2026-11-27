import { isValid, parse } from "date-fns";
import {
  ageSchema,
  bloodGroupSchema,
  emailSchema,
  futureDateSchema,
  genderSchema,
  nameSchema,
  pastDateSchema,
  phoneSchema,
  relationSchema,
} from "../../../utils/schemas";
import z from "zod";

const emergencyContactSchema = z.object({
  name: nameSchema.or(z.literal("")),
  relationship: relationSchema.or(z.literal("")),
  phoneNo: phoneSchema.or(z.literal("")),
});

export const appointmentSchema = z.object({
  name: nameSchema,
  gender: genderSchema,
  bloodGroup: bloodGroupSchema,
  dateOfBirth: pastDateSchema,
  age: ageSchema,
  phoneNo: phoneSchema,
  email: emailSchema.or(z.literal("")),
  emergencyContact: emergencyContactSchema,
  departmentId: z.string(),
  doctorId: z.string(),
  date: futureDateSchema,
  time: z.string().refine(
    (val) => {
      const parsed = parse(val, "hh:mm a", new Date());
      return isValid(parsed);
    },
    {
      message: "Enter valid time format as HH:MM AM/PM",
    }
  ),
  visitNote: z
    .string()
    .nonempty({ message: "Enter Valid Visit Note" })
    .or(z.literal("")),
});
