import { applyNodeModifier } from "./modifierProcessor";
import { createMarkerComment } from "../utility/domMarkers";
import { isBrowser } from "../utility/environment";

interface ConditionalElementRuntime<TTagName extends ElementTagName = ElementTagName> {
  condition: () => boolean;
  tagName: TTagName;
  modifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>;
  placeholder: Comment;
  currentElement: ExpandedElement<TTagName> | null;
  host: ExpandedElement<TTagName>;
  index: number;
  update(): void;
}

const activeConditionalRuntimes = new Set<ConditionalElementRuntime<any>>();

function renderConditionalElement<TTagName extends ElementTagName>(
  runtime: ConditionalElementRuntime<TTagName>
): void {
  const shouldShow = runtime.condition();
  
  if (shouldShow && !runtime.currentElement) {
    // Create the element
    const element = document.createElement(runtime.tagName) as ExpandedElement<TTagName>;
    let localIndex = 0;

    runtime.modifiers.forEach((modifier) => {
      const renderedNode = applyNodeModifier(element, modifier, localIndex);
      if (renderedNode) {
        const node = renderedNode as Node;
        const parentNode = element as unknown as Node & ParentNode;
        if (node.parentNode !== parentNode) {
          parentNode.appendChild(node);
        }
        localIndex += 1;
      }
    });

    // Replace placeholder with element
    if (runtime.placeholder.parentNode) {
      runtime.placeholder.parentNode.replaceChild(element as Node, runtime.placeholder);
    }
    
    runtime.currentElement = element;
  } else if (!shouldShow && runtime.currentElement) {
    // Replace element with placeholder
    if (runtime.currentElement.parentNode) {
      runtime.currentElement.parentNode.replaceChild(runtime.placeholder, runtime.currentElement as Node);
    }
    
    runtime.currentElement = null;
  }
}

export function createConditionalElement<TTagName extends ElementTagName>(
  tagName: TTagName,
  condition: () => boolean,
  modifiers: Array<NodeMod<TTagName> | NodeModFn<TTagName>>,
  host: ExpandedElement<TTagName>,
  index: number
): Comment {
  if (!isBrowser) {
    return document.createComment(`conditional-${tagName}-ssr`);
  }

  const placeholder = createMarkerComment(`conditional-${tagName}`);
  
  const runtime: ConditionalElementRuntime<TTagName> = {
    condition,
    tagName,
    modifiers: [...modifiers],
    placeholder,
    currentElement: null,
    host,
    index,
    update: () => renderConditionalElement(runtime)
  };

  activeConditionalRuntimes.add(runtime);
  
  // Initial render
  renderConditionalElement(runtime);

  return runtime.currentElement ? (runtime.currentElement as unknown as Comment) : placeholder;
}

export function updateConditionalRuntimes(): void {
  activeConditionalRuntimes.forEach(runtime => {
    try {
      runtime.update();
    } catch (error) {
      // Remove runtime if it errors (likely due to cleanup)
      activeConditionalRuntimes.delete(runtime);
    }
  });
}

export function clearConditionalRuntimes(): void {
  activeConditionalRuntimes.clear();
}