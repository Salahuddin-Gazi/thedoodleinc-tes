import React, { useContext, useEffect, useState } from "react";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { ContextData } from "../context/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getUser } from "../../utility/helper";

const Favorites = ({ blog }) => {
  var { favoritedUserIds } = blog;
  var [isUserFavorited, setIsUserFavorited] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(ContextData);
  var userId = getUser();

  useEffect(() => {
    if (!!favoritedUserIds) {
      var userIdsInFavorite = favoritedUserIds
        ? favoritedUserIds.split(",").map(Number)
        : [];
      var index = userIdsInFavorite.findIndex((user) => user == userId);
      if (index >= 0) {
        setIsUserFavorited(true);
      } else {
        setIsUserFavorited(false);
      }
    }
  }, []);

  function handleClick() {
    if (!!!isLoggedIn) {
      return navigate("/login");
    }

    var favoriteData = {
      userId: userId,
      blogId: blog.id,
    };
    axios
      .post("http://127.0.0.1:5432/blog//toggle-favorite", favoriteData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => {
        // Handle success
        var { message, favoritedUserIds } = data;
        toast.success(message, {
          position: "top-right",
        });

        if (!!favoritedUserIds) {
          console.log(favoritedUserIds);
          var userIdsInFavorite = favoritedUserIds
            ? favoritedUserIds.split(",").map(Number)
            : [];
          var index = userIdsInFavorite.findIndex((user) => user == userId);
          if (index >= 0) {
            setIsUserFavorited(true);
          } else {
            setIsUserFavorited(false);
          }
        } else {
          setIsUserFavorited(false);
          console.log(isUserFavorited);
        }
      })
      .catch((error) => {
        // Handle error
        // console.error("Error saving comment", error);
        toast.error("Favorite toggle error!", {
          position: "top-right",
        });
      });
  }
  return (
    <button onClick={handleClick} title="Toggle Favorite">
      {!isUserFavorited ? (
        <MdFavoriteBorder size={40} color="red" />
      ) : (
        <MdFavorite size={40} color="red" />
      )}
    </button>
  );
};

export default Favorites;
