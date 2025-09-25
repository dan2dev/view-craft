/**
 * Error handling and logging utilities for view-craft
 */

export interface ErrorContext {
  operation: string;
  tagName?: string;
  modifierType?: string;
  additionalInfo?: Record<string, unknown>;
}

export type ErrorLevel = "error" | "warn" | "info";

/**
 * Centralized error logging with context
 */
export function logError(
  message: string,
  error: Error | unknown,
  context?: ErrorContext,
  level: ErrorLevel = "error"
): void {
  const logMethod = console[level] || console.error;
  
  const contextStr = context 
    ? ` [${context.operation}${context.tagName ? ` - ${context.tagName}` : ""}]`
    : "";
  
  logMethod(`view-craft${contextStr}: ${message}`, error);
  
  if (context?.additionalInfo) {
    console.groupCollapsed("Additional context:");
    console.table(context.additionalInfo);
    console.groupEnd();
  }
}

/**
 * Safely executes a function and logs any errors
 */
export function safeExecute<T>(
  fn: () => T,
  context: ErrorContext,
  fallback?: T
): T | undefined {
  try {
    return fn();
  } catch (error) {
    logError("Operation failed", error, context);
    return fallback;
  }
}

/**
 * Wraps an async function with error handling
 */
export function safeExecuteAsync<T>(
  fn: () => Promise<T>,
  context: ErrorContext,
  fallback?: T
): Promise<T | undefined> {
  return fn().catch((error) => {
    logError("Async operation failed", error, context);
    return fallback;
  });
}

/**
 * Creates a wrapped function that automatically handles errors
 */
export function withErrorHandling<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  context: ErrorContext,
  fallback?: TReturn
): (...args: TArgs) => TReturn | undefined {
  return (...args: TArgs) => {
    try {
      return fn(...args);
    } catch (error) {
      logError("Function execution failed", error, {
        ...context,
        additionalInfo: {
          ...context.additionalInfo,
          argumentCount: args.length,
          arguments: args.slice(0, 3) // Log first 3 args to avoid spam
        }
      });
      return fallback;
    }
  };
}

/**
 * Validates that a value is not null or undefined
 */
export function assertNotNull<T>(
  value: T | null | undefined,
  message: string,
  context?: ErrorContext
): T {
  if (value == null) {
    const error = new Error(`Assertion failed: ${message}`);
    logError("Null/undefined assertion failed", error, context);
    throw error;
  }
  return value;
}

/**
 * Validates that a condition is true
 */
export function assert(
  condition: boolean,
  message: string,
  context?: ErrorContext
): void {
  if (!condition) {
    const error = new Error(`Assertion failed: ${message}`);
    logError("Condition assertion failed", error, context);
    throw error;
  }
}

/**
 * Creates a specialized error for view-craft operations
 */
export class ViewCraftError extends Error {
  constructor(
    message: string,
    public readonly context?: ErrorContext,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = "ViewCraftError";
  }
}

/**
 * Handles DOM-related errors with specific context
 */
export function handleDOMError(
  error: Error | unknown,
  operation: string,
  element?: Element | Node
): void {
  const context: ErrorContext = {
    operation,
    additionalInfo: {
      elementType: element?.nodeType,
      elementTag: (element as Element)?.tagName?.toLowerCase(),
      isConnected: (element as Node)?.isConnected
    }
  };
  
  logError("DOM operation failed", error, context);
}

/**
 * Handles modifier processing errors
 */
export function handleModifierError(
  error: Error | unknown,
  modifierType: string,
  tagName?: string
): void {
  const context: ErrorContext = {
    operation: "modifier-processing",
    tagName,
    modifierType,
    additionalInfo: {
      modifierType
    }
  };
  
  logError("Modifier processing failed", error, context);
}

/**
 * Handles reactive update errors
 */
export function handleReactiveError(
  error: Error | unknown,
  updateType: "attribute" | "text" | "list" | "conditional",
  elementInfo?: { tagName?: string; isConnected?: boolean }
): void {
  const context: ErrorContext = {
    operation: `reactive-update-${updateType}`,
    tagName: elementInfo?.tagName,
    additionalInfo: {
      updateType,
      isConnected: elementInfo?.isConnected
    }
  };
  
  logError("Reactive update failed", error, context);
}