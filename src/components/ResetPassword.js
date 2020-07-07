import React from "react";
import { Link } from "react-router-dom";
import axios from "../../axios";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            code: "",
            submitEmail: true,
            submitCode: false,
            success: false,
            error: undefined,
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    handleSubmit() {
        if (this.state.submitEmail) {
            return axios
                .post("/password/reset/start", { email: this.state.email })
                .then(() => {
                    this.setState({ submitEmail: false, submitCode: true });
                })
                .catch(() => {
                    return this.setState({
                        error:
                            "Oops, something went wrong. Please check if the email you provided is correct.",
                    });
                });
        } else if (this.state.submitCode) {
            return axios
                .post("/password/reset/verify", {
                    email: this.state.email,
                    code: this.state.code,
                    password: this.state.password,
                })
                .then(() => {
                    this.setState({ success: true, submitCode: false });
                })
                .catch((err) => {
                    if (err.response.status === 404) {
                        return this.setState({
                            error:
                                "The code you've provided is no longer valid or incorrect. Please check the code and resubmit your request or ask for another email to be sent.",
                        });
                    } else {
                        return this.setState({
                            error: "Oops, something went wrong",
                        });
                    }
                });
        }
    }
    render() {
        return (
            <div className="login">
                {this.state.error && (
                    <p className="error">{this.state.error}</p>
                )}
                {this.state.submitEmail && (
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={(e) => this.handleChange(e)}
                        required
                    />
                )}
                {this.state.submitCode && (
                    <div>
                        <h3>
                            A code was sent to your email. Please enter it
                            bellow and define your new password.
                        </h3>
                        <input
                            name="code"
                            type="text"
                            placeholder="Code"
                            onChange={(e) => this.handleChange(e)}
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="New Password"
                            onChange={(e) => this.handleChange(e)}
                            required
                        />
                    </div>
                )}
                {this.state.success ? (
                    <h3>
                        Password Updated. Please <Link to="/login">Log In</Link>
                    </h3>
                ) : (
                    <button onClick={() => this.handleSubmit()}>Submit</button>
                )}{" "}
                <p>
                    Not yet a member? <Link to="/">Sign Up</Link>
                </p>
            </div>
        );
    }
}
