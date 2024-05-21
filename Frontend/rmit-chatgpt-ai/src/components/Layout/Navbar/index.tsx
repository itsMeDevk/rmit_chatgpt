import { HashLink as Link } from "react-router-hash-link";
import styles from "./Navbar.module.scss";
import { useNavigate } from "react-router-dom";

import { useState, useEffect, useRef } from "react";
import { logout } from "../../../actions/securityActions";

// a typed JS object: string attributes to string values, like a Map
type StringMap = { [label: string]: string };

interface Props {
  children: JSX.Element;
  subLinks: StringMap;
}



const Navbar = () => {
  let navigate = useNavigate();
  const logoutUser = () => {
    logout();
    window.location.href = '/login';
  }
  const [user, setUser] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(user);
    }
  }, [user]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.div}>
        <Link className={styles.logo} to="/dashboard">
          <img src="/RMITLOGO.png" alt="logo" />
        </Link>
        <ul className={styles.ul}>
          <li className={styles.li}>
            RMIT ChatGPT AI
          </li>
          <li className={styles.li}>
            Version: 1.0.0
          </li>
        </ul>
      </div>
      <div className={styles.navRight}>
        <div className={styles.navOptions}>
          <Link className={styles.navLinks} to="/dashboard">
            Dashboard
          </Link>
          <div className={styles.navLinksDropdown}>
            <button className={styles.navLinksDropbtn}>Ads
              <i className={" fa fa-caret-down"}></i>
            </button>
            <div className={styles.navLinksDropdownContent}>
              <a href="/ads">Competitors</a>
            </div>
            {/* <span className={styles.name}></span> */}
          </div>
        </div>
        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>{user}
            <i className={" fa fa-caret-down"}></i>
          </button>
          <div className={styles.dropdownContent + " dropdown-content"}>
            <span className={styles.button} onClick={logoutUser}>Logout</span>
          </div>
          {/* <span className={styles.name}></span> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
