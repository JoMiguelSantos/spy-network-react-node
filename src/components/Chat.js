import React, { useEffect, useRef } from "react";
import { socket } from "../socket";
import { useSelector } from "react-redux";
import ProfilePic from "./Profile/ProfilePic";
import { useHistory } from "react-router-dom";
import OnlineUsers from "./OnlineUsers";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.messages);
    const history = useHistory();

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            socket.emit("messageSent", { message: e.target.value });
            e.target.value = "";
        }
    };

    return (
        <div className="chat__container">
            <h1 className="chat__title">Welcome to the Spy Chat</h1>
            <OnlineUsers />
            <ul className="chat__messages--container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((message, index) => {
                        return (
                            <li className="chat__messages--message" key={index}>
                                <ProfilePic
                                    clickHandler={() =>
                                        history.push(
                                            `/user/${message.sender_id}`
                                        )
                                    }
                                    first={message.first}
                                    last={message.last}
                                    image={message.image}
                                    size="small"
                                />
                                <div className="chat__messages--data-container">
                                    <div className="chat__messages--user-info">
                                        <p>
                                            {message.first} {message.last}
                                        </p>
                                        <p>{message.created_at}</p>
                                    </div>
                                    <p className="chat__message">
                                        {message.message}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
            </ul>
            <textarea
                className="chat__messages--textarea"
                cols="50"
                rows="5"
                onKeyDown={keyCheck}
                placeholder="Write a message and press Enter to send it to the Chat."
            ></textarea>
        </div>
    );
}
