import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { getUser } from "../../utility/helper";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ContextData } from "../context/Context";

const EditBlog = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { id } = useParams();

  var isLoggedIn = getUser();
  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  var userId = getUser();
  const navigate = useNavigate();
  const { setBlogsData, blogsData } = useContext(ContextData);
  var blog = blogsData.find((blog) => blog.id == id);

  if (blog && !!!title && !!!body) {
    setTitle(blog.title);
    setBody(blog.body);
  }

  if (blog && blog.userId != userId) {
    navigate("/");
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  function hadleForm({ target }) {
    var { name, value } = target;
    if (name == "title") {
      setTitle(value);
    } else if (name == "body") {
      setBody(value);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    var blogData = {
      userId,
      title,
      body,
    };

    axios
      .put(`http://127.0.0.1:5432/blog/${blog.id}`, blogData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => {
        // Handle success
        toast.success("Blog updated successfully!", {
          position: "top-right",
        });
        const { blogId } = data;
        var updatedBlogsData = blogsData.map((blog) =>
          blog.id == blogId ? { ...blog, title, body } : blog
        );
        setBlogsData(updatedBlogsData);
        navigate(`/blog_detail/${blogId}`);
      })
      .catch((error) => {
        // Handle error
        // console.error("Error saving comment", error);
        toast.error("Blog updated failed!", {
          position: "top-right",
        });
      });
  }
  return (
    <div className="my-5">
      <h1 className="text-gray-900 font-bold text-2xl mb-2">Update Blog</h1>

      <form method="post" onSubmit={handleSubmit}>
        <div className="md:flex mb-8 bg-[#f9f9fa] p-3">
          <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
            <div className="mb-4">
              <label className="block uppercase tracking-wide text-xs font-bold">
                Title
              </label>
              <input
                type="text"
                value={title}
                name="title"
                onChange={hadleForm}
                className="w-full shadow-inner p-4 border-0"
              />
            </div>
            <div className="mb-4">
              <label className="block uppercase tracking-wide text-xs font-bold">
                Body
              </label>
              <textarea
                value={body}
                placeholder="Write your comment."
                name="body"
                onChange={hadleForm}
                className="w-full shadow-inner p-4 border-0"
                rows={10}
              />
            </div>
            <button
              className="rounded-lg px-4 py-2 border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-green-100 duration-300"
              type="submit"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
