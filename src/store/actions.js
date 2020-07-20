import axios from "../../axios";

export const getAllfriends = async () => {
    const {
        data: { friends },
    } = await axios.get("/friendship");
    return { type: "GET_ALL_FRIENDS", friends };
};

export const unfriendFriend = async (friend_id) => {
    await axios.delete(`/friendship/${friend_id}`);
    return { type: "UNFRIEND_FRIEND", id: friend_id };
};

export const acceptFriend = async (friend_id) => {
    await axios.put(`/friendship/${friend_id}`);
    return { type: "ACCEPT_FRIEND", id: friend_id };
};

export const chatMessages = (messages) => {
    return { type: "LAST_10_MESSAGES", messages };
};

export const chatMessage = (message) => {
    return { type: "MESSAGE_SENT", message };
};

export const deleteUser = async (user_id) => {
    await axios.delete(`/api/user/${user_id}`);
    return { type: "DELETE_USER", user_id };
};
