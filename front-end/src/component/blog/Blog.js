import React, { useContext } from "react";
import { Link } from "react-router-dom";
import BlogTile from "./BlogTile";
import { ContextData } from "../context/Context";

const Blog = () => {
  const { blogsData } = useContext(ContextData);
  if (blogsData.length == 0) {
    return <div>Add some blogs to show</div>;
  }
  var blogs_view = blogsData.map((blog) => (
    <Link to={`/blog_detail/${blog.id}`} key={blog.id}>
      <BlogTile blog={blog} key={blog.id} />
    </Link>
  ));

  return (
    <>
      <h1 className="text-gray-900 font-bold text-2xl mb-2">All Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-8">
        {blogs_view}
      </div>
    </>
  );
};

export default Blog;
