/// <reference types="vite/client" />

// Allow side-effect imports of global CSS files, e.g. `import "./index.css"`.
declare module '*.css'

// Allow CSS Modules imports, e.g. `import styles from "./styles.module.css"`.
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}