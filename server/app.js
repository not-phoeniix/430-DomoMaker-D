const path = require("path");
const express = require("express");
const compression = require("compression");
const favicon = require("serve-favicon");
const mongoose = require("mongoose");
const expressHandlebars = require("express-handlebars");
const helmet = require("helmet");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const redis = require("redis");

require("dotenv").config();

const router = require("./router.js");

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;
const DB_URI = process.env.MONGODB_URI || "mongodb://localhost/DomoMaker";

mongoose.connect(DB_URI).catch((err) => {
    if (err) {
        console.log("Could not connect to database !!");
        throw err;
    }
});

const redisClient = redis.createClient({
    url: process.env.REDIS_URI
});

redisClient.on("error", (err) => console.log("Redis client error:", err));

redisClient.connect().then(() => {
    const app = express();

    app.use(helmet());
    app.use("/assets", express.static(path.resolve(`${__dirname}/../hosted`)));
    app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
    app.use(compression());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(session({
        key: "sessionid",
        store: new RedisStore({
            client: redisClient
        }),
        secret: "Domo Arigato",
        resave: false,
        saveUninitialized: false,
    }));

    app.engine("handlebars", expressHandlebars.engine({ defaultLayout: "" }));
    app.set("view engine", "handlebars");
    app.set("views", `${__dirname}/../views`);

    router(app);

    app.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`Listening on 127.0.0.1:${PORT} !!`);
    });
});
