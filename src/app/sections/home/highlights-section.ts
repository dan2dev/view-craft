import { highlights } from "../../content/highlights";

export function highlightSection() {
  return section(
    { className: "grid gap-6 md:grid-cols-2" },
    ...highlights.map(({ title, description }) =>
      article(
        {
          className:
            "rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:shadow-xl cursor-default hover:scale-[1.02]",
          style: "background: var(--card-bg); border-color: var(--card-border);",
        },
        h3({ className: "text-lg font-semibold", style: "color: var(--emerald-secondary);" }, title),
        p({ className: "mt-2 text-sm leading-relaxed", style: "color: var(--text-secondary);" }, description),
      ),
    ),
  );
}
