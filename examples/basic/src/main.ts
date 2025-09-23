import "./style.css";
import "view-craft";

let someMessage = "Hello, world!";

// (() => {
//   console.log("ok1");
//   // id("app-title").onClick;
// })();

// const cn = ()
let data: {
  color: "red" | "blue";
} = { color: "red" };

const app1 = div(
  someMessage,
  "this is another string",
  h1("View Craft Basic Example"),
  div("This is a simple example of using View Craft to create DOM elements."),
  button(
    // class({
    //   "small": true
    // }),
    // id("myButton"),
    { id: "myButton", className: () => data.color },
    {
      style: () => ({
        color: "white",
        fontSize: data.color === "red" ? "16px" : "20px",
        backgroundColor: data.color,
        padding: "10px",
        borderRadius: "5px",
      }),
    },
    "Click me",
    (e) => {
      e.addEventListener?.("click", (e) => {
        data.color = data.color === "red" ? "blue" : "red";
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
)(document.body, 0);
document.body.appendChild(app1 as Node);
document.body.addEventListener("update", () => {
  console.log("update!!!!!!");
});

// div("Hello, world!", { id: "main", virtual: true });
