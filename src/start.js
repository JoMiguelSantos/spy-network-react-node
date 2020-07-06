import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./components/Welcome";
import Homepage from "./components/Homepage";

let elem;

if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <Homepage />;
}

ReactDOM.render(elem, document.querySelector("main"));
