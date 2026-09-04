# Example 2 Prompt: Comprehensive Insurance Claim Submission

> **Context for Coding Agent**: 
> You are equipped with the `webmcp-process-to-component` skill. 
> Read the business requirements below, execute Phase 1 (produce `spec.md`), and execute Phase 2 (synthesize the unified component with one Zod schema, one mutation handler, and the canonical `document.modelContext` registration).

---

## Business Request: Administrative Insurance Claim Process

Our insurance carrier needs to transform our multi-step claim filing and evidence verification workflow into a single, unified WebMCP component. This workflow is conceptually deeper than a simple form: it requires policy verification, incident documentation, statutory requirement checks, evidence uploads, deductible computation, and formal adjuster assignment.

Both policyholders using our web portal and autonomous insurance AI agents (handling intake via phone, chat, or external enterprise systems) must execute this process against the exact same logic.

### The Required 6-Step Workflow:

1. **Policy Lookup (`Policy`)**:
   - `policyNumber`: Format `POL-` followed by 6 digits (e.g. `POL-883920`).
   - `policyHolderName`: Full legal name of insured individual or business.
   - `coverageType`: One of `['auto', 'homeowners', 'commercial']`.

2. **Incident Details (`Claim`)**:
   - `incidentDate`: Date of incident occurrence (YYYY-MM-DD, within policy term).
   - `incidentLocation`: City, state, or address of event.
   - `incidentDescription`: Descriptive summary of what transpired (minimum 20 characters).

3. **Statutory Requirements (`Requirements`)**:
   - Dynamic checklist:
     - `hasPoliceReport`: Boolean flag (mandatory for vehicular collisions or theft).
     - `policeReportNumber`: Optional string if police were dispatched.
     - `hasThirdPartyInvolved`: Boolean flag if another person/vehicle was involved.

4. **Evidence & Loss Assessment (`Evidence`)**:
   - `estimatedLossAmount`: Numerical monetary amount ($ USD) of damages/loss.
   - `evidenceType`: One of `['photos', 'repair_estimate', 'medical_invoice', 'affidavit']`.
   - `notes`: Additional evidentiary notes.

5. **Validation & Deductible Preview (`Validation`)**:
   - Compares estimated loss against policy deductible ($500 for standard policies).
   - Computes net estimated payout: `estimatedLossAmount - deductible`.
   - Confirms policy active status and coverage limits.

6. **Submission & Adjuster Assignment (`Submission`)**:
   - Generates unique Claim Tracking ID: `CLM-XXXXXX`.
   - Assigns claim to a dedicated senior adjuster.
   - Emits initial claim status: `UNDER_REVIEW`.
   - Outputs complete settlement schedule and next steps.

---

### Non-Negotiable Architectural Requirements:
1. **Single Schema**: Use Zod to define `InsuranceClaimSchema`, exporting both the TypeScript type and the JSON Schema for WebMCP.
2. **Unified Handler**: Implement `executeInsuranceClaimAction(input)` as the sole mutation function used by both human form submission and WebMCP tool execution.
3. **WebMCP Registration**: Register tool `file_insurance_claim` on `document.modelContext` with mount/unmount `AbortController` cleanup and ref-based state synchronization.
4. **Visual UI**: Render the multi-step form as an interactive **vertical timeline stepper** (following `process-ui desing.png`) featuring:
   - A vertical connector line linking each sequential stage.
   - Circular step indicators that turn green with checkmarks as each step is completed.
   - Clean, readable typography displaying current values and stage descriptions.
   - Active form inputs for the current step with forward/back navigation.
