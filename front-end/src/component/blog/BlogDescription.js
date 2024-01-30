import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContextData } from "../context/Context";
import axios from "axios";
import CommentsSection from "./CommentsSection";
import WriteComment from "./WriteComment";
import { Button } from "../Button";
import { getUser } from "../../utility/helper";
import Favorites from "./Favorites";

const BlogDescription = () => {
  const [blogComments, setBlogComments] = useState([]);
  const { blogsData, users } = useContext(ContextData);
  const { id } = useParams();
  const navigate = useNavigate();

  var prevComments = JSON.parse(sessionStorage.getItem("comments"));
  if (!prevComments) {
    sessionStorage.setItem("comments", JSON.stringify({}));
    prevComments = JSON.parse(sessionStorage.getItem("comments"));
  }
  var comments = prevComments[id];

  useEffect(() => {
    if (!comments) {
      axios
        .get(`http://127.0.0.1:5432/comment/${id}`)
        .then((res) => {
          const { comments } = res.data;
          if (comments && comments.length > 0) {
            setBlogComments(comments);
          }
        })
        .catch((error) => console.log(error));
    }
  }, []);

  if (blogComments.length > 0 && !comments) {
    prevComments[id] = blogComments;
    comments = blogComments;
    sessionStorage.setItem("comments", JSON.stringify(prevComments));
  }

  var index = blogsData.findIndex((blog) => blog.id == id);

  if (index < 0) {
    return <div>Blog not found</div>;
  }

  var blog = blogsData[index];
  var user = users.find((user) => user.id == blog.userId);

  var isAuthorized = user ? user.id == getUser() : false;

  function handleClick() {
    navigate(`/blog/edit/${blog.id}`);
  }

  return (
    <>
      <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16 relative">
        <div className="max-w-2xl mx-auto">
          <div className="mt-3 bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
            <div>
              <h1 className="text-gray-900 font-bold text-3xl mb-2">
                {blog.title}
              </h1>
              <p className="text-gray-700 text-xs mt-2">
                <span>{user && <>{user.username}</>}</span>
                <br />
                <span>{user && <>{user.email}</>}</span>
              </p>
              <p className="text-base leading-8 my-5">{blog.body}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5">
          {isAuthorized && <Button clickEvent={handleClick}>Update</Button>}
          <Favorites blog={blog} />
        </div>
      </div>
      <WriteComment setComments={(data) => setBlogComments(data)} />
      {comments && comments.length > 0 && (
        <div>
          <h1 className="text-gray-900 font-bold text-2xl mb-2">
            Comment Section
          </h1>
          <CommentsSection
            comments={comments}
            setComments={(data) => setBlogComments(data)}
          />
        </div>
      )}
    </>
  );
};

export default BlogDescription;
