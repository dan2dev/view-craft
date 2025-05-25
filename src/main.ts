import * as csr from "./csr/index.ts";
import { isBrowser } from "./utility/isBrowser";
import * as ssr from "./ssr/index.ts";

isBrowser ? csr.registerTags() : ssr.registerTags();

export { isBrowser };
