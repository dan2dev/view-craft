import { isBrowser } from "../utility/environment";
import { applyNodeModifier } from "../core/modifierProcessor";
import { createMarkerPair, clearBetweenMarkers, insertNodesBefore } from "../utility/dom";
import { resolveCondition } from "../utility/conditions";
import { modifierProbeCache } from "../utility/modifierPredicates";
import { isFunction } from "../utility/typeGuards";

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
          const node = applyNodeModifier(host, item, index);
          if (node) nodes.push(node);
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
    if (!isBrowser) {
      return document.createComment("when-ssr");
    }

    const { start: startMarker, end: endMarker } = createMarkerPair("when");
    
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

    activeWhenRuntimes.add(runtime);
    
    const parent = host as unknown as Node & ParentNode;
    parent.appendChild(startMarker);
    parent.appendChild(endMarker);
    
    renderWhenContent(runtime);

    return startMarker;
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
