import { useState, useEffect } from "react";
import React from "react";
import { HashLink as Link } from "react-router-hash-link";

import styles from "./CreateAd.module.scss";

import { send_campaign } from "../../actions/adsActions";
import { useNavigate } from "react-router";

interface FuncProps {
    heading: string;
    course: any;
    courseSearchKeywords: string[];
    courseKeyFeatures: string[];
    titles: number[];
    descriptions: number[];
    openai_Data: Object;
    campaign: string;
}

const FinishCampaign: React.FC<FuncProps> = (props) => {
    let _ = require('lodash');
    const [isLoading, setIsLoading] = useState(true);
    const nav = useNavigate();
    let Descriptions: string[] = [];
    let Titles: string[] = [];

    useEffect(() => {
        startCampaign();
    }, []);

    const startCampaign = () => {
        setIsLoading(true);

        _.forEach(props.titles, (value: number) => {
            Titles.push(_.get(props.openai_Data, "Titles[" + value + "]") as string)
        });
        _.forEach(props.descriptions, (value: number) => {
            Descriptions.push(_.get(props.openai_Data, "Descriptions[" + value + "]") as string)
        });
        const data = {
            "Descriptions": Descriptions,
            "Titles": Titles,
            "courseCode": props.course.courseCode,
            "courseName": props.course.courseName
        }
        send_campaign(data)
            .then((response) => {
                if (response.success) {
                    setIsLoading(false);
                    setTimeout(() => nav('/dashboard'), 5000);
                }

            },
                (error) => {
                    console.log(error)
                });
    }

    return (
        <div className={styles.createAd}>
            <div className={styles.container + " "}>
                <div className={styles.finishCampaignContainer}>
                    <div className={styles.campainCircleDiv + " input-group"}>
                        <div className={styles.circle_loader + " " + (!isLoading && styles.load_complete)}>
                            <div className={styles.checkmark + " " + styles.draw + " " + (!isLoading && styles.changeDiv)}></div>
                        </div>
                    </div>
                    {!isLoading && <div className={styles.FinishCampHeadline}>Congratulations!</div>}
                    {!isLoading && <div className={styles.FinishCampMessage}>You've successfully started your campaign in Google Ads</div>}
                    {!isLoading && <div className={styles.formGroup + " form-group " + styles.BtnDiv}>
                        <Link to="/dashboard" className={styles.GoToDashboardBtn + " btn btn-block"}>Go to Dashboard</Link>
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default FinishCampaign;
