import React from "react";

const ProfilePic = ({ toggleModal, first, last, image }) => {
    return (
        <div onClick={toggleModal}>
            <p>{`${first} ${last}`}</p>
            <img
                className="profile__img"
                src={image || "default.png"}
                alt={`${first} ${last}`}
            />
        </div>
    );
};

export default ProfilePic;
