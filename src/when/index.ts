import { isBrowser } from "../utility/environment";
import { applyNodeModifier } from "../core/modifierProcessor";
import { createMarkerPair, clearBetweenMarkers, insertNodesBefore } from "../utility/dom";

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
  update(): void;
}

const activeWhenRuntimes = new Set<WhenRuntime<any>>();

function renderWhenContent<TTagName extends ElementTagName>(runtime: WhenRuntime<TTagName>): void {
  clearBetweenMarkers(runtime.startMarker, runtime.endMarker);
  
  let foundMatch = false;
  const nodesToInsert: Node[] = [];

  for (const group of runtime.groups) {
    const conditionResult = typeof group.condition === "function" 
      ? group.condition() 
      : group.condition;

    if (conditionResult) {
      foundMatch = true;
      for (const item of group.content) {
        const element = applyNodeModifier(runtime.host, item, runtime.index);
        if (element) {
          nodesToInsert.push(element);
        }
      }
      break;
    }
  }

  if (!foundMatch && runtime.elseContent.length > 0) {
    for (const item of runtime.elseContent) {
      const element = applyNodeModifier(runtime.host, item, runtime.index);
      if (element) {
        nodesToInsert.push(element);
      }
    }
  }

  insertNodesBefore(nodesToInsert, runtime.endMarker);
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