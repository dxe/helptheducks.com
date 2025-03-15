import { z } from "zod";
import { SonomaCities } from "./zipcodes";

const EmptyStringToUndefined = z.literal("").transform(() => undefined);

export const PetitionFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name too short" })
      .max(255, { message: "Name too long" }),
    email: z.string().email().max(255, { message: "Email too long" }),
    phone: z
      .string()
      .regex(/^[0-9+-]*$/, {
        message: "Phone number may only contain numbers, +, and -",
      })
      .min(10, { message: "Phone number too short" })
      .max(255, { message: "Phone number too long" })
      .or(EmptyStringToUndefined)
      .optional(),
    outsideUS: z.boolean(),
    zip: z
      .string()
      .regex(/^[0-9]*$/, { message: "Zip code may only contain numbers" })
      .length(5, { message: "Zip code must be 5 digits or empty" })
      .or(EmptyStringToUndefined)
      .optional(),
    city: z
      .string()
      .max(255, { message: "City too long" })
      .or(EmptyStringToUndefined)
      .optional(),
    message: z
      .string()
      .min(10, { message: "Message must be at least 10 characters" })
      .max(10_000, { message: "Please limit message to 10,000 characters" }),
  })
  .superRefine((data, ctx) => {
    // If outside of US, throw away the zip code.
    if (data.outsideUS) {
      data.zip = undefined;
    } else {
      // If inside US, zip code is required.
      if (!data.zip) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Zip code is required",
          path: ["zip"],
        });
      }
    }
    const isInSonoma = !!(
      data.zip &&
      data.zip in SonomaCities &&
      SonomaCities[data.zip as keyof typeof SonomaCities]
    );
    // If outside of Sonoma, throw away the city.
    if (!isInSonoma) {
      data.city = undefined;
    }
    // If in Sonoma, city is required.
    if (isInSonoma && !data.city) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "City is required",
        path: ["city"],
      });
    }
  });

export type PetitionForm = z.infer<typeof PetitionFormSchema>;
