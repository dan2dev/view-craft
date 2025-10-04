export function heroSection(navigate: (path: string) => void) {
  const makeHandler = (path: string) =>
    on("click", (event: Event) => {
      event.preventDefault();
      navigate(path);
    });

  return header(
    {
      className: "pt-20 pb-24 bg-vc-hero-bg",
    },
    div(
      {
        className: "container max-w-4xl text-center",
      },
      div(
        {
          className: "mb-12 flex justify-center",
        },
        img({
          src: '/view-craft/view-craft-logo-3.png',
          alt: 'ViewCraft Robot',
          className: "w-32 h-32 md:w-40 md:h-40",
        })
      ),
      h1(
        {
          className: "mb-6 text-vc-primary max-w-3xl mx-auto",
        },
        "A lightweight reactive DOM library for developers who prefer control"
      ),
      p(
        {
          className: "text-lg text-vc-secondary mb-10 max-w-2xl mx-auto",
        },
        "ViewCraft keeps the DOM within reach: import once, compose real elements with readable helpers, mutate state with plain objects, then call update() when you want changes on screen. No virtual layers, no unwelcome surprises."
      ),
      div(
        {
          className: "flex flex-wrap gap-3 justify-center items-center mb-8",
        },
        a(
          {
            href: "#get-started",
            className: "btn-primary",
          },
          makeHandler("get-started"),
          "Get Started",
        ),
        a(
          {
            href: "#examples",
            className: "btn-secondary",
          },
          makeHandler("examples"),
          "See Examples",
        ),
      ),
      div(
        {
          className: "inline-block bg-vc-primary text-vc-text-inverse text-xs px-3 py-1.5 rounded-full font-mono",
        },
        "npm install view-craft"
      )
    ),
  );
}
