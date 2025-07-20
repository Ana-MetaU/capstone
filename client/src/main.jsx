import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {UserProvider} from "./context/UserContext.jsx";
import "./index.css";
import App from "./App.jsx";
import {ProfileProvider} from "./context/ProfileContext.jsx";
import {FeedProvider} from "./context/FeedContext.jsx";
import {MovieProvider} from "./context/MovieContext.jsx";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <ProfileProvider>
      <FeedProvider>
        <MovieProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MovieProvider>
      </FeedProvider>
    </ProfileProvider>
  </UserProvider>
);
