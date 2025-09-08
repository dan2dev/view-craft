import "./utility/index";
import "./core/index";
import { some1 } from "./some";

export const start = () => {
  console.log("Starting...");
  some1();
  return {
    id: "example-id",
    value: 42,
  };
};

export default {};
