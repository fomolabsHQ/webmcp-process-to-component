import { z } from "zod";

export const InsuranceClaimSchema = z.object({
  policyNumber: z
    .string()
    .min(5, "Policy number is required")
    .regex(/^POL-\d{4,8}$/i, "Format must be POL-XXXXXX (e.g. POL-883920)"),
  policyHolderName: z.string().min(2, "Insured party full name is required"),
  coverageType: z.enum(["auto", "homeowners", "commercial"], {
    errorMap: () => ({ message: "Select a valid coverage line." }),
  }),
  incidentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must follow YYYY-MM-DD format"),
  incidentLocation: z.string().min(3, "Incident location is required"),
  incidentDescription: z
    .string()
    .min(15, "Description must be at least 15 characters to provide adequate context"),
  hasPoliceReport: z.boolean(),
  policeReportNumber: z.string().optional(),
  hasThirdPartyInvolved: z.boolean(),
  estimatedLossAmount: z
    .number({ invalid_type_error: "Estimated loss must be a number" })
    .positive("Estimated loss must be greater than $0"),
  evidenceType: z.enum(["photos", "repair_estimate", "medical_invoice", "affidavit"], {
    errorMap: () => ({ message: "Select primary evidence type." }),
  }),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export type InsuranceClaimFormData = z.infer<typeof InsuranceClaimSchema>;

/**
 * Compliant JSON Schema object for document.modelContext.registerTool
 */
export const insuranceClaimToolInputSchema = {
  type: "object",
  properties: {
    policyNumber: {
      type: "string",
      description: "Policy identifier (format: POL-XXXXXX, e.g. POL-883920)",
    },
    policyHolderName: {
      type: "string",
      description: "Full legal name of insured individual or company",
    },
    coverageType: {
      type: "string",
      enum: ["auto", "homeowners", "commercial"],
      description: "Policy insurance product line",
    },
    incidentDate: {
      type: "string",
      description: "Date the event occurred in ISO format (YYYY-MM-DD)",
    },
    incidentLocation: {
      type: "string",
      description: "City, state or street address of incident",
    },
    incidentDescription: {
      type: "string",
      description: "Detailed narrative describing how damage occurred",
    },
    hasPoliceReport: {
      type: "boolean",
      description: "Whether a formal police or authority report was filed",
    },
    policeReportNumber: {
      type: "string",
      description: "Blotter or police incident report ID if applicable",
    },
    hasThirdPartyInvolved: {
      type: "boolean",
      description: "Whether other individuals or vehicles were involved",
    },
    estimatedLossAmount: {
      type: "number",
      description: "Total estimated monetary cost of damage in USD",
    },
    evidenceType: {
      type: "string",
      enum: ["photos", "repair_estimate", "medical_invoice", "affidavit"],
      description: "Primary type of supporting documentation",
    },
    notes: {
      type: "string",
      description: "Optional supplementary notes or adjuster remarks",
    },
  },
  required: [
    "policyNumber",
    "policyHolderName",
    "coverageType",
    "incidentDate",
    "incidentLocation",
    "incidentDescription",
    "hasPoliceReport",
    "hasThirdPartyInvolved",
    "estimatedLossAmount",
    "evidenceType",
  ],
};
