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
        // axios
        //     .post("/signup", { ...this.state })
        //     .then((res) => {
        //         if (res.status === 201) {
        //             this.setState({ error: undefined });
        //             return location.replace("/");
        //         } else {
        //             return this.setState({
        //                 error: "Oops, something went wrong",
        //             });
        //         }
        //     })
        //     .catch(() =>
        //         this.setState({ error: "Oops, something went wrong" })
        //     );
    }
    render() {
        return (
            <div className="login">
                {this.error && <p>{this.error}</p>}
                <input
                    name="email"
                    type="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={this.handleSubmit}>Register</button>
                <p>
                    Not yet a member?
                    <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        );
    }
}
