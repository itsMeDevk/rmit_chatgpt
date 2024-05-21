import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { HashLink as Link } from "react-router-hash-link";
import styles from "./Login.module.scss";
import { login } from "../../../actions/securityActions";
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

const Login = () => {

  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState({
    password: "",
    showPassword: false,
  });
  const [isBtnEnable, setBtn] = useState(true);

  const [messages, setMessages] = useState<messagePair[]>([]);

  const handleClickShowPassword = () => {
    setPassword({ ...password, showPassword: !password.showPassword });
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const checkCredentials = () => {
    return ((/^[a-z]+@rmit.edu.au$/.test(email) || /^s+[0-9]+@student.rmit.edu.au$/i.test(email)) &&
      password.password.length > 0);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessages([]);
    const LoginRequest = {
      "username": email,
      "password": password.password
    };
    if (checkCredentials()) {
      login(LoginRequest)
        .then((message) => {
          setMessages(previousState => [{ key: 'message', value: message.toString() }]);
          setTimeout(function () {
            navigate("/dashboard");
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

            // setMessages(resMessage);
            setMessages(previousState => [{ key: 'error', value: resMessage }]);
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
                  console.log(messages);
                  return (
                    <div key={index} className="alert alert-danger text-center" role="alert">
                      {item.value}
                    </div>
                  )
                }

              })}
              <span className={styles.heading}>Log In</span>
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
                  <label htmlFor="password" className={styles.inputLabel}>Password <Link className={styles.forgotPassword} to="/change-password">Got a verification code?</Link></label>
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
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {password.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    required
                  />
                </div>
                <div className={"d-flex flex-column"}>
                  <div className={""}>
                    <input type="submit"
                      value="Login"
                      className={"btn btn-block mt-4 " + styles.submitButton}
                      disabled={isBtnEnable} />
                  </div>
                  {/* <div className={styles.lineDiv + " d-flex flex-row w-100 justify-content-center"}>
                    <span className={styles.line + " col-5"}></span>
                    <span className={styles.orText + " col-2"} >or</span>
                    <span className={styles.line + " col-5"}></span>
                  </div>
                  <div>
                    <Link className={"btn btn-block " + styles.altButton} to="/signup">
                      Create Account
                    </Link>
                  </div> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}
// Login.propTypes = {
//   login: PropTypes.func.isRequired,
//   errors: PropTypes.object.isRequired,
//   security: PropTypes.object.isRequired
// };

// const mapStateToProps = state => ({
//   security: state.security,
//   errors: state.errors
// });

// export default connect(
//   mapStateToProps,
//   {login}
// )(Login);

export default Login;
