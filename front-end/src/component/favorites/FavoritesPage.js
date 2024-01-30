import React, { useContext, useState } from "react";
import { getUser } from "../../utility/helper";
import { Link, Navigate } from "react-router-dom";
import { ContextData } from "../context/Context";
import BlogTile from "../blog/BlogTile";

const FavoritesPage = () => {
  var userId = getUser();
  if (!userId) {
    return <Navigate to={"/login"} />;
  }

  var [favoritedBlogs, setFavoritedBlogs] = useState([]);
  const { blogsData } = useContext(ContextData);

  if (favoritedBlogs.length == 0) {
    var tempFavoritedBlogs = [];
    blogsData.forEach((blog) => {
      var { favoritedUserIds } = blog;
      if (!!favoritedUserIds) {
        var userIdsInFavorite = favoritedUserIds
          ? favoritedUserIds.split(",").map(Number)
          : [];
        var index = userIdsInFavorite.findIndex((user) => user == userId);
        if (index >= 0) {
          tempFavoritedBlogs.push(blog);
        }
      }
    });
    // console.log("tempFavoritedBlogs", tempFavoritedBlogs);
    if (tempFavoritedBlogs.length > 0) {
      setFavoritedBlogs(tempFavoritedBlogs);
    }

    return <div>Add some blogs to your favorite list to show.</div>;
  }

  var blogs_view = favoritedBlogs.map((blog) => (
    <Link to={`/blog_detail/${blog.id}`} key={blog.id}>
      <BlogTile blog={blog} key={blog.id} />
    </Link>
  ));

  return (
    <>
      <h1 className="text-gray-900 font-bold text-2xl mb-2">Favorite Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-8">
        {blogs_view}
      </div>
    </>
  );
};

export default FavoritesPage;
