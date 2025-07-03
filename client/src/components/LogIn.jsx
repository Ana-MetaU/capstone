import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import {userLogin} from "../api/UserApi";
import {useUser} from "../context/UserContext";
import "./LogIn.css";

const LogIn = () => {
  console.log("what hpapening")
  const [formData, setFormData] = useState({username: "", password: ""});
  const navigate = useNavigate();
  const {user, setUser, isLoading, setIsLoading} = useUser();
  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    const result = await userLogin(formData);
    if (result.success) {
      if (result.user) {
        setUser(result.user);
        if (user) {
          setIsLoading(false);
        }
      }
      console.log("user", user);
      navigate("/");
    } else {
    }
  };

  return (
    <div className="log-in">
      <h1>PARTY WATCH</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          j
          onChange={handleChange}
          required
        />

        <button type="submit">Log In</button>
      </form>

      <div className="hr-lines">
        <span> OR </span>
      </div>

      <p>
        Don't have an account?
        <Link to="/signup"> Sign Up </Link>
      </p>
    </div>
  );
};

export default LogIn;
