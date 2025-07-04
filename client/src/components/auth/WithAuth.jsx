import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useUser} from "../../context/UserContext";
import {userAuthenticate} from "../../api/UserApi";
const WithAuth = (WrappedComponent) => {
  return function ProtectedComponent(props) {
    const {user, setUser} = useUser();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        userAuthenticate()
          .then((result) => {
            if (result.success) {
              setUser(result.user);
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
