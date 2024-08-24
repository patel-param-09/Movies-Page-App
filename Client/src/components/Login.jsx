import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import validation from "./LoginValidation";
import { useNavigate } from "react-router-dom";
import fetchClient from "../Services/Instance";

function Login() {
  const Navigate = useNavigate();
  const axiosInstance = fetchClient();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      Navigate("/");
    }
  }, []);

  const [errors, setErrors] = useState({});
  function handleInput(e) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    setErrors(validation(values));
    axiosInstance.post("login", values).then((res) => {
      if (res.data) {
        alert(res.data.message);
        Navigate("/");
      }
      localStorage.setItem("token", res.data.token);
    });
  }
  return (
    <div className="main-login-div">
      <div className="inner-div">
        <form action="" onSubmit={handleSubmit}>
          <h1 className="heading">Login</h1>
          <div className="input-div">
            <div className="email-input">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                onChange={handleInput}
                name="email"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="pass-input">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                onChange={handleInput}
                name="password"
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>
          </div>
          <button className="login-btn" type="submit">
            Login
          </button>
        </form>
        <Link to={"/signup"} className="link">
          Create Account ?
        </Link>
      </div>
    </div>
  );
}

export default Login;