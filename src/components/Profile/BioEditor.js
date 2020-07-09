import React from "react";
import axios from "../../../axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            loading: false,
            error: "",
            draftBio: "",
        };
    }

    handleClick() {
        this.setState({ isVisible: !this.state.isVisible });
    }

    handleChange(e) {
        this.setState({ draftBio: e.target.value });
    }

    handleSubmit() {
        this.setState({ loading: true });
        axios
            .post("/bio", { bio: this.state.draftBio })
            .then((res) => {
                this.props.setBio(res.data.user.bio);
                this.setState({
                    isVisible: false,
                    loading: false,
                    draftBio: "",
                    error: "",
                });
            })
            .catch(() => {
                this.setState({
                    error:
                        "Something went wrong, please resubmit your request,",
                    loading: false,
                });
            });
    }

    render() {
        return (
            <div>
                {!this.state.isVisible && (
                    <p
                        className="profile__bio--change-btn btn"
                        onClick={() => this.handleClick()}
                    >
                        {this.props.bio ? "Edit Bio" : "Add Bio"}
                    </p>
                )}
                {this.state.error && (
                    <p className="error">{this.state.error}</p>
                )}
                {this.state.isVisible && (
                    <div className="profile__bio--update">
                        <textarea
                            className="profile__bio--textarea"
                            onChange={(e) => this.handleChange(e)}
                            cols="40"
                            rows="10"
                            value={this.state.draftBio || this.props.bio}
                            required
                        />
                        <div className="profile__bio--update-btns">
                            <button
                                className="btn"
                                onClick={() => this.handleSubmit()}
                            >
                                Save
                            </button>
                            <button
                                className="btn"
                                onClick={() => this.handleClick()}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
