import { useEffect, useRef } from "react";
import { initWebMCPRuntime } from "./runtime";
import { UnregisterFunction, WebMCPTool } from "./types";

export interface UseWebMCPToolOptions {
  enabled?: boolean;
}

/**
 * React hook to register and manage the lifecycle of a WebMCP tool on document.modelContext.
 *
 * Features:
 * - Mount / Teardown via AbortController signal + defensive fallback unregister()
 * - Zero-churn state synchronization: stores the execution handler in a useRef updated on every render
 * - Post-unmount async guard: verifies signal.aborted before and after execution
 */
export function useWebMCPTool(
  tool: WebMCPTool,
  options: UseWebMCPToolOptions = {}
) {
  const { enabled = true } = options;

  // Keep a reference to the latest tool definition and handler
  const toolRef = useRef<WebMCPTool>(tool);
  toolRef.current = tool;

  // Serialize inputSchema to avoid unnecessary re-registrations on object reference change
  const schemaHash = JSON.stringify(tool.inputSchema);

  useEffect(() => {
    if (!enabled || typeof document === "undefined") {
      return;
    }

    // Ensure the runtime exists on document.modelContext
    const modelContext = initWebMCPRuntime();
    const controller = new AbortController();
    const { signal } = controller;

    let unregisterFn: UnregisterFunction | void;

    try {
      unregisterFn = modelContext.registerTool(
        {
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          execute: async (input: Record<string, unknown>) => {
            // Guard: do not execute if component already unmounted
            if (signal.aborted) {
              throw new Error(
                `[WebMCP] Execution of '${tool.name}' aborted: component unmounted.`
              );
            }

            // Always call the latest handler from toolRef
            const result = await toolRef.current.execute(input);

            // Guard: discard result if component unmounted during the async execution
            if (signal.aborted) {
              throw new Error(
                `[WebMCP] Component unmounted during execution of '${tool.name}'.`
              );
            }

            return result;
          },
        },
        { signal }
      );
    } catch (err) {
      console.warn(`[WebMCP] Failed to register tool '${tool.name}':`, err);
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
  }, [tool.name, tool.description, schemaHash, enabled]);
}
