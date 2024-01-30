import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveUser } from "../../utility/helper";
import { toast } from "react-toastify";
import { ContextData } from "../context/Context";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setIsLoggedIn, users, setCurrentUser } = useContext(ContextData);
  const navigate = useNavigate();

  function hadleForm({ target }) {
    var { name, value } = target;

    if (name == "email") {
      setEmail(value);
    } else if (name == "username") {
      setUsername(value);
    } else if (name == "password") {
      setPassword(value);
    }
  }
  function handleSubmit(e) {
    e.preventDefault();
    var userData = {
      username,
      email,
      password,
    };

    axios
      .post("http://127.0.0.1:5432/user/registration", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => {
        const { userId } = data;
        saveUser(userId);
        toast.success("Registered successfully!", {
          position: "top-right",
        });
        setIsLoggedIn(true);

        var user = users.find((user) => user.id == userId);
        if (user) {
          setCurrentUser(user);
        }

        navigate("/");
      })
      .catch((error) => {
        // Handle error
        console.error("Error registering!", error);
      });
  }
  return (
    <div className="my-5">
      <h1 className="text-gray-900 font-bold text-2xl mb-2">Register</h1>

      <form method="post" onSubmit={handleSubmit}>
        <div className="md:flex mb-8 bg-[#f9f9fa] p-3">
          <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
            <div className="mb-4">
              <label className="block uppercase tracking-wide text-xs font-bold">
                Username
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
            <div className="mb-4">
              <label className="block uppercase tracking-wide text-xs font-bold">
                Password
              </label>
              <input
                type="password"
                value={password}
                name="password"
                onChange={hadleForm}
                className="w-full shadow-inner p-4 border-0"
              />
            </div>
            <button
              className="rounded-lg px-4 py-2 border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-green-100 duration-300"
              type="submit"
            >
              Register
            </button>
            <div className="my-4">
              <Link to={"/login"} className="text-sky-400">
                Already have an account
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
