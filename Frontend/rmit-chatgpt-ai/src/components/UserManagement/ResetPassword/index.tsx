import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { useNavigate, useParams } from 'react-router-dom';
import { HashLink as Link } from "react-router-hash-link";
import styles from "./ResetPassword.module.scss";
import { login, completePasswordReset } from "../../../actions/securityActions";
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

const ResetPassword = () => {

  let navigate = useNavigate();

  const [password, setPassword] = useState({
    password: "",
    showPassword: false,
  });
  const [confirmPassword, setConfirmPassword] = useState({
    password: "",
    showPassword: false,
  });
  const [isBtnEnable, setBtn] = useState(true);
  const [messages, setMessages] = useState<messagePair[]>([]);

  // const queryParameters = new URLSearchParams(window.location.search)
  const { username, session } = useParams();
  console.log(username, session)
  // const username = queryParameters.get("username")

  const handleClickShowPassword = (passwordType: number) => {
    if (passwordType == 1)
      setPassword({ ...password, showPassword: !password.showPassword });
    else
      setConfirmPassword({ ...confirmPassword, showPassword: !confirmPassword.showPassword });
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const checkCredentials = () => {
    let message = {
      key: "error",
      value: ""
    }

    if (password.password.length < 8) {
      message.value = "Password should be atleast 8 characters long"
      setMessages([message])
      return false;
    }
    if (!/[!@#$%^&*()_+\-={};:|,.<>?~]/.test(password.password)) {
      message.value = "Contains at least 1 special character"
      setMessages([message])
      return false;
    }
    if (!RegExp("[0-9]").test(password.password)) {
      message.value = "Contains at least 1 number"
      setMessages([message])
      return false;
    }
    if (!RegExp("[a-z]").test(password.password)) {
      message.value = "Contains at least 1 lowercase letter"
      setMessages([message])
      return false;
    }
    if (!RegExp("[A-Z]").test(password.password)) {
      message.value = "Contains at least 1 uppercase letter"
      setMessages([message])
      return false;
    }
    if (password.password !== confirmPassword.password) {
      message.value = "Both passwords should match"
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
      "session": session,
      "new_password": password.password,
      "username": username
    };
    console.log(reset_password)
    if (checkCredentials()) {
      completePasswordReset(reset_password)
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

            setMessages(resMessage);
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
    <div className={styles.login}>
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
              <span className={styles.heading}>Reset Password</span>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup + " form-group"}>
                  <label htmlFor="password" className={styles.inputLabel}>New Password</label>
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

export default ResetPassword;
