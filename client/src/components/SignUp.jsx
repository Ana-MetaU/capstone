import {useState} from "react";
import {Link} from "react-router-dom";
import './SignUp.css'

const SignUp = () => {
  const [formData, setFormData] = useState({username: "", password: ""});
  const [message, setMessage] = useState("");

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
    console.log("TODO: handle sign up in the backend");
  };

  return (
    <div className="sign-up">
      <div className="signup-logo">
        <p>here we will insert a image that presents my app.</p>
      </div>

    <div className="signup-right">
 <div className="signup-form">
    <h2>PARTY WATCH </h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
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
      <div className="divider">OR</div>

      <p>
        Already have an account?
        <Link to="/login"> Login </Link>
      </p>
    </div>
    </div>
     
  );
};

export default SignUp;
