import {useState} from "react";
import ErrorModal from "../UI/ErrorModal";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import {userLogin} from "../../api/UserApi";
import {useUser} from "../../context/UserContext";
import "./LogIn.css";

const LogIn = () => {
  const {user, setUser, isLoading, setIsLoading} = useUser();
  const [formData, setFormData] = useState({username: "", password: ""});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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
        setIsLoading(false);
        navigate("/");
      }
    } else {
      setErrorMessage(result.message);
      setIsModalOpen(true);
      setIsLoading(false);
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
      <ErrorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={errorMessage}
      />
    </div>
  );
};

export default LogIn;
