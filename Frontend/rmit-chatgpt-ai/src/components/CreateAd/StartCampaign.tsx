import { useEffect } from "react";
import React from "react";
import { HashLink as Link } from "react-router-hash-link";

import styles from "./CreateAd.module.scss";

import { Input, Chip } from "@material-ui/core";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import LinkIcon from '@mui/icons-material/Link';

interface FuncProps {
    heading: string;
    nextStep(arg: void): void;
    prevStep(arg: void): void;
    course: any;
    courseSearchKeywords: string[];
    courseKeyFeatures: string[];
    titles: number[];
    descriptions: number[];
    setTitles(arg: number[]): void;
    setDescriptions(arg: number[]): void;
    openai_Data: Object;
    setOpenai_Data(arg: Object): void;
    campaign: string;
}


const StartCampaign: React.FC<FuncProps> = (props) => {
    let _ = require('lodash');
    let Descriptions: string[] = [];
    let Titles: string[] = [];
    let Title_Scores: number[] = [];
    let Description_Scores: number[] = [];


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.nextStep();
    }

    const handlStepBtns = (goHead: boolean) => {
        goHead ? props.nextStep() : props.prevStep();
    }

    useEffect(() => {
        const requestData = {
            "courseCode": props.course.courseCode,
            "courseName": props.course.courseName,
            "courseKeyFeatures": props.courseKeyFeatures,
            "courseSearchKeywords": props.courseSearchKeywords,
            "courseUrl": props.course.courseUrl,
            "campaignName": "1.Computer Engineering|BR|BMM"
        }
        Descriptions = [];
        Titles = [];
        Title_Scores = [];
        Description_Scores = [];

    }, []);


    _.forEach(props.titles, (value: number) => {
        Titles.push(_.get(props.openai_Data, "Titles[" + value + "]") as string)
        Title_Scores.push(_.get(props.openai_Data, "Title_Scores[" + value + "]") as number)
    });
    _.forEach(props.descriptions, (value: number) => {
        Descriptions.push(_.get(props.openai_Data, "Descriptions[" + value + "]") as string)
        Description_Scores.push(_.get(props.openai_Data, "Description_Scores[" + value + "]") as number)
    });
    return (
        <div className={styles.createAd}>
            <div className={styles.container + " "}>
                <div className={styles.heading}>{props.heading}</div>
                <form
                    onKeyDown={(e) => { if (e.keyCode == 13) { e.preventDefault() } }}
                    onSubmit={handleSubmit}
                    className={styles.form} >
                    <div className={styles.input_group_GPT + " input-group"}>
                        <div className={styles.sectionDiv + " d-flex flex-row justify-content-around"}>
                            <div className={styles.section1 + " col-3"}>
                                <div className={styles.formGroup + " form-group"}>
                                    <label htmlFor="CourseKeyFeatures" className={styles.heading + " " + styles.inputLabel}>Selected Titles</label>
                                    <div id="CourseKeyFeatures" className={styles.generatedTexts}>
                                        <List sx={{
                                            width: '100%',
                                            maxHeight: 400,
                                        }}>
                                            {Titles && Titles.map((item, index) => {
                                                const labelId = `checkbox-list-secondary-label-${item}`;
                                                return (
                                                    <ListItem
                                                        key={index}
                                                        className={styles.chip}
                                                        disablePadding
                                                    >
                                                        <ListItemButton disabled>
                                                            <ListItemAvatar className={styles.scores}>
                                                                <span>{Title_Scores[index]}%</span>
                                                            </ListItemAvatar>
                                                            <ListItemText id={labelId} primary={item} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                );
                                            })}
                                        </List>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.section2 + " col-5"}>
                                <div className={styles.formGroup + " form-group"}>
                                    <label htmlFor="CourseKeyFeatures" className={styles.heading + " " + styles.inputLabel}>Selected Descriptions</label>
                                    <div id="CourseKeyFeatures" className={styles.generatedTexts}>
                                        <List sx={{
                                            width: '100%',
                                            maxHeight: 400,
                                        }}>
                                            {Descriptions && Descriptions.map((item, index) => {
                                                const labelId = `checkbox-list-secondary-label-${item}`;
                                                return (
                                                    <ListItem
                                                        key={index}
                                                        className={styles.chip}
                                                        disablePadding
                                                    >
                                                        <ListItemButton disabled>
                                                            <ListItemAvatar className={styles.scores}>
                                                                <span>{Description_Scores[index]}%</span>
                                                            </ListItemAvatar>
                                                            <ListItemText id={labelId} primary={item} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                );
                                            })}
                                        </List>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.section3 + " col-3"}>
                                <div className={styles.formGroup + " form-group"}>
                                    <label htmlFor="courseCode" className={styles.heading + " " + styles.inputLabel}>Course Info</label>
                                </div>
                                <div className={styles.formGroup + " form-group"}>
                                    <label htmlFor="courseCode" className={styles.inputLabel}>Campaign Name</label>
                                    <div className={styles.keywords}>
                                        <Chip
                                            className={styles.chip}
                                            size="small"
                                            label={props.campaign}
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup + " form-group"}>
                                    <label htmlFor="courseCode" className={styles.inputLabel}>Course Code</label>
                                    <Input
                                        id="courseCode"
                                        type="string"
                                        className={styles.Input + " form-control form-control-sm"}
                                        placeholder="Enter Course Code"
                                        name="courseCode"
                                        value={props.course.courseCode}
                                        onKeyUp={() => { }}
                                        disabled
                                    />
                                </div>
                                <div className={styles.formGroup + " form-group"}>
                                    <label htmlFor="courseName" className={styles.inputLabel}>Course Name</label>
                                    <Input
                                        id="courseName"
                                        type="string"
                                        className={styles.Input + " form-control form-control-sm"}
                                        placeholder="Enter Course Name"
                                        name="courseName"
                                        value={props.course.courseName}
                                        onKeyUp={() => { }}
                                        disabled
                                    />
                                </div>
                                <div className={styles.formGroup + " form-group"} style={{ width: "100%" }}>
                                    <label htmlFor="courseUrl" className={styles.inputLabel}>Course URL</label>
                                    <Input
                                        id="courseUrl"
                                        type="string"
                                        className={styles.Input + " form-control form-control-sm"}
                                        style={{
                                            display: "inline-block",
                                            width: "87%",
                                            borderRadius: "3px 0px 0px 3px",
                                            marginRight: "0"
                                        }}
                                        placeholder="Enter Course URL"
                                        name="Course URL"
                                        value={props.course.courseUrl}
                                        onKeyUp={() => { }}
                                        disabled
                                    />
                                    <Link to={props.course.courseUrl} target="_blank"
                                        className={styles.courseLink + " btn btn-secondary"}
                                    ><LinkIcon /></Link>
                                </div>
                                <div className={styles.formGroup + " form-group"}>
                                    <label htmlFor="CourseSearchKeywords" className={styles.inputLabel}>Course Search Keywords</label>
                                    <div id="CourseSearchKeywords" className={styles.keywords}>
                                        {props.courseSearchKeywords.map((item, index) => (
                                            <Chip
                                                key={index}
                                                className={styles.chip}
                                                size="small"
                                                label={item}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.formGroup + " form-group"}>
                                    <label htmlFor="CourseKeyFeatures" className={styles.inputLabel}>Key Course Features</label>
                                    <div id="CourseKeyFeatures" className={styles.keywords}>
                                        {props.courseKeyFeatures.map((item, index) => (
                                            <Chip
                                                key={index}
                                                className={styles.chip}
                                                size="small"
                                                label={item}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.formGroup + " form-group " + styles.BtnDiv}>
                            <input type="submit"
                                value="Start Campaign"
                                className={styles.CampaignBtn + " btn btn-block btn-success"}
                                onClick={() => { handlStepBtns(true) }}
                            />
                        </div>
                        <div className={styles.formGroup + " form-group " + styles.BtnDiv}>
                            <input type="submit"
                                value="Back"
                                className={styles.BackBtn + " btn btn-block btn-success"}
                                onClick={() => { handlStepBtns(false) }}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StartCampaign;
