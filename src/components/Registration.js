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
        console.log("handleSubmit");

        axios
            .post("/signup", { ...this.state })
            .then((res) => {
                console.log("handleSubmit res", res);
                if (res.status === 201) {
                    this.setState({ error: undefined });
                    return location.replace("/");
                } else {
                    return this.setState({
                        error: "Oops, something went wrong",
                    });
                }
            })
            .catch(() =>
                this.setState({ error: "Oops, something went wrong" })
            );
    }
    render() {
        return (
            <div className="registration">
                {this.error && <p>{this.error}</p>}
                <input
                    name="first"
                    placeholder="First Name"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="last"
                    placeholder="Last Name"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={() => this.handleSubmit()}>Register</button>
                <p>
                    Already a member?
                    <Link to="/login">Log In</Link>
                </p>
            </div>
        );
    }
}
