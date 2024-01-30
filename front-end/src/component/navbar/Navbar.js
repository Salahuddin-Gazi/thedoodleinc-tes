import React, { useContext, useState } from "react";
import { ContextData } from "../context/Context";
import { removeUser } from "../../utility/helper";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHamburger } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const { isLoggedIn, currentUser, setIsLoggedIn, setCurrentUser } =
    useContext(ContextData);
  var [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    removeUser();
    setIsLoggedIn(false);
    setCurrentUser({});
    toast.warning("User logged out!", {
      position: "top-right",
    });
    navigate("/");
  }
  function toggleMenu() {
    setShowMenu((prev) => !prev);
  }
  var menuClass = showMenu
    ? "w-full md:flex md:items-center md:w-auto"
    : "hidden w-full md:flex md:items-center md:w-auto";
  return (
    <header className="border-b border-gray-200 dark:border-gray-600">
      <nav
        className="
          flex flex-wrap
          items-center
          justify-between
          w-full
          py-4
          md:py-0
          px-4
          text-lg text-gray-700
          bg-white
          container md:container-xl mx-auto p-3.5
        "
      >
        <Link to={"/"}>
          {" "}
          <h2 className="text-5xl leading-normal font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-orange-500">
            Blog
          </h2>
        </Link>
        <div className={menuClass} id="menu">
          <ul
            className="
              pt-4
              text-base text-gray-700
              md:flex
              md:justify-between 
              md:pt-0"
          >
            {isLoggedIn && (
              <>
                <li>
                  <Link
                    className="md:p-4 py-2 block hover:text-purple-400 text-purple-500"
                    to={"/blog/add"}
                  >
                    Add Blog
                  </Link>
                </li>
                <li>
                  <a
                    className="md:p-4 py-2 block hover:text-purple-400 text-purple-500"
                    href="/blog/favorites"
                  >
                    Favorites
                  </a>
                </li>
              </>
            )}
            {!!!isLoggedIn ? (
              <li>
                <Link
                  className="md:p-4 py-2 block hover:text-purple-400 text-purple-500"
                  to={"/login"}
                >
                  Sign In
                </Link>
              </li>
            ) : (
              <>
                {" "}
                <li>
                  <div className="md:p-4 py-2 block">
                    {currentUser.username}
                  </div>
                </li>
                <li>
                  <button
                    className="md:p-4 py-2 block hover:text-purple-400 text-purple-500"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
        <button className="md:hidden" onClick={toggleMenu}>
          {!showMenu ? (
            <FaHamburger size={30} color="red" />
          ) : (
            <IoMdClose size={30} color="red" />
          )}
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
