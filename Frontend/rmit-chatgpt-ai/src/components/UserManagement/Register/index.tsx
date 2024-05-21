import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import styles from "./Register.module.scss";
// import { register } from "../../actions/securityActions";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";

import { useState, useEffect, useRef } from "react";


const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState({
    password: "",
    showPassword: false,
  });
  const [confirmPassword, setConfirmPassword] = useState({
    password: "",
    showPassword: false,
  });
  const [isEnable, setEnable] = useState(true);

  const handleClickShowPassword = (passwordType: number) => {
    if (passwordType == 1)
      setPassword({ ...password, showPassword: !password.showPassword });
    else
      setConfirmPassword({ ...confirmPassword, showPassword: !confirmPassword.showPassword });
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(event.currentTarget.elements);
    console.log(event.currentTarget.elements[0]);
  };

  const handleKeyUp = () => {
    if (name.length > 1 && name.length < 25 &&
      username.length > 5 &&
      /^[a-z]+@rmit.edu.au$/i.test(email) &&
      password.password.length > 0 &&
      password.password == confirmPassword.password
    ) {
      setEnable(false);
    }
    else setEnable(true);
  };

  return (
    <div className={styles.register}>
      <div className={styles.container + " container-fluid"}>
        <div className="row h-100">
          <div className={styles.leftSide + " col-6 d-flex flex-column align-items-center justify-content-center"}>
            <img src="RMITLOGO_LOGIN.png" className="rounded" alt="..."></img>
            <span className={styles.logo}>RMIT ChatGPT AI</span>
          </div>
          <div className={styles.rightSide + " col-6 d-flex flex-column align-items-center justify-content-center"}>
            <div className={styles.insideContainer + " col-6"}>
              <span className={styles.heading}>Create Account</span>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup + " form-group"}>
                  <label htmlFor="username" className={styles.inputLabel}>Username</label>
                  <Input
                    id="username"
                    type="text"
                    className={styles.Input + " form-control form-control-lg"}
                    placeholder="Enter Username"
                    name="username"
                    value={username}
                    onKeyUp={handleKeyUp}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup + " form-group"}>
                  <label htmlFor="name" className={styles.inputLabel}>Full Name</label>
                  <Input
                    id="name"
                    type="text"
                    className={styles.Input + " form-control form-control-lg"}
                    placeholder="Enter Full Name"
                    name="name"
                    value={name}
                    onKeyUp={handleKeyUp}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup + " form-group"}>
                  <label htmlFor="email" className={styles.inputLabel}>Email Address</label>
                  <Input
                    id="email"
                    type="email"
                    className={styles.Input + " form-control form-control-lg"}
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onKeyUp={handleKeyUp}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup + " form-group"}>
                  <label htmlFor="password" className={styles.inputLabel}>Password</label>
                  <Input
                    id="password"
                    type={password.showPassword ? "text" : "password"}
                    className={styles.Input + " form-control form-control-lg"}
                    placeholder="************"
                    name="password"
                    value={password.password}
                    onKeyUp={handleKeyUp}
                    onChange={(event) => setPassword({ ...password, ["password"]: event.target.value })}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleClickShowPassword(1)}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {password.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    required
                  />
                </div>
                <div className={styles.formGroup + " form-group"}>
                  <label htmlFor="confirmPassword" className={styles.inputLabel}>Confirm Password</label>
                  <Input
                    id="confirmPassword"
                    type={confirmPassword.showPassword ? "text" : "password"}
                    className={styles.Input + " form-control form-control-lg"}
                    placeholder="************"
                    name="password"
                    value={confirmPassword.password}
                    onKeyUp={handleKeyUp}
                    onChange={(event) => setConfirmPassword({ ...confirmPassword, ["password"]: event.target.value })}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleClickShowPassword(2)}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {confirmPassword.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    required
                  />
                </div>
                <div className={"d-flex flex-column"}>
                  <div className={""}>
                    <input type="submit"
                      value="Signup"
                      className={"btn btn-block mt-4 " + styles.submitButton}
                      disabled={isEnable} />
                  </div>
                  <div className={styles.lineDiv + " d-flex flex-row w-100 justify-content-center"}>
                    <span className={styles.line + " col-5"}></span>
                    <span className={styles.orText + " col-2"} >or</span>
                    <span className={styles.line + " col-5"}></span>
                  </div>
                  <span className={styles.text + " text-center"}>Already have an Account?</span>
                  <div>
                    <Link className={"btn btn-block " + styles.altButton} to="/login">
                      Login
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}

export default Register;
