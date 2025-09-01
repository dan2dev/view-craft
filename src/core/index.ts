
// export namespace Core {
//   register:
// }

export const v = <TTagName extends ElementTagName>(tagName: TTagName, attributes: ElementAttributes<TTagName>, children: (VirtualElement | Primitive)[]) => {
  return {
    tagName,
    attributes,
    children,
  } satisfies VirtualElement<TTagName>;
}
