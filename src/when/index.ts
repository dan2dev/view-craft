import { isBrowser } from "../utility/environment";
import { applyNodeModifier } from "../core/modifierProcessor";
import { createMarkerPair, clearBetweenMarkers, insertNodesBefore } from "../utility/dom";
import { resolveCondition } from "../utility/conditions";
import { modifierProbeCache } from "../utility/modifierPredicates";
import { isFunction } from "../utility/typeGuards";
import { isSSR, isHydrating } from "../utility/runtimeContext";
import { appendChild } from "../utility/nodeFactory";
import { claimChild } from "../core/hydration";

type WhenCondition = boolean | (() => boolean);
type WhenContent<TTagName extends ElementTagName = ElementTagName> = 
  NodeMod<TTagName> | NodeModFn<TTagName>;

interface WhenGroup<TTagName extends ElementTagName = ElementTagName> {
  condition: WhenCondition;
  content: WhenContent<TTagName>[];
}

interface WhenRuntime<TTagName extends ElementTagName = ElementTagName> {
  startMarker: Comment;
  endMarker: Comment;
  host: ExpandedElement<TTagName>;
  index: number;
  groups: WhenGroup<TTagName>[];
  elseContent: WhenContent<TTagName>[];
  /**
   * Tracks which branch is currently rendered:
   *  - null: nothing rendered yet
   *  - -1: else branch
   *  - >=0: index of groups[]
   */
  activeIndex: number | -1 | null;
  update(): void;
}

const activeWhenRuntimes = new Set<WhenRuntime<any>>();

function renderWhenContent<TTagName extends ElementTagName>(runtime: WhenRuntime<TTagName>): void {
  const { groups, elseContent, host, index, endMarker } = runtime;

  // Determine which branch (if any) should be active now
  let newActive: number | -1 | null = null;
  for (let i = 0; i < groups.length; i++) {
    if (resolveCondition(groups[i].condition)) {
      newActive = i;
      break;
    }
  }
  if (newActive === null && elseContent.length) {
    newActive = -1;
  }

  // If the active branch hasn't changed, we skip re-rendering to preserve
  // any existing structural runtimes (like list) inside the branch.
  if (newActive === runtime.activeIndex) {
    return;
  }

  // Branch changed – clear old content
  clearBetweenMarkers(runtime.startMarker, runtime.endMarker);
  runtime.activeIndex = newActive;

  // Nothing to render
  if (newActive === null) return;

  const nodes: Node[] = [];

  const renderItems = (items: ReadonlyArray<WhenContent<TTagName>>) => {
    for (const item of items) {
      if (isFunction(item)) {
        if ((item as Function).length === 0) {
          // Zero-arg reactive function (reactive text)
            modifierProbeCache.delete(item as Function);
            const node = applyNodeModifier(host, item, index);
            if (node) nodes.push(node);
            continue;
        }
        // Structural NodeModFn (list, nested when, tag builders returning functions, etc.)
        const realHost = host as unknown as Element & {
          appendChild: (n: Node) => any;
          insertBefore: (n: Node, ref: Node | null) => any;
        };
        const originalAppend = realHost.appendChild;
        (realHost as any).appendChild = function(n: Node) {
          return (realHost as any).insertBefore(n, endMarker);
        };
        try {
          // Invoke the NodeModFn. It may either:
          //  1. Return a node that is NOT yet in the DOM (simple element factory)
          //  2. Self-append its own markers/content (structural runtime like list / nested when)
          const maybeNode = applyNodeModifier(host, item, index);
          if (maybeNode && !maybeNode.parentNode) {
            // Not in DOM yet => treat as simple element factory result; queue for insertion
            nodes.push(maybeNode);
          }
        } finally {
          (realHost as any).appendChild = originalAppend;
        }
        continue;
      }

      // Plain content (primitive, Node, attribute object)
      const node = applyNodeModifier(host, item, index);
      if (node) nodes.push(node);
    }
  };

  if (newActive >= 0) {
    renderItems(groups[newActive].content);
  } else if (newActive === -1) {
    renderItems(elseContent);
  }

  insertNodesBefore(nodes, endMarker);
}

class WhenBuilderImpl<TTagName extends ElementTagName = ElementTagName> {
  private groups: WhenGroup<TTagName>[] = [];
  private elseContent: WhenContent<TTagName>[] = [];

  constructor(initialCondition: WhenCondition, ...content: WhenContent<TTagName>[]) {
    this.groups.push({ condition: initialCondition, content });
  }

  when(condition: WhenCondition, ...content: WhenContent<TTagName>[]): WhenBuilderImpl<TTagName> {
    this.groups.push({ condition, content });
    return this;
  }

  else(...content: WhenContent<TTagName>[]): WhenBuilderImpl<TTagName> {
    this.elseContent = content;
    return this;
  }

  render(host: ExpandedElement<TTagName>, index: number): Node | null {
    let startMarker: Comment;
    let endMarker: Comment;

    if (isHydrating()) {
      // Hydration mode: claim existing markers
      const claimedStart = claimChild(host as Node, "comment");
      const claimedEnd = claimChild(host as Node, "comment");
      
      if (claimedStart && claimedEnd) {
        startMarker = claimedStart as Comment;
        endMarker = claimedEnd as Comment;
      } else {
        // Fallback if claiming fails
        const markers = createMarkerPair("when");
        startMarker = markers.start;
        endMarker = markers.end;
      }
    } else {
      const markers = createMarkerPair("when");
      startMarker = markers.start;
      endMarker = markers.end;
    }
    
    if (isSSR()) {
      // SSR: render the active branch content directly between markers
      appendChild(host, startMarker);
      appendChild(host, endMarker);
      
      // Find and render the first matching condition
      for (let i = 0; i < this.groups.length; i++) {
        if (resolveCondition(this.groups[i].condition)) {
          this.renderContentBetweenMarkers(this.groups[i].content, host, endMarker, index);
          return startMarker;
        }
      }
      
      // No conditions matched, render else content if available
      if (this.elseContent.length > 0) {
        this.renderContentBetweenMarkers(this.elseContent, host, endMarker, index);
      }
      
      return startMarker;
    }

    // Browser/Hydration: set up runtime for dynamic updates
    const runtime: WhenRuntime<TTagName> = {
      startMarker,
      endMarker,
      host,
      index,
      groups: [...this.groups],
      elseContent: [...this.elseContent],
      activeIndex: null,
      update: () => renderWhenContent(runtime)
    };

    if (isHydrating()) {
      // Hydration: determine which branch should be active and verify existing content
      let expectedActive: number | -1 | null = null;
      for (let i = 0; i < this.groups.length; i++) {
        if (resolveCondition(this.groups[i].condition)) {
          expectedActive = i;
          break;
        }
      }
      if (expectedActive === null && this.elseContent.length) {
        expectedActive = -1;
      }
      
      runtime.activeIndex = expectedActive;
      activeWhenRuntimes.add(runtime);
      return startMarker;
    }

    // Browser mode: append markers and render
    const parent = host as unknown as Node & ParentNode;
    parent.appendChild(startMarker);
    parent.appendChild(endMarker);
    
    activeWhenRuntimes.add(runtime);
    renderWhenContent(runtime);

    return startMarker;
  }

  private renderContentBetweenMarkers(
    content: WhenContent<TTagName>[], 
    host: ExpandedElement<TTagName>, 
    endMarker: Comment, 
    index: number
  ): void {
    for (const item of content) {
      const node = applyNodeModifier(host, item, index);
      if (node) {
        if (isSSR()) {
          // In SSR, insert before the end marker
          (host as any).insertBefore(node, endMarker);
        } else {
          // In browser, should not reach here, but handle gracefully
          appendChild(host, node);
        }
      }
    }
  }
}

function createWhenBuilderFunction<TTagName extends ElementTagName>(
  builder: WhenBuilderImpl<TTagName>
): WhenBuilder<TTagName> {
  const nodeModFn = (host: ExpandedElement<TTagName>, index: number): Node | null => {
    return builder.render(host, index);
  };

  return Object.assign(nodeModFn, {
    when: (condition: WhenCondition, ...content: WhenContent<TTagName>[]): WhenBuilder<TTagName> => {
      builder.when(condition, ...content);
      return createWhenBuilderFunction(builder);
    },
    else: (...content: WhenContent<TTagName>[]): WhenBuilder<TTagName> => {
      builder.else(...content);
      return createWhenBuilderFunction(builder);
    },
  }) as unknown as WhenBuilder<TTagName>;
}

export function updateWhenRuntimes(): void {
  activeWhenRuntimes.forEach(runtime => {
    try {
      runtime.update();
    } catch (error) {
      // Remove runtime if it errors (likely due to cleanup)
      activeWhenRuntimes.delete(runtime);
    }
  });
}

export function clearWhenRuntimes(): void {
  activeWhenRuntimes.clear();
}

export function when<TTagName extends ElementTagName = ElementTagName>(
  condition: WhenCondition, 
  ...content: WhenContent<TTagName>[]
): WhenBuilder<TTagName> {
  const builder = new WhenBuilderImpl<TTagName>(condition, ...content);
  return createWhenBuilderFunction(builder);
}
