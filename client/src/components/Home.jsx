import React, {useState} from "react";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import Graphic from "./Graphic";
import Sidebar from "./Sidebar";

const Home = () => {
  const [activeIcon, setActiveIcon] = useState('tv-shows');
  return (
    <div>
      <Sidebar activeIcon={activeIcon} 
      onActiveIconChange={setActiveIcon} />
    </div>
  );
};

export default Home;
