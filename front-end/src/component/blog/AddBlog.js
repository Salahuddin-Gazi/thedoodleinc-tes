import axios from "axios";
import React, { useContext, useState } from "react";
import { getUser } from "../../utility/helper";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ContextData } from "../context/Context";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  var userId = getUser();
  const navigate = useNavigate();
  const { setBlogsData, blogsData } = useContext(ContextData);
  var isLoggedIn = getUser();
  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
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
      .post("http://127.0.0.1:5432/blog/add", blogData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => {
        // Handle success
        toast.success("Blog added successfully!", {
          position: "top-right",
        });
        const { blogId } = data;
        setBlogsData((prevBlogs) => [
          ...prevBlogs,
          { id: blogId, userId, title, body },
        ]);
        setBody("");
        setTitle("");
        navigate(`/blog_detail/${blogId}`);
      })
      .catch((error) => {
        // Handle error
        console.error("Error saving comment", error);
      });
  }
  return (
    <div className="my-5">
      <h1 className="text-gray-900 font-bold text-2xl mb-2">Add Blog</h1>

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
                placeholder="Add a title."
              />
            </div>
            <div className="mb-4">
              <label className="block uppercase tracking-wide text-xs font-bold">
                Body
              </label>
              <textarea
                value={body}
                placeholder="Add blog body."
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
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
