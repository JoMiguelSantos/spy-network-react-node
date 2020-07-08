import React from "react";
import axios from "../../axios";

import Uploader from "./Uploader";
import Logo from "./Logo";
import Profile from "./Profile";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
            image: "",
            first: "",
            last: "",
            bio: "",
        };
        this.toggleModal = this.toggleModal.bind(this);
    }

    componentDidMount() {
        axios.get("/user").then((res) => {
            const { image, first, last, bio } = res.data.user;
            this.setState({ image, first, last, bio });
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
            <div>
                <Logo />
                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    image={this.state.image}
                    bio={this.state.bio}
                    toggleModal={this.toggleModal}
                    setBio={(newBio) => this.setBio(newBio)}
                />
                <p onClick={this.toggleModal}>Update Profile Image</p>
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
