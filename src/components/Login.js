import React from "react";
import { Link } from "react-router-dom";
import axios from "../../axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        if (!this.state.password || !this.state.email) {
            return this.setState({
                error: "Please fill in both email and password fiels.",
            });
        }
        axios
            .post("/login", { ...this.state })
            .then(() => {
                this.setState({ error: undefined });
                return location.replace("/");
            })
            .catch((err) => {
                if (err.response.status === 404) {
                    return this.setState({
                        error:
                            "The user and/or password you've entered is not correct. Please check and resubmit your credentials.",
                    });
                } else {
                    return this.setState({
                        error: "Oops, something went wrong",
                    });
                }
            });
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
                {this.state.error && (
                    <p className="error">{this.state.error}</p>
                )}
                <div className="login">
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
                        Log In
                    </button>
                </div>
                <p className="login__signup-link">
                    Not yet a member? <Link to="/">Sign Up</Link>
                </p>
                <p className="login__reset-password">
                    Forgot your password?{" "}
                    <Link to="/reset">Reset your password</Link>
                </p>
            </>
        );
    }
}
