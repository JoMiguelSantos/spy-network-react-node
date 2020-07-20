import * as io from "socket.io-client";
import {
    chatMessages,
    chatMessage,
    newUserOnline,
    onlineUsers,
    userOffline,
} from "./store/actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => store.dispatch(chatMessages(msgs)));
        socket.on("chatMessage", (msg) => store.dispatch(chatMessage(msg)));
        socket.on("newUserOnline", (user_id) =>
            store.dispatch(newUserOnline(user_id))
        );
        socket.on("onlineUsers", (onlineUsers) =>
            store.dispatch(onlineUsers(onlineUsers))
        );
        socket.on("userOffline", (user_id) =>
            store.dispatch(userOffline(user_id))
        );
    }
};
