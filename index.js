const express = require("express");
const app = express();
const compression = require("compression");
const csurf = require("csurf");
const cookieSession = require("cookie-session");
const helmet = require("helmet");
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
                        return res.sendStatus(200);
                    } else {
                        return res.sendStatus(401);
                    }
                })
                .catch((err) => res.send(err));
        } else {
            return res.redirect("/auth/login?err=true");
        }
    });
});

app.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.post("/signup", (req, res) => {
    console.log("/signup", req.body);
    hashPassword(req.body.password).then((hashedPw) => {
        console.log("/signup hash", hashedPw);
        return db
            .createUser({ ...req.body, password: hashedPw })
            .then((data) => {
                console.log("/signup db", data);

                req.session.userId = data.rows[0].id;
                req.session.first = data.rows[0].first;
                req.session.last = data.rows[0].last;
                return res.sendStatus(201);
            })
            .catch((err) => {
                return res.send(err);
            });
    });
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
