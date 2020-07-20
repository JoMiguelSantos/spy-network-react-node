import * as io from "socket.io-client";
import {
    chatMessages,
    chatMessage,
    addNewOnlineUser,
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
            store.dispatch(addNewOnlineUser(user_id))
        );
        socket.on("onlineUsers", (onlineUsersList) =>
            store.dispatch(onlineUsers(onlineUsersList))
        );
        socket.on("userOffline", (user_id) =>
            store.dispatch(userOffline(user_id))
        );
    }
};
