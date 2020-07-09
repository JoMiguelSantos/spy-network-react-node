const express = require("express");
const app = express();
const compression = require("compression");
const csurf = require("csurf");
const cookieSession = require("cookie-session");
const helmet = require("helmet");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const { uploadFileS3 } = require("./s3");
const { uploader } = require("./multer");
const { s3Url } = require("./config.json");

const { hashPassword, comparePassword } = require("./bc");
const db = require("./db");

app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(
    cookieSession({
        secret:
            process.env.cookieSecret || require("./secrets.json").cookieSecret,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
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

app.post("/logout", (req, res) => {
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
                return res.send(500).send(err);
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

app.post("/upload", uploader.single("image"), uploadFileS3, (req, res) => {
    if (req.file) {
        const { filename } = req.file;
        const image = s3Url + filename;
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

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
