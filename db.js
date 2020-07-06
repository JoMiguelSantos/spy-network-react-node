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
    const query = `INSERT INTO users ("first", "last", email, password) 
                   VALUES ($1, $2, $3, $4) RETURNING *;`;
    return db.query(query, [first, last, email, password]);
};

exports.readUser = ({ email, id }) => {
    const query = `SELECT * FROM users WHERE ${id ? "id" : "email"} = $1;`;
    return db.query(query, [email || id]);
};

exports.updateUser = ({ first, last, email, password, id }) => {
    const query = `INSERT INTO users (first, last, email, password, id) 
                       VALUES ($1, $2, $3, $4, $5)
                       ON CONFLICT (id)
                       DO UPDATE SET first = $1, 
                                     last = $2, 
                                     email = $3
                                     ${password ? ",password = $4" : ""};`;
    return db.query(query, [first, last, email, password || "", id]);
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
