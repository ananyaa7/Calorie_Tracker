import React from "react";
import Button from "@mui/material/Button";
import { useState } from "react";
import { TextField } from "@mui/material";
import { makeStyles } from "@material-ui/core";
import axios from 'axios';
import "./SignUp.css";

import { Link } from "react-router-dom";

//Pop up the sign up component when clicked, close otherwise

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



const SignUp = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  var handleSignup = () => {
    let body = {
      "firstName": "Heet",
      "lastName": "Parikh",
      "email": email,
      "password": password
    }
    axios.post("http://localhost:8000/signup", body).then((res) => {
      setEmail(res.data.email)
      setPassword(res.data.password)
    })
  }
  return (
    <div className="SignUp">
      <form className={classes.root}>
        <h className="title">Calories Tracker</h>
       
        <TextField
          label="First Name"
          variant="outlined"
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          type="text"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
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
          <Button className="button1" type="submit" variant="contained" style={{backgroundColor:'#12565a'}} onClick = {handleSignup} >
            Sign Up
          </Button>

          <p className="logRout">
            {" "}
            Already have an account?
            <Link className="logRout_b" to="/Login">
              {" "}
              Log-In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
