import { isDomChild } from "@/utility/isDomChild";
import { tags } from "@/utility/tags";

export type ChildLinkType<T> =
  | {
      parent: T;
      index: number;
    }
  | {
      anchor: T;
      index: number;
    };

function processFunctionModifier<T, TAnchor>(
  child: T,
  link: ChildLinkType<TAnchor>,
): any {
  let computedChild: T = child;

  while (typeof computedChild === "function") {
    if ("parent" in link) {
      (link.parent as any).updateView = child;
    } else if ("anchor" in link) {
      (link.anchor as any).updateView = child;
    }

    // ------------------
    computedChild = computedChild(computedChild, {
      index: link.index,
      parent: link.parent,
      anchor: link.anchor,
    } as ChildLinkType<TAnchor>);
  }

  if (isDomChild(computedChild)) {
  }

  return computedChild;
}

/**
 * Creates a tag builder for a specific HTML tag.
 *
 * This function generates a builder function that can be used to create an HTML element of the specified tag.
 * The returned builder accepts one or more modifier functions which enhance or modify the element creation process.
 * Once the modifiers have been provided, invoking the builder with a parent and an index will ultimately create
 * the corresponding HTML element.
 *
 * @typeParam TTagName - The type of the tag name, extending the base TagName.
 * @param tag - The HTML tag name for which the builder function is created.
 *
 * @returns A function that accepts modifier functions and returns another function. This final function,
 * when called with a parent element and an index, creates an HTML element of the specified tag and applies
 * the given modifiers.
 *
 * @remarks
 * This builder pattern allows for more modular and incremental element construction by chaining transformations
 * via modifier functions. It serves a similar purpose to higher-order component or function patterns in modern
 * web development.
 */
export function createTagBuilder<TTagName extends TagName = TagName>(
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
