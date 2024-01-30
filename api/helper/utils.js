import path, { dirname } from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";

var __filename = fileURLToPath(import.meta.url);
var folder_dir = dirname(__filename);
var __dirname = dirname(folder_dir);

export function database_operation() {
  // Connect to SQLite database
  var db_path = path.join(__dirname, "data.db");
  var db = new sqlite3.Database(db_path, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      //   Create a table if it doesn't exist
      db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                email TEXT NOT NULL,
                password TEXT NOT NULL
            )`);

      db.run(`CREATE TABLE IF NOT EXISTS blogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                favoritedUserIds TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
            )`);

      db.run(`CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                blogId INTEGER,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                body TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (blogId) REFERENCES blogs (id) ON DELETE CASCADE
            )`);
    }
  });

  return db;
}
