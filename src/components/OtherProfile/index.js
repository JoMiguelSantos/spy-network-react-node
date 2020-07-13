import React from "react";
import axios from "../../../axios";
import FriendButton from "./FriendButton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { image: "", first: "", last: "", bio: "" };
    }

    componentDidMount() {
        const {
            match: { params },
        } = this.props;

        if (this.props.currentUserId == params.id) {
            this.props.history.push("/");
        }
        axios.get(`/api/user/${params.id}`).then((res) => {
            const { image, first, last, bio } = res.data.user;
            this.setState({ image, first, last, bio });
        });
    }

    render() {
        return (
            <div className="other profile__container">
                <div className="profile__image--container">
                    <div className="other profile__pic--container">
                        <img
                            className="other profile__pic--img medium"
                            src={this.state.image || "/default.png"}
                            alt={`${this.state.first} ${this.state.last}`}
                        />
                        <FriendButton
                            id={this.props.match.params.id}
                            currentUserId={this.props.currentUserId}
                        />
                    </div>
                </div>
                <div className="other profile__details--container">
                    <h1>{`${this.state.first} ${this.state.last}`}</h1>
                    <p className="other profile__bio--text">
                        {this.state.bio || "This user has no bio yet."}
                    </p>
                </div>
                <p
                    className="btn go-back"
                    onClick={() => this.props.history.goBack()}
                >
                    Go Back
                </p>
            </div>
        );
    }
}
