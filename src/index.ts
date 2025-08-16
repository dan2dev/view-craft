import { ExampleType } from "../types";

export const start = () => {
  console.log("Starting...");
  return {
    id: "example-id",
    value: 42
  } satisfies ExampleType;
};
