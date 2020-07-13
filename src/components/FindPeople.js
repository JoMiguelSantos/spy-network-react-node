import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";

const FindPeople = () => {
    const [last3Users, setLast3Users] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isInitialDisplay, setInitialDisplay] = useState(true);
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            (() => {
                axios
                    .get("/api/users")
                    .then(({ data }) => {
                        setLast3Users(data.users);
                    })
                    .catch(() => {
                        setNoResults(true);
                    });
            })();
        }

        return () => (mounted = false);
    }, []);

    const handleChange = (e) => {
        setSearchTerm(e.target.value);

        if (!e.target.value) {
            setInitialDisplay(true);
            setNoResults(false);
            setFilteredUsers([]);
        } else {
            axios
                .get(`/api/users/${e.target.value}`)
                .then(({ data }) => {
                    setFilteredUsers(data.users);
                    setInitialDisplay(false);
                    setNoResults(false);
                })
                .catch(() => {
                    setFilteredUsers([]);
                    setNoResults(true);
                    setInitialDisplay(false);
                });
        }
    };

    const userFactoryList = (users) => {
        return users.map((user) => {
            return (
                <li key={user.id} className="user__search--match">
                    <Link to={`/user/${user.id}`}>
                        <img
                            className="user__search--match img"
                            src={user.image}
                            alt={`${user.first} ${user.last}`}
                        />
                    </Link>
                    <Link to={`/user/${user.id}`}>
                        <p className="user__search--match text">
                            {user.first} {user.last}
                        </p>
                    </Link>
                </li>
            );
        });
    };

    return (
        <div>
            <h1 className="user__search--title">Find Spies</h1>
            {isInitialDisplay && (
                <div className="user__search--init-display">
                    <p>Checkout who just joined!</p>
                    <ul>{userFactoryList(last3Users)}</ul>
                    <p>Are you looking for someone in particular?</p>
                </div>
            )}
            <input
                className="user__search--input"
                type="text"
                value={searchTerm}
                placeholder="Insert Spy Name"
                onChange={handleChange}
            />
            {!isInitialDisplay && !noResults && (
                <ul>{userFactoryList(filteredUsers)}</ul>
            )}
            {noResults && (
                <p>No results where found when searching by: {searchTerm}</p>
            )}
        </div>
    );
};

export default FindPeople;
