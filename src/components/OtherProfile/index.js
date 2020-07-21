import React from "react";
import axios from "../../../axios";
import FriendButton from "./FriendButton";
import { connect } from "react-redux";
import { socket } from "../../socket";
import Chat from "../Chat";
import { getAllfriends } from "../../store/actions";

class OtherProfile extends React.Component {
    constructor(props) {
        super(props);

        this._isMounted = false;
        this.state = {
            image: "",
            first: "",
            last: "",
            bio: "",
            mounted: false,
            id: "",
            privateMessages: [],
            isChatOpen: false,
        };
    }

    componentDidMount() {
        const {
            match: { params },
        } = this.props;

        if (this.props.currentUserId == params.id) {
            this.props.history.push("/");
        }

        this._isMounted = true;
        axios.get(`/api/user/${params.id}`).then((res) => {
            const { image, first, last, bio, id } = res.data.user;
            if (this._isMounted) {
                this.setState({ image, first, last, bio, id });
            }
        });
        if (!this.props.accepted_friends) {
            this.props.getFriendsList();
        }
        socket.on("privateChat", (msgs) => {
            const reversedMsgs = [...msgs].reverse();
            const formattedMsgs = reversedMsgs.map((message) => {
                return {
                    ...message,
                    created_at: new Date(message.created_at).toUTCString(),
                };
            });
            this.setState({ privateMessages: formattedMsgs });
        });
        socket.on("newPrivateChatMessage", (msg) =>
            this.setState({
                privateMessages: this.state.privateMessages.concat({
                    ...msg,
                    created_at: new Date(msg.created_at).toUTCString(),
                }),
            })
        );
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    isFriend() {
        const acceptedFriendsIds =
            this.props.accepted_friends &&
            this.props.accepted_friends.map((friend) => friend.id);
        if (acceptedFriendsIds && acceptedFriendsIds.includes(this.state.id)) {
            return true;
        }
        return false;
    }

    clickHandler() {
        socket.emit("privateChat", { friend_id: this.state.id });
        this.setState({ isChatOpen: !this.state.isChatOpen });
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
                        {this.isFriend() && (
                            <button
                                className="chat-btn btn"
                                onClick={() => this.clickHandler()}
                            >
                                {this.state.isChatOpen
                                    ? "Close Chat"
                                    : "Open Chat"}
                            </button>
                        )}
                    </div>
                </div>
                <div className="other profile__details--container">
                    <h1>{`${this.state.first} ${this.state.last}`}</h1>
                    <p className="other profile__bio--text">
                        {this.state.bio || "This user has no bio yet."}
                    </p>
                    {this.state.isChatOpen && (
                        <Chat
                            isPrivate={true}
                            friend_id={this.props.match.params.id}
                            privateMessages={this.state.privateMessages}
                        />
                    )}
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

const mapStateToProps = (state) => ({
    accepted_friends:
        state.friends && state.friends.filter((friend) => friend.accepted),
});

const mapDispatchToProps = (dispatch) => {
    return {
        getFriendsList: () => dispatch(getAllfriends()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherProfile);
