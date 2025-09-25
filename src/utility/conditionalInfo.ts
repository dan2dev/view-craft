export interface ConditionalInfo {
  condition: () => boolean;
  tagName: string;
  modifiers: Array<NodeMod<any> | NodeModFn<any>>;
}

export function storeConditionalInfo(
  node: Node,
  info: ConditionalInfo
): void {
  (node as any)._conditionalInfo = info;
}

export function hasConditionalInfo(node: Node): boolean {
  return Boolean((node as any)._conditionalInfo);
}

export function getConditionalInfo(node: Node): ConditionalInfo | null {
  return ((node as any)._conditionalInfo as ConditionalInfo | undefined) ?? null;
}
