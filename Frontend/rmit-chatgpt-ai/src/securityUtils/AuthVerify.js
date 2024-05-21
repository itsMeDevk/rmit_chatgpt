import React from "react";
import { logout } from "../actions/securityActions";

const AuthVerify = () => {
    const user = JSON.parse(localStorage.getItem("access_token"));

    if (user) {
        if (user.expires_in < Date.now()) {
            logout();
        } else {
            return true;
        }
    }
    return false;
};

export default AuthVerify;