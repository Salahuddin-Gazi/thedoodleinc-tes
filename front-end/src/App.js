import React, { useContext } from "react";
import Blog from "./component/blog/blog";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BlogDescription from "./component/blog/BlogDescription";
import { ContextData } from "./component/context/Context";
import Navbar from "./component/navbar/Navbar";
import Login from "./component/authentication/Login";
import Register from "./component/authentication/Register";
import AddBlog from "./component/blog/AddBlog";
import EditBlog from "./component/blog/EditBlog";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FavoritesPage from "./component/Favorites/FavoritesPage";

export function App() {
  const { isLoggedIn } = useContext(ContextData);
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />
      <div className="container md:container-xl mx-auto p-3.5">
        {/* <div className="mb-7 flex justify-center items-center text-center">

        </div> */}
        <Routes>
          <Route path="/" element={<Blog />} />
          <Route path="/blog/favorites" element={<FavoritesPage />} />
          <Route path="/blog_detail/:id" element={<BlogDescription />} />
          <Route path="/blog/add" element={<AddBlog />} />
          <Route path="/blog/edit/:id" element={<EditBlog />} />
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to={"/"} /> : <Login />}
          />
          <Route
            path="/register"
            element={isLoggedIn ? <Navigate to={"/"} /> : <Register />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
