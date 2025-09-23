import "./style.css";
import "view-craft";

let someMessage = "Hello, world!";

// (() => {
//   console.log("ok1");
//   // id("app-title").onClick;
// })();

// const cn = ()
let color: "red" | "blue" = "red";

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
    { id: "myButton", className: () => color },
    "Click me",
    (e) => {
      console.log("--", e);
    },
    // () => {
    //   someMessage = "Button Clicked!";
    //   alert(someMessage);
    // }
  ),
)(document.body, 0);
document.body.appendChild(app1 as Node);

// div("Hello, world!", { id: "main", virtual: true });
