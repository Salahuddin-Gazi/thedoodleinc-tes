import express from "express";
import bcrypt from "bcrypt";
import { body, validationResult, query } from "express-validator";
import { database_operation } from "../../helper/utils.js";
const router = express.Router();
var db = database_operation();

// Middleware to parse JSON in the request body
router.use(express.json());

// get all users info
router.get("/users", (req, res) => {
  db.all("SELECT id, username, email FROM users", (err, users) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // console.log("Users:", users);
    res.json(users);
  });
});

// get speicfic user
router.get(
  "/get",
  [
    query("email").isEmail().normalizeEmail(),
    query("password").isLength({ min: 6 }).escape(),
  ],
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.query;

    // Retrieve user from the 'users' table
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Check if user exists
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Compare the provided password with the hashed password in the database
      bcrypt.compare(password, user.password, (bcryptErr, result) => {
        if (bcryptErr) {
          return res.status(500).json({ error: bcryptErr.message });
        }

        // Check if the password is correct
        if (!result) {
          return res.status(401).json({ error: "Incorrect password" });
        }

        // If everything is okay, return the user data (excluding password)
        const { id, username, email } = user;
        res.json({ id, username, email });
      });
    });
  }
);

// user registration
router.post(
  "/registration",
  [
    body("username").notEmpty().trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }).escape(),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;

      // Check if the user already exists
      const existingUser = await getUserByUsernameOrEmail(username, email);

      if (existingUser) {
        return res
          .status(409)
          .json({ error: "Username or email already taken" });
      }

      // Hash the password with bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into the 'users' table with hashed password
      const userId = await insertUser(username, email, hashedPassword);

      // Create a session for the new user
      req.session.userId = userId;

      res.json({
        message: "User registered successfully",
        userId: req.session.userId,
      });
    } catch (err) {
      console.error("Error adding user:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Function to get user by username or email
async function getUserByUsernameOrEmail(username, email) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email],
      (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      }
    );
  });
}

// Function to insert user into the 'users' table
async function insertUser(username, email, password) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, password],
      function (err) {
        if (err) {
          reject(err);
        } else {
          // Return the ID of the inserted user
          resolve(this.lastID);
        }
      }
    );
  });
}

// user login
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty().escape(),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Retrieve user from the 'users' table by email
      const user = await getUserByEmail(email);

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Create a session for the logged-in user
      req.session.userId = user.id;

      res.json({ message: "Login successful", userId: req.session.userId });
    } catch (err) {
      console.error("Error during login:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Function to get user by email
async function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

export default router;
