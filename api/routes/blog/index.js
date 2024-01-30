import express from "express";
import { body, param, validationResult } from "express-validator";
import { database_operation } from "../../helper/utils.js";
const router = express.Router();
var db = database_operation();

// Middleware to parse JSON in the request body
router.use(express.json());

// get all blogs
router.get("/", (req, res) => {
  // Retrieve all blog posts from the 'blogs' table
  db.all("SELECT * FROM blogs", (err, blogs) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ blogs });
  });
});

// get a single blog
router.get("/:id", [param("id").isInt({ min: 1 })], (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const blogId = req.params.id;

  // Check if the specified blog post exists
  db.get("SELECT * FROM blogs WHERE id = ?", [blogId], (blogErr, blog) => {
    if (blogErr) {
      return res.status(500).json({ error: blogErr.message });
    }

    // Check if the blog post exists
    if (!blog) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.json({ blog });
  });
});

// add blog
router.post(
  "/add",
  [
    body("userId").isInt({ min: 1 }), // Assuming userId is an integer and should be present
    body("title").notEmpty().trim().escape(),
    body("body").notEmpty().trim().escape(),
  ],
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, title, body } = req.body;

    // Check if the specified user exists
    db.get("SELECT * FROM users WHERE id = ?", [userId], (userErr, user) => {
      if (userErr) {
        return res.status(500).json({ error: userErr.message });
      }

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Insert blog post into the 'blogs' table
      db.run(
        "INSERT INTO blogs (userId, title, body) VALUES (?, ?, ?)",
        [userId, title, body],
        function (blogErr) {
          if (blogErr) {
            return res.status(500).json({ error: blogErr.message });
          }

          const blogId = this.lastID;
          res.json({ message: "Blog post added successfully", blogId });
        }
      );
    });
  }
);

// update blog
router.put(
  "/:id",
  [
    param("id").isInt({ min: 1 }), // Assuming blog post ID is an integer and should be present
    body("userId").isInt({ min: 1 }), // Assuming userId is an integer and should be present
    body("title").optional().trim().escape(),
    body("body").optional().trim().escape(),
  ],
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blogId = req.params.id;
    const { userId, title, body } = req.body;

    // Check if the specified blog post exists
    db.get("SELECT * FROM blogs WHERE id = ?", [blogId], (blogErr, blog) => {
      if (blogErr) {
        return res.status(500).json({ error: blogErr.message });
      }

      // Check if the blog post exists
      if (!blog) {
        return res.status(404).json({ error: "Blog post not found" });
      }

      // Check if the blog post was added by the specified user
      if (blog.userId !== userId) {
        return res
          .status(403)
          .json({ error: "You are not authorized to update this blog post" });
      }

      // Update the blog post in the 'blogs' table
      db.run(
        "UPDATE blogs SET title = ?, body = ? WHERE id = ?",
        [title, body, blogId],
        function (updateErr) {
          if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
          }

          // Check if any rows were affected
          if (this.changes === 0) {
            return res.status(404).json({ error: "Blog post not found" });
          }

          res.json({ message: "Blog post updated successfully", blogId });
        }
      );
    });
  }
);

// delete blog
router.delete(
  "/:id",
  [param("id").isInt({ min: 1 }), param("userId").isInt({ min: 1 })],
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blogId = req.params.id;
    const userId = req.params.userId;

    // Check if the specified blog post exists
    db.get("SELECT * FROM blogs WHERE id = ?", [blogId], (blogErr, blog) => {
      if (blogErr) {
        return res.status(500).json({ error: blogErr.message });
      }

      // Check if the blog post exists
      if (!blog) {
        return res.status(404).json({ error: "Blog post not found" });
      }

      // Check if the blog post was added by the specified user
      if (blog.userId !== userId) {
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this blog post" });
      }

      // Delete the blog post from the 'blogs' table
      db.run("DELETE FROM blogs WHERE id = ?", [blogId], function (deleteErr) {
        if (deleteErr) {
          return res.status(500).json({ error: deleteErr.message });
        }

        // Check if any rows were affected
        if (this.changes === 0) {
          return res.status(404).json({ error: "Blog post not found" });
        }

        res.json({ message: "Blog post deleted successfully" });
      });
    });
  }
);

// add favorite
router.post(
  "/toggle-favorite",
  [body("userId").isInt({ min: 1 }), body("blogId").isInt({ min: 1 })],
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, blogId } = req.body;

    // Check if the specified user and blog exist
    db.get("SELECT * FROM users WHERE id = ?", [userId], (userErr, user) => {
      if (userErr) {
        return res.status(500).json({ error: userErr.message });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      db.get("SELECT * FROM blogs WHERE id = ?", [blogId], (blogErr, blog) => {
        if (blogErr) {
          return res.status(500).json({ error: blogErr.message });
        }

        if (!blog) {
          return res.status(404).json({ error: "Blog not found" });
        }

        // Check if the user has already favorited the blog
        const favoritedUserIds = blog.favoritedUserIds
          ? blog.favoritedUserIds.split(",").map(Number)
          : [];
        const isFavorited = favoritedUserIds.includes(userId);

        if (isFavorited) {
          // Remove the user from the list of favorited users
          const updatedFavoritedUserIds = favoritedUserIds
            .filter((id) => id !== userId)
            .join(",");
          db.run(
            "UPDATE blogs SET favoritedUserIds = ? WHERE id = ?",
            [updatedFavoritedUserIds, blogId],
            function (updateErr) {
              if (updateErr) {
                return res
                  .status(500)
                  .json({
                    error: updateErr.message,
                    favoritedUserIds: updatedFavoritedUserIds,
                  });
              }

              res.json({ message: "Favorite removed successfully" });
            }
          );
        } else {
          // Add the user to the list of favorited users
          const updatedFavoritedUserIds = favoritedUserIds
            .concat(userId)
            .join(",");
          db.run(
            "UPDATE blogs SET favoritedUserIds = ? WHERE id = ?",
            [updatedFavoritedUserIds, blogId],
            function (updateErr) {
              if (updateErr) {
                return res.status(500).json({ error: updateErr.message });
              }

              res.json({
                message: "Favorite added successfully",
                favoritedUserIds: updatedFavoritedUserIds,
              });
            }
          );
        }
      });
    });
  }
);

export default router;
