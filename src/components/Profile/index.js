import React from "react";
import ProfilePic from "./ProfilePic";
import BioEditor from "./BioEditor";
import { useHistory } from "react-router-dom";

const Profile = ({ toggleModal, first, last, image, bio, setBio, picSize }) => {
    const history = useHistory();

    return (
        <div className="profile__container">
            <div className="profile__image--container">
                <ProfilePic
                    first={first}
                    last={last}
                    image={image}
                    toggleModal={toggleModal}
                    size={picSize}
                />
                <p className="profile__image--update-btn" onClick={toggleModal}>
                    Update Profile Image
                </p>
            </div>
            <div className="profile__details--container">
                <h1>{`${first} ${last}`}</h1>
                <p className="profile__bio--text">
                    {bio || "No bio available."}
                </p>
                <BioEditor setBio={setBio} bio={bio} />
                <p className="btn go-back" onClick={() => history.go(-2)}>
                    Go Back
                </p>
            </div>
        </div>
    );
};

export default Profile;
