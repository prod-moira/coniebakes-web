import { z } from "zod";

const facebookUrlRegex = /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9.\-_]+\/?$/;

export const checkoutSchema = z.object({
  name: z
  .string()
    .min(2, "Please enter your full name")
    .max(50, "Please input a valid name")
    .regex(/^[A-Za-zÀ-ÿ\s'-.]+$/, "Please input a valid name")
    .refine((val) => val.trim().split(/\s+/).length >= 2, "Please enter your full name"),

email: z
  .string()
  .email("Please input a valid email address")
  .refine((val) => val.split('@')[0].length >= 3, "Please input a valid email address"),

  phone: z
    .string()
    .regex(/^09[0-9]{9}$/, "Please input a valid phone number."),

  facebook: z
    .string()
    .max(100, "Please input a valid Facebook URL")
    .regex(facebookUrlRegex, "Please input a valid Facebook URL"),

  address: z
    .string()
    .min(10, "Please enter a valid delivery address")
    .max(200, "Please enter a valid delivery address"),

  payment: z.string().min(1, "Please select a payment method"),

  deliveryDate: z.string().min(1, "Please select a delivery date"),

  deliveryTime: z.string().min(1, "Please select a delivery time"),

  specialInstructions: z.string().max(300).optional(),

  agree: z.boolean().refine(val => val === true, {
    message: "You must agree before continuing",
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;