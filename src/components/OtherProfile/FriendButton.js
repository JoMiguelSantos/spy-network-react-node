/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import axios from "../../../axios";

const FriendButton = ({ id, currentUserId }) => {
    const [buttonText, setButtonText] = useState();

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            (() => {
                axios
                    .get(`/friendship/${id}`)
                    .then(({ data }) => {
                        if (data.friendship.accepted) {
                            setButtonText("Unfriend");
                        } else if (!data.friendship.accepted) {
                            if (id == currentUserId) {
                                setButtonText("Cancel Friend Request");
                            } else {
                                setButtonText("Accept Friend Request");
                            }
                        }
                    })
                    .catch((err) => {
                        if (err.response.status == 404) {
                            setButtonText("Make Friend Request");
                        }
                    });
            })();
        }

        return () => (mounted = false);
    }, []);

    const handleClick = async () => {
        switch (buttonText) {
            case "Unfriend":
            case "Cancel Friend Request":
                try {
                    await axios.delete(`/friendship/${id}`);
                    setButtonText("Make Friend Request");
                } catch (err) {
                    console.log(err);
                }
                break;
            case "Accept Friend Request":
                try {
                    await axios.put(`/friendship/${id}`);
                    setButtonText("Unfriend");
                } catch (err) {
                    console.log(err);
                }
                break;
            case "Make Friend Request":
                try {
                    await axios.post(`/friendship/${id}`);
                    setButtonText("Cancel Friend Request");
                } catch (err) {
                    console.log(err);
                }
                break;
            default:
        }
    };

    return (
        <button className="friendship__btn btn" onClick={handleClick}>
            {buttonText}
        </button>
    );
};

export default FriendButton;
