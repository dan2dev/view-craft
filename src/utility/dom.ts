export namespace Dom {
  export function push(parent: HTMLElement, ...children: (HTMLElement | string)[]) {
    children.forEach((child) => {
      if (typeof child === "string") {
        parent.appendChild(document.createTextNode(child));
      } else {
        parent.appendChild(child);
      }
    });
    return parent;
  }
}