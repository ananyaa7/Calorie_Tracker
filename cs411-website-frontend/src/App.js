
import { Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./Components/Navbar";
import SignUp from './Pages/SignUp/SignUp';
import Login from "./Pages/Login/Login";
import Landing from "./Pages/Landing/Landing";

function App() {
  return (
    <div>
      <Navbar/>
      <Main />
    </div>
  );
}


const Main = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUp/>} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Landing" element={<Landing />} />
    </Routes>
  );
};

export default App;
