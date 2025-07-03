import React, {useState, useEffect} from "react";
import {useUser} from "./context/UserContext.jsx";
import WithAuth from "./components/WithAuth.jsx";
import {MovieProvider} from "./context/MovieContext.jsx";
import {Routes, Route} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Layout from "./components/Layout.jsx";
import "./App.css";

function App() {
  const {user} = useUser();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user) {
  //     navigate('/login');
  //   }
  // },  [user]);
    return (
      <MovieProvider>
        <Routes>
          <Route path="/*" element={<Layout />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
        </Routes>
      </MovieProvider>
    );
  }


export default App;
