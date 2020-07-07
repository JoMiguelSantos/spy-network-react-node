import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./components/Welcome";
import App from "./components/App";

let elem;

if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <App />;
}

ReactDOM.render(elem, document.querySelector("main"));
