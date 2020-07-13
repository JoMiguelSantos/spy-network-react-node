const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPass } = require("./secrets.json");
    db = spicedPg(
        `postgres:${dbUser}:${dbPass}:@localhost:5432/social_network`
    );
}

exports.createUser = ({ first, last, email, password }) => {
    const query = `INSERT INTO users (first, last, email, password) 
                   VALUES ($1, $2, $3, $4) RETURNING *;`;
    return db.query(query, [first, last, email, password]);
};

exports.readUser = ({ email, id }) => {
    const query = `SELECT * FROM users WHERE ${id ? "id" : "email"} = $1;`;
    return db.query(query, [email || id]);
};

exports.readMatchingUsers = ({ search }) => {
    const query = `SELECT * FROM users WHERE first ILIKE $1 OR last ILIKE $1;`;
    return db.query(query, [search + "%"]);
};

exports.readLast3Users = () => {
    const query = `SELECT * FROM users ORDER BY id DESC LIMIT 3;`;
    return db.query(query);
};

exports.updateUser = ({ first, last, email, password }) => {
    const query = `UPDATE users
                   SET first = $1, 
                        last = $2, 
                        email = $3
                        ${password ? ",password = $4" : ""}
                   WHERE email = $3;`;
    return db.query(query, [first, last, email, password || ""]);
};

exports.updatePassword = ({ email, password }) => {
    const query = `UPDATE users
                   SET password = $2
                   WHERE email = $1;`;
    return db.query(query, [email, password]);
};

exports.updateImage = ({ id, image }) => {
    const query = `UPDATE users
                   SET image = $2
                   WHERE id = $1
                   RETURNING image;`;
    return db.query(query, [id, image]);
};

exports.updateBio = ({ id, bio }) => {
    const query = `UPDATE users
                   SET bio = $2
                   WHERE id = $1
                   RETURNING bio;`;
    return db.query(query, [id, bio]);
};

exports.deleteUser = ({ id }) => {
    const query = `DELETE FROM users WHERE id = $1`;
    return db.query(query, [id]);
};

exports.readProfile = ({ user_id }) => {
    const query = `SELECT * FROM user_profiles WHERE user_id = $1`;
    return db.query(query, [user_id]);
};

exports.createProfile = ({ user_id, age, city, url }) => {
    const query = `INSERT INTO user_profiles (user_id, age, city, url) VALUES ($1, $2, $3, $4) RETURNING *;`;
    return db.query(query, [user_id, age || null, city || "", url || ""]);
};

exports.updateProfile = ({ user_id, age, city, url }) => {
    const query = `INSERT INTO user_profiles (age, city, url, user_id) 
                       VALUES ($1, $2, $3, $4)
                       ON CONFLICT (user_id)
                       DO UPDATE SET age = $1, 
                                     city = $2, 
                                     url = $3;`;
    return db.query(query, [age || null, city || "", url || "", user_id]);
};

exports.deleteProfile = ({ id }) => {
    const query = `DELETE FROM user_profiles WHERE id = $1`;
    return db.query(query, [id]);
};

exports.deleteTestUser = () => {
    return db
        .query(`SELECT id FROM users WHERE email = 'test@email.com';`)
        .then((data) => {
            const id = data.rows[0].id;
            return db.query(`DELETE FROM user_profiles WHERE user_id = ${id};
                  DELETE FROM signatures WHERE user_id = ${id};
                  DELETE FROM users WHERE id = ${id};`);
        })
        .catch(() => console.log("all good test user didn't exist"));
};

exports.createToken = ({ email, code }) => {
    const query = `INSERT INTO reset_codes (email, code) 
                   VALUES ($1, $2) RETURNING *;`;
    return db.query(query, [email, code]);
};

exports.readToken = ({ code }) => {
    const query = `SELECT * 
                  FROM reset_codes 
                  WHERE code = $1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes';`;
    return db.query(query, [code]);
};

exports.deleteToken = ({ id }) => {
    const query = `DELETE FROM reset_codes WHERE id = $1`;
    return db.query(query, [id]);
};

exports.readFriendship = ({ user_id, friend_id }) => {
    const query = `SELECT * FROM friendships
           WHERE (receiver_id = $1 AND sender_id = $2)
           OR (receiver_id = $2 AND sender_id = $1);`;
    return db.query(query, [user_id, friend_id]);
};

exports.createFriendship = ({ user_id, friend_id }) => {
    const query = `INSERT INTO friendships (sender_id, receiver_id) 
                   VALUES ($1, $2) RETURNING *;`;
    return db.query(query, [user_id, friend_id]);
};

exports.updateFriendship = ({ user_id, friend_id }) => {
    const query = `UPDATE friendships
                   SET accepted = TRUE
                   WHERE (receiver_id = $1 AND sender_id = $2)
                        OR (receiver_id = $2 AND sender_id = $1)
                   RETURNING *;`;
    return db.query(query, [user_id, friend_id]);
};

exports.deleteFriendship = ({ user_id, friend_id }) => {
    const query = `DELETE 
                    FROM friendships 
                    WHERE (receiver_id = $1 AND sender_id = $2)
                        OR (receiver_id = $2 AND sender_id = $1)`;
    return db.query(query, [user_id, friend_id]);
};
