# Example 1 Prompt: E-Commerce Product Return Agent

> **Context for Coding Agent**: 
> You are equipped with the `webmcp-process-to-component` skill. 
> Read the business requirements below, execute Phase 1 (produce `spec.md`), and execute Phase 2 (synthesize the unified component with one Zod schema, one mutation handler, and the canonical `document.modelContext` registration).

---

## Business Request: Modernizing Our Customer Return Flow

Our e-commerce store needs to turn our multi-step customer return and refund process into a unified component. We want human shoppers to be able to complete returns through a modern, step-by-step visual UI, but we also want autonomous AI customer support agents to be able to execute returns directly via WebMCP.

### The Required 6-Step Workflow:

1. **Order Lookup (`Order`)**:
   - Customer supplies their `orderNumber` (format: `ORD-` followed by 4–6 alphanumeric characters, e.g. `ORD-9821`) and their account `email`.
   - The system checks if the order exists.

2. **Eligibility Verification (`Eligibility`)**:
   - The item must be within the 30-day return policy window.
   - Customer confirms the item condition is either `unopened` or `gently_used` (items marked `damaged_by_user` are ineligible).

3. **Return Reason (`Reason`)**:
   - Selection from standard return reasons:
     - `wrong_size`: Ordered wrong size / fit
     - `defective`: Defective or damaged in transit
     - `not_as_described`: Item differs from catalog photos
     - `changed_mind`: No longer needed

4. **Return Method (`Return Method`)**:
   - Selection of shipping/drop-off preference:
     - `dropoff_qr`: Instant digital QR code for carrier drop-off (UPS / FedEx drop point)
     - `carrier_pickup`: Scheduled doorstep pickup
     - `in_store`: Return to any retail location

5. **Refund Preference (`Refund`)**:
   - Options:
     - `original_payment`: Refund to original credit card / payment method (takes 3-5 business days).
     - `store_credit`: Instant store credit balance + **10% extra bonus** added to the balance.

6. **Ready / Confirmation (`Ready`)**:
   - System generates:
     - Return Merchandise Authorization number (`RMA-XXXXXX`)
     - Printable / scannable Return QR code
     - Summary of refunded amount and return instructions.

---

### Non-Negotiable Architectural Requirements:
1. **Single Schema**: Use Zod to define `ReturnProcessSchema`, exporting both the TypeScript type and the JSON Schema for WebMCP.
2. **Unified Handler**: Implement `executeReturnAction(input)` as the sole mutation function used by both the human form submission and the WebMCP tool execution.
3. **WebMCP Registration**: Register tool `process_product_return` on `document.modelContext` with mount/unmount `AbortController` cleanup and ref-based state synchronization.
4. **Visual UI**: Provide a visual stepper matching the application's design system tokens (`tokens.css`). Specifically, implement an interactive **vertical timeline stepper** (modeled after `process-ui desing.png`) featuring:
   - A vertical connector line linking each sequential stage.
   - Circular step indicators that light up green with checkmarks as steps are completed.
   - Clean, readable typography displaying current values and stage descriptions.
   - Active form inputs for the current step with forward/back navigation.
