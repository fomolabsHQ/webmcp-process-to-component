import { z } from "zod";

export const ReturnProcessSchema = z.object({
  orderNumber: z
    .string()
    .min(5, "Order number is required")
    .regex(/^ORD-[A-Za-z0-9]{3,8}$/i, "Format must be ORD-XXXX (e.g. ORD-9821)"),
  email: z.string().email("A valid account email is required"),
  itemCondition: z.enum(["unopened", "gently_used"], {
    errorMap: () => ({ message: "Item must be unopened or gently used to be eligible." }),
  }),
  reason: z.enum(["wrong_size", "defective", "not_as_described", "changed_mind"], {
    errorMap: () => ({ message: "Please select a valid return reason." }),
  }),
  returnMethod: z.enum(["dropoff_qr", "carrier_pickup", "in_store"], {
    errorMap: () => ({ message: "Please select a valid return method." }),
  }),
  refundPreference: z.enum(["original_payment", "store_credit"], {
    errorMap: () => ({ message: "Please select a refund preference." }),
  }),
  notes: z.string().max(250, "Notes cannot exceed 250 characters").optional(),
});

export type ReturnFormData = z.infer<typeof ReturnProcessSchema>;

/**
 * Compliant JSON Schema object for document.modelContext.registerTool
 */
export const returnToolInputSchema = {
  type: "object",
  properties: {
    orderNumber: {
      type: "string",
      description: "Customer order identifier (format: ORD-XXXX, e.g. ORD-9821)",
    },
    email: {
      type: "string",
      description: "Customer email linked to the purchase",
    },
    itemCondition: {
      type: "string",
      enum: ["unopened", "gently_used"],
      description: "Physical condition of the item",
    },
    reason: {
      type: "string",
      enum: ["wrong_size", "defective", "not_as_described", "changed_mind"],
      description: "Customer reason for return",
    },
    returnMethod: {
      type: "string",
      enum: ["dropoff_qr", "carrier_pickup", "in_store"],
      description: "Carrier or drop-off method",
    },
    refundPreference: {
      type: "string",
      enum: ["original_payment", "store_credit"],
      description: "Refund to original payment or store credit with +10% bonus",
    },
    notes: {
      type: "string",
      description: "Optional notes or additional context",
    },
  },
  required: [
    "orderNumber",
    "email",
    "itemCondition",
    "reason",
    "returnMethod",
    "refundPreference",
  ],
};
