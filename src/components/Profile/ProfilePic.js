import React from "react";

const ProfilePic = ({ toggleModal, first, last, image, size }) => {
    return (
        <div className="profile__pic--container" onClick={toggleModal}>
            <img
                className={"profile__pic--img " + size}
                src={image || "/default.png"}
                alt={`${first} ${last}`}
            />
        </div>
    );
};

export default ProfilePic;
