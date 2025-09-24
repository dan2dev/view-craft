import "./style.css";
import "view-craft";

let someMessage = "Hello, world!";

// (() => {
//   console.log("ok1");
//   // id("app-title").onClick;
// })();

// const cn = ()
let data: {
  color: "green" | "blue";
} = { color: "green" };

const items = [
  { id: 1, name: "Item 1", price: 10 },
  { id: 2, name: "Item 2", price: 20 },
  { id: 3, name: "Item 3", price: 30 },
];

const app1 = div(
  someMessage,
  "this is another string",
  h1("View Craft Basic Example"),
  div("This is a simple example of using View Craft to create DOM elements."),
  button("sort",(e) => {
    e.addEventListener?.("click", (_e) => {
      items.sort((a, b) => a.price - b.price);
      refreshDynamicLists();
    });
    // console.log("--", e);
  }),
  button("push",(e) => {
    e.addEventListener?.("click", (_e) => {
      items.push({ id: items.length + 1, name: `Item ${items.length + 1}`, price: items.length * 10 });
      refreshDynamicLists();
    });
    // console.log("--", e);
  }),
  button("insert in the beginning",(e) => {
    e.addEventListener?.("click", (_e) => {
      items.unshift({ id: items.length + 1, name: `Item ${items.length + 1}`, price: items.length * 10 });
      refreshDynamicLists();
    });
    // console.log("--", e);
  }),
  createDynamicListRenderer(items, (item) => div(item.name, "---", item.price, input())),
  button(
    // class({
    //   "small": true
    // }),
    // id("myButton"),
    {
      id: "myButton",
      className: () => data.color,
    },
    {
      style: () => ({
        color: "green",
        fontSize: data.color === "blue" ? "20px" : "40px",
        backgroundColor: data.color,
        padding: "10px 20px",
        borderRadius: "5px",
      }),
    },
    "Click me",
    (e) => {
      e.addEventListener?.("click", (e) => {
        data.color = data.color === "green" ? "blue" : "green";
        // console.log("Button clicked!");
        // document.body.dispatchEvent(new Event("update", { bubbles: true }));
        e.currentTarget?.dispatchEvent(new Event("update", { bubbles: true }));
      });
      // console.log("--", e);
    },
    // () => {
    //   someMessage = "Button Clicked!";
    //   alert(someMessage);
    // }
  ),
  "this is a test",
)(document.body, 0);
document.body.appendChild(app1 as Node);
document.body.addEventListener("update", () => {
  console.log("update!!!!!!");
});

// div("Hello, world!", { id: "main", virtual: true });
