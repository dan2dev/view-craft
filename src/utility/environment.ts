/**
 * Enhanced environment detection utilities with better edge case handling
 */

export interface EnvironmentInfo {
  isBrowser: boolean;
  isNode: boolean;
  isWebWorker: boolean;
  isSSR: boolean;
  hasDOM: boolean;
  supportsCustomElements: boolean;
  supportsES6: boolean;
}

/**
 * Cached environment detection results
 */
let environmentInfo: EnvironmentInfo | null = null;

/**
 * Detects if we're running in a browser environment
 */
export function isBrowser(): boolean {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return true;
  }
  return false;
}

/**
 * Detects if we're running in a Node.js environment
 */
export function isNode(): boolean {
  return (
    typeof process !== "undefined" &&
    process.versions != null &&
    process.versions.node != null
  );
}

/**
 * Detects if we're running in a Web Worker
 */
export function isWebWorker(): boolean {
  return (
    typeof self !== "undefined" &&
    typeof window === "undefined" &&
    typeof importScripts === "function"
  );
}

/**
 * Detects if we're in a server-side rendering context
 */
export function isSSR(): boolean {
  // Check for common SSR indicators
  if (isNode()) {
    return true;
  }

  // Check for DOM-like environments that aren't real browsers (like jsdom)
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    // jsdom or similar testing environments
    if (typeof navigator === "undefined" || !navigator.userAgent) {
      return true;
    }

    // Check for server-side DOM implementations
    if (document.defaultView === null) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if DOM APIs are available
 */
export function hasDOM(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof document.createElement === "function" &&
    typeof document.createTextNode === "function"
  );
}

/**
 * Checks if Custom Elements are supported
 */
export function supportsCustomElements(): boolean {
  return (
    isBrowser() &&
    typeof customElements !== "undefined" &&
    typeof customElements.define === "function"
  );
}

/**
 * Checks for ES6+ features support
 */
export function supportsES6(): boolean {
  try {
    // Test for basic ES6 features
    new Function("(a = 0) => a");
    return typeof Symbol !== "undefined" && typeof Promise !== "undefined";
  } catch {
    return false;
  }
}

/**
 * Gets comprehensive environment information
 */
export function getEnvironmentInfo(): EnvironmentInfo {
  if (environmentInfo === null) {
    environmentInfo = {
      isBrowser: isBrowser(),
      isNode: isNode(),
      isWebWorker: isWebWorker(),
      isSSR: isSSR(),
      hasDOM: hasDOM(),
      supportsCustomElements: supportsCustomElements(),
      supportsES6: supportsES6(),
    };
  }

  return environmentInfo;
}

/**
 * Clears cached environment info (useful for testing)
 */
export function clearEnvironmentCache(): void {
  environmentInfo = null;
}

/**
 * Checks if we can safely use DOM methods
 */
export function canUseDOMAPIs(): boolean {
  const env = getEnvironmentInfo();
  return env.hasDOM && (env.isBrowser || env.isSSR);
}

/**
 * Checks if we can use reactive features
 */
export function canUseReactiveFeatures(): boolean {
  const env = getEnvironmentInfo();
  return env.isBrowser && env.supportsES6;
}

/**
 * Safe document access with fallback
 */
export function getDocument(): Document | null {
  if (hasDOM()) {
    return document;
  }
  return null;
}

/**
 * Safe window access with fallback
 */
export function getWindow(): Window | null {
  if (isBrowser()) {
    return window;
  }
  return null;
}

/**
 * Creates appropriate DOM elements based on environment
 */
export function createSafeElement(tagName: string): Element | null {
  const doc = getDocument();
  if (doc) {
    try {
      return doc.createElement(tagName);
    } catch (error) {
      console.warn(`Failed to create element "${tagName}":`, error);
      return null;
    }
  }
  return null;
}

/**
 * Creates appropriate text nodes based on environment
 */
export function createSafeTextNode(text: string): Text | null {
  const doc = getDocument();
  if (doc) {
    try {
      return doc.createTextNode(text);
    } catch (error) {
      console.warn(`Failed to create text node:`, error);
      return null;
    }
  }
  return null;
}

/**
 * Creates appropriate comment nodes based on environment
 */
export function createSafeComment(text: string): Comment | null {
  const doc = getDocument();
  if (doc) {
    try {
      return doc.createComment(text);
    } catch (error) {
      console.warn(`Failed to create comment node:`, error);
      return null;
    }
  }
  return null;
}

// Export the original isBrowser for backward compatibility
// Note: isBrowser is already exported as a function above