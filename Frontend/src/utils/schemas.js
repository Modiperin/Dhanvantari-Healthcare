import { z } from "zod";
import { parse, isValid, isBefore, startOfDay } from "date-fns";

export const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address") // ✅ Must be first
  .max(254, "Email must be at most 254 characters long")
  .refine((val) => val.split("@")[0]?.length <= 64, {
    message: "Email username must be at most 64 characters long",
  });
export const phoneSchema = z
  .string()
  .regex(/^\+?\d{1,4}(\s?\d{1,15})+$/, { message: "Invalid phone number" }); // adjust regex for your country
export const usernameSchema = z
  .string()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(30);

export const nameSchema = z.string().min(1, { message: "Name is required" });
export const departmentSchema = z
  .string()
  .nonempty({ message: "Department is required" });

const acceptedFormats = ["d-M-yyyy", "dd-MM-yyyy"];

export const dateSchema = (isFuture = false) =>
  z
    .string()
    .refine(
      (val) => {
        return acceptedFormats.some((format) => {
          const parsed = parse(val, format, new Date());
          return isValid(parsed);
        });
      },
      {
        message: "Enter a valid date",
      }
    )
    .refine(
      (val) => {
        const parsed = acceptedFormats
          .map((format) => parse(val, format, new Date()))
          .find((date) => isValid(date));

        if (!parsed) return false;

        const today = startOfDay(new Date());

        return isFuture ? !isBefore(parsed, today) : isBefore(parsed, today);
      },
      {
        message: isFuture
          ? "Date must be today or in the future"
          : "Date must be in the past",
      }
    );

export const pastDateSchema = dateSchema(false);
export const futureDateSchema = dateSchema(true);
export const genderSchema = z.enum(["male", "female", "others"], {
  message: "Enter valid Gender",
});
export const ageSchema = z.coerce
  .number()
  .min(0)
  .max(100, { message: "Enter valid age" });

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  });

export const doctorPasswordSchema = z
  .string()
  .min(5, { message: "Password must be at least 5 characters long" })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  });

export const pincodeSchema = z.preprocess(
  (val) => (val === "" ? null : val),
  z.coerce.number().int().gte(100000).lte(999999).nullable()
);

export const digipinSchema = z
  .string()
  .regex(/^[FCJKLMPT2-9]{10}$/, {
    message: "Use 10 codes only: F, C, J, K, L, M, P, T or 2-9.",
  })
  .or(z.literal(""));

export const relationSchema = z.enum(
  [
    "father",
    "mother",
    "wife",
    "husband",
    "son",
    "daughter",
    "brother",
    "sister",
    "guardian",
  ],
  {
    message: "Enter valid Relation",
  }
);
export const bloodGroupSchema = z.enum(
  ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-","N/A"],
  {
    message: "Enter a valid blood group",
  }
);

export const urlSchema = z
  .string()
  .url("Invalid URL")
  .min(1, "Link is required");
