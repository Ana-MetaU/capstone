import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {UserProvider} from "./context/UserContext.jsx";
import "./index.css";
import App from "./App.jsx";
import {ProfileProvider} from "./context/ProfileContext.jsx";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <ProfileProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProfileProvider>
  </UserProvider>
);
