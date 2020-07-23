const express = require("express");
const app = express();
const compression = require("compression");
const csurf = require("csurf");
const cookieSession = require("cookie-session");
const helmet = require("helmet");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const { uploadFileS3, deleteFolderS3 } = require("./s3");
const { uploader } = require("./multer");
const { s3Url } = require("./config.json");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

const { hashPassword, comparePassword } = require("./bc");
const db = require("./db");
const cookieSessionMiddleware = cookieSession({
    secret: process.env.cookieSecret || require("./secrets.json").cookieSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(cookieSessionMiddleware);
app.use(express.static("public"));

app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(csurf());

app.use(function (req, res, next) {
    res.set("x-frame-options", "deny");
    res.cookie("mytoken", req.csrfToken());
    next();
});
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/login", (req, res) => {
    return db.readUser({ email: req.body.email }).then((data) => {
        if (data.rowCount > 0) {
            comparePassword(req.body.password, data.rows[0].password)
                .then((check) => {
                    if (check) {
                        req.session.userId = data.rows[0].id;
                        req.session.first = data.rows[0].first;
                        req.session.last = data.rows[0].last;
                        req.session.email = data.rows[0].email;
                        return res.sendStatus(200);
                    } else {
                        return res.sendStatus(401);
                    }
                })
                .catch((err) => res.status(500).send(err));
        } else {
            return res.sendStatus(404);
        }
    });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.post("/signup", (req, res) => {
    hashPassword(req.body.password).then((hashedPw) => {
        return db
            .createUser({ ...req.body, password: hashedPw })
            .then((data) => {
                req.session.userId = data.rows[0].id;
                req.session.first = data.rows[0].first;
                req.session.last = data.rows[0].last;
                req.session.email = data.rows[0].email;
                return res.sendStatus(201);
            })
            .catch((err) => {
                console.log(err);
                return res.sendStatus(500);
            });
    });
});

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    return db.readUser({ email }).then((data) => {
        if (data.rowCount > 0) {
            const secretCode = cryptoRandomString({
                length: 6,
            });
            return db
                .createToken({ email, code: secretCode })
                .then(() => {
                    sendEmail(
                        email,
                        "Reset Password",
                        `Hey, psst! 

Here's your very secret reset password code: ${secretCode}`
                    );
                    return res.sendStatus(200);
                })
                .catch(() => {
                    return res.sendStatus(500);
                });
        } else {
            return res.sendStatus(404);
        }
    });
});

app.post("/password/reset/verify", async (req, res) => {
    const { email, code, password } = req.body;

    try {
        const data = await db.readToken({ code });

        if (data.rowCount > 0) {
            const newPassword = await hashPassword(password);
            db.updatePassword({
                email,
                password: newPassword,
            })
                .then(() => {
                    return res.sendStatus(200);
                })
                .catch(() => {
                    return res.sendStatus(500);
                });
        }
    } catch (err) {
        res.sendStatus(404);
    }
});

app.get("/user", async (req, res) => {
    try {
        let data = await db.readUser({ id: req.session.userId });
        if (data.rowCount > 0) {
            let user = data.rows[0];
            delete user.password;
            res.json({ success: true, user });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get("/api/users", async (req, res) => {
    try {
        let data = await db.readLast3Users({ user_id: req.session.userId });
        if (data.rowCount > 0) {
            let cleanedData = data.rows.map((user) => {
                delete user.password;
                return user;
            });
            res.json({ success: true, users: cleanedData });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get("/api/users/:search", async (req, res) => {
    try {
        let data = await db.readMatchingUsers({ search: req.params.search });
        if (data.rowCount > 0) {
            let cleanedData = data.rows.map((user) => {
                delete user.password;
                return user;
            });
            res.json({ success: true, users: cleanedData });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get("/api/user/:user_id", async (req, res) => {
    try {
        let data = await db.readUser({ id: req.params.user_id });
        if (data.rowCount > 0) {
            let user = data.rows[0];
            delete user.password;
            res.json({ success: true, user });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.delete("/api/user/:user_id", deleteFolderS3, async (req, res) => {
    await Promise.all([
        db.deleteFriendship({ user_id: req.params.user_id }),
        db.deleteChat({ user_id: req.params.user_id }),
    ])
        .then(() => {
            db.deleteUser({ user_id: req.params.user_id })
                .then(() => {
                    // remove session cookie
                    req.session = null;
                    // redirect to "/"
                    return res.sendStatus(204);
                })
                .catch((err) => {
                    console.log(err);
                    return res.sendStatus("500");
                });
        })
        .catch((err) => {
            console.log(err);
            return res.sendStatus("500");
        });
});

app.post("/upload", uploader.single("image"), uploadFileS3, (req, res) => {
    if (req.file) {
        const { filename } = req.file;
        const image = `${s3Url + req.session.userId}/${filename}`;
        return db
            .updateImage({ id: req.session.userId, image })
            .then(({ rows }) => {
                return res.json(rows[0]);
            });
    } else {
        return res.sendStatus(400);
    }
});

app.post("/bio", async (req, res) => {
    try {
        let data = await db.updateBio({
            id: req.session.userId,
            bio: req.body.bio,
        });
        if (data.rowCount > 0) {
            const user = data.rows[0];
            res.json({ success: true, user });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get("/friendship", async (req, res) => {
    try {
        const data = await db.readAllFriendships({
            user_id: req.session.userId,
        });
        const friends = data.rows;
        res.json({ success: true, friends });
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get("/friendship/:friend_id", async (req, res) => {
    try {
        const data = await db.readFriendship({
            user_id: req.session.userId,
            friend_id: req.params.friend_id,
        });
        if (data.rowCount > 0) {
            const friendship = data.rows[0];
            res.json({ success: true, friendship });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/friendship/:friend_id", async (req, res) => {
    try {
        const data = await db.createFriendship({
            user_id: req.session.userId,
            friend_id: req.params.friend_id,
        });
        if (data.rowCount > 0) {
            const friendship = data.rows[0];
            res.json({ success: true, friendship });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.put("/friendship/:friend_id", async (req, res) => {
    try {
        const data = await db.updateFriendship({
            user_id: req.session.userId,
            friend_id: req.params.friend_id,
        });
        if (data.rowCount > 0) {
            const friendship = data.rows[0];
            res.json({ success: true, friendship });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.delete("/friendship/:friend_id", async (req, res) => {
    try {
        const data = await db.deleteFriendship({
            user_id: req.session.userId,
            friend_id: req.params.friend_id,
        });
        if (data.rowCount > 0) {
            // const friendship = data.rows[0];
            res.json({
                success: true,
                friendship: { id: req.params.friend_id },
            });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(process.env.PORT || 8080, function () {
    console.log("I'm listening.");
});

let onlineUsers = {};
io.on("connection", (socket) => {
    console.log(`socket id ${socket.id} is connected!!`);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    db.getLast10Messages().then((data) => {
        io.sockets.emit("chatMessages", data.rows);
    });

    const userId = socket.request.session.userId;

    if (!onlineUsers[userId]) {
        onlineUsers[userId] = new Set([socket.id]);
        socket.broadcast.emit("newUserOnline", userId);
    } else {
        onlineUsers[userId].add(socket.id);
    }

    db.getOnlineUsers({ online_users: Object.keys(onlineUsers) }).then(
        ({ rows }) => {
            io.sockets.emit("onlineUsers", rows);
        }
    );

    socket.on("privateChatMessage", ({ friend_id, message }) => {
        db.createPrivateMessage({
            user_id: userId,
            message,
            friend_id,
        }).then(({ rows }) => {
            db.readMessage({ message_id: rows[0].id }).then(({ rows }) => {
                if (onlineUsers[friend_id] && onlineUsers[friend_id].size > 0) {
                    onlineUsers[friend_id].forEach((socketId) => {
                        io.to(socketId).emit("newPrivateChatMessage", rows[0]);
                    });
                }
                onlineUsers[userId].forEach((socketId) => {
                    io.to(socketId).emit("newPrivateChatMessage", rows[0]);
                });
            });
        });
    });

    socket.on("privateChat", ({ friend_id }) => {
        db.getPrivateMessages({ friend_id, user_id: userId }).then(
            ({ rows }) => {
                if (onlineUsers[friend_id] && onlineUsers[friend_id].size > 0) {
                    onlineUsers[friend_id].forEach((socketId) => {
                        io.to(socketId).emit("privateChat", rows);
                    });
                }
                onlineUsers[userId].forEach((socketId) => {
                    io.to(socketId).emit("privateChat", rows);
                });
            }
        );
    });

    socket.on("messageSent", ({ message }) => {
        db.createMessage({ user_id: userId, message }).then(({ rows }) => {
            db.readMessage({ message_id: rows[0].id }).then(({ rows }) => {
                io.sockets.emit("chatMessage", rows[0]);
            });
        });
    });

    socket.on("disconnect", () => {
        onlineUsers[userId].delete(socket.id);
        if (onlineUsers[userId] && onlineUsers[userId].size == 0) {
            delete onlineUsers[userId];
            io.sockets.emit("userOffline", userId);
        }
    });
});
