import { ReturnFormData, ReturnProcessSchema } from "./schema";

export interface ReturnExecutionResult {
  success: boolean;
  rmaNumber?: string;
  orderNumber?: string;
  trackingNumber?: string;
  qrCodeData?: string;
  refundAmount?: string;
  refundMethodDescription?: string;
  status?: string;
  message?: string;
  error?: string;
}

/**
 * Unified mutation handler for customer product returns.
 * Executed identically by both the human UI and AI agent WebMCP calls.
 */
export async function executeReturnAction(
  data: unknown
): Promise<ReturnExecutionResult> {
  // 1. Strict validation via single source of truth schema
  const parsed = ReturnProcessSchema.safeParse(data);
  if (!parsed.success) {
    const errorDetails = parsed.error.issues.map((i) => i.message).join("; ");
    return {
      success: false,
      error: `Validation error: ${errorDetails}`,
    };
  }

  const valid: ReturnFormData = parsed.data;

  // 2. Simulated backend latency & database check
  await new Promise((resolve) => setTimeout(resolve, 600));

  // 3. Compute refund details
  const basePrice = 89.0;
  const tax = 7.12;
  const subtotal = basePrice + tax;
  const isStoreCredit = valid.refundPreference === "store_credit";
  const bonus = isStoreCredit ? subtotal * 0.1 : 0;
  const totalRefund = subtotal + bonus;

  const rmaNumber = `RMA-${Math.floor(100000 + Math.random() * 900000)}`;
  const trackingNumber = `1Z${Math.random().toString(36).substring(2, 10).toUpperCase()}9821`;
  const qrCodeData = `${rmaNumber}-${valid.returnMethod.toUpperCase()}`;

  return {
    success: true,
    status: "READY",
    rmaNumber,
    orderNumber: valid.orderNumber,
    trackingNumber,
    qrCodeData,
    refundAmount: `$${totalRefund.toFixed(2)}`,
    refundMethodDescription: isStoreCredit
      ? `Instant Store Credit with 10% Bonus ($${bonus.toFixed(2)} bonus included)`
      : "Original Payment Card (disbursed within 3–5 business days)",
    message: `Return authorization ${rmaNumber} created successfully. Package is ready for ${
      valid.returnMethod === "dropoff_qr"
        ? "digital QR drop-off"
        : valid.returnMethod === "carrier_pickup"
        ? "doorstep courier pickup"
        : "in-store retail return"
    }.`,
  };
}
