import React from "react";
import Registration from "./Registration";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import { HashRouter, Route } from "react-router-dom";

const Welcome = () => {
    return (
        <>
            <h1 class="welcome__title">Welcome to the Agency</h1>
            <div class="welcome__logo--container">
                <img
                    className="welcome__logo"
                    src="/agency.png"
                    alt="large logo"
                />
            </div>
            <p className="welcome__text">
                “I’ve been a spy for almost all of my adult life – I don’t like
                being in the spotlight.” –{" "}
                <span className="welcome__text--author">Edward Snowden</span>
            </p>
            <HashRouter>
                <React.Fragment>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={ResetPassword} />
                </React.Fragment>
            </HashRouter>
        </>
    );
};

export default Welcome;
