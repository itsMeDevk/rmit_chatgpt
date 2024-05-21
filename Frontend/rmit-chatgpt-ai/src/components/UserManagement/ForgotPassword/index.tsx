import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { useNavigate } from 'react-router';
import { HashLink as Link } from "react-router-hash-link";
import styles from "./ForgotPassword.module.scss";
import { forgotPassword } from "../../../actions/securityActions";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import { useState, useEffect, useRef } from "react";

import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";

export interface messagePair {
  key: string;
  value: string;
};

const ForgotPassword = () => {

  let navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [isBtnEnable, setBtn] = useState(true);
  const [messages, setMessages] = useState<messagePair[]>([]);

  const queryParameters = new URLSearchParams(window.location.search)

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
      setMessages([message])
      return false;
    } else {
      setMessages([]);
      return true;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessages([]);
    const forgot_password = {
      "username": email,
    };
    console.log(forgot_password)
    if (checkCredentials()) {
      forgotPassword(forgot_password)
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
    <div className={styles.forgotpassword}>
      <div className={styles.container + " container-fluid"}>
        <div className="row h-100">
          <div className={styles.leftSide + " col-6 d-flex flex-column align-items-center justify-content-center"}>
            <img src="RMITLOGO_LOGIN.png" className="rounded" alt="..."></img>
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
              <span className={styles.heading}>Forgot Password?</span>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup + " form-group"}>
                  <label htmlFor="email" className={styles.inputLabel}>Don't worry, we got you!</label>
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
                <div className={"d-flex flex-column"}>
                  <div className={""}>
                    <input type="submit"
                      value="Submit"
                      className={"btn btn-block mt-4 " + styles.submitButton}
                      disabled={isBtnEnable} />
                  </div>
                  <div className={styles.lineDiv + " d-flex flex-row w-100 justify-content-center"}>
                    {/* <br /> */}
                    <span className={styles.line + " col-5"}></span>
                    <span className={styles.orText + " col-2"} >or</span>
                    <span className={styles.line + " col-5"}></span>
                  </div>
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

export default ForgotPassword;
