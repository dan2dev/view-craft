# View Craft – SSR & Hydration Implementation Plan

This document defines the tasks, design constraints, and incremental steps required to add **Server‑Side Rendering (SSR)** and **hydration** to View Craft with *minimal disruption* to existing code and public APIs.

---

## 1. Objectives

1. `renderToString(viewBuilder)` – Produce deterministic HTML on the server using the same element builders & modifiers.
2. **Hydration** – On the client, reuse pre-rendered DOM nodes instead of recreating them:
   - Element builders reuse existing DOM children by index.
   - Structural systems (`list`, `when`, conditionals) adopt their marker comments & inner nodes.
3. Preserve current developer ergonomics (no forced keys, no new required APIs).
4. Ensure reactive text & reactive attributes begin updating after hydration without DOM churn.
5. Permit future enhancements (e.g., keyed diffing, dev warnings) without redesign.

---

## 2. Current State Summary

| Concern | Current Situation | Gap for SSR/Hydration |
|---------|------------------|-----------------------|
| Element creation | Direct `document.createElement` scattered | Needs abstraction |
| Text nodes | Created ad hoc (`document.createTextNode`) | Need reuse during hydration |
| Comments / markers | List & when use marker pairs; conditionals use element-or-comment | Need deterministic SSR + hydration claiming |
| Server guards | Many `if (!isBrowser)` short-circuits (e.g. `when` returns a single comment) | Must render *real* branch content on SSR |
| Reactivity | Works via registries referencing live DOM | Must register against reused nodes |
| Conditional elements | No SSR metadata stored | Need a way to re-bind condition logic |
| List runtime | Always creates new markers, manages nodes | Must adopt existing markers + children when hydrating |
| `when` runtime | Server returns placeholder; no real branch output | Must fully render active branch in SSR |

---

## 3. Design Principles

1. **Abstraction, not Rewrite**: Introduce a *tiny node factory adapter* rather than refactoring every module interface.
2. **Index-Based Mapping First**: Hydration uses `(parent, childIndex)` sequencing to claim nodes (simplest workable strategy).
3. **Deterministic Output**: SSR avoids randomness (no `Math.random` in marker IDs).
4. **Non-Intrusive Hooks**: Add hydration checks where creation occurs—avoid pushing complexity into business logic.
5. **One-Pass Serialization**: Virtual tree holds complete structure; serialization is a pure walk.

---

## 4. Core New Modules

### 4.1 `src/utility/runtimeContext.ts`
Responsibilities:
- Track `runtimeMode: "browser" | "ssr" | "hydrate"`.
- Helpers: `setRuntimeMode`, `getRuntimeMode`, `isSSR`, `isHydrating`, `isBrowserRuntime`.

### 4.2 `src/utility/nodeFactory.ts`
Adapter surface:
- `createElement(tag)`
- `createText(data)`
- `createComment(data)`
- `append(parent, child)`
- `insertBefore(parent, child, ref)`
- `setAttribute(el, k, v)`
- Unified across modes: browser delegates to DOM; SSR builds virtual nodes.

### 4.3 `src/core/ssr/virtualNodes.ts`
- Minimal classes: `VElement`, `VText`, `VComment`, implementing shape: `nodeType`, `tagName?`, `childNodes[]`, `parentNode`, `textContent`, `attributes (Map)`.
- Utilities: `serialize(node, options)`.
- Self-closing tag handling using existing `SELF_CLOSING_TAGS`.

### 4.4 `src/core/ssr/renderToString.ts`
Implementation steps:
1. Set mode `"ssr"`.
2. Create virtual root wrapper (not emitted if `options.unwrap === true`).
3. Invoke builder(s) with `(root, 0)`.
4. Serialize children deterministically.
5. Reset mode (optional) or leave to caller.
6. Exported: `renderToString(view, options?)`.

### 4.5 `src/core/hydration.ts`
- `beginHydration(root: Element)`
  - Sets mode `"hydrate"`.
  - Initializes a `WeakMap<ParentNode, number>`: next child claim index.
- `claimChild(parent, expectedKind, tagName?)`
  - Returns existing child if it matches expectations; else returns `null`.
- `endHydration()` sets mode back to `"browser"`.
- `hydrate(root, viewBuilder)` high-level API.

---

## 5. Required Modifications (File-Level)

| File | Change Summary |
|------|----------------|
| `core/elementFactory.ts` | Replace direct `document.createElement` with adapter + hydration reuse via `claimChild`. |
| `core/modifierProcessor.ts` | For primitive → text node: hydration try `claimChild(parent,"text")`. |
| `core/reactive.ts` | Extend `createReactiveTextNode` to accept optional existing Text node during hydration. |
| `utility/dom.ts` | Replace internal creation helpers with adapter; make marker creation deterministic in SSR. |
| `core/conditionalRenderer.ts` | Add hydration path: claim existing element/comment; store metadata after claiming. |
| `core/conditionalUpdater.ts` | Ensure conditional info is attached post-hydration; handle both element/comment origins. |
| `when/index.ts` | Always render full branch on SSR (remove server placeholder behavior); hydration reclaims markers and verifies branch. |
| `list/runtime.ts` | Hydration: claim start/end markers, scan nodes between them → initialize `records` and `lastSyncedItems`. |
| `core/runtimeBootstrap.ts` | No major change (ensure safe in SSR—avoid side effects if not needed). |
| `index.ts` | Export `renderToString`, `hydrate`. |

---

## 6. Hydration Flow (Detailed)

1. Server: `renderToString(app)` generates HTML with:
   - Element order identical to runtime append order.
   - Comments for list & when markers: `<!--list-start-N-->`, `<!--list-end-N-->`, `<!--when-start-N-->`, etc. (Deterministic N).
   - Conditional hidden elements → comment `<!--conditional-div-hidden-->`.
2. Client:
   - Inject HTML (e.g., via server framework).
   - Call `hydrate(root, app)`:
     - Mode = `hydrate`.
     - First builder invocation:
       - For each element creation site: claim existing DOM child by index.
       - For each primitive text insertion: claim text node.
       - For structural runtimes:
         - `list`: claim two sequential comments; gather elements between; map them to items from current provider result (assumption: item count matches).
         - `when`: claim marker pair & existing branch nodes; recompute active branch; if mismatch, rebuild (fallback).
         - Conditional element: claim element or comment; attach conditional info; future updates proceed.
       - For reactive text / attributes: register against claimed nodes.
     - Mode switches to `"browser"` after completion (normal updates resume).
3. User calls `update()`; reactive, list, when, conditional behaviors proceed unchanged.

---

## 7. Index Claim Rules

- Only **node-producing** modifiers advance the hydration index.
- Attribute-only objects do NOT advance index.
- Zero-arg primitive-returning functions (reactive text) count as a text node (claim index).
- Structural markers (start + end) each consume an index position (because they are real comment nodes in the DOM).
- Conditional element vs comment: whichever existed occupies its index.

---

## 8. Marker Strategy

| Runtime | Start Comment Pattern | End Comment Pattern | Deterministic ID Source |
|---------|-----------------------|---------------------|-------------------------|
| list | `list-start-<n>` | `list-end-<n>` | Incrementing global counter in SSR/hydration |
| when | `when-start-<n>` | `when-end-<n>` | Same counter |
| conditional hidden | `conditional-<tag>-hidden` | (single node only) | No counter needed |
| conditional placeholder SSR (was passed) | same as hidden | — | — |

> Counter must reset (or be scoped) per `renderToString` call to ensure reproducibility between identical server renders.

---

## 9. Conditional Element Handling

- SSR:
  - Evaluate condition.
  - Emit element (with its children) or comment placeholder.
  - Optionally add `data-vc-cond="tag"` attribute to facilitate debugging (can be omitted for minimal output).
- Hydration:
  - At builder site, attempt claim:
    - If expected element but found comment, still adopt existing & store metadata; updater will flip if needed on next `update()`.
  - Store conditional info (condition function, tagName, modifiers) for future toggles as currently done in browser path.

---

## 10. Reactive Text & Attribute Hydration

Extend `createReactiveTextNode(resolver, preEval?, existingNode?)`:
- If `existingNode` provided:
  - Do NOT replace textContent unless mismatch vs `preEval` (keep SSR text stable).
  - Register into `reactiveTextNodes` map as usual.

Attribute resolvers:
- Hydration path identical: set initial value (already in DOM, may be redundant), then attach update listener.

---

## 11. Serialization Rules

1. Escape text node content: `& < >`.
2. Escape attribute values: `& " < >`.
3. Omit attributes with `undefined` / `null`.
4. Void (self-closing) tags: emit `<br>` not `<br></br>`.
5. Styles (object form):
   - Serialize by iterating keys (as-is) → `key: value;`
   - Same transformation logic as runtime (if runtime normalizes camelCase to CSS property names, replicate or reuse code).
6. Preserve comment nodes exactly: `<!--when-start-0-->`.

---

## 12. Public API Additions

```ts
import { renderToString, hydrate } from "view-craft";

const html = renderToString(() =>
  div(
    h1("SSR"),
    list(() => items, i => div(i)),
    when(() => show, span("Shown")).else(span("Hidden")),
    () => counter
  )
);

// Client:
hydrate(document.getElementById("app")!, () =>
  div(
    h1("SSR"),
    list(() => items, i => div(i)),
    when(() => show, span("Shown")).else(span("Hidden")),
    () => counter
  )
);
```

Optional advanced invocation:
```ts
renderToString(app, { wrapperTag: "div", debugHydration: true });
```

---

## 13. Testing Plan

| Test Type | Scenario | Assertion |
|-----------|----------|-----------|
| SSR snapshot | list + when + conditional + reactive text | Stable deterministic HTML |
| Hydration reuse | Inject SSR HTML, hydrate, mutate list | No duplicate nodes, list sync works |
| Conditional toggle | Hydrate state=hidden then reveal | Comment replaced by element |
| When branch switch | Hydrate active branch, flip condition | Markers reused, content replaced |
| Reactive text | Hydrate with initial count, update variable, call `update()` | Text node updated in place |
| Attribute reactivity | Hydrate element with reactive style/class | Attribute changes without node replacement |

---

## 14. Incremental Implementation Order

1. Add runtime context & mode helpers.
2. Implement nodeFactory adapter (browser pass-through).
3. Virtual node classes + serializer.
4. `renderToString` basic (primitives + plain elements).
5. Replace direct DOM creation calls with adapter.
6. Enable comment/marker creation in SSR (deterministic).
7. Remove server short-circuit in `when`; SSR full branch render.
8. Add SSR support for list markers & children.
9. Introduce hydration module + element/text claiming (simple elements + primitives).
10. Hydrate list markers & adopt children.
11. Hydrate when markers & branch adoption.
12. Conditional hydration logic.
13. Reactive text/attribute reuse modifications.
14. Add tests for each milestone (avoid giant untested step).
15. Documentation updates in README.

---

## 15. Edge Cases & Mitigations

| Edge Case | Mitigation |
|-----------|------------|
| Mismatch in child counts (hydration) | Log warning (future strict mode) and fallback to creating new nodes |
| Non-deterministic conditions (Date.now, random) | Document requirement: conditions must be pure for hydration consistency |
| Mixed consecutive primitives (text nodes) collapse | Preserve separate text nodes (DOM will not auto-merge unless manually concatenated) |
| Attribute order differences | Attribute order is not semantically important; serializer may normalize insertion order |
| List items changed between SSR & hydration | Currently requires same length & semantic mapping; future extension: keyed hydration |

---

## 16. Future Enhancements (Not in MVP)

- Optional keyed list hydration strategy.
- Dev build mismatch overlay.
- Streaming SSR (chunk flush).
- Lazy branch hydration (`when` subtree deferral).
- Source map of builder call sites for debug logs.

---

## 17. Minimal Patch Footprint Guidelines

1. Wrap creation logic; do not rename existing exports.
2. Keep function signatures stable; add optional params only when unavoidable.
3. Prefer additive modules over in-place large diff blocks.
4. Use feature flags / mode branching inside small, localized helpers.

---

## 18. Success Criteria Checklist

| Criterion | Done? |
|-----------|-------|
| Deterministic SSR output | ☐ |
| `renderToString` exported & tested | ☐ |
| Hydration reuses element & text nodes | ☐ |
| Lists adopt markers & children | ☐ |
| When branches SSR-render fully | ☐ |
| Conditional element reuse functions | ☐ |
| Reactive text updates post-hydration | ☐ |
| No breaking changes to existing API | ☐ |
| README SSR section added | ☐ |
| Tests cover major paths | ☐ |

---

## 19. Pseudocode Highlights

### 19.1 Element Factory (Hydration Adapt)
```ts
function createElementFactory(tag, ...mods) {
  return (parent, index) => {
    if (isHydrating()) {
      const existing = claimChild(parent, "element", tag);
      const el = existing ?? nodeFactory.createElement(tag);
      applyModifiers(el, mods, index);
      return el;
    }
    const el = nodeFactory.createElement(tag);
    applyModifiers(el, mods, index);
    return el;
  };
}
```

### 19.2 Primitive Text Node (Modifier)
```ts
if (isPrimitive(value)) {
  if (isHydrating()) {
    const existing = claimChild(parent, "text");
    if (existing && existing.nodeType === 3) {
      if (existing.textContent !== String(value)) existing.textContent = String(value);
      return existing;
    }
  }
  return nodeFactory.createText(String(value));
}
```

### 19.3 SSR Render
```ts
export function renderToString(view, options) {
  setRuntimeMode("ssr");
  const root = nodeFactory.createElement(options?.wrapperTag ?? "div");
  const fn = normalizeView(view); // unify NodeMod vs NodeModFn
  fn(root, 0);
  return serializeChildren(root);
}
```

---

## 20. Documentation (README Addendum Outline)

- New Section: “SSR & Hydration”
  - `renderToString`
  - `hydrate`
  - Purity requirements
  - Example end-to-end
  - Limitations (no keyed hydration yet)

---

## 21. Open Questions (to Resolve Before Coding)

1. Do we need debug attributes (e.g., `data-vc-i`) in initial MVP? (Proposed: NO.)
2. Should `hydrate()` accept an options object for strict mismatch mode? (Defer.)
3. Should SSR strip whitespace between markers? (Keep current behavior—no extra formatting.)

---

## 22. Implementation Milestone Mapping

| Milestone | Branch Recommendation | Scope |
|-----------|-----------------------|-------|
| M1 | feat/ssr-mode | runtimeContext + adapter |
| M2 | feat/ssr-serialize | virtual nodes + serialize + base renderToString |
| M3 | feat/ssr-elements | Adapter integration across core creation sites |
| M4 | feat/ssr-structural | SSR list & when full rendering |
| M5 | feat/hydration-core | hydration cursor + element/text reuse |
| M6 | feat/hydration-structural | list & when adoption |
| M7 | feat/hydration-conditional | conditional element hydration |
| M8 | feat/hydration-reactive | reactive reuse & tests |
| M9 | feat/ssr-docs-tests | README + final test suite |

---

## 23. Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hidden DOM mismatches silently ignored | Subtle bugs | Add console.warn in hydrate mismatch cases (gated by flag) |
| Performance overhead in hot paths | Slower renders | Adapter designed as minimal pass-through (branch predicted) |
| Over-claiming nodes (index drift) | Broken structure | Strict sequencing & no index increment on attribute-only mods |
| Reactive nodes double registration | Memory growth | Ensure reuse path checks & cleans old maps if needed |

---

## 24. Conclusion

This plan provides a low-intrusion pathway to add SSR + hydration, aligning runtime behaviors across environments while preserving existing APIs. It emphasizes deterministic output, predictable hydration by index, and extensibility for future keyed or debug capabilities.

Proceed with Milestone M1 once approved.

---