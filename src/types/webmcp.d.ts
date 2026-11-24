import 'react';

declare module 'react' {
  interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
    toolautosubmit?: string;
  }
}

export interface WebMCPToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<unknown> | unknown;
  annotations?: {
    readOnlyHint?: boolean;
  };
}

export interface ModelContextContainer {
  registerTool: (tool: WebMCPToolDefinition) => void;
  unregisterTool?: (name: string) => void;
}

declare global {
  interface Navigator {
    modelContext?: ModelContextContainer;
  }
}
