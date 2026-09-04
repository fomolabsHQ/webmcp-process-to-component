import { ModelContext, WebMCPRegisterOptions, WebMCPTool } from "./types";

/**
 * Initializes and ensures document.modelContext is ready on page load.
 * Compliant with emerging WebMCP specifications.
 */
export function initWebMCPRuntime(): ModelContext {
  if (typeof document === "undefined") {
    // Non-browser environment
    return {} as ModelContext;
  }

  const existing = document.modelContext;
  if (existing && typeof existing.registerTool === "function") {
    return existing;
  }

  const toolsRegistry = new Map<string, WebMCPTool>();

  const modelContext: ModelContext = {
    registerTool(tool: WebMCPTool, options?: WebMCPRegisterOptions) {
      if (!tool || !tool.name) {
        throw new Error("[WebMCP] Tool registration failed: 'name' is required.");
      }

      toolsRegistry.set(tool.name, tool);

      // Dispatch event for agent or host observability
      if (typeof document.dispatchEvent === "function") {
        document.dispatchEvent(
          new CustomEvent("webmcp:tool-registered", {
            detail: {
              name: tool.name,
              description: tool.description,
              inputSchema: tool.inputSchema,
            },
          })
        );
      }

      const unregister = () => {
        if (toolsRegistry.has(tool.name)) {
          toolsRegistry.delete(tool.name);
          if (typeof document.dispatchEvent === "function") {
            document.dispatchEvent(
              new CustomEvent("webmcp:tool-unregistered", {
                detail: { name: tool.name },
              })
            );
          }
        }
      };

      // Handle abort signal if provided
      if (options?.signal) {
        if (options.signal.aborted) {
          unregister();
          return unregister;
        }

        options.signal.addEventListener("abort", () => {
          unregister();
        }, { once: true });
      }

      return unregister;
    },

    unregisterTool(name: string) {
      if (toolsRegistry.has(name)) {
        toolsRegistry.delete(name);
        if (typeof document.dispatchEvent === "function") {
          document.dispatchEvent(
            new CustomEvent("webmcp:tool-unregistered", {
              detail: { name },
            })
          );
        }
        return true;
      }
      return false;
    },

    getTools() {
      return Array.from(toolsRegistry.values());
    },

    getTool(name: string) {
      return toolsRegistry.get(name);
    },

    async executeTool(name: string, input: Record<string, unknown>) {
      const tool = toolsRegistry.get(name);
      if (!tool) {
        throw new Error(`[WebMCP] Tool '${name}' is not currently registered.`);
      }
      return await tool.execute(input);
    },
  };

  // Mount to document
  document.modelContext = modelContext;

  // Expose convenient inspector on window for external agents and developer console
  if (typeof window !== "undefined") {
    (window as unknown as { __WEBMCP__: unknown }).__WEBMCP__ = {
      listTools: () => modelContext.getTools?.() || [],
      getTool: (name: string) => modelContext.getTool?.(name),
      execute: (name: string, input: Record<string, unknown>) =>
        modelContext.executeTool?.(name, input),
    };
  }

  return modelContext;
}
