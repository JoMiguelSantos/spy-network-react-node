import React from "react";
import axios from "../../axios";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { image: "", first: "", last: "", bio: "" };
    }

    componentDidMount() {
        const {
            match: { params },
        } = this.props;

        if (this.props.currentUserId === params.userId) {
            this.props.history.push("/");
        }
        axios.get(`/api/user/${params.userId}`).then((res) => {
            const { image, first, last, bio } = res.data.user;
            this.setState({ image, first, last, bio });
        });
    }

    render() {
        return (
            <>
                <div className="other profile__pic--container">
                    <img
                        className="other profile__pic--img medium"
                        src={this.state.image || "default.png"}
                        alt={`${this.state.first} ${this.state.last}`}
                    />
                </div>
                <div className="other profile__details--container">
                    <h1>{`${this.state.first} ${this.state.last}`}</h1>
                    <p className="other profile__bio--text">{this.state.bio}</p>
                </div>
            </>
        );
    }
}
