import React from "react";

const Logo = () => {
    return (
        <div className="logo">
            <a href="/">
                <img className="logo__img" src="/agency.png" />
            </a>
            <a href="/">
                <p className="logo__text">The Agency</p>
            </a>
        </div>
    );
};

export default Logo;
