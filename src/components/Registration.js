import React from "react";
import { Link } from "react-router-dom";
import axios from "../../axios";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            email: "",
            password: "",
            error: undefined,
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    handleSubmit() {
        axios
            .post("/signup", { ...this.state })
            .then(() => {
                this.setState({ error: undefined });
                return location.replace("/");
            })
            .catch(() =>
                this.setState({
                    error: "Oops, something went wrong",
                })
            );
    }
    keyCheck(e) {
        if (e.key == "Enter") {
            e.preventDefault();
            this.handleSubmit();
        }
    }
    render() {
        return (
            <>
                <div className="registration">
                    {this.state.error && (
                        <p className="error">{this.state.error}</p>
                    )}
                    <input
                        onKeyDown={(e) => this.keyCheck(e)}
                        name="first"
                        type="text"
                        placeholder="First Name"
                        onChange={(e) => this.handleChange(e)}
                        required
                    />
                    <input
                        onKeyDown={(e) => this.keyCheck(e)}
                        name="last"
                        type="text"
                        placeholder="Last Name"
                        onChange={(e) => this.handleChange(e)}
                        required
                    />
                    <input
                        onKeyDown={(e) => this.keyCheck(e)}
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={(e) => this.handleChange(e)}
                        required
                    />
                    <input
                        onKeyDown={(e) => this.keyCheck(e)}
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => this.handleChange(e)}
                        required
                    />
                    <button className="btn" onClick={() => this.handleSubmit()}>
                        Register
                    </button>
                </div>
                <p className="registration__login-link">
                    Already a member? <Link to="/login">Log In</Link>
                </p>
            </>
        );
    }
}
