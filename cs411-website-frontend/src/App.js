
import { Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./Components/Navbar";
import SignUp from './Pages/SignUp/SignUp';
import Login from "./Pages/Login/Login";
import Landing from "./Pages/Landing/Landing";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
<script src="https://unpkg.com/bootstrap-table@1.19.1/dist/bootstrap-table.min.js"></script>


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
