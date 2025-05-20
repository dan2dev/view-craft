import { isBrowser } from "./utility/isBrowser";
import * as csr from "./csr/index.ts";

isBrowser && csr.registerTags();

console.log("OK!");
export { isBrowser };
