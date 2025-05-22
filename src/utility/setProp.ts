export const setProp = <TObject, TValue>(element: TObject, prop: string, value: TValue, configurable: boolean = false, enumerable: boolean = false, writable: boolean = false) => {
  Object.defineProperty(element, prop, {
    value,
    configurable,
    enumerable,
    writable
  });
}
