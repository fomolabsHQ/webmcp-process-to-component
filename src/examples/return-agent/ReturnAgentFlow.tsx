import { useState } from "react";
import { Check, QrCode, AlertCircle, ArrowRight, ArrowLeft, RotateCcw, PackageCheck, Truck, CreditCard } from "lucide-react";
import { ReturnFormData, returnToolInputSchema } from "./schema";
import { executeReturnAction, ReturnExecutionResult } from "./handler";
import { useWebMCPTool } from "../../lib/webmcp";

interface ReturnAgentFlowProps {
  onClose?: () => void;
}

export function ReturnAgentFlow({ onClose }: ReturnAgentFlowProps) {
  // Stepper state (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form values
  const [formData, setFormData] = useState<Partial<ReturnFormData>>({
    orderNumber: "ORD-9821",
    email: "customer@example.com",
    itemCondition: "gently_used",
    reason: "wrong_size",
    returnMethod: "dropoff_qr",
    refundPreference: "store_credit",
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ReturnExecutionResult | null>(null);

  // Unified execution trigger (used by human finish & AI tool)
  const performReturn = async (data: ReturnFormData) => {
    setIsSubmitting(true);
    setValidationError(null);
    try {
      const res = await executeReturnAction(data);
      setExecutionResult(res);
      if (res.success) {
        setCurrentStep(6);
      } else {
        setValidationError(res.error || "Failed to process return.");
      }
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unexpected error during return.";
      setValidationError(msg);
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  };

  // WebMCP tool registration on document.modelContext
  useWebMCPTool({
    name: "process_product_return",
    description: "Processes an e-commerce customer product return, validates eligibility, and generates an RMA authorization and return shipping QR code.",
    inputSchema: returnToolInputSchema,
    execute: async (input) => {
      // Sync incoming AI agent parameters to visual UI state
      const typedInput = input as ReturnFormData;
      setFormData(typedInput);
      return await performReturn(typedInput);
    },
  });

  const handleNext = async () => {
    setValidationError(null);

    if (currentStep === 1) {
      if (!formData.orderNumber || !formData.email) {
        setValidationError("Please enter both your order number and account email.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.itemCondition) {
        setValidationError("Please select item condition.");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!formData.reason) {
        setValidationError("Please select a return reason.");
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!formData.returnMethod) {
        setValidationError("Please select a return method.");
        return;
      }
      setCurrentStep(5);
    } else if (currentStep === 5) {
      if (!formData.refundPreference) {
        setValidationError("Please select a refund preference.");
        return;
      }
      // Execute final mutation
      await performReturn(formData as ReturnFormData);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStep > 1 && currentStep < 6) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setExecutionResult(null);
    setValidationError(null);
  };

  // Timeline Step metadata
  const steps = [
    {
      num: 1,
      name: "Order Lookup",
      time: "01:00 PM",
      desc: "Identify order # and verified customer account email",
    },
    {
      num: 2,
      name: "Eligibility Check",
      time: "01:02 PM",
      desc: "Verify 30-day policy window and physical product condition",
    },
    {
      num: 3,
      name: "Return Reason",
      time: "01:03 PM",
      desc: "Customer stated reason for return or exchange",
    },
    {
      num: 4,
      name: "Return Logistics",
      time: "01:04 PM",
      desc: "Selection of carrier drop-off or courier pickup",
    },
    {
      num: 5,
      name: "Refund Preference",
      time: "01:05 PM",
      desc: "Original payment method or instant store credit bonus",
    },
    {
      num: 6,
      name: "Ready & Confirmation",
      time: "01:06 PM",
      desc: "RMA authorization and prepaid QR code generated",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] shadow-xl overflow-hidden transition-all">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[var(--color-rule)] bg-[var(--color-paper-alt)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-[var(--color-ink)]">
              Product Return Agent
            </h3>
            <p className="text-xs font-mono text-[var(--color-ink-subtle)]">
              WebMCP Tool: <span className="text-[var(--color-accent)] font-semibold">process_product_return</span>
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs font-mono px-3 py-1.5 rounded-full border border-[var(--color-rule)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-rule-strong)]"
          >
            Close
          </button>
        )}
      </div>

      {/* Main Stepper Content following process-ui desing.png */}
      <div className="p-6 sm:p-8">
        
        {/* Error notification */}
        {validationError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Vertical Timeline Stepper */}
        <div className="relative flex flex-col space-y-8">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.num || (currentStep === 6 && executionResult?.success);
            const isCurrent = currentStep === step.num && !(currentStep === 6 && executionResult?.success);
            const isLast = index === steps.length - 1;

            return (
              <div key={step.num} className="relative flex items-start gap-4 sm:gap-6 group">
                
                {/* Left: Time Column */}
                <div className="w-16 sm:w-20 pt-1 text-right font-mono text-xs font-medium text-[var(--color-ink-subtle)]">
                  {step.time}
                </div>

                {/* Middle: Vertical Line & Node */}
                <div className="relative flex flex-col items-center">
                  {/* Circular Node */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                      isCompleted
                        ? "bg-[#22C55E] text-white shadow-sm ring-4 ring-emerald-500/10"
                        : isCurrent
                        ? "bg-[var(--color-accent)] text-white ring-4 ring-[var(--color-accent)]/20"
                        : "bg-[var(--color-paper-sunken)] border border-[var(--color-rule)] text-[var(--color-ink-subtle)]"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span className="text-xs font-mono font-semibold">{step.num}</span>
                    )}
                  </div>

                  {/* Vertical Connector Line */}
                  {!isLast && (
                    <div
                      className={`w-[2px] absolute top-7 bottom-[-34px] transition-colors duration-300 ${
                        isCompleted ? "bg-[#22C55E]" : "bg-[var(--color-rule-strong)]"
                      }`}
                    />
                  )}
                </div>

                {/* Right: Step Title & Interactive Body */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-display font-semibold text-sm transition-colors ${
                        isCurrent
                          ? "text-[var(--color-accent)]"
                          : isCompleted
                          ? "text-[var(--color-ink)]"
                          : "text-[var(--color-ink-muted)]"
                      }`}
                    >
                      {step.name}
                    </h4>
                    {isCompleted && (
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Confirmed
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-[var(--color-ink-subtle)] mt-0.5 mb-3">
                    {step.desc}
                  </p>

                  {/* Step 1 Interactive Form */}
                  {isCurrent && step.num === 1 && (
                    <div className="p-4 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper-alt)] space-y-3">
                      <div>
                        <label className="block text-xs font-mono text-[var(--color-ink-2)] mb-1">
                          Order Number
                        </label>
                        <input
                          type="text"
                          value={formData.orderNumber || ""}
                          onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                          placeholder="ORD-9821"
                          className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-[var(--color-ink-2)] mb-1">
                          Customer Email
                        </label>
                        <input
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="customer@example.com"
                          className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2 Interactive Form */}
                  {isCurrent && step.num === 2 && (
                    <div className="p-4 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper-alt)] space-y-2">
                      <label className="block text-xs font-mono text-[var(--color-ink-2)] mb-1">
                        Item Condition
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, itemCondition: "gently_used" })}
                          className={`p-3 rounded-lg border text-xs font-medium text-left transition-all ${
                            formData.itemCondition === "gently_used"
                              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-ink)]"
                              : "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink-muted)]"
                          }`}
                        >
                          <div className="font-semibold text-[var(--color-ink)]">Gently Used</div>
                          <div className="text-[11px] text-[var(--color-ink-subtle)]">Opened, packaging intact</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, itemCondition: "unopened" })}
                          className={`p-3 rounded-lg border text-xs font-medium text-left transition-all ${
                            formData.itemCondition === "unopened"
                              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-ink)]"
                              : "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink-muted)]"
                          }`}
                        >
                          <div className="font-semibold text-[var(--color-ink)]">Unopened</div>
                          <div className="text-[11px] text-[var(--color-ink-subtle)]">Factory sealed</div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3 Interactive Form */}
                  {isCurrent && step.num === 3 && (
                    <div className="p-4 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper-alt)] space-y-3">
                      <div>
                        <label className="block text-xs font-mono text-[var(--color-ink-2)] mb-1">
                          Primary Reason
                        </label>
                        <select
                          value={formData.reason}
                          onChange={(e) => setFormData({ ...formData, reason: e.target.value as ReturnFormData["reason"] })}
                          className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent)]"
                        >
                          <option value="wrong_size">Wrong Size / Fit</option>
                          <option value="defective">Defective / Damaged in transit</option>
                          <option value="not_as_described">Item not as pictured</option>
                          <option value="changed_mind">No longer needed</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Step 4 Interactive Form */}
                  {isCurrent && step.num === 4 && (
                    <div className="p-4 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper-alt)] space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, returnMethod: "dropoff_qr" })}
                          className={`p-3 rounded-lg border text-xs font-medium text-left transition-all ${
                            formData.returnMethod === "dropoff_qr"
                              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                              : "border-[var(--color-rule)] bg-[var(--color-paper)]"
                          }`}
                        >
                          <QrCode className="w-4 h-4 text-[var(--color-accent)] mb-1" />
                          <div className="font-semibold text-[var(--color-ink)]">Drop-off QR</div>
                          <div className="text-[10px] text-[var(--color-ink-subtle)]">No printer needed</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, returnMethod: "carrier_pickup" })}
                          className={`p-3 rounded-lg border text-xs font-medium text-left transition-all ${
                            formData.returnMethod === "carrier_pickup"
                              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                              : "border-[var(--color-rule)] bg-[var(--color-paper)]"
                          }`}
                        >
                          <Truck className="w-4 h-4 text-[var(--color-accent)] mb-1" />
                          <div className="font-semibold text-[var(--color-ink)]">Home Pickup</div>
                          <div className="text-[10px] text-[var(--color-ink-subtle)]">Doorstep courier</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, returnMethod: "in_store" })}
                          className={`p-3 rounded-lg border text-xs font-medium text-left transition-all ${
                            formData.returnMethod === "in_store"
                              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                              : "border-[var(--color-rule)] bg-[var(--color-paper)]"
                          }`}
                        >
                          <PackageCheck className="w-4 h-4 text-[var(--color-accent)] mb-1" />
                          <div className="font-semibold text-[var(--color-ink)]">In-Store</div>
                          <div className="text-[10px] text-[var(--color-ink-subtle)]">Immediate refund</div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 5 Interactive Form */}
                  {isCurrent && step.num === 5 && (
                    <div className="p-4 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper-alt)] space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, refundPreference: "store_credit" })}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            formData.refundPreference === "store_credit"
                              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 ring-1 ring-[var(--color-accent)]"
                              : "border-[var(--color-rule)] bg-[var(--color-paper)]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-[var(--color-ink)]">Store Credit</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
                              +10% Bonus
                            </span>
                          </div>
                          <div className="text-[11px] text-[var(--color-ink-subtle)]">
                            Instant balance credit: <span className="font-semibold text-[var(--color-ink)]">$105.73</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, refundPreference: "original_payment" })}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            formData.refundPreference === "original_payment"
                              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 ring-1 ring-[var(--color-accent)]"
                              : "border-[var(--color-rule)] bg-[var(--color-paper)]"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <CreditCard className="w-3.5 h-3.5 text-[var(--color-ink-muted)]" />
                            <span className="text-xs font-semibold text-[var(--color-ink)]">Original Card</span>
                          </div>
                          <div className="text-[11px] text-[var(--color-ink-subtle)]">
                            Disbursed in 3–5 days: <span className="font-semibold text-[var(--color-ink)]">$96.12</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 6: Confirmation Screen */}
                  {step.num === 6 && executionResult?.success && (
                    <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-mono uppercase text-emerald-600 dark:text-emerald-400 font-semibold">
                            Return Authorization Active
                          </div>
                          <div className="font-display font-bold text-lg text-[var(--color-ink)]">
                            {executionResult.rmaNumber}
                          </div>
                        </div>

                        {/* Digital QR Code Badge */}
                        <div className="p-2 rounded-lg bg-white border border-[var(--color-rule)] shadow-xs">
                          <QrCode className="w-10 h-10 text-[var(--color-ink)]" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--color-rule)] text-xs font-mono">
                        <div>
                          <span className="text-[var(--color-ink-subtle)]">Tracking Code:</span>
                          <div className="font-semibold text-[var(--color-ink)]">{executionResult.trackingNumber}</div>
                        </div>
                        <div>
                          <span className="text-[var(--color-ink-subtle)]">Total Refund:</span>
                          <div className="font-semibold text-emerald-600 dark:text-emerald-400 font-bold">{executionResult.refundAmount}</div>
                        </div>
                      </div>

                      <p className="text-xs text-[var(--color-ink-muted)]">
                        {executionResult.message}
                      </p>

                      <button
                        onClick={resetFlow}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-accent)] hover:underline pt-2"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Process another return</span>
                      </button>
                    </div>
                  )}

                  {/* Compact summary of completed values */}
                  {isCompleted && step.num < 6 && (
                    <div className="text-xs font-mono text-[var(--color-ink-muted)] bg-[var(--color-paper-alt)] px-3 py-1.5 rounded-md inline-block border border-[var(--color-rule)]">
                      {step.num === 1 && `Order: ${formData.orderNumber} • ${formData.email}`}
                      {step.num === 2 && `Condition: ${formData.itemCondition}`}
                      {step.num === 3 && `Reason: ${formData.reason}`}
                      {step.num === 4 && `Logistics: ${formData.returnMethod}`}
                      {step.num === 5 && `Refund: ${formData.refundPreference}`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stepper Navigation Buttons (for human interaction) */}
        {currentStep < 6 && (
          <div className="mt-8 pt-6 border-t border-[var(--color-rule)] flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--color-rule)] text-xs font-display font-medium text-[var(--color-ink-2)] hover:bg-[var(--color-paper-alt)] disabled:opacity-40 disabled:pointer-events-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-deep)] text-white text-xs font-display font-semibold transition-all shadow-sm"
            >
              <span>{currentStep === 5 ? "Submit Return" : "Continue"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
