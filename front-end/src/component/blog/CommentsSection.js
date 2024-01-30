import moment from "moment";
import React, { useContext } from "react";
import { ContextData } from "../context/Context";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const CommentsSection = ({ comments, setComments }) => {
  const { currentUser } = useContext(ContextData);
  const { id: blogId } = useParams();

  function handleDelete(comment) {
    var { id, email } = comment;
    axios
      .delete(
        "http://127.0.0.1:5432/comment/delete",
        {
          data: {
            id,
            email,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(({ data }) => {
        // Handle success
        // console.log("Comment saved successfully", response.data);
        var { message } = data;

        var prevComments = JSON.parse(sessionStorage.getItem("comments"));
        // console.log("prevComments", prevComments);
        if (!!prevComments && prevComments[blogId].length > 0) {
          var tempBlogComments = prevComments[blogId].filter(
            (comment) => comment.id != id
          );
          //   console.log("tempBlogComments", tempBlogComments);
          prevComments[blogId] = tempBlogComments;
          sessionStorage.setItem("comments", JSON.stringify(prevComments));
          setComments(prevComments);
        }

        toast.success(message, {
          position: "top-right",
        });
      })
      .catch((error) => {
        // Handle error
        // console.error("Error saving comment", error);
        toast.error("Error deleting comment !", {
          position: "top-right",
        });
      });
  }
  var section = comments.map((comment) => (
    <article
      key={comment.id}
      className="pt-6 pb-3 px-6 text-base bg-white rounded-lg dark:bg-gray-900"
    >
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
            {comment.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {moment(comment.created_at).format("DD/MM/YYYY")}
          </p>
        </div>
      </footer>
      <p className="text-gray-500 dark:text-gray-400">{comment.body}</p>
      {Object.keys(currentUser).length > 0 &&
        currentUser.email == comment.email && (
          <button className="mt-2" onClick={() => handleDelete(comment)}>
            <MdDelete size={30} color="red" />
          </button>
        )}
    </article>
  ));
  return <div className="flex flex-col gap-y-3">{section}</div>;
};

export default CommentsSection;
