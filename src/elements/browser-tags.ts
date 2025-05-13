import { tags } from "@/utility/tags";

export type ChildLinkType<T> = {
  anchor?: T;
  parent?: T;
  index?: number;
}
function processFunctionModifier<T, TAnchor>(child: T, link: ChildLinkType<TAnchor>): any {
    let computedChild = child;

    while (typeof computedChild === "function") {
        (link.anchor as any).updateView = child;
        computedChild = computedChild(link.anchor, {
            index: link.index,
            parent: link.parent,
            index: link.index,
        });
    }

    return computedChild;
}


export function registerTag<TTagName extends TagName = TagName>(tag: TTagName) {
  return function (...modifiers: ModifierFn<typeof tag>[]) {
    // builder function
    return function (parent: any, index: number) {
      // create element
      const element = document.createElement(tag);
  
      // build all children (modifiers) until there is no more functions in the modifiers
      

    }
  }
    
}
export function initBrowserTags() {
  tags.forEach((tag) => {
    Object.defineProperty(globalThis, tag, {
      value: (...modifiers: ModifierFn<typeof tag>[]) => () => document.createElement(tag),
      writable: false,
      enumerable: false,
      configurable: true,
    });
  }
}