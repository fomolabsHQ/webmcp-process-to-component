import { InsuranceClaimFormData, InsuranceClaimSchema } from "./schema";

export interface ClaimExecutionResult {
  success: boolean;
  claimNumber?: string;
  policyNumber?: string;
  policyHolderName?: string;
  coverageType?: string;
  estimatedLoss?: string;
  deductible?: string;
  netEstimatedPayout?: string;
  assignedAdjuster?: string;
  reviewDeadline?: string;
  status?: string;
  message?: string;
  error?: string;
}

/**
 * Unified mutation handler for insurance claims.
 * Executed identically by both the human UI and AI agent WebMCP calls.
 */
export async function executeInsuranceClaimAction(
  data: unknown
): Promise<ClaimExecutionResult> {
  // 1. Strict validation via single source of truth schema
  const parsed = InsuranceClaimSchema.safeParse(data);
  if (!parsed.success) {
    const errorDetails = parsed.error.issues.map((i) => i.message).join("; ");
    return {
      success: false,
      error: `Validation error: ${errorDetails}`,
    };
  }

  const valid: InsuranceClaimFormData = parsed.data;

  // 2. Simulated backend latency & policy database verification
  await new Promise((resolve) => setTimeout(resolve, 700));

  // 3. Compute deductible and net eligible payout
  const deductibleAmount = 500.0;
  const netPayout = Math.max(0, valid.estimatedLossAmount - deductibleAmount);

  const claimNumber = `CLM-${Math.floor(100000 + Math.random() * 900000)}`;
  const adjusters = [
    "Sarah Jenkins (Senior Casualty Adjuster)",
    "David Vance (Property Damage Specialist)",
    "Elena Rostova (Commercial Claims Lead)",
  ];
  const assignedAdjuster = adjusters[Math.floor(Math.random() * adjusters.length)];

  return {
    success: true,
    status: "UNDER_REVIEW",
    claimNumber,
    policyNumber: valid.policyNumber,
    policyHolderName: valid.policyHolderName,
    coverageType: valid.coverageType.toUpperCase(),
    estimatedLoss: `$${valid.estimatedLossAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    deductible: `$${deductibleAmount.toFixed(2)}`,
    netEstimatedPayout: `$${netPayout.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    assignedAdjuster,
    reviewDeadline: "2 Business Days",
    message: `Claim ${claimNumber} created successfully for policy ${valid.policyNumber}. Dispatched to ${assignedAdjuster}.`,
  };
}
