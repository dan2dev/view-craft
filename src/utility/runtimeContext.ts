/**
 * Runtime context for managing SSR, hydration, and browser modes
 */

export type RuntimeMode = "browser" | "ssr" | "hydrate";

let currentMode: RuntimeMode = "browser";

export function setRuntimeMode(mode: RuntimeMode): void {
  currentMode = mode;
}

export function getRuntimeMode(): RuntimeMode {
  return currentMode;
}

export function isSSR(): boolean {
  return currentMode === "ssr";
}

export function isHydrating(): boolean {
  return currentMode === "hydrate";
}

export function isBrowserRuntime(): boolean {
  return currentMode === "browser";
}