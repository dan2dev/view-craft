// Explicitly import the global types to ensure type checking
import { some1 } from "./some";

export const start = () => {
  console.log("Starting...");
  some1();
  // Example usage of VirtualElement to trigger type checking
  const el: VirtualElement = {
    tagName: "div",
    att: {},
  } satisfies VirtualElement;
  return el;
};

const some: NodeMod<"div"> = (parent, index) => {
  return {
    tagName: "div",
    att: {},
    children: []
  } satisfies VirtualElement<"div">;
}

declare type LoginModel = {
  username: string;
  password: string;
}

// export const start = () => {
//   console.log("Starting...");
//   return {
//     id: "example-id",
//     value: 42
//   } satisfies VTagName;
// };

export default {}