import { z } from "zod";
import {
  ageSchema,
  bloodGroupSchema,
  digipinSchema,
  emailSchema,
  genderSchema,
  nameSchema,
  pastDateSchema,
  phoneSchema,
  pincodeSchema,
  relationSchema,
} from "../../../utils/schemas";

const addressSchema = z.object({
  houseName: z.string().min(1, "House name is required"),
  locality: z.string().min(1, "Locality is required"),
  area: z.string().min(1, "Area is required"),
  city: z.string().min(1, "city is required"),
  pincode: pincodeSchema.nullable(),
  digipin: digipinSchema,
  state: z.string().min(1, "state is required"),
  country: z.string().min(1, "country is required"),
});

const emergencyContactSchema = z.object({
  name: nameSchema.or(z.literal("")),
  relationship: relationSchema.or(z.literal("")),
  phoneNo: phoneSchema.or(z.literal("")),
});

export const patientSchema = z.object({
  name: nameSchema,
  gender: genderSchema,
  bloodGroup: bloodGroupSchema,
  dateOfBirth: pastDateSchema,
  age: ageSchema,
  phoneNo: phoneSchema,
  email: emailSchema.or(z.literal("")),
  address: addressSchema,
  emergencyContact: emergencyContactSchema,
  departmentId: z.string().or(z.literal("")),
  doctorId: z.string().or(z.literal("")),
  priority: z.coerce.number(),
  visitNote: z
    .string()
    .nonempty({ message: "Enter Valid Visit Note" })
    .or(z.literal("")),
});

export const defaultPatientFormValues = {
  name: "",
  gender: "male",
  bloodGroup: "O+",
  dateOfBirth: "",
  age: 0,
  phoneNo: "",
  email: "",
  typeOfPatient: "newPatient",
  address: {
    houseName: "",
    locality: "",
    area: "",
    city: "",
    pincode: "",
    digipin: "",
    state: "",
    country: "india",
  },
  emergencyContact: {
    name: "",
    relationship: "",
    phoneNo: "",
  },
  departmentId: "",
  doctorId: "",
  priority: 3,
  visitNote: "",
  referredBy: "",
};
