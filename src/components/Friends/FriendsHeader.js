import React from "react";
import ProfilePic from "../Profile/ProfilePic";
import { useDispatch } from "react-redux";
import { unfriendFriend, acceptFriend } from "../../store/actions";
import { useHistory } from "react-router-dom";

const FriendHeader = ({ first, last, image, id, friend }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const handleClick = (e) => {
        if (e.target.innerHTML == "Unfriend") {
            dispatch(unfriendFriend(id));
        } else if (e.target.innerHTML == "Accept Friend Request") {
            dispatch(acceptFriend(id));
        }
    };

    return (
        <div className="friendship__friend--header">
            <h1 className="friendship__friend--header__title">{`${first} ${last}`}</h1>
            <ProfilePic
                clickHandler={() => history.push(`/user/${id}`)}
                first={first}
                last={last}
                image={image}
                size="medium"
            />
            <button className="friendship__btn btn" onClick={handleClick}>
                {friend ? "Unfriend" : "Accept Friend Request"}
            </button>
        </div>
    );
};

export default FriendHeader;
