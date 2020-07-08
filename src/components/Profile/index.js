import React from "react";
import ProfilePic from "./ProfilePic";
import BioEditor from "./BioEditor";

const Profile = ({ toggleModal, first, last, image, bio, setBio }) => {
    return (
        <>
            <h1>
                <p>{`${first} ${last}`}</p>
            </h1>
            <ProfilePic
                first={first}
                last={last}
                image={image}
                toggleModal={toggleModal}
            />
            <BioEditor setBio={setBio} bio={bio} />
        </>
    );
};

export default Profile;
