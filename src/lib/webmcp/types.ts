/**
 * WebMCP Specification Types for document.modelContext
 */

export interface WebMCPToolInputSchema {
  type: string;
  properties?: Record<string, unknown>;
  required?: string[];
  [key: string]: unknown;
}

export interface WebMCPTool {
  name: string;
  description: string;
  inputSchema: WebMCPToolInputSchema | Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<unknown>;
}

export interface WebMCPRegisterOptions {
  signal?: AbortSignal;
}

export type UnregisterFunction = () => void;

export interface ModelContext {
  registerTool: (
    tool: WebMCPTool,
    options?: WebMCPRegisterOptions
  ) => UnregisterFunction | void;
  unregisterTool?: (name: string) => boolean;
  getTools?: () => WebMCPTool[];
  getTool?: (name: string) => WebMCPTool | undefined;
  executeTool?: (name: string, input: Record<string, unknown>) => Promise<unknown>;
}

declare global {
  interface Document {
    modelContext?: ModelContext;
  }
}
