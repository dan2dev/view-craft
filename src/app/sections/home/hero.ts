export function heroSection(navigate: (path: string) => void) {
  const makeHandler = (path: string) =>
    on("click", (event: Event) => {
      event.preventDefault();
      navigate(path);
    });

  return header(
    {
      className: "pt-20 pb-24 bg-white",
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
          src: '/view-craft/view-craft-logo.png',
          alt: 'ViewCraft Robot',
          className: "w-32 h-32 md:w-40 md:h-40",
        })
      ),
      h1(
        {
          className: "mb-6 text-vc-primary max-w-3xl mx-auto",
        },
        "The Composability Framework for Next-Gen Web Editors"
      ),
      p(
        {
          className: "text-lg text-vc-secondary mb-10 max-w-2xl mx-auto",
        },
        "Stop building headaches, build ViewCraft dev-ship foundation. You trust a platform, high performance, type-safety and it feels just… fun. "
      ),
      div(
        {
          className: "flex flex-wrap gap-3 justify-center items-center mb-8",
        },
        a(
          {
            href: "#api",
            className: "btn-primary",
          },
          makeHandler("api"),
          "Start Building Now",
        ),
        a(
          {
            href: "#examples",
            className: "btn-secondary",
          },
          makeHandler("examples"),
          "Learn what is great [↗]",
        ),
      ),
      div(
        {
          className: "inline-block bg-vc-primary text-white text-xs px-3 py-1.5 rounded-full font-mono",
        },
        "import { ViewCraftApp } from './examples/editor'"
      )
    ),
  );
}
