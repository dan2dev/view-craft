import "./style.css";
import "view-craft";

let someMessage = "Hello, world!";

// (() => {
//   console.log("ok1");
//   // id("app-title").onClick;
// })();

// const cn = ()
let data: {
  color: "green" | "blue" | "red";
} = { color: "green" };

let items = [
  { id: 1, name: "Item 1", price: 10 },
  { id: 2, name: "Item 2", price: 20 },
  { id: 3, name: "Item 3", price: 30 },
];

const app1 = div(
  h1("View Craft Basic Example"),
  div("This is a simple example of using View Craft to create DOM elements."),
  div(
    {
      style: {
        backgroundColor: "#F0F0F0",
      },
    },
    "color:",
    () => data.color,
  ),
  button(
    "sort",
    on("click", () => {
      items.sort((a, b) => a.price - b.price);
      update();
    }),
  ),
  button("sort", (e) => {
    e.addEventListener?.("click", (_e) => {
      items.sort((a, b) => a.price - b.price);
      update();
    });
    // console.log("--", e);
  }),
  // Example using the on() helper instead of manual addEventListener
  button(
    "push (using on helper)",
    on("click", (e) => {
      items.push({
        id: items.length + 1,
        name: `Item ${items.length + 1}`,
        price: items.length * 10,
      });
      update();
    }),
  ),
  button("insert in the beginning", (e) => {
    e.addEventListener?.("click", (_e) => {
      items.unshift({
        id: items.length + 1,
        name: `Item ${items.length + 1}`,
        price: items.length * 10,
      });
      update();
    });
    // console.log("--", e);
  }),
  button("reset", (e) => {
    e.addEventListener?.("click", (_e) => {
      items = [{ id: 1, name: "Item 1", price: 10 }];
      update();
    });
  }),

  button(
    // class({
    //   "small": true
    // }),
    // id("myButton"),
    {
      id: "myButton",
      style: () => ({
        // color: "green",
        backgroundColor: data.color, // camelCase CSS properties now work!
        padding: "10px 20px",
        // fontSize: data.color === "green" ? "40px" : "50px", // camelCase
        // "font-size": data.color === "blue" ? "40px" : "40px", // kebab-case also works
        borderRadius: "5px", // camelCase instead of "border-radius"
      }),
    },
    {},
    "Click me",
    (e) => {
      e.addEventListener?.("click", (e) => {
        if (data.color === "red") {
          data.color = "green";
        } else if (data.color === "green") {
          data.color = "blue";
        } else if (data.color === "blue") {
          data.color = "red";
        }
        // data.color = data.color === "green" ? "blue" : "green";
        // console.log("Button clicked!");
        // document.body.dispatchEvent(new Event("update", { bubbles: true }));
        // e.currentTarget?.dispatchEvent(new Event("update", { bubbles: true }));
        update();
      });
      // console.log("--", e);
    },
    // () => {
    //   someMessage = "Button Clicked!";
    //   alert(someMessage);
    // }
  ),
  div(
    {
      style: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        padding: "20px",
        boxSizing: "border-box",
      },
    },
    div(),
    div(
      // () => items.length >= 2,
      when(
        () => false,
        list(
          () => items,
          (item) =>
            div(
              {
                style: {
                  backgroundColor: "red",
                },
              },
              item.name,
              "---",
              item.price,
              input(),
              () => data.color,
              button("delete", (e) => {
                e.addEventListener?.("click", (_e) => {
                  items.splice(
                    items.findIndex((i) => i.id === item.id),
                    1,
                  );
                  update();
                });
              }),
            ),
        ),
      ).else(
        list(
          () => items,
          (item) =>
            div(
              item.name,
              "---",
              item.price,
              input(),
              () => data.color,
              div(
                {
                  style: {
                    color: "red",
                    backgroundColor: "#FFF",
                  },
                },
                list(
                  () => items,
                  (tag) => div("--", tag.name),
                ),
              ),
              button("delete", (e) => {
                e.addEventListener?.("click", (_e) => {
                  items.splice(
                    items.findIndex((i) => i.id === item.id),
                    1,
                  );
                  update();
                });
              }),
            ),
        ),
      ),
    ),
  ),
  div(
    "----",
    () => Boolean(data.color === "green"),
    "this will show only when data.color === green",
    { className: "green" },
    div("----", () => {
      console.log("output test"); // this should output only once but is output twice
      // return "ok: " + data.color + "!";
      return "ok: ";
    }),
  ),
  when(
    () => data.color === "green",
    h1("this will show only when data.color === green", { className: "green" }),
    h2("this also will show only when data.color === green", {
      className: "green",
    }),
    p("this also will show only when data.color === green", {
      className: "green",
    }),
  )
    .when(
      () => data.color === "blue",
      h1("this will show only when data.color === blue", { className: "blue" }),
      h2("also this will show only when data.color === blue", {
        className: "blue",
      }),
    )
    .else(
      h1("this will show only when data.color !== green && data.color !== blue"),
      h2("this will show only when data.color !== green && data.color !== blue"),
    ),

  "this is a test",
)(document.body, 0);
document.body.appendChild(app1 as Node);
// document.body.addEventListener("update", () => {
//   console.log("update!!!!!!");
// });

// div("Hello, world!", { id: "main", virtual: true });
