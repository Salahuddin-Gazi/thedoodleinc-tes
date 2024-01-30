import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { getUser } from "../../utility/helper";

export const ContextData = createContext(null);

function Context({ children }) {
  var [blogsData, setBlogsData] = useState([]);
  var [users, setUsers] = useState([]);
  var [currentUser, setCurrentUser] = useState({});
  var [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (getUser()) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    axios
      .get("http://127.0.0.1:5432/blog")
      .then((res) => {
        const { blogs } = res.data;
        if (blogs && blogs.length > 0) {
          setBlogsData(blogs);
        }
      })
      .catch((error) => console.log(error));

    axios
      .get("http://127.0.0.1:5432/user/users")
      .then((res) => {
        const users = res.data;
        if (users && users.length > 0) {
          setUsers(users);

          if (getUser()) {
            var userId = getUser();
            var user = users.find((user) => user.id == userId);
            if (user) {
              setCurrentUser(user);
            }
          }
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <ContextData.Provider
      value={{
        blogsData,
        setBlogsData,
        users,
        isLoggedIn,
        setIsLoggedIn,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </ContextData.Provider>
  );
}

export default Context;
