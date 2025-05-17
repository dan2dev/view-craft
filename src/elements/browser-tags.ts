import { isDomChild } from "@/utility/isDomChild";
import { tags } from "@/utility/tag-names";


function processFunctionModifier<T, TAnchor>(
  child: T,
  link: ChildLinkType<TAnchor>,
): any {
  let computedChild: T = child;

  // while (typeof computedChild === "function") {
  //   if ("parent" in link) {
  //     (link.parent as any).updateView = child;
  //   } else if ("anchor" in link) {
  //     (link.anchor as any).updateView = child;
  //   }

  //   // ------------------
  //   computedChild = computedChild(computedChild, {
  //     index: link.index,
  //     parent: link.parent,
  //     anchor: link.anchor,
  //   } as ChildLinkType<TAnchor>);
  // }

  // if (isDomChild(computedChild)) {
  // }

  return computedChild;
}

export function createTag<TTagName extends TagName = TagName>(
  tag: TTagName,
) {
  return function (...modifiers: ModifierFn<typeof tag>[]) {
    // builder function
    return function (parent: any, link: ChildLinkType<TagName>) {
      // create element
      const element = document.createElement(tag);

      // build all children (modifiers) until there is no more functions in the modifiers
      let childIndex = 0;
      const children = modifiers.map((modifier) => {
        const child = processFunctionModifier(modifier, {
          index: childIndex,
          parent: parent,
        });
        if (
          child instanceof HTMLElement ||
          child instanceof Text ||
          child instanceof Comment
        ) {
          childIndex++;
        }
        return child;
      });
    };
  };
}
export function initBrowserTags() {
  tags.forEach((tag) => {
    Object.defineProperty(globalThis, tag, {
      value:
        (...modifiers: ModifierFn<typeof tag>[]) =>
        () =>
          document.createElement(tag),
      writable: false,
      enumerable: false,
      configurable: true,
    });
  });
}
