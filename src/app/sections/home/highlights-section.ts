import { highlights } from "../../content/highlights";

const icons = [
  '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>',
  '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
  '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>',
  '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>'
];

export function highlightSection() {
  return section(
    {
      className: "py-20 bg-vc-bg border-t border-vc-border",
    },
    div(
      {
        className: "container",
      },
      h2(
        {
          className: "text-center mb-4",
        },
        "Features: Why Why ViewCraft?"
      ),
      p(
        {
          className: "text-center text-vc-secondary mb-16 max-w-2xl mx-auto",
        },
        ""
      ),
      div(
        {
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        },
        ...highlights.map(({ title, description }, index) =>
          article(
            {
              className: "bg-white rounded-vc-card p-6 border border-vc-border hover:shadow-vc-card-hover transition-shadow",
            },
            div({
              className: "w-10 h-10 rounded-lg bg-vc-bg flex items-center justify-center text-vc-primary mb-4",
              innerHTML: icons[index % icons.length],
            }),
            h3({
              className: "text-base font-semibold mb-2 text-vc-primary",
            }, title),
            p({
              className: "text-sm text-vc-secondary leading-relaxed",
            }, description),
          ),
        ),
      ),
    ),
  );
}
