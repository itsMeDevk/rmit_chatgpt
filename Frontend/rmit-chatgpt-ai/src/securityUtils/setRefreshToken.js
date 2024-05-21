import axios from "axios";

const setRefreshToken = () => {
  const token = JSON.parse(localStorage.getItem("access_token"));
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token.token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setRefreshToken;