import React from "react";
import ProfilePic from "./ProfilePic";
import BioEditor from "./BioEditor";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../store/actions";

const Profile = ({
    toggleModal,
    first,
    last,
    image,
    bio,
    setBio,
    picSize,
    id,
}) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const deleteHandler = async () => {
        await dispatch(deleteUser(id));
        return window.location.reload();
    };

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
                <p className="profile__delete-btn btn" onClick={deleteHandler}>
                    Delete My Account
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
