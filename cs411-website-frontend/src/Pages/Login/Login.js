import React from "react";
import Button from "@mui/material/Button";
import { useState } from "react";
import { TextField } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import "./Login.css";

import { Link } from "react-router-dom";
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

const Login = () => {
    
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    var handleLogin = (e) => {
      e.preventDefault();
      let body = {
        "email": email,
        "password": password
      }
      axios.post("http://localhost:8000/login",body).then((res) => {
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
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div>
          <Button className="button1" type="submit" variant="contained" style={{backgroundColor:'#12565a'}} onClick = {handleLogin} >
            Log In
          </Button>

          <p className="SignRout">
            {" "}
            Don't have an account?
            <Link className="SignRout_b" to="/SignUp">
              {" "}
              Sign-Up
            </Link>
          </p>
        </div>
      </form>
    </div>
    );

};
export default Login;