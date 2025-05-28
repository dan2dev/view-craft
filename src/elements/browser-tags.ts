// import { isDomChild } from "@/utility/isDomChild";



// function processFunctionModifier<TElement, TMod>(
//   element: TElement,
//   mod: TMod,
//   index: number,
// ) {
//   let computedMod = mod;
//   while (typeof computedMod === "function") {
//     computedMod = computedMod(element, index);
//   };
//   return computedMod;
// }

// export function createTag<TTagName extends TagName = TagName>(tag: TTagName) {
//   return function (...modifiers: ModifierFn<typeof tag>[]) {
//     // builder function
//     return function (parent: VirtualElement, link: ChildLinkType<TagName>) {
//       // create element
//       const element = document.createElement(tag);

//       // build all children (modifiers) until there is no more functions in the modifiers
//       let childIndex = 0;
//       // const mods = modifiers.map((modifier) => {
//       //   const mod = processFunctionModifier(modifier, modifier, childIndex);


//       // });
//       return element;
//     };
//   };
// }
// export function createSelfClosingTag<TTagName extends SelfClosingTagName = SelfClosingTagName>(
//   tag: TTagName,
// ) {
//   return function (...modifiers: ModifierFn<typeof tag>[]) {
//     // builder function
//     return function (parent: any, link: ChildLinkType<TagName>) {
//       // create element
//       const element = document.createElement(tag);

//       // build all children (modifiers) until there is no more functions in the modifiers
//       let childIndex = 0;
//       // const mods = modifiers.map((modifier) => {
//       //   return processFunctionModifier(modifier, {
//       //     index: childIndex,
//       //     parent: parent,
//       //   });
//       // });

//       // --------------

//       return element;
//     };
//   };
// }



// // export function initBrowserTags() {
// //   tags.forEach((tag) => {
// //     Object.defineProperty(globalThis, tag, {
// //       value:
// //         (...modifiers: ModifierFn<typeof tag>[]) =>
// //         () =>
// //           document.createElement(tag),
// //       writable: false,
// //       enumerable: false,
// //       configurable: true,
// //     });
// //   });
// // }
