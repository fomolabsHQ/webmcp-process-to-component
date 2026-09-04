---
name: webmcp-process-to-component
description: Turn any existing user- or agent-facing multi-step workflow, form, or transaction into a unified, reusable WebMCP-compliant component that serves both human UI and AI agents from one schema, one mutation handler, and one safe document.modelContext registration.
---

# WebMCP Process-to-Component (PTC)

A construction skill that guides an AI coding agent through turning a multi-step user- or agent-facing process (return flow, insurance claim, checkout, booking, support resolution) into a single, cohesive, WebMCP-compliant React component.

## Core Philosophy

This is **not** a scraper or an automated wrapper that slaps annotations onto existing HTML. It is an architectural synthesis:
1. **Understand First**: Discover the business domain and produce a reviewable specification before writing code.
2. **One Schema**: A single Zod schema defines the data contract, driving both human form validation and the WebMCP tool's `inputSchema`.
3. **One Mutation Handler**: The actual mutation logic lives in a single shared handler. The human UI and the AI agent execute the exact same code with identical side effects.
4. **Lifecycle-Safe Registration**: The component registers its capability on `document.modelContext` using `AbortController` cleanup, defensive unregister fallback, ref-based state synchronization, and post-unmount safety checks.

---

## The Non-Negotiable Rules

1. **Mandatory Spec Checkpoint**: Never generate a component from implicit reasoning. Phase 1 must always output a `process-spec.md` (following `references/process-spec-template.md`) that a human can inspect and correct.
2. **No Divergent Paths**: Never create a "form submit handler" and an "agent tool handler" separately. Both must route through `executeProcessAction(...)`.
3. **Canonical Registration Surface**: Always register against `document.modelContext`. Never use the legacy `navigator.modelContext`.
4. **Zero-Churn State Sync**: Never re-register a tool on state changes (e.g., input typing). Store dynamic handlers in a `useRef` so `execute` reads the latest state without causing tool flicker.
5. **Defensive Cleanup**: Always pair `AbortController` signal with an explicit unregister fallback to ensure clean teardown even on older preview runtimes.
6. **Post-Unmount Guard**: Always verify `signal.aborted` after any `await` inside `execute()` before committing state changes or triggering side effects.
7. **Design System Adaptation**: Adapt to the design tokens and UI conventions already present in the target repository (Tailwind, CSS modules, shadcn/ui, etc.). Do not impose an external styling system.

---

## Phase 1 — Discovery (Produce Process Spec)

Inspect the target process (an existing page, a user story, API documentation, or a business flow description) and generate a `process-spec.md` file capturing:

1. **Purpose**: A single unambiguous sentence describing the goal of the action.
2. **Step Progression**: The sequential steps (e.g. `Order` → `Eligibility` → `Reason` → `Return Method` → `Refund` → `Ready`).
3. **Field Specifications**:
   - Field key and type
   - Required vs. optional
   - Validation rules (length, patterns, bounds)
   - Human-friendly label and description
4. **Backend Touchpoints & Side Effects**:
   - What databases or state stores are modified?
   - What external side effects occur (emails sent, slots locked, inventory adjusted)?
5. **Success & Error States**:
   - Standard success payload format (e.g., `{ success: true, referenceId: string }`).
   - Defined error codes and human-readable error messages.

*Output*: Save the completed spec to `src/components/[process-name]/spec.md` (or the equivalent target directory).

---

## Phase 2 — Synthesis (Generate Unified Component)

From the approved `spec.md`, synthesize the component folder adhering to the architecture described in `references/component-pattern.md`:

### 1. `schema.ts`
- Implement the Zod validation schema.
- Export TypeScript types inferred from the schema.
- Export a clean JSON Schema definition for `document.modelContext.registerTool({ inputSchema })`.

### 2. `handler.ts`
- Implement `executeProcessAction(input: unknown)`.
- Parse inputs through `ProcessSchema.safeParse`.
- Execute the state mutation / business logic.
- Return the standardized response envelope.

### 3. `useWebMCPTool.ts`
- Standard hook implementation managing `document.modelContext.registerTool`.
- Wire `AbortController` to the component mount/unmount cycle.
- Call defensive unregister on cleanup.
- Guard with `signal.aborted` after asynchronous calls.

### 4. `[ProcessName].tsx`
- Build the human UI using the host repository's design system tokens and components.
- Wire visual inputs to update component state.
- Wire form submission to `executeProcessAction`.
- Register the WebMCP tool via `useWebMCPTool`, allowing an AI agent to execute the flow directly and mirror progress in the visual UI.

---

## Phase 3 — Verification

Verify that the synthesized component functions seamlessly on both surfaces:

1. **Human UI Validation**:
   - Step through the visual flow.
   - Verify that invalid input displays clear inline errors.
   - Verify that successful submission advances to the completed state with confirmation.

2. **WebMCP Agent Surface**:
   - Verify that `document.modelContext` registers the tool on mount.
   - Verify that calling `execute(validInput)` returns `{ success: true, referenceId: ... }` and updates the UI.
   - Verify that calling `execute(invalidInput)` rejects with descriptive schema errors.
   - Verify that unmounting the component removes the tool from `document.modelContext`.
