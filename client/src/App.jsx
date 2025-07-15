import {MovieProvider} from "./context/MovieContext.jsx";
import {Routes, Route} from "react-router-dom";
import LogIn from "./components/auth/LogIn";
import SignUp from "./components/auth/SignUp";
import Layout from "./components/Layout/Layout.jsx";
import "./App.css";
import {TVShowContext, TVShowProvider} from "./context/TvShowContext.jsx";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Layout />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn />} />
    </Routes>
  );
}

export default App;
