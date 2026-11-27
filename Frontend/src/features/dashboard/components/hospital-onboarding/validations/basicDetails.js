import { z } from "zod";
import {
  digipinSchema,
  emailSchema,
  phoneSchema,
  pincodeSchema,
} from "../../../../../utils/schemas";

export const basicDetailsSchema = z.object({
  name: z.string().min(1, { message: "Hospital name is required" }),
  pincode: pincodeSchema,
  digiPin: digipinSchema,
  address: z.string().min(1, { message: "Address is required" }),
  email: emailSchema,
  optionalEmail: emailSchema.or(z.literal("")).nullable(),
  phoneNo: phoneSchema,
  optionalPhoneNo: phoneSchema.or(z.literal("")).nullable(),
});
