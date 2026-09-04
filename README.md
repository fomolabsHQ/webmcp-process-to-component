# WebMCP Process-to-Component (PTC)

WebMCP Process-to-Component (PTC) replaces the slow, brittle world of AI agents blindly clicking pixels and scraping HTML with a unified architecture where multi-step web workflows—like insurance claims and product returns—expose both an interactive human UI and a strongly-typed `document.modelContext` tool from a single Zod schema and shared mutation handler. By bridging this gap natively in the browser, people and AI agents can now synchronously co-pilot complex administrative transactions on the same live page, eliminating tedious manual form fatigue for users while giving them real-time visual verification and complete human-in-the-loop control as the agent executes actions safely and instantaneously.

---

## 1. How WebMCP Was Implemented

### The Registration Standard
Tools are registered directly on `document.modelContext` using compliant schema contracts:

```typescript
document.modelContext.registerTool({
  name: "process_product_return",
  description: "Processes product returns, validates eligibility, and generates RMA authorizations.",
  inputSchema: returnToolInputSchema,
  execute: async (input) => {
    return await executeReturnAction(input);
  }
});
```

### Lifecycle-Safe React Hook (`useWebMCPTool`)
To make WebMCP robust in production single-page applications, we implemented a custom lifecycle hook that solves three critical edge cases:

1. **Mount & Teardown via `AbortController`**:
   Registers the tool on component mount and links it to an `AbortController`. When the component unmounts, it invokes `abort()` and defensively triggers an explicit `unregister()` fallback to support older preview runtimes.
2. **Zero-Churn State Synchronization**:
   Form values and execution handlers are stored in a React `useRef` updated on every render. This ensures the agent's `execute()` function always reads the freshest state without triggering re-registration effect cycles (which would cause the tool to flicker or momentarily disappear from the model's toolset).
3. **Post-Unmount Safety Guard**:
   Checks `signal.aborted` after any asynchronous operation (`await`) before allowing state updates or side effects to commit, preventing memory leaks and updates to dead components.

---

## 2. Reference Implementations Included

This repository contains two production-grade examples synthesized using the skill:

1. **Return Agent (`src/examples/return-agent/`)**:
   * **Workflow**: `Order` → `Eligibility` → `Reason` → `Return Method` → `Refund` → `Ready`.
   * **WebMCP Tool**: `process_product_return`.
   * **UI**: Clean vertical timeline stepper with green checkmarks and QR code issuance.
2. **Insurance Claim (`src/examples/insurance-claim/`)**:
   * **Workflow**: `Policy` → `Claim` → `Requirements` → `Evidence` → `Validation` → `Submission`.
   * **WebMCP Tool**: `file_insurance_claim`.
   * **UI**: Blue-themed administrative stepper with automated underwriting pre-checks and adjuster assignment.

---

## 3. Project Architecture & Agent Skill

```text
├── SKILL.md                          # The WebMCP Process-to-Component AI Agent Skill
├── references/                       # Templates for process specifications and unified components
├── example1.md                       # Sample prompt: E-commerce Return Agent
├── example2.md                       # Sample prompt: Administrative Insurance Claim
├── src/
│   ├── lib/webmcp/                   # WebMCP runtime initializer and useWebMCPTool hook
│   ├── components/landing/           # Hero, animated architecture diagram, and example cards
│   ├── examples/
│   │   ├── return-agent/             # Synthesized Return Agent (Spec, Schema, Handler, UI)
│   │   └── insurance-claim/          # Synthesized Insurance Claim (Spec, Schema, Handler, UI)
│   └── styles/                       # CSS design tokens adhering to design.md
└── netlify.toml                      # Netlify continuous deployment configuration
```

---

## 4. Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Verify TypeScript and build production bundle
npm run build
```

---

## 5. Deployment

This repository is configured for immediate deployment on **Netlify**:
* **Build Command**: `npm run build`
* **Publish Directory**: `dist`
* **SPA Routing**: Automatic redirects configured in `netlify.toml`
