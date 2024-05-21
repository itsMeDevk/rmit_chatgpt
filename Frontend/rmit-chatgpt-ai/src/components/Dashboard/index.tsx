import React, { Component } from "react";
import styles from "./Dashboard.module.scss";
import { HashLink as Link } from "react-router-hash-link";

const Dashboard = () => {

  return (
    <div className={styles.dashboard}>
      <div className={styles.container + " "}>
        <div className={styles.heading}>Dashboard</div>
        <div className={styles.options}>
          <div className={styles.card + " card"}>
            <div className={styles.cardBody + " card-body"}>
              <h5 className={styles.cardTitle + " card-title"}>Competitors Advertisements</h5>
              <p className={styles.cardText + " card-text"}>Check out what your competitors are doing.</p>
              <Link to="/ads" className="btn btn-secondary">Competitors Ads page</Link>
            </div>
          </div>
          <div className={styles.card + " card"}>
            <div className={styles.cardBody + " card-body"}>
              <h5 className={styles.cardTitle + " card-title"}>Start Google Ads campaign</h5>
              <p className={styles.cardText + " card-text"}>Got a course for Marketing! Start a google ads campaign now.</p>
              <Link to="/create_ad" className="btn btn-secondary">Create Advertisement</Link>
            </div>
          </div>
        </div>
        <h2 className={styles.list}><Link to="/ads"></Link></h2>
      </div>
    </div >);
}

export default Dashboard;
