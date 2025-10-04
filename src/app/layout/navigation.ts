import { routes } from "../routes";
import { themeToggle } from "../ui/theme-toggle";

export function navigation(getPath: () => string, onNavigate: (path: string) => void) {
  return nav(
    {
      className: "sticky top-0 z-50 border-b backdrop-blur transition-colors",
      style: "border-color: var(--nav-border); background-color: var(--nav-bg);",
    },
    div(
      { className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-4" },
      a(
        {
          href: "#overview",
          className: "flex items-center gap-3 text-lg font-semibold transition-all duration-200 cursor-pointer hover:scale-105",
          style: "color: var(--text-primary);",
        },
        on("click", (event) => {
          event.preventDefault();
          onNavigate("overview");
        }),
        img({
          src: "/view-craft/view-craft-logo-1.png",
          alt: "View-Craft Logo",
          className: "w-10 h-10 drop-shadow-lg",
          style: "filter: drop-shadow(0 2px 8px rgba(91, 165, 160, 0.3));",
        }),
        span("view-craft"),
      ),
      div(
        { className: "flex flex-wrap items-center gap-2" },
        themeToggle(),
        ...routes.map(({ path, label }) => {
          const activeClass = "transition-all duration-200 cursor-pointer px-5 py-2.5 text-sm font-semibold";
          const idleClass = "transition-all duration-200 cursor-pointer hover:scale-105 px-5 py-2.5 text-sm font-medium";
          const activeStyle = `
            background: var(--vc-grad-brand);
            color: var(--button-primary-text);
            border-radius: var(--vc-radius-lg);
            box-shadow: var(--vc-shadow-1), var(--vc-inner-hi), var(--vc-inner-sh);
          `;
          const idleStyle = `
            color: var(--text-secondary);
            background-color: transparent;
            border-radius: var(--vc-radius-lg);
          `;

          return a(
            {
              href: `#${path}`,
              className: () => (getPath() === path ? activeClass : idleClass),
              style: () => (getPath() === path ? activeStyle : idleStyle),
            },
            on("click", (event) => {
              event.preventDefault();
              onNavigate(path);
            }),
            label,
          );
        }),
        a({
          href: "https://github.com/dan2dev/view-craft",
          target: "_blank",
          rel: "noreferrer",
          className: "flex items-center gap-2 px-4 py-2 text-sm font-medium transition hover:scale-105",
          style: `
              color: var(--vc-color-primary-strong);
              border-radius: var(--vc-radius-md);
              background-color: transparent;
            `,
          title: "View on GitHub",
          innerHTML:
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
        }),
      ),
    ),
  );
}
