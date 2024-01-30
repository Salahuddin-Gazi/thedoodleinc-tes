import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContextData } from "../context/Context";
import { getUser } from "../../utility/helper";
import { toast } from "react-toastify";

const WriteComment = ({ setComments }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  var { id } = useParams();
  var { currentUser } = useContext(ContextData);
  var userId = getUser();

  useEffect(() => {
    if (!!currentUser?.username) {
      setUsername(currentUser.username);
      setEmail(currentUser.email);
      // console.log(user);
    }
  }, []);

  function hadleForm({ target }) {
    var { name, value } = target;
    if (name == "username") {
      setUsername(value);
    } else if (name == "email") {
      setEmail(value);
    } else {
      setBody(value);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    var commentData = {
      blogId: id,
      name: username,
      email: email,
      body: body,
    };

    axios
      .post("http://127.0.0.1:5432/comment/add", commentData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => {
        // Handle success
        // console.log("Comment saved successfully", response.data);
        var { commentId } = data;

        var prevComments = JSON.parse(sessionStorage.getItem("comments"));
        if (!prevComments) {
          sessionStorage.setItem("comments", JSON.stringify({}));
          prevComments = JSON.parse(sessionStorage.getItem("comments"));
        }
        if (!prevComments[id]) {
          prevComments[id] = [];
        }
        prevComments[id].push({ ...commentData, id: commentId });
        sessionStorage.setItem("comments", JSON.stringify(prevComments));
        toast.success("Comment added!", {
          position: "top-right",
        });
        setComments(prevComments);
        setBody("");
      })
      .catch((error) => {
        // Handle error
        // console.error("Error saving comment", error);
        toast.error("Error adding comment !", {
          position: "top-right",
        });
      });
  }
  return (
    <div className="my-5">
      <h1 className="text-gray-900 font-bold text-2xl mb-2">Write a comment</h1>

      <form method="post" onSubmit={handleSubmit}>
        <div className="md:flex mb-8 bg-[#f9f9fa] p-3">
          <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
            {!!!userId && (
              <>
                <div className="mb-4">
                  <label className="block uppercase tracking-wide text-xs font-bold">
                    Name
                  </label>
                  <input
                    type="text"
                    value={username}
                    name="username"
                    onChange={hadleForm}
                    className="w-full shadow-inner p-4 border-0"
                  />
                </div>
                <div className="mb-4">
                  <label className="block uppercase tracking-wide text-xs font-bold">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    name="email"
                    onChange={hadleForm}
                    className="w-full shadow-inner p-4 border-0"
                  />
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block uppercase tracking-wide text-xs font-bold">
                Comment
              </label>
              <textarea
                value={body}
                placeholder="Write your comment."
                name="body"
                onChange={hadleForm}
                className="w-full shadow-inner p-4 border-0"
                rows={3}
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

export default WriteComment;
