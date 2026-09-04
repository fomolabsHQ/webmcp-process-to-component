import { useState } from "react";
import { Check, AlertCircle, ArrowRight, ArrowLeft, Shield, FileText, CheckCircle2 } from "lucide-react";
import { InsuranceClaimFormData, insuranceClaimToolInputSchema } from "./schema";
import { executeInsuranceClaimAction, ClaimExecutionResult } from "./handler";
import { useWebMCPTool } from "../../lib/webmcp";

interface InsuranceClaimFlowProps {
  onClose?: () => void;
}

export function InsuranceClaimFlow({ onClose }: InsuranceClaimFlowProps) {
  // Stepper state (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form values with realistic defaults
  const [formData, setFormData] = useState<Partial<InsuranceClaimFormData>>({
    policyNumber: "POL-883920",
    policyHolderName: "Jane Doe",
    coverageType: "auto",
    incidentDate: new Date().toISOString().split("T")[0],
    incidentLocation: "Austin, TX",
    incidentDescription: "Front bumper damaged during slow-speed collision in parking lot.",
    hasPoliceReport: true,
    policeReportNumber: "APD-2026-9812",
    hasThirdPartyInvolved: true,
    estimatedLossAmount: 3200,
    evidenceType: "photos",
    notes: "Photos of damaged panel and exchange slip from other driver provided.",
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ClaimExecutionResult | null>(null);

  // Unified mutation execution trigger
  const performClaim = async (data: InsuranceClaimFormData) => {
    setIsSubmitting(true);
    setValidationError(null);
    try {
      const res = await executeInsuranceClaimAction(data);
      setExecutionResult(res);
      if (res.success) {
        setCurrentStep(6);
      } else {
        setValidationError(res.error || "Failed to process claim.");
      }
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unexpected error during claim filing.";
      setValidationError(msg);
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  };

  // WebMCP tool registration on document.modelContext
  useWebMCPTool({
    name: "file_insurance_claim",
    description: "Filing an insurance claim, verifying active policy limits, validating regulatory checklists, calculating deductibles, and dispatching to an assigned claims adjuster.",
    inputSchema: insuranceClaimToolInputSchema,
    execute: async (input) => {
      // Synchronize incoming AI agent parameters with the visual form state
      const typedInput = input as InsuranceClaimFormData;
      setFormData(typedInput);
      return await performClaim(typedInput);
    },
  });

  const handleNext = async () => {
    setValidationError(null);

    if (currentStep === 1) {
      if (!formData.policyNumber || !formData.policyHolderName || !formData.coverageType) {
        setValidationError("Please complete all policy details.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.incidentDate || !formData.incidentLocation || !formData.incidentDescription || formData.incidentDescription.length < 15) {
        setValidationError("Please provide complete incident details (description must be at least 15 chars).");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (formData.hasPoliceReport === undefined || formData.hasThirdPartyInvolved === undefined) {
        setValidationError("Please answer the statutory questions.");
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!formData.estimatedLossAmount || formData.estimatedLossAmount <= 0 || !formData.evidenceType) {
        setValidationError("Please enter an estimated loss greater than $0 and select evidence type.");
        return;
      }
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Execute final submission
      await performClaim(formData as InsuranceClaimFormData);
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
      name: "Policy Verification",
      time: "09:00 AM",
      desc: "Verify active policy coverage, line, and named policyholder",
    },
    {
      num: 2,
      name: "Incident Details",
      time: "09:05 AM",
      desc: "Document date of occurrence, jurisdiction, and event summary",
    },
    {
      num: 3,
      name: "Statutory Requirements",
      time: "09:10 AM",
      desc: "Record law enforcement report and third-party involvement",
    },
    {
      num: 4,
      name: "Evidence & Loss",
      time: "09:15 AM",
      desc: "Itemize estimated damages and upload supporting documentation",
    },
    {
      num: 5,
      name: "Validation & Deductible",
      time: "09:20 AM",
      desc: "Audit policy deductible and preview net estimated coverage",
    },
    {
      num: 6,
      name: "Submission & Assignment",
      time: "09:25 AM",
      desc: "Issue formal claim reference number and assign adjuster",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] shadow-xl overflow-hidden transition-all">
      {/* Header with Blue Theme */}
      <div className="px-6 py-5 border-b border-[var(--color-rule)] bg-[var(--color-paper-alt)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-[var(--color-ink)]">
              Insurance Claim Portal
            </h3>
            <p className="text-xs font-mono text-[var(--color-ink-subtle)]">
              WebMCP Tool: <span className="text-blue-600 dark:text-blue-400 font-semibold">file_insurance_claim</span>
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
                  {/* Circular Node: Emerald green on complete, Blue on current active */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                      isCompleted
                        ? "bg-[#22C55E] text-white shadow-sm ring-4 ring-emerald-500/10"
                        : isCurrent
                        ? "bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-sm"
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

                {/* Right: Step Content & Interactive Form */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-display font-semibold text-sm transition-colors ${
                        isCurrent
                          ? "text-blue-600 dark:text-blue-400"
                          : isCompleted
                          ? "text-[var(--color-ink)]"
                          : "text-[var(--color-ink-muted)]"
                      }`}
                    >
                      {step.name}
                    </h4>
                    {isCompleted && (
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Verified
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-[var(--color-ink-subtle)] mt-0.5 mb-3">
                    {step.desc}
                  </p>

                  {/* Step 1 Interactive Form: Policy */}
                  {isCurrent && step.num === 1 && (
                    <div className="p-4 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper-alt)] space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-mono text-[var(--color-ink-2)] mb-1">
                            Policy Number
                          </label>
                          <input
                            type="text"
                            value={formData.policyNumber || ""}
                            onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                            placeholder="POL-883920"
                            className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[var(--color-ink)] focus:outline-none focus:border-blue-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-[var(--color-ink-2)] mb-1">
                            Policyholder Name
                          </label>
                          <input
                            type="text"
                            value={formData.policyHolderName || ""}
                            onChange={(e) => setFormData({ ...formData, policyHolderName: e.target.value })}
                            placeholder="Jane Doe"
                            className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[var(--color-ink)] focus:outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[var(--color-ink-2)] mb-1">
                          Coverage Line
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["auto", "homeowners", "commercial"] as const).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setFormData({ ...formData, coverageType: type })}
                              className={`py-2 px-3 rounded-lg border text-xs font-medium capitalize text-center transition-all ${
                                formData.coverageType === type
                                  ? "border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                                  : "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink-muted)]"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2 Interactive Form: Incident */}
                  {isCurrent && step.num === 2 && (
                    <div className="p-4 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper-alt)] space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-mono text-[var(--color-ink-2)] mb-1">
                            Incident Date
                          </label>
                          <input
                            type="date"
                            value={formData.incidentDate || ""}
                            onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                            className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[var(--color-ink)] focus:outline-none focus:border-blue-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-[var(--color-ink-2)] mb-1">
                            Incident Location
                          </label>
                          <input
                            type="text"
                            value={formData.incidentLocation || ""}
                            onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })}
                            placeholder="Austin, TX"
                            className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[var(--color-ink)] focus:outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[var(--color-ink-2)] mb-1">
                          Narrative Description of Event
                        </label>
                        <textarea
                          rows={2}
                          value={formData.incidentDescription || ""}
                          onChange={(e) => setFormData({ ...formData, incidentDescription: e.target.value })}
                          placeholder="Describe how and where the damage or loss occurred..."
                          className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[var(--color-ink)] focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3 Interactive Form: Requirements */}
                  {isCurrent && step.num === 3 && (
                    <div className="p-4 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper-alt)] space-y-3">
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper)] cursor-pointer">
                          <span className="text-xs font-medium text-[var(--color-ink)]">
                            Was a formal police report filed?
                          </span>
                          <input
                            type="checkbox"
                            checked={formData.hasPoliceReport || false}
                            onChange={(e) => setFormData({ ...formData, hasPoliceReport: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                        </label>

                        {formData.hasPoliceReport && (
                          <div>
                            <label className="block text-xs font-mono text-[var(--color-ink-2)] mb-1">
                              Police Incident Report #
                            </label>
                            <input
                              type="text"
                              value={formData.policeReportNumber || ""}
                              onChange={(e) => setFormData({ ...formData, policeReportNumber: e.target.value })}
                              placeholder="APD-2026-9812"
                              className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[var(--color-ink)] focus:outline-none focus:border-blue-600"
                            />
                          </div>
                        )}

                        <label className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper)] cursor-pointer">
                          <span className="text-xs font-medium text-[var(--color-ink)]">
                            Were third parties or other vehicles involved?
                          </span>
                          <input
                            type="checkbox"
                            checked={formData.hasThirdPartyInvolved || false}
                            onChange={(e) => setFormData({ ...formData, hasThirdPartyInvolved: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Step 4 Interactive Form: Evidence */}
                  {isCurrent && step.num === 4 && (
                    <div className="p-4 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper-alt)] space-y-3">
                      <div>
                        <label className="block text-xs font-mono text-[var(--color-ink-2)] mb-1">
                          Estimated Dollar Loss ($ USD)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs text-[var(--color-ink-subtle)]">$</span>
                          <input
                            type="number"
                            value={formData.estimatedLossAmount || ""}
                            onChange={(e) => setFormData({ ...formData, estimatedLossAmount: parseFloat(e.target.value) || 0 })}
                            placeholder="3200"
                            className="w-full text-xs font-mono pl-7 pr-3 py-2 rounded-lg border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[var(--color-ink)] focus:outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[var(--color-ink-2)] mb-1">
                          Primary Evidence Type
                        </label>
                        <select
                          value={formData.evidenceType}
                          onChange={(e) => setFormData({ ...formData, evidenceType: e.target.value as InsuranceClaimFormData["evidenceType"] })}
                          className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[var(--color-ink)] focus:outline-none focus:border-blue-600"
                        >
                          <option value="photos">Photographic Evidence</option>
                          <option value="repair_estimate">Certified Repair Estimate</option>
                          <option value="medical_invoice">Medical Treatment Invoice</option>
                          <option value="affidavit">Sworn Witness Affidavit</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Step 5 Interactive Form: Validation Preview */}
                  {isCurrent && step.num === 5 && (
                    <div className="p-4 rounded-xl border border-blue-600/30 bg-blue-500/5 space-y-3">
                      <div className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Automated Underwriting Pre-Check
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--color-rule)] text-center">
                        <div className="p-2 rounded-lg bg-[var(--color-paper)] border border-[var(--color-rule)]">
                          <div className="text-[10px] font-mono text-[var(--color-ink-subtle)] uppercase">Gross Loss</div>
                          <div className="font-display font-bold text-sm text-[var(--color-ink)] mt-0.5">
                            ${(formData.estimatedLossAmount || 0).toLocaleString()}
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-[var(--color-paper)] border border-[var(--color-rule)]">
                          <div className="text-[10px] font-mono text-[var(--color-ink-subtle)] uppercase">Deductible</div>
                          <div className="font-display font-bold text-sm text-red-500 mt-0.5">
                            -$500.00
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-[var(--color-paper)] border border-blue-500/20">
                          <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400 uppercase font-semibold">Net Payout</div>
                          <div className="font-display font-bold text-sm text-blue-600 dark:text-blue-400 mt-0.5">
                            ${Math.max(0, (formData.estimatedLossAmount || 0) - 500).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-[var(--color-ink-muted)] flex items-center gap-2 pt-1">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Policy status confirmed active with standard comprehensive coverage.</span>
                      </div>
                    </div>
                  )}

                  {/* Step 6: Confirmation Screen */}
                  {step.num === 6 && executionResult?.success && (
                    <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-mono uppercase text-emerald-600 dark:text-emerald-400 font-semibold">
                            Claim Registered & Dispatched
                          </div>
                          <div className="font-display font-bold text-lg text-[var(--color-ink)]">
                            {executionResult.claimNumber}
                          </div>
                        </div>

                        <div className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold border border-blue-600/20">
                          {executionResult.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[var(--color-rule)] text-xs font-mono">
                        <div>
                          <span className="text-[var(--color-ink-subtle)]">Policy Number:</span>
                          <div className="font-semibold text-[var(--color-ink)]">{executionResult.policyNumber}</div>
                        </div>
                        <div>
                          <span className="text-[var(--color-ink-subtle)]">Est. Settlement:</span>
                          <div className="font-semibold text-emerald-600 dark:text-emerald-400 font-bold">{executionResult.netEstimatedPayout}</div>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-[var(--color-ink-subtle)]">Review Target:</span>
                          <div className="font-semibold text-[var(--color-ink)]">{executionResult.reviewDeadline}</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-[var(--color-paper)] border border-[var(--color-rule)] text-xs text-[var(--color-ink-2)]">
                        <span className="font-semibold">Assigned Adjuster:</span> {executionResult.assignedAdjuster}
                      </div>

                      <button
                        onClick={resetFlow}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-2"
                      >
                        <Shield className="w-3 h-3" />
                        <span>Submit another claim</span>
                      </button>
                    </div>
                  )}

                  {/* Compact summary of completed values */}
                  {isCompleted && step.num < 6 && (
                    <div className="text-xs font-mono text-[var(--color-ink-muted)] bg-[var(--color-paper-alt)] px-3 py-1.5 rounded-md inline-block border border-[var(--color-rule)]">
                      {step.num === 1 && `Policy: ${formData.policyNumber} (${formData.coverageType?.toUpperCase()})`}
                      {step.num === 2 && `Date: ${formData.incidentDate} • ${formData.incidentLocation}`}
                      {step.num === 3 && `Police: ${formData.hasPoliceReport ? formData.policeReportNumber || "Yes" : "No"}`}
                      {step.num === 4 && `Loss: $${(formData.estimatedLossAmount || 0).toLocaleString()} • ${formData.evidenceType}`}
                      {step.num === 5 && `Deductible verified ($500)`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stepper Navigation Buttons */}
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-display font-semibold transition-all shadow-sm"
            >
              <span>{currentStep === 5 ? "Submit Formal Claim" : "Continue"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
