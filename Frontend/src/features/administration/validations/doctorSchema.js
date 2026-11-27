import { z } from "zod";
import {
  doctorPasswordSchema,
  emailSchema,
  futureDateSchema,
  nameSchema,
  pastDateSchema,
  phoneSchema,
  urlSchema,
  usernameSchema,
} from "../../../utils/schemas";

const socialLinks = z.array(
  z.object({
    name: nameSchema.or(z.literal("")),
    url: urlSchema.or(z.literal(""))
  })
);

const awards = z.array(
  z.object({
    awardName: z.string().min(1, "Award Name is required").or(z.literal("")),
    awardedBy: z.string().min(1, "Awarded by is required").or(z.literal("")),
    date: pastDateSchema.or(z.literal("")),
  })
);

const publications = z.array(
  z.object({
    title: z.string().min(1, "Publication title is required").or(z.literal("")),
    publicationDate: pastDateSchema.or(z.literal("")),
    journal: z.string().min(1, "Journal is required").or(z.literal("")),
    url: urlSchema.or(z.literal("")),
  }).or(z.literal(""))
);

export const doctorSchema = z.object({
  titleName: z.enum(["Dr.", "Mr.", "Mrs.", "Prof.", "Ms", "none"], {
    message: "Enter valid Title Name",
  }),
  name: z.string().min(1, { message: "Name is required" }),
  gender: z.enum(["male", "female", "others"], {
    message: "Enter valid Gender",
  }),
  registrationNo: z.string().nonempty({ message: "Registeration is required" }),
  type: z.enum(["full-time", "part-time", "visiting"], {
    message: "Enter valid staff type",
  }),
  experience: z.coerce
    .number()
    .min(0)
    .max(100, { message: "Enter valid Experience" })
    .or(z.literal("")),
  departmentId: z.string().nonempty({ message: "Department is required" }),
  dateOfBirth: pastDateSchema,
  specialities: z
    .string()
    .array()
    .nonempty({ message: "Fill at least one specialities" }),
  qualifications: z
    .string()
    .array()
    .nonempty({ message: "Fill at least one qualification" }),
  userName: z.union([emailSchema, phoneSchema, usernameSchema]),
  password: doctorPasswordSchema.or(z.literal("")),
  profileId: z.string().nonempty({ message: "Profile is required" }),
  accessType: z.enum(["P", "T"], {
    message: "Enter valid access type",
    //p->permenant,t->temporary
  }),
  accessEndTime: futureDateSchema.or(z.literal("")),
  active: z.coerce.boolean(),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(1000, "Bio must not exceed 1000 characters")
    .or(z.literal("")),
  socialLinks,
  awards,
  publications,
});

export const defaultValues = {
  titleName: "Dr.",
  name: "",
  gender: "",
  registrationNo: "",
  type: "",
  experience: null,
  departmentId: "",
  dateOfBirth: "",
  specialities: [],
  qualifications: [],
  userName: "",
  password: "",
  profileId: "",
  accessType: "P",
  accessEndTime: "",
  active: true,
  bio: "",
  socialLinks: [
    {
      name: null,
      url: null,
    },
  ],
  awards: [
    {
      awardName: "",
      awardedBy: "",
      date: "",
    },
  ],
  publications: [
    {
      title: "",
      publicationDate: "",
      journal: "",
      url: "",
    },
  ],
};
