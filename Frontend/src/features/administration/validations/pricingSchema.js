import { z } from "zod";
export const pricingSchema = z.object({
  name: z.string().min(1, { message: "Service/Payment name is required" }),
  cost: z.coerce.number().min(1, "Pricing must be greater than 0"),
  status: z.boolean(),
});

export const defaultValueForPricingForm = {
  name: "",
  cost: 0,
  status: true,
};
