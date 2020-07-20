import React from "react";
import { useSelector } from "react-redux";
import ProfilePic from "./Profile/ProfilePic";
import { useHistory } from "react-router";

export default () => {
    const onlineUsers = useSelector((state) => state && state.onlineUsers);
    const history = useHistory();

    return (
        <ul className="online-users__container">
            {onlineUsers &&
                onlineUsers.map(({ first, last, image, id }) => {
                    return (
                        <li className="online-user" key={id}>
                            <ProfilePic
                                clickHandler={() => history.push(`/user/${id}`)}
                                first={first}
                                last={last}
                                image={image}
                                size="small"
                            />
                            <p>
                                {first} {last}
                            </p>
                        </li>
                    );
                })}
        </ul>
    );
};
