import express from "express";
import { body, param, validationResult } from "express-validator";
import { database_operation } from "../../helper/utils.js";
const router = express.Router();
var db = database_operation();

// Middleware to parse JSON in the request body
router.use(express.json());

router.post(
  "/add",
  [
    body("blogId").isInt({ min: 1 }),
    body("name").notEmpty().trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("body").notEmpty().trim().escape(),
  ],
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { blogId, name, email, body } = req.body;

    // Check if the specified blog post exists
    db.get("SELECT * FROM blogs WHERE id = ?", [blogId], (blogErr, blog) => {
      if (blogErr) {
        return res.status(500).json({ error: blogErr.message });
      }

      // Check if the blog post exists
      if (!blog) {
        return res.status(404).json({ error: "Blog post not found" });
      }

      // Insert comment into the 'comments' table
      db.run(
        "INSERT INTO comments (blogId, name, email, body) VALUES (?, ?, ?, ?)",
        [blogId, name, email, body],
        function (commentErr) {
          if (commentErr) {
            return res.status(500).json({ error: commentErr.message });
          }
          var commentId = this.lastID;
          res.json({ message: "Comment added successfully", commentId });
        }
      );
    });
  }
);

// update comment
router.put(
  "/:id",
  [
    param("id").isInt({ min: 1 }), // Assuming comment ID is an integer and should be present
    body("email").isEmail().normalizeEmail(),
    body("blogId").isInt({ min: 1 }), // Assuming blogId is an integer and should be present
    body("name").notEmpty().trim().escape(),
    body("body").notEmpty().trim().escape(),
  ],
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const commentId = req.params.id;
    const { email, blogId, name, body } = req.body;

    // Check if the specified comment exists
    db.get(
      "SELECT * FROM comments WHERE id = ?",
      [commentId],
      (commentErr, comment) => {
        if (commentErr) {
          return res.status(500).json({ error: commentErr.message });
        }

        // Check if the comment exists
        if (!comment) {
          return res.status(404).json({ error: "Comment not found" });
        }

        // Check if the specified blog post exists
        db.get(
          "SELECT * FROM blogs WHERE id = ?",
          [blogId],
          (blogErr, blog) => {
            if (blogErr) {
              return res.status(500).json({ error: blogErr.message });
            }

            // Check if the blog post exists
            if (!blog) {
              return res.status(404).json({ error: "Blog post not found" });
            }

            // Check if the specified user (by email) created the blog post
            db.get(
              "SELECT * FROM users WHERE email = ?",
              [email],
              (userErr, user) => {
                if (userErr) {
                  return res.status(500).json({ error: userErr.message });
                }

                // Check if the user exists
                if (!user) {
                  return res.status(404).json({ error: "User not found" });
                }

                // Check if the user created the associated blog post
                if (blog.userId !== user.id) {
                  return res.status(403).json({
                    error: "You are not authorized to update this comment",
                  });
                }

                // Update the comment in the 'comments' table
                db.run(
                  "UPDATE comments SET blogId = ?, name = ?, email = ?, body = ? WHERE id = ?",
                  [blogId, name, email, body, commentId],
                  function (updateErr) {
                    if (updateErr) {
                      return res.status(500).json({ error: updateErr.message });
                    }

                    // Check if any rows were affected
                    if (this.changes === 0) {
                      return res
                        .status(404)
                        .json({ error: "Comment not found" });
                    }

                    res.json({ message: "Comment updated successfully" });
                  }
                );
              }
            );
          }
        );
      }
    );
  }
);

// delete comment
router.delete(
  "/delete",
  [body("id").isInt({ min: 1 }), body("email").isEmail().normalizeEmail()],
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const commentId = req.body.id;
    const email = req.body.email;

    // Check if the specified comment exists
    db.get(
      "SELECT * FROM comments WHERE id = ?",
      [commentId],
      (commentErr, comment) => {
        if (commentErr) {
          return res.status(500).json({ error: commentErr.message });
        }

        // Check if the comment exists
        if (!comment) {
          return res.status(404).json({ error: "Comment not found" });
        }

        // Check if the user created the associated comment
        if (comment.email !== email) {
          return res.status(403).json({
            error: "You are not authorized to delete this comment",
          });
        }

        // Check if the specified blog post exists
        db.get(
          "SELECT * FROM blogs WHERE id = ?",
          [comment.blogId],
          (blogErr, blog) => {
            if (blogErr) {
              return res.status(500).json({ error: blogErr.message });
            }

            // Check if the blog post exists
            if (!blog) {
              return res.status(404).json({ error: "Blog post not found" });
            }

            // Check if the specified user (by email) created the blog post
            db.get(
              "SELECT * FROM users WHERE email = ?",
              [email],
              (userErr, user) => {
                if (userErr) {
                  return res.status(500).json({ error: userErr.message });
                }

                // Check if the user exists
                if (!user) {
                  return res.status(404).json({ error: "User not found" });
                }

                // Delete the comment from the 'comments' table
                db.run(
                  "DELETE FROM comments WHERE id = ?",
                  [commentId],
                  function (deleteErr) {
                    if (deleteErr) {
                      return res.status(500).json({ error: deleteErr.message });
                    }

                    // Check if any rows were affected
                    if (this.changes === 0) {
                      return res
                        .status(404)
                        .json({ error: "Comment not found" });
                    }

                    res.json({ message: "Comment deleted successfully" });
                  }
                );
              }
            );
          }
        );
      }
    );
  }
);

// Route to get all comments for a blog post
router.get("/:blogId", [param("blogId").isInt({ min: 1 })], (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const blogId = req.params.blogId;

  // Retrieve all comments for the specified blog post
  db.all(
    "SELECT * FROM comments WHERE blogId = ?",
    [blogId],
    (err, comments) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ comments });
    }
  );
});

export default router;
