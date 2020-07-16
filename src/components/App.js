import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import axios from "../../axios";

import Uploader from "./Uploader";
import Logo from "./Logo";
import Profile from "./Profile";
import OtherProfile from "./OtherProfile";
import ProfilePic from "./Profile/ProfilePic";
import FindPeople from "./FindPeople";
import Friends from "./Friends";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
            image: "",
            first: "",
            last: "",
            bio: "",
            id: "",
        };
        this.toggleModal = this.toggleModal.bind(this);
    }

    componentDidMount() {
        axios.get("/user").then((res) => {
            const { image, first, last, bio, id } = res.data.user;
            this.setState({ image, first, last, bio, id });
        });
    }

    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    setImage(newProfilePic) {
        this.setState({
            image: newProfilePic,
            uploaderIsVisible: false,
        });
    }

    setBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    render() {
        return (
            <div className="app__container">
                <header>
                    <Logo />
                    <a href="/users">Find more Spies</a>
                    <a href="/friends">Friendships</a>
                    <a href="/logout">Log Out</a>
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        image={this.state.image}
                        toggleModal={this.toggleModal}
                        size="small"
                    />
                </header>
                {!this.state.uploaderIsVisible && (
                    <BrowserRouter>
                        <div>
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <Profile
                                        first={this.state.first}
                                        last={this.state.last}
                                        image={this.state.image}
                                        bio={this.state.bio}
                                        toggleModal={this.toggleModal}
                                        setBio={(newBio) => this.setBio(newBio)}
                                        picSize="medium"
                                    />
                                )}
                            />
                            <Route
                                path="/user/:id"
                                component={(props) => (
                                    <OtherProfile
                                        currentUserId={this.state.id}
                                        match={props.match}
                                        history={props.history}
                                    />
                                )}
                            />
                            <Route path="/users" component={FindPeople} />
                            <Route path="/friends" component={Friends} />
                        </div>
                    </BrowserRouter>
                )}
                {this.state.uploaderIsVisible && (
                    <Uploader
                        setImage={() => this.setImage()}
                        closeModal={this.toggleModal}
                    />
                )}
            </div>
        );
    }
}
