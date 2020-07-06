import React from "react";
import Registration from "./Registration";
import Login from "./Login";
import { HashRouter, Route, Link } from "react-router-dom";

const Welcome = () => {
    return (
        <>
            <h1>Welcome to the Agency</h1>
            <img src="agency.png" alt="big logo" />
            <p>
                In social science, <strong>agency</strong> is defined as the
                capacity of individuals to act independently and to make their
                own free choices.
            </p>
            <HashRouter>
                <React.Fragment>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </React.Fragment>
            </HashRouter>
        </>
    );
};

export default Welcome;
