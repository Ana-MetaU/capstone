import {MovieProvider} from './context/MovieContext.jsx'
import {Routes, Route} from "react-router-dom";
import LogIn from "./components/LogIn";
import Home from "./components/Home";
import "./App.css";
import SignUp from "./components/SignUp";

function App() {
  return (
    <MovieProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </MovieProvider>
  );
}

export default App;
