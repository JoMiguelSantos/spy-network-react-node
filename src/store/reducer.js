export default (state = {}, action) => {
    const loadAllFriends = (state, action) => {
        return { ...state, friends: action.friends };
    };

    const removeFriend = (state, action) => {
        return {
            ...state,
            friends: state.friends.filter((friend) => friend.id != action.id),
        };
    };

    const addFriend = (state, action) => {
        return {
            ...state,
            friends: state.friends.map((friend) => {
                if (friend.id == action.id) {
                    return { ...friend, accepted: true };
                }
                return friend;
            }),
        };
    };

    const loadMessages = (state, action) => {
        const formattedMessages = action.messages.map((message) => {
            return {
                ...message,
                created_at: new Date(message.created_at).toUTCString(),
            };
        });
        return { ...state, messages: formattedMessages.reverse() };
    };

    const addMessage = (state, action) => {
        const formattedMessage = {
            ...action.message,
            created_at: new Date(action.message.created_at).toUTCString(),
        };
        return {
            ...state,
            messages: state.messages.concat(formattedMessage),
        };
    };

    const addNewOnlineUser = (state, action) => {
        return { ...state, onlineUsers: state.onlineUsers.concat(action.user) };
    };
    const onlineUsers = (state, action) => {
        return { ...state, onlineUsers: action.users };
    };
    const userOffline = (state, action) => {
        return {
            ...state,
            onlineUsers: state.onlineUsers.filter(
                (user) => user.id != action.user
            ),
        };
    };

    const deleteUser = (state, action) => {
        return {};
    };

    if (action.type == "GET_ALL_FRIENDS") {
        return loadAllFriends(state, action);
    } else if (action.type == "UNFRIEND_FRIEND") {
        return removeFriend(state, action);
    } else if (action.type == "ACCEPT_FRIEND") {
        return addFriend(state, action);
    } else if (action.type == "LAST_10_MESSAGES") {
        return loadMessages(state, action);
    } else if (action.type == "MESSAGE_SENT") {
        return addMessage(state, action);
    } else if (action.type == "DELETE_USER") {
        return deleteUser(state, action);
    } else if (action.type == "NEW_ONLINE_USER") {
        return addNewOnlineUser(state, action);
    } else if (action.type == "ONLINE_USERS") {
        return onlineUsers(state, action);
    } else if (action.type == "USER_OFFLINE") {
        return userOffline(state, action);
    } else {
        return state;
    }
};
