import express from "express";
import session from "express-session";
import cors from "cors";
import { database_operation } from "./helper/utils.js";
import user from "./routes/user/index.js";
import blog from "./routes/blog/index.js";
import comment from "./routes/comment/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    secret: process.env.SECRET_KEY || "default-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

const db = database_operation();
const port = 5432;

function database_poll() {
  db.all("SELECT * FROM blogs", (err, blog_data) => {
    if (err) {
      console.error(err);
      // res.status(500).send("Internal Server Error");
      setTimeout(() => {
        console.log("polling ...");
        database_poll();
      }, 1000);
    } else {
      // CRUD Operations
      // users
      app.use("/user", user);
      // blogs
      app.use("/blog", blog);
      // comments
      app.use("/comment", comment);

      app.listen(port, () => {
        console.log(`Listening on port ${port}`);
      });
    }
  });
}

database_poll();
