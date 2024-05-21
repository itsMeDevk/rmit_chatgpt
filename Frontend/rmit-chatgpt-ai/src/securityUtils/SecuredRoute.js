import React from "react";
import { Route, useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import AuthVerify from "./AuthVerify";

const SecuredRoute = ({
  redirectPath = '/login',
  children,
}) => {
  if (!AuthVerify()) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default SecuredRoute;