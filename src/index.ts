// Explicitly import the global types to ensure type checking
export const start = () => {
  console.log("Starting...");
  // Example usage of VElementTag to trigger type checking
  const el: VElementTag = {
    tagName: "div",
    att: {},
  } satisfies VElementTag;
  return el;
};

const some: VElementTagBuilderFn = () => 2;


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