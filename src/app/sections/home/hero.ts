export function heroSection(navigate: (path: string) => void) {
  const makeHandler = (path: string) =>
    on("click", (event: Event) => {
      event.preventDefault();
      navigate(path);
    });

  return header(
    {
      className: "relative isolate overflow-hidden px-6 py-24 sm:py-32 transition-colors",
      style: "background: var(--vc-grad-panel);",
    },
    div(
      { className: "mx-auto flex max-w-4xl flex-col items-center gap-6 text-center" },
      div(
        {
          className: "relative mb-4 transition-transform duration-300 hover:scale-110",
          style: "animation: float 3s ease-in-out infinite;"
        },
        img({
          src: '/view-craft/view-craft-logo.png',
          alt: 'View-Craft Cyclops Robot',
          className: 'w-32 h-32 drop-shadow-2xl',
          style: `
            filter: drop-shadow(0 10px 30px rgba(91, 165, 160, 0.4));
          `
        })
      ),
      span(
        {
          className: "border px-5 py-2 text-sm font-semibold",
          style: `
            background: var(--vc-grad-accent);
            color: var(--vc-ink);
            border-color: var(--vc-accent-teal);
            border-radius: 999px;
            box-shadow: var(--vc-shadow-1), var(--vc-inner-hi), var(--vc-inner-sh);
          `,
        },
        "view-craft · DOM-first UI library",
      ),
      h1(
        { className: "font-semibold tracking-tight", style: "color: var(--text-primary);" },
        "Finally, a framework that ",
        span({ style: "color: var(--vc-color-primary-strong);" }, "doesn't update behind your back"),
      ),
      p(
        { className: "max-w-2xl text-base sm:text-lg", style: "color: var(--text-secondary);" },
        "Mutate state, call ",
        code(
          {
            className: "px-2 py-1 font-mono text-sm",
            style: `
              background-color: var(--vc-elev-1);
              color: var(--vc-color-primary-strong);
              border-radius: var(--vc-radius-sm);
              box-shadow: var(--vc-inner-hi), var(--vc-inner-sh);
            `,
          },
          "update()",
        ),
        ", and ship. No virtual DOM, no build-time wizardry, just vibes and vanilla browser APIs with a productivity twist.",
      ),
      div(
        { className: "flex flex-wrap items-center justify-center gap-4 mt-2" },
        a(
          {
            className: "px-6 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer hover:scale-105",
            style: `
              background: var(--vc-grad-brand);
              color: var(--button-primary-text);
              border-radius: var(--vc-radius-md);
              box-shadow: var(--vc-shadow-1), var(--vc-inner-hi), var(--vc-inner-sh);
            `,
            href: "#overview",
          },
          makeHandler("overview"),
          "Overview",
        ),
        a(
          {
            className: "px-6 py-3 text-sm font-semibold border-2 transition-all duration-200 cursor-pointer hover:scale-105",
            style: `
              background-color: var(--button-secondary-bg);
              border-color: var(--button-secondary-border);
              color: var(--button-secondary-text);
              border-radius: var(--vc-radius-md);
              box-shadow: var(--vc-inner-hi), var(--vc-inner-sh);
            `,
            href: "#api",
          },
          makeHandler("api"),
          "API reference",
        ),
        a(
          {
            className: "px-6 py-3 text-sm font-semibold border transition-all duration-200 cursor-pointer hover:scale-105",
            style: `
              background-color: transparent;
              border-color: color-mix(in oklab, var(--vc-color-primary) 50%, white);
              color: var(--vc-color-primary-strong);
              border-radius: var(--vc-radius-md);
            `,
            href: "#examples",
          },
          makeHandler("examples"),
          "Examples",
        ),
      ),
    ),
  );
}
