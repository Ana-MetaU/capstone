import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import Graphic from "../UI/Graphic";
import {userSignup} from "../../api/UserApi";
import "./SignUp.css";

const SignUp = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  // Handle input changes
  const handleChange = (event) => {
    const {name, value} = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents page refresh
    console.log("User Input:", formData); // Logs user input

    const result = await userSignup(formData);
    console.log("resultsss", result);

    if (result.success) {
      navigate("/login");
    } else {
      setMessage("something went wrong");
    }

    // have to add later for more robustness if username is not unique, inform the user
  };

  return (
    <div className="sign-up">
      <div className="signup-logo">
        <div className="image-wrapper">
          <Graphic></Graphic>
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-form">
          <div className="title">
            <h2>PARTY WATCH </h2>
            <h3>Discover. Watch. Track.Repeat </h3>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              type="text"
              id="username"
              placeholder="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="text"
              id="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
            />
            <div className="form-buttons">
              <button type="submit">Sign Up</button>
            </div>
            {message && (
              <div className={`message ${message.type}`}>{message.text}</div>
            )}
          </form>
        </div>

        <div className="hr-lines">
          <span> OR </span>
        </div>

        <p>
          Already have an account?
          <Link to="/login"> Login </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
