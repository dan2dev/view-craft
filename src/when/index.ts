import { isBrowser } from "../utility/environment";
import { applyNodeModifier } from "../core/modifierProcessor";

type WhenCondition = boolean | (() => boolean);

interface WhenGroup {
  condition: WhenCondition;
  content: any[];
}

interface WhenRuntime {
  startMarker: Comment;
  endMarker: Comment;
  host: ExpandedElement<any>;
  index: number;
  groups: WhenGroup[];
  elseContent: any[];
  update(): void;
}

const activeWhenRuntimes = new Set<WhenRuntime>();

function clearBetweenMarkers(startMarker: Comment, endMarker: Comment): void {
  let current = startMarker.nextSibling;
  while (current && current !== endMarker) {
    const next = current.nextSibling;
    current.parentNode?.removeChild(current);
    current = next;
  }
}

function renderWhenContent(runtime: WhenRuntime): void {
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

  const parent = runtime.startMarker.parentNode;
  if (parent) {
    nodesToInsert.forEach(node => {
      parent.insertBefore(node, runtime.endMarker);
    });
  }
}

class WhenBuilder {
  private groups: WhenGroup[] = [];
  private elseContent: any[] = [];

  constructor(initialCondition: WhenCondition, ...content: any[]) {
    this.groups.push({ condition: initialCondition, content });
  }

  when(condition: WhenCondition, ...content: any[]): WhenBuilder {
    this.groups.push({ condition, content });
    return this;
  }

  else(...content: any[]): WhenBuilder {
    this.elseContent = content;
    return this;
  }

  render(host: ExpandedElement<any>, index: number): Node | null {
    if (!isBrowser) {
      return document.createComment("when-ssr");
    }

    const startMarker = document.createComment("when-start");
    const endMarker = document.createComment("when-end");
    
    const runtime: WhenRuntime = {
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

type WhenBuilderFunction = WhenBuilder & NodeModFn<any>;

function createWhenBuilderFunction(builder: WhenBuilder): WhenBuilderFunction {
  const nodeModFn = (host: ExpandedElement<any>, index: number): Node | null => {
    return builder.render(host, index);
  };

  return Object.assign(nodeModFn, {
    when: (condition: WhenCondition, ...content: any[]): WhenBuilderFunction => {
      builder.when(condition, ...content);
      return createWhenBuilderFunction(builder);
    },
    else: (...content: any[]): WhenBuilderFunction => {
      builder.else(...content);
      return createWhenBuilderFunction(builder);
    },
  }) as any;
}

export function updateWhenRuntimes(): void {
  activeWhenRuntimes.forEach(runtime => {
    runtime.update();
  });
}

export function when(condition: WhenCondition, ...content: any[]): WhenBuilderFunction {
  const builder = new WhenBuilder(condition, ...content);
  return createWhenBuilderFunction(builder);
}