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

    if (action.type == "GET_ALL_FRIENDS") {
        return loadAllFriends(state, action);
    } else if (action.type == "UNFRIEND_FRIEND") {
        return removeFriend(state, action);
    } else if (action.type == "ACCEPT_FRIEND") {
        return addFriend(state, action);
    } else {
        return state;
    }
};
