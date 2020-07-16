import React, { useState, useEffect } from "react";
import axios from "../../../axios";
import { useDispatch, useSelector } from "react-redux";
import FriendHeader from "./FriendsHeader";
import { getAllfriends } from "../../store/actions";

const Friends = () => {
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) =>
            state.friends && state.friends.filter((friend) => friend.accepted)
    );
    const friendsToBe = useSelector(
        (state) =>
            state.friends && state.friends.filter((friend) => !friend.accepted)
    );

    useEffect(() => {
        dispatch(getAllfriends());
    }, []);

    return (
        <div className="friendship__container">
            <h1 className="friendship__title">Friendships</h1>
            <div className="friendship__friends--container">
                <ul className="friendship__friends">
                    <h2 className="friendship__friends--title">To Be</h2>
                    {friends &&
                        friends.map((friend) => {
                            return (
                                <li
                                    className="friendship__friend"
                                    key={friend.id}
                                >
                                    <FriendHeader
                                        id={friend.id}
                                        first={friend.first}
                                        last={friend.last}
                                        image={friend.image}
                                        friend={true}
                                    />
                                </li>
                            );
                        })}
                </ul>
                <ul className="friendship__friends-requests">
                    <h2 className="friendship__friends-requests--title">
                        Not Yet To Be
                    </h2>
                    {friends &&
                        friendsToBe.map((friend) => {
                            return (
                                <li
                                    className="friendship__friend-request"
                                    key={friend.id}
                                >
                                    <FriendHeader
                                        id={friend.id}
                                        first={friend.first}
                                        last={friend.last}
                                        image={friend.image}
                                        friend={false}
                                    />
                                </li>
                            );
                        })}
                </ul>
            </div>
        </div>
    );
};

export default Friends;
