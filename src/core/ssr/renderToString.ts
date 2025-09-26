/**
 * Server-side rendering entry point
 */
import { setRuntimeMode, getRuntimeMode } from '../../utility/runtimeContext';
import { createElement } from '../../utility/nodeFactory';
import { serialize, type SerializeOptions } from './virtualNodes';
import { resetMarkerCounter } from '../../utility/dom';

export interface RenderOptions extends SerializeOptions {
  wrapperTag?: string;
}

/**
 * Renders a view builder function to HTML string
 */
export function renderToString(
  viewBuilder: (parent: any, index: number) => any,
  options: RenderOptions = {}
): string {
  const originalMode = getRuntimeMode();
  
  try {
    setRuntimeMode("ssr");
    resetMarkerCounter(); // Ensure deterministic markers
    
    // Create virtual root wrapper (will be unwrapped unless specified)
    const root = createElement(options.wrapperTag || "div");
    
    // Invoke the builder with the virtual root
    viewBuilder(root, 0);
    
    // Serialize the result
    return serialize(root, { unwrap: true, ...options });
  } finally {
    // Restore original runtime mode
    setRuntimeMode(originalMode);
  }
}