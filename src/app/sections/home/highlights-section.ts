import { highlights } from "../../content/highlights";

export function highlightSection() {
  const colors = [
    'var(--vc-accent-mint)',
    'var(--vc-accent-seafoam)',
    'var(--vc-accent-sky)',
    'var(--vc-accent-peach)'
  ];

  return section(
    { className: "grid gap-6 md:grid-cols-2" },
    ...highlights.map(({ title, description }, index) =>
      article(
        {
          className: "border-2 p-6 transition-all duration-300 cursor-default hover:scale-[1.03] hover:-translate-y-1",
          style: `
            background: var(--card-bg);
            border-color: ${colors[index % colors.length]};
            border-radius: var(--vc-radius-xl);
            box-shadow: var(--vc-shadow-1);
          `,
        },
        h3({
          className: "text-lg font-bold mb-2",
          style: `color: var(--vc-color-primary-strong); text-shadow: 0 1px 2px rgba(91, 165, 160, 0.1);`
        }, title),
        p({
          className: "text-sm leading-relaxed",
          style: "color: var(--text-secondary);"
        }, description),
      ),
    ),
  );
}
