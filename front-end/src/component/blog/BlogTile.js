import React from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const BlogTile = ({ blog }) => {
  // console.log(blog);
  var navigate = useNavigate();
  return (
    <div className="card border-2 border-transparent hover:border-yellow-600 rounded-lg hover:shadow-xl transition duration-300 ease-in-out bg-gray-100">
      {/* <img
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhkk3bTsCGUexAWuCrRaJedXosbyO2jCtevA&amp;usqp=CAU"
    alt=""
    className="w-full rounded-t-md"
  /> */}
      <div className="p-3">
        <div className="text-slate-600 text-sm font-normal pt-2">
          {moment(blog.created_at).format("MM/DD/YYYY")}
        </div>
        <h2 className="text-sky-800 text-lg font-semibold line-clamp-2 pt-2.5 h-[66px]">
          {blog.title}
        </h2>
        <p className="text-slate-700 font-normal line-clamp-2 leading-6 pt-1 h-[52px]">
          {blog.body}
        </p>
        <div className="text-right pt-1">
          <button
            className="text-yellow-600 text-sm font-semibold content-end"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/blog_detail/${blog.id}`);
            }}
          >
            Read More{" "}
            <i
              className="fa fa-arrow-right fa-beat"
              style={{ color: "#d29d2c" }}
            ></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogTile;
