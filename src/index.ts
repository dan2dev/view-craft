
export const start = () => {
  console.log("Starting...");
  // Example usage of VElementTag to trigger type checking
  const el: VElementTag = {
    tagName: "div",
    att: {},
  };
  return el;
};
import { VElementTag } from "../types";

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