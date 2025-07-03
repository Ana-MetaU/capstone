import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useUser} from "../context/UserContext";

const WithAuth = (WrappedComponent) => {
  return function ProtectedComponent(props) {
    const {user, setUser} = useUser();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        fetch("http://localhost:3000/auth/me", {credentials: "include"})
          .then((response) => response.json())
          .then((data) => {
            if (data.id) {
              console.log("data", data);
              setUser(data);
            } else {
              navigate("/login");
            }
          })
          .catch(() => {
            navigate("/login");
          });
      }
    }, [user, setUser, navigate]);

    if (!user) {
      return <p>Loading...</p>; // Prevents flickering
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
