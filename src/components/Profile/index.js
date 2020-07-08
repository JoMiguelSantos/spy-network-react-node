import React from "react";
import ProfilePic from "./ProfilePic";
import BioEditor from "./BioEditor";

const Profile = ({ toggleModal, first, last, image, bio, setBio, picSize }) => {
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
                <BioEditor setBio={setBio} bio={bio} />
            </div>
        </div>
    );
};

export default Profile;
