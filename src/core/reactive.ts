import { handleReactiveError, logError, safeExecute } from "../utility/errorHandler";
import { isNodeConnected } from "../utility/dom";

type TextResolver = () => Primitive;
type AttributeResolver = () => unknown;

interface ReactiveTextNodeInfo {
  resolver: TextResolver;
  lastValue?: string;
  errorCount: number;
}

interface ReactiveElementInfo {
  attributeResolvers: Map<string, {
    resolver: AttributeResolver;
    applyValue: (value: unknown) => void;
    errorCount: number;
  }>;
}

// Global reactive state management
const reactiveElements = new Map<Element, ReactiveElementInfo>();
const reactiveTextNodes = new Map<Text, ReactiveTextNodeInfo>();

// Configuration for reactive behavior
const REACTIVE_CONFIG = {
  MAX_ERRORS_PER_RESOLVER: 5,
  CLEANUP_BATCH_SIZE: 100,
  PERFORMANCE_MONITORING: false
} as const;

/**
 * Tracks an element for reactive updates with enhanced error handling.
 */
export function trackReactiveElement<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>
): void {
  if (!element || !(element instanceof Element)) {
    logError(
      "Cannot track non-element for reactive updates",
      new Error("Invalid element"),
      { operation: "trackReactiveElement" },
      "warn"
    );
    return;
  }

  if (!reactiveElements.has(element)) {
    reactiveElements.set(element, {
      attributeResolvers: new Map()
    });
  }
}

/**
 * Creates a reactive text node that updates its content when update() is called.
 * Enhanced with error recovery and performance optimization.
 */
export function createReactiveTextNode(resolver: TextResolver): Text {
  const textNode = document.createTextNode("");
  
  if (!resolver || typeof resolver !== "function") {
    logError(
      "Invalid resolver provided to createReactiveTextNode",
      new Error("Invalid resolver"),
      { operation: "createReactiveTextNode" },
      "warn"
    );
    return textNode;
  }

  const nodeInfo: ReactiveTextNodeInfo = {
    resolver,
    errorCount: 0
  };

  reactiveTextNodes.set(textNode, nodeInfo);
  
  // Initialize the text node with safe execution
  const initialValue = safeExecute(
    resolver,
    { operation: "createReactiveTextNode-initialization" },
    ""
  );
  
  if (initialValue !== undefined) {
    const textContent = initialValue == null ? String(initialValue) : String(initialValue);
    nodeInfo.lastValue = textContent;
    textNode.textContent = textContent;
  }
  
  return textNode;
}

/**
 * Registers an attribute resolver for reactive updates with enhanced error handling.
 */
export function registerAttributeResolver<TTagName extends ElementTagName>(
  element: ExpandedElement<TTagName>,
  key: keyof ExpandedElementAttributes<TTagName>,
  resolver: AttributeResolver,
  applyValue: (value: unknown) => void
): void {
  if (!element || !resolver || !applyValue) {
    logError(
      "Invalid parameters for registerAttributeResolver",
      new Error("Missing required parameters"),
      { 
        operation: "registerAttributeResolver",
        tagName: element?.tagName?.toLowerCase(),
        additionalInfo: {
          hasElement: !!element,
          hasResolver: !!resolver,
          hasApplyValue: !!applyValue,
          attributeKey: String(key)
        }
      },
      "warn"
    );
    return;
  }

  trackReactiveElement(element);
  
  const elementInfo = reactiveElements.get(element as Element);
  if (!elementInfo) {
    logError(
      "Failed to get element info for attribute resolver",
      new Error("Element not tracked"),
      { 
        operation: "registerAttributeResolver",
        tagName: element.tagName?.toLowerCase() 
      }
    );
    return;
  }

  const attributeKey = String(key);
  const resolverInfo = {
    resolver,
    applyValue: (value: unknown) => {
      safeExecute(
        () => applyValue(value),
        {
          operation: "attributeResolver-applyValue",
          tagName: element.tagName?.toLowerCase(),
          additionalInfo: { attributeKey, value: String(value).slice(0, 100) }
        }
      );
    },
    errorCount: 0
  };

  elementInfo.attributeResolvers.set(attributeKey, resolverInfo);

  // Create event handler with error handling
  const handler = () => {
    if (resolverInfo.errorCount >= REACTIVE_CONFIG.MAX_ERRORS_PER_RESOLVER) {
      return; // Stop trying after too many errors
    }

    const nextValue = safeExecute(
      resolver,
      {
        operation: "attributeResolver-execution",
        tagName: element.tagName?.toLowerCase(),
        additionalInfo: { attributeKey }
      }
    );

    if (nextValue !== undefined) {
      resolverInfo.applyValue(nextValue);
    } else {
      resolverInfo.errorCount++;
    }
  };

  // Register event listener with error handling
  try {
    element.addEventListener?.("update", handler);
    handler(); // Initial execution
  } catch (error) {
    handleReactiveError(
      error,
      "attribute",
      { 
        tagName: element.tagName?.toLowerCase(),
        isConnected: isNodeConnected(element as Node)
      }
    );
  }
}

/**
 * Updates all reactive text nodes with performance monitoring and error recovery.
 */
export function notifyReactiveTextNodes(): void {
  const startTime = REACTIVE_CONFIG.PERFORMANCE_MONITORING ? Date.now() : 0;
  const staleTextNodes: Text[] = [];
  let updatedCount = 0;
  let errorCount = 0;

  reactiveTextNodes.forEach((nodeInfo, textNode) => {
    // Check if node is still connected
    if (!isNodeConnected(textNode)) {
      staleTextNodes.push(textNode);
      return;
    }

    // Skip nodes with too many errors
    if (nodeInfo.errorCount >= REACTIVE_CONFIG.MAX_ERRORS_PER_RESOLVER) {
      return;
    }

    // Execute resolver with error handling
    const value = safeExecute(
      nodeInfo.resolver,
      {
        operation: "notifyReactiveTextNodes-resolver",
        additionalInfo: { 
          nodeType: "text",
          errorCount: nodeInfo.errorCount
        }
      }
    );

    if (value !== undefined) {
      const newContent = value == null ? String(value) : String(value);
      
      // Only update if content actually changed
      if (nodeInfo.lastValue !== newContent) {
        const success = safeExecute(
          () => {
            textNode.textContent = newContent;
            return true;
          },
          {
            operation: "notifyReactiveTextNodes-update",
            additionalInfo: { 
              oldContent: nodeInfo.lastValue?.slice(0, 50),
              newContent: newContent.slice(0, 50)
            }
          },
          false
        );

        if (success) {
          nodeInfo.lastValue = newContent;
          updatedCount++;
        } else {
          nodeInfo.errorCount++;
          errorCount++;
        }
      }
    } else {
      nodeInfo.errorCount++;
      errorCount++;
    }
  });

  // Clean up stale nodes in batches for performance
  const batchSize = REACTIVE_CONFIG.CLEANUP_BATCH_SIZE;
  for (let i = 0; i < staleTextNodes.length; i += batchSize) {
    const batch = staleTextNodes.slice(i, i + batchSize);
    batch.forEach(textNode => reactiveTextNodes.delete(textNode));
  }

  // Log performance metrics if monitoring is enabled
  if (REACTIVE_CONFIG.PERFORMANCE_MONITORING && startTime > 0) {
    const duration = Date.now() - startTime;
    logError(
      "Reactive text nodes update completed",
      new Error("Performance monitoring"),
      {
        operation: "notifyReactiveTextNodes-metrics",
        additionalInfo: {
          totalNodes: reactiveTextNodes.size,
          updatedNodes: updatedCount,
          staleNodes: staleTextNodes.length,
          errorCount,
          duration: `${duration}ms`
        }
      },
      "info"
    );
  }
}

/**
 * Dispatches update events to all registered reactive elements with enhanced cleanup.
 */
export function notifyReactiveElements(): void {
  const startTime = REACTIVE_CONFIG.PERFORMANCE_MONITORING ? Date.now() : 0;
  const staleElements: Element[] = [];
  let updatedCount = 0;
  let errorCount = 0;

  reactiveElements.forEach((elementInfo, element) => {
    // Check if element is still connected
    if (!isNodeConnected(element)) {
      staleElements.push(element);
      return;
    }

    // Dispatch update event with error handling
    const success = safeExecute(
      () => {
        element.dispatchEvent(new Event("update", { bubbles: true }));
        return true;
      },
      {
        operation: "notifyReactiveElements-dispatch",
        tagName: element.tagName?.toLowerCase(),
        additionalInfo: {
          resolverCount: elementInfo.attributeResolvers.size
        }
      },
      false
    );

    if (success) {
      updatedCount++;
    } else {
      errorCount++;
    }
  });

  // Clean up stale elements in batches
  const batchSize = REACTIVE_CONFIG.CLEANUP_BATCH_SIZE;
  for (let i = 0; i < staleElements.length; i += batchSize) {
    const batch = staleElements.slice(i, i + batchSize);
    batch.forEach(element => reactiveElements.delete(element));
  }

  // Log performance metrics if monitoring is enabled
  if (REACTIVE_CONFIG.PERFORMANCE_MONITORING && startTime > 0) {
    const duration = Date.now() - startTime;
    logError(
      "Reactive elements update completed",
      new Error("Performance monitoring"),
      {
        operation: "notifyReactiveElements-metrics",
        additionalInfo: {
          totalElements: reactiveElements.size,
          updatedElements: updatedCount,
          staleElements: staleElements.length,
          errorCount,
          duration: `${duration}ms`
        }
      },
      "info"
    );
  }
}

/**
 * Gets reactive system statistics for monitoring and debugging.
 */
export function getReactiveStats() {
  const textNodeStats = {
    total: reactiveTextNodes.size,
    withErrors: 0,
    connected: 0
  };

  const elementStats = {
    total: reactiveElements.size,
    totalResolvers: 0,
    connected: 0
  };

  // Count text node statistics
  reactiveTextNodes.forEach((info, textNode) => {
    if (info.errorCount > 0) {
      textNodeStats.withErrors++;
    }
    if (isNodeConnected(textNode)) {
      textNodeStats.connected++;
    }
  });

  // Count element statistics  
  reactiveElements.forEach((info, element) => {
    elementStats.totalResolvers += info.attributeResolvers.size;
    if (isNodeConnected(element)) {
      elementStats.connected++;
    }
  });

  return {
    textNodes: textNodeStats,
    elements: elementStats,
    config: REACTIVE_CONFIG
  };
}

/**
 * Clears all reactive state (useful for testing and cleanup).
 */
export function clearReactiveState(): void {
  reactiveTextNodes.clear();
  reactiveElements.clear();
  
  logError(
    "Reactive state cleared",
    new Error("Manual cleanup"),
    { operation: "clearReactiveState" },
    "info"
  );
}

/**
 * Enables or disables performance monitoring for reactive updates.
 */
export function setPerformanceMonitoring(enabled: boolean): void {
  (REACTIVE_CONFIG as any).PERFORMANCE_MONITORING = enabled;
}