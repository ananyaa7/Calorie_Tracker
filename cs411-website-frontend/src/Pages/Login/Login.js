import React from "react";
import Button from "@mui/material/Button";
import { useState } from "react";
import { TextField } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import { Link } from 'react-router-dom';
import {Modal} from "react-bootstrap";



import "./Login.css";


import axios from "axios";

const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing(10),
      backgroundColor: "white",
      "& .MuiTextField-root": {
        margin: theme.spacing(2),
        width: "300px",
      },
      "& .MuiButtonBase-root": {
        margin: theme.spacing(2),
        width: "300px",
      },
    },
  }));


function setBody(userBody){
  sessionStorage.setItem('body', JSON.stringify(userBody));
}

function getBody(){
  const tokenBody = sessionStorage.getItem('body');
  const userToken = JSON.parse(tokenBody);
  return userToken?.token
}


const Login = () => {
    
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [errorEmail,setErrorEmail] = useState("");
    const [errorPass,setErrorPass] = useState("");
    const [show, setShow] = useState(false);
    const [authed, setAuthed] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    var handleLogin = (e) => {
      e.preventDefault();
      let body = {
        "email": email,
        "password": password
      }
      axios.post("http://localhost:8000/login",body).then((res) => {
        console.log(res);
        if (res.data == "successful")
        {
          setErrorPass(res.data);
          setErrorEmail(res.data);
          
        }
        else if (res.data == "Password incorrect")
        {
          //show password incorrect
          setErrorPass(res.data);
        }
        else{
          //email incorrect
          setErrorEmail(res.data)
          setErrorPass("Password incorrect");
        }
      })
    }

    var handleUpdatePass = () =>
    {
      console.log(newPassword)
      let body = {
        "email": email,
        "password": newPassword
      }
      axios.post("http://localhost:8000/forgotpassword",body).then((res) => {
        console.log(res.status);
      })
    }

    return(
    <div className="LogIn">
      <form className={classes.root}>
        <h className="title">Welcome Back!</h>
    
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error = {errorEmail === "Email incorrect"}
          helperText={errorEmail === "Email incorrect" ? 'Email incorrect!' : ' '}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          required
          value={password}
          id="outlined-error"
          onChange={(e) => setPassword(e.target.value)}
          error = {errorPass === "Password Incorrect"}
          helperText={errorPass === "Password incorrect" ? 'Password incorrect!' : ' '}
        />

        <div>
          <Button className="button1" variant="contained" style={{backgroundColor:'#12565a'}} onClick ={handleLogin}>
            Log In
          </Button>


          <p className="SignRout">
            {" "}
            Don't have an account?
            <Link className="SignRout_b" to="/SignUp">
              {" "}
              Sign-Up
            </Link>
            <br></br>

            <p className="ForgotPass"  onClick={() => handleShow()}>
              {" "}
              Forgot password?
            </p>
          </p>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Update your password</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <TextField 
              style={{ textAlign:"center" }} 
              id="outlined-basic" 
              label="New Password" 
              variant="outlined" 
              onChange={(e)=>{setNewPassword(e.target.value)}}
              />

            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary">Close</Button>
              <Button variant="primary" onClick ={ () => {handleUpdatePass(); handleClose();}}>Save changes</Button>
            </Modal.Footer>
        </Modal>

        </div>
      </form>
    </div>
    );

};
export default Login;