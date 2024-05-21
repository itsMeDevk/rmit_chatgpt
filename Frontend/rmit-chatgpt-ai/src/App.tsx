import React from "react";
import { useEffect, useRef, useState } from "react";

// import logo from './logo.svg';
import './App.css';
import Navbar from "./components/Layout/Navbar";
import Login from "./components/UserManagement/Login";
import Register from "./components/UserManagement/Register";
import Dashboard from "./components/Dashboard";
import ResetPassword from "./components/UserManagement/ResetPassword";
import AdvertisementsList from "./components/Advertisements/AdvertisementsList";
import CreateAd from "./components/CreateAd";

import { logout } from "./actions/securityActions";
import SecuredRoute from "./securityUtils/SecuredRoute";
import AuthVerify from "./securityUtils/AuthVerify";


import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ChangePassword from "./components/UserManagement/ChangePassword";
import setRefreshToken from "./securityUtils/setRefreshToken";


const App = () => {
  const [pageHeight, setPageHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  // const dispatch = useDispatch();

  useEffect(() => {
    if (ref.current !== null) {
      setPageHeight(ref.current.clientHeight);
    }
    if (AuthVerify()) {
      setLoggedIn(true);
      setRefreshToken();
    }
  }, [loggedIn]);

  return (
    <Router>
      <div ref={ref}>
        {loggedIn && <Navbar />}
        <Routes>
          <Route path="/" element={loggedIn ? <Navigate to="/dashboard" replace={true} /> : <Navigate to="/login" replace={true} />} />
          {!loggedIn ? <Route path="/login" Component={Login} /> : <Route path="/login" element={<Navigate to="/dashboard" replace={true} />} />}
          <Route path="/reset-password/:username/:session" Component={ResetPassword} />
          <Route path="/change-password" Component={ChangePassword} />
          <Route
            path="/dashboard"
            element={<SecuredRoute><Dashboard /></SecuredRoute>}
          />
          <Route
            path="/ads"
            element={<SecuredRoute><AdvertisementsList /></SecuredRoute>}
          />
          <Route
            path="/create_ad"
            element={<SecuredRoute><CreateAd /></SecuredRoute>}
          />
          {/* <Route
            path="/"
            element={<SecuredRoute><React.Fragment /></SecuredRoute>}
          /> */}
        </Routes>
      </div>

    </Router >
  );
};

export default App;
