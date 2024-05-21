import axios, { AxiosError } from "axios";
import setRefreshToken from "../securityUtils/setRefreshToken";

//const BASE_URL = "https://api.rmitchatgptai.com";
const BASE_URL = "http://127.0.0.1:5000";

const FRONT_BASE_URL = "http://localhost:3000";
//const FRONT_BASE_URL = "https://www.rmitchatgptai.com";

export const login = async (LoginRequest) => {
    LoginRequest["auth_flow_type"] = "USER_PASSWORD_AUTH";
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };
    try {
        localStorage.clear();
        // post => Login Request
        const res = await axios.post(BASE_URL + "/api/auth/login", LoginRequest, { headers: headers }, { mode: 'cors' }, { method: 'post' });
        console.log(res);
        console.log(res.data.data);
        // extract token from res.data
        const response = res.data;
        const access_token = {
            token: response.data.access_token,
            expires_in: Date.now() + response.data.expires_in * 60 * 60,
        };
        const id_token = response.data.id_token;
        const refresh_token = {
            token: response.data.refresh_token,
            expires_in: Date.now() + (response.data.expires_in * 2 * 60 * 60),
        };

        const message = response.message;

        // store the token in the localStorage
        localStorage.setItem("user", LoginRequest.username);
        localStorage.setItem("confirmed", true);
        localStorage.setItem("access_token", JSON.stringify(access_token));
        localStorage.setItem("id_token", JSON.stringify(id_token));
        localStorage.setItem("refresh_token", JSON.stringify(refresh_token));
        //     // set our token in header ***
        setRefreshToken(refresh_token.token);
        return response.message;

    }
    catch (err) {
        switch (err.response.status) {
            case 401:
                let message = err.response.data.message;

                if (err.response.data.data.secondary === "PASSWORD_RESET_REQUIRED") {
                    message = "Redirecting to change password page..."
                    setTimeout(function () {
                        window.location.href = FRONT_BASE_URL + "/change-password";
                    }, 1200);
                    localStorage.setItem("confirmed", false);
                }
                else
                    if (err.response.data.data) {
                        message = "Redirecting to reset password page..."
                        setTimeout(function () {
                            window.location.href = FRONT_BASE_URL + "/reset-password/" + LoginRequest.username + "/" + err.response.data.data.session;
                        }, 1200);
                        localStorage.setItem("confirmed", false);

                        // localStorage.setItem("session", err.response.data.data.session);
                    }
                throw Error(message);
                break;
            case 403:
                throw Error(err.response.data.message);
                break;
            default:
                throw Error("Something went wrong. Please try again later.");
                break;
        }


    }
}
export const completePasswordReset = async (reset_password) => {
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };
    try {
        localStorage.clear();
        // post => Login Request
        const res = await axios.post(BASE_URL + "/api/auth/complete-password-reset", reset_password, { headers: headers }, { mode: 'cors' });
        console.log(res);
        console.log(res.data.data);
        // extract token from res.data
        const response = res.data;
        const message = response.message;
        return response.message;
    }
    catch (err) {
        switch (err.response.status) {
            case 401:
                let message = err.response.data.message;
                throw Error(message);
                break;
            case 403:
                throw Error(err.response.data.message);
                break;
            default:
                throw Error("Something went wrong. Please try again later.");
                break;
        }

    }
}


export const resetPassword = async (reset_password) => {
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };
    try {
        localStorage.clear();
        // post => Login Request
        const res = await axios.post(BASE_URL + "/api/auth/reset-password", reset_password, { headers: headers }, { mode: 'cors' });
        // extract token from res.data
        const response = res.data;
        // const message = response.message;
        return response.message;
    }
    catch (err) {
        console.log(err);
        switch (err.response.status) {
            case 401:
                let message = err.response.data.message;
                throw Error(message);
                break;
            case 403:
                throw Error(err.response.data.message);
                break;
            case 500:
                throw Error("Something went wrong. Please try again later.")
                break;
            default:
                throw Error("Something went wrong. Please try again later.");
                break;
        }
    }
}

// Neither completely implemented nor tested
export const forgotPassword = async (forgot_password) => {
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };
    try {
        localStorage.clear();
        // post => Login Request
        const res = await axios.post(BASE_URL + "/api/auth/forgot-password", forgot_password, { headers: headers }, { mode: 'cors' });
        console.log(res);
        console.log(res.data.data);
        // extract token from res.data
        const response = res.data;
        const message = response.message;
        return response.message;
    }
    catch (err) {
        console.log(err);
        switch (err.response.status) {
            case 401:
                let message = err.response.data.message;
                throw Error(message);
                break;
            case 403:
                throw Error(err.response.data.message);
                break;
            default:
                throw Error("Something went wrong. Please try again later.");
                break;
        }


    }
}

export const logout = () => {
    localStorage.clear();
    // setJWTToken needs to be coded for token
    setRefreshToken(false);
    window.location.reload();
};
