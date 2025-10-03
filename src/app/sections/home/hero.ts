export function heroSection(navigate: (path: string) => void) {
  const makeHandler = (path: string) =>
    on("click", (event: Event) => {
      event.preventDefault();
      navigate(path);
    });

  return header(
    {
      className: "relative isolate overflow-hidden px-6 py-24 sm:py-32 transition-colors",
      style: "background: linear-gradient(to bottom right, var(--bg-secondary), var(--bg-primary));",
    },
    div(
      { className: "mx-auto flex max-w-4xl flex-col items-center gap-6 text-center" },
      span(
        {
          className: "rounded-full border px-4 py-1 text-sm",
          style: "background-color: var(--badge-bg); color: var(--badge-text); border-color: var(--badge-border);",
        },
        "view-craft · DOM-first UI library",
      ),
      h1(
        { className: "text-4xl font-semibold tracking-tight sm:text-6xl", style: "color: var(--text-primary);" },
        "Finally, a framework that ",
        span({ className: "text-emerald-400" }, "doesn't update behind your back"),
      ),
      p(
        { className: "max-w-2xl text-base sm:text-lg", style: "color: var(--text-secondary);" },
        "Mutate state, call ",
        code(
          { className: "rounded px-2 py-1", style: "background-color: var(--bg-tertiary); color: var(--emerald-secondary);" },
          "update()",
        ),
        ", and ship. No virtual DOM, no build-time wizardry, just vibes and vanilla browser APIs with a productivity twist.",
      ),
      div(
        { className: "flex flex-wrap items-center justify-center gap-4" },
        a(
          {
            className:
              "rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg transition-all duration-200 hover:shadow-xl cursor-pointer hover:scale-105",
            style:
              "background-color: var(--button-primary-bg); color: var(--button-primary-text); box-shadow: 0 10px 25px -5px var(--card-hover-shadow);",
            href: "#overview",
          },
          makeHandler("overview"),
          "Overview",
        ),
        a(
          {
            className:
              "rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer hover:scale-105",
            style:
              "background-color: var(--button-secondary-bg); border-color: var(--button-secondary-border); color: var(--button-secondary-text);",
            href: "#api",
          },
          makeHandler("api"),
          "API reference",
        ),
        a(
          {
            className:
              "rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer hover:scale-105",
            style:
              "background-color: var(--button-secondary-bg); border-color: var(--button-secondary-border); color: var(--button-secondary-text);",
            href: "#examples",
          },
          makeHandler("examples"),
          "Examples",
        ),
      ),
    ),
  );
}
