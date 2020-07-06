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
        console.log("handleSubmit Login axios sent");

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
    render() {
        return (
            <div className="login">
                {this.state.error && (
                    <p className="error">{this.state.error}</p>
                )}
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => this.handleChange(e)}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => this.handleChange(e)}
                    required
                />
                <button onClick={() => this.handleSubmit()}>Log In</button>
                <p>
                    Not yet a member? <Link to="/">Sign Up</Link>
                </p>
                <p>
                    Forgot your password?{" "}
                    <Link to="/reset">Reset your password</Link>
                </p>
            </div>
        );
    }
}
