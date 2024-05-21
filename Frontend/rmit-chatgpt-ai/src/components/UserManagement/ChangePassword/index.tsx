import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { HashLink as Link } from "react-router-hash-link";
import styles from "./ChangePassword.module.scss";
import { resetPassword } from "../../../actions/securityActions";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import { useState, useEffect, useRef } from "react";

import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";
import { log } from "console";

const BASE_URL = "https://rmitchatgptai.com";

export interface messagePair {
  key: string;
  value: string;
};

const ChangePassword = () => {

  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [newPassword, setNewPassword] = useState({
    password: "",
    showPassword: false,
  });
  const [confirmPassword, setConfirmPassword] = useState({
    password: "",
    showPassword: false,
  });
  const [isBtnEnable, setBtn] = useState(true);
  const [messages, setMessages] = useState<messagePair[]>([]);

  const queryParameters = new URLSearchParams(window.location.search)

  const handleClickShowPassword = (passwordType: number) => {
    if (passwordType == 1)
      setNewPassword({ ...newPassword, showPassword: !newPassword.showPassword });
    else
      setConfirmPassword({ ...confirmPassword, showPassword: !confirmPassword.showPassword })
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const checkCredentials = () => {
    let message = {
      key: "error",
      value: ""
    }
    if ((email.length > 0) && ((!/^[a-z]+@rmit.edu.au$/i.test(email) && !/^s+[0-9]+@student.rmit.edu.au$/i.test(email)))) {
      message.value = "Please enter a valid RMIT email address";
    }
    else if (code.length <= 0) {
      message.value = "Please enter verification code sent to your registered email";
    }
    else if (newPassword.password.length < 8) {
      message.value = "Password should be atleast 8 characters long"
    }
    else if (!/[!@#$%^&*()_+\-={};:|,.<>?~]/.test(newPassword.password)) {
      message.value = "Contains at least 1 special character"
    }
    else if (!RegExp("[0-9]").test(newPassword.password)) {
      message.value = "Contains at least 1 number"
    }
    else if (!RegExp("[a-z]").test(newPassword.password)) {
      message.value = "Contains at least 1 lowercase letter"
    }
    else if (!RegExp("[A-Z]").test(newPassword.password)) {
      message.value = "Contains at least 1 uppercase letter"
    }
    else if (newPassword.password !== confirmPassword.password) {
      message.value = "Both passwords should match"
    }

    if (message.value.length > 0) {
      setMessages([message])
      return false;
    }
    else {
      setMessages([]);
      return true;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessages([]);
    const reset_password = {
      "username": email,
      "new_password": newPassword.password,
      "confirmation_code": code
    };
    console.log(reset_password)
    if (checkCredentials()) {
      resetPassword(reset_password)
        .then((message) => {
          setMessages(previousState => [{ key: 'message', value: message.toString() }]);
          setTimeout(function () {
            navigate("/login");
            window.location.reload();
          }, 1200);
        },
          (error) => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();

            setMessages(previousState => [{ key: 'error', value: resMessage.toString() }]);
          }
        );
    } else {
      setBtn(true);
    };
  };

  const handleKeyUp = () => {
    if (checkCredentials()) setBtn(false);
    else setBtn(true);
  };

  return (
    <div className={styles.changepassword}>
      <div className={styles.container + " container-fluid"}>
        <div className="row h-100">
          <div className={styles.leftSide + " col-6 d-flex flex-column align-items-center justify-content-center"}>
            <img src={BASE_URL + "/RMITLOGO_LOGIN.png"} className="rounded" alt="..."></img>
            <span className={styles.logo}>RMIT ChatGPT AI</span>
          </div>
          <div className={styles.rightSide + " col-6 d-flex flex-column align-items-center justify-content-center"}>
            <div className={styles.insideContainer + " col-6"}>
              {Object.values(messages).map((item, index) => {
                if (item.key === "message") {
                  return (
                    <div key={index} className="alert alert-success text-center" role="alert">
                      {item.value}
                    </div>
                  )
                }
                else if (item.key == "error") {
                  return (
                    <div key={index} className="alert alert-danger text-center" role="alert">
                      {item.value}
                    </div>
                  )
                }

              })}
              <span className={styles.heading}>Change Password</span>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup + " form-group"}>
                  <label htmlFor="email" className={styles.inputLabel}>Email Address</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Email Address"
                    name="username"
                    value={email}
                    onKeyUp={handleKeyUp}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup + " form-group"}>
                  <label htmlFor="code" className={styles.inputLabel}>Email Verification Code</label>
                  <input
                    id="code"
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Verification Code"
                    name="code"
                    value={code}
                    onKeyUp={handleKeyUp}
                    onChange={(event) => setCode(event.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup + " form-group"}>
                  <label htmlFor="password" className={styles.inputLabel}>New Password</label>
                  <Input
                    id="password"
                    type={newPassword.showPassword ? "text" : "password"}
                    className={styles.Input + " form-control form-control-lg"}
                    placeholder="************"
                    name="password"
                    value={newPassword.password}
                    onKeyUp={handleKeyUp}
                    onChange={(event) => setNewPassword({ ...newPassword, ["password"]: event.target.value })}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleClickShowPassword(1)}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {newPassword.showPassword ? <Visibility /> : <VisibilityOff />}
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
                          onClick={() => handleClickShowPassword(3)}
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
                      value="Submit"
                      className={"btn btn-block mt-4 " + styles.submitButton}
                      disabled={isBtnEnable} />
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

export default ChangePassword;
