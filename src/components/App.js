import React from "react";
import axios from "../../axios";

import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";
import Logo from "./Logo";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
            image: "",
            first: "",
            last: "",
        };
        this.toggleModal = this.toggleModal.bind(this);
    }

    componentDidMount() {
        axios.get("/user").then((res) => {
            const { image, first, last } = res.data.user;
            this.setState({ image, first, last });
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

    render() {
        return (
            <div>
                <Logo />
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    image={this.state.image}
                    toggleModal={this.toggleModal}
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
