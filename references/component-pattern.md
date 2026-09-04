# Process-to-Component (PTC) — Canonical Architecture Pattern

This reference demonstrates the required implementation pattern for any component synthesized under the WebMCP Process-to-Component methodology.

---

## 1. Directory Structure

Every synthesized process component is self-contained in a dedicated directory:

```text
src/components/[process-name]/
├── spec.md              # The approved Phase 1 process spec
├── schema.ts            # Zod validation schema + JSON Schema export
├── handler.ts           # Unified business logic & mutation handler
├── useWebMCPTool.ts     # Lifecycle-safe WebMCP tool hook
└── [ProcessName].tsx    # Dual-surface React component (UI + Tool)
```

---

## 2. Single Schema (`schema.ts`)

Defines the single source of truth for both React form validation and WebMCP agent parameter schemas:

```typescript
import { z } from "zod";

export const ProcessSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  category: z.enum(["standard", "express"]),
  notes: z.string().optional(),
});

export type ProcessFormData = z.infer<typeof ProcessSchema>;

/**
 * Lightweight JSON schema representation for document.modelContext.registerTool
 */
export const processToolInputSchema = {
  type: "object",
  properties: {
    identifier: {
      type: "string",
      description: "Identifier or lookup key for the entity",
    },
    category: {
      type: "string",
      enum: ["standard", "express"],
      description: "Processing speed or category",
    },
    notes: {
      type: "string",
      description: "Optional notes or details",
    },
  },
  required: ["identifier", "category"],
};
```

---

## 3. Unified Mutation Handler (`handler.ts`)

A pure async function executing the core logic. It is called by both the human form submission and the WebMCP tool execution, ensuring behavior never diverges.

```typescript
import { ProcessFormData, ProcessSchema } from "./schema";

export interface ExecutionResult {
  success: boolean;
  referenceId?: string;
  message?: string;
  error?: string;
}

export async function executeProcessAction(
  data: unknown
): Promise<ExecutionResult> {
  // 1. Strict validation against shared schema
  const parsed = ProcessSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const validData: ProcessFormData = parsed.data;

  // 2. Perform backend / state mutation
  // Simulated async operation:
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    referenceId: `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    message: `Successfully processed ${validData.identifier} (${validData.category}).`,
  };
}
```

---

## 4. Lifecycle-Safe Tool Registration (`useWebMCPTool.ts`)

The React hook implementing the locked WebMCP lifecycle requirements:
- **Mount / Teardown**: Uses `AbortController` signal and calls fallback `unregister()` defensively.
- **State Synchronization**: Uses an internal `useRef` to store the latest handler/state so `execute` never reads stale data, without re-registering on every keystroke.
- **Stale Guard**: Inspects `signal.aborted` after any `await` before allowing updates to commit.

```typescript
import { useEffect, useRef } from "react";

export interface WebMCPToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<unknown>;
}

export function useWebMCPTool(tool: WebMCPToolDefinition) {
  const toolRef = useRef(tool);
  toolRef.current = tool;

  useEffect(() => {
    // Check for runtime support
    if (typeof document === "undefined" || !(document as any).modelContext) {
      return;
    }

    const modelContext = (document as any).modelContext;
    const controller = new AbortController();
    const { signal } = controller;

    let unregisterFn: (() => void) | undefined;

    try {
      const registrationResult = modelContext.registerTool(
        {
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          execute: async (input: Record<string, unknown>) => {
            // Guard: don't execute if already aborted
            if (signal.aborted) {
              throw new Error("Tool execution aborted: component has unmounted.");
            }

            // Always call via ref to get the latest state/handler
            const result = await toolRef.current.execute(input);

            // Guard: don't commit side-effects if unmounted during await
            if (signal.aborted) {
              throw new Error("Component unmounted during tool execution.");
            }

            return result;
          },
        },
        { signal }
      );

      if (typeof registrationResult === "function") {
        unregisterFn = registrationResult;
      }
    } catch (err) {
      console.warn(`[WebMCP] Failed to register tool: ${tool.name}`, err);
    }

    return () => {
      // 1. Abort signal
      controller.abort();

      // 2. Defensive explicit unregister for runtimes that don't honor signal
      if (typeof unregisterFn === "function") {
        unregisterFn();
      } else if (typeof modelContext.unregisterTool === "function") {
        modelContext.unregisterTool(tool.name);
      }
    };
  }, [tool.name, tool.description]);
}
```

---

## 5. Dual-Surface Component (`[ProcessName].tsx`)

```tsx
import React, { useState } from "react";
import { ProcessFormData, ProcessSchema, processToolInputSchema } from "./schema";
import { executeProcessAction, ExecutionResult } from "./handler";
import { useWebMCPTool } from "./useWebMCPTool";

export function ProcessComponent() {
  const [formData, setFormData] = useState<Partial<ProcessFormData>>({});
  const [status, setStatus] = useState<string>("idle");
  const [result, setResult] = useState<ExecutionResult | null>(null);

  // Unified execution wrapper for UI
  const handleRun = async (dataToRun: unknown) => {
    setStatus("loading");
    const res = await executeProcessAction(dataToRun);
    setResult(res);
    setStatus(res.success ? "success" : "error");
    return res;
  };

  // Register WebMCP tool
  useWebMCPTool({
    name: "execute_process_action",
    description: "Executes the business process action with validated parameters.",
    inputSchema: processToolInputSchema,
    execute: async (input) => {
      // Updates visual UI form state so human observer sees agent actions
      setFormData(input as Partial<ProcessFormData>);
      return await handleRun(input);
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await handleRun(formData);
      }}
      className="p-6 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper)]"
    >
      {/* Visual Form Inputs */}
      {/* Step navigations and feedback */}
    </form>
  );
}
```
