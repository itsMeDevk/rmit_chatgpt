import { useState, useEffect } from "react";
import React from "react";

import styles from "./CreateAd.module.scss";

import { Input, Chip } from "@material-ui/core";
import MenuItem from '@mui/material/MenuItem';
import { Select } from '@mui/material';

import { get_campaigns } from "../../actions/adsActions";

import Loader from "../Layout/Loader";

interface FuncProps {
    nextStep(arg: void): void;
    handleChange(arg: any): void;
    course: any;
    heading: string;
    courseSearchKeywords: string[];
    courseKeyFeatures: string[];
    inputCourseSearch: string;
    inputCourseKeyFeatures: string;
    setInputCourseSearch(arg: string): void;
    setInputCourseKeyFeatures(arg: string): void;
    handleKeywords(e: any, inputCategory: number): void;
    handleKeywordsDelete(item: string, index: number, inputCategory: number): void;
    handleStringInput(value: string, key: string): void;
    campaign: string;
    setCampaign(arg: string): void;
}

const CourseDetails: React.FC<FuncProps> = (props) => {
    let _ = require('lodash');
    const [campaigns, setCampaigns] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.nextStep();
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        get_campaigns()
            .then((response) => {
                setIsLoading(true);
                setCampaigns(response.data)
                if (response.data) {
                    setIsLoading(false);
                }
            },
                (error) => {
                    console.log(error)
                });
    }
    return (
        <div className={styles.createAd}>
            <div className={styles.container + " "}>
                <div className={styles.heading}>{props.heading}</div>
                <form
                    onKeyDown={(e) => { if (e.keyCode == 13) { e.preventDefault() } }}
                    onSubmit={handleSubmit}
                    className={styles.form} >
                    <div className={styles.input_group + " input-group"}>
                        <div className={styles.formGroup + " form-group"}>
                            <label htmlFor="courseCode" className={styles.inputLabel}>Campaign Name</label>
                            {isLoading && <Loader />}
                            {!isLoading && <Select
                                className={styles.selectBox}
                                value={props.campaign}
                                onChange={(event) => { console.log(event.target); props.setCampaign(event.target.value) }}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            '& .MuiList-root': {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                overflow: 'auto',
                                                height: '300px',
                                            },
                                            '& .MuiMenuItem-root': {
                                                padding: 1,
                                            },
                                        },
                                    },
                                }}
                            >
                                <MenuItem className={styles.options} value="">
                                    <em>None</em>
                                </MenuItem>
                                {!_.isEmpty(campaigns) && Object.keys(campaigns).map((item: string, index: number) => {
                                    return (
                                        <MenuItem className={styles.options} key={index} value={item}>{item}</MenuItem>

                                    )
                                })}
                            </Select>}
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
                                onChange={(event) => props.handleStringInput(event.target.value, "courseCode")}
                                required
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
                                onChange={(event) => props.handleStringInput(event.target.value, "courseName")}
                                required
                            />
                        </div>
                        <div className={styles.formGroup + " form-group"}>
                            <label htmlFor="courseUrl" className={styles.inputLabel}>Course URL</label>
                            <Input
                                id="courseUrl"
                                type="string"
                                className={styles.Input + " form-control form-control-sm"}
                                placeholder="Enter Course URL"
                                name="Course URL"
                                value={props.course.courseUrl}
                                onKeyUp={() => { }}
                                onChange={(event) => props.handleStringInput(event.target.value, "courseUrl")}
                                required
                            />
                        </div>
                        <div className={styles.formGroup + " form-group"}>
                            <label htmlFor="CourseSearchKeywords" className={styles.inputLabel}>Course Search Keywords</label>
                            <Input
                                id="CourseSearchKeywords"
                                className={styles.Input + " form-control form-control-sm"}
                                placeholder="Enter Search Keywords"
                                value={props.inputCourseSearch}
                                onChange={(e) => { props.setInputCourseSearch(e.target.value) }}
                                onKeyDown={(e) => { props.handleKeywords(e, 0) }}
                            />
                            <div className={styles.keywords}>
                                {props.courseSearchKeywords.map((item, index) => (
                                    <Chip
                                        key={index}
                                        className={styles.chip}
                                        size="small"
                                        onDelete={() => props.handleKeywordsDelete(item, index, 0)}
                                        label={item}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={styles.formGroup + " form-group"}>
                            <label htmlFor="CourseKeyFeatures" className={styles.inputLabel}>Key Course Features</label>
                            <Input
                                id="CourseKeyFeatures"
                                className={styles.Input + " form-control form-control-sm"}
                                placeholder="Enter Key Features"
                                value={props.inputCourseKeyFeatures}
                                onChange={(e) => { props.setInputCourseKeyFeatures(e.target.value) }}
                                onKeyDown={(e) => { props.handleKeywords(e, 1) }}
                            />
                            <div className={styles.keywords}>
                                {props.courseKeyFeatures.map((item, index) => (
                                    <Chip
                                        key={index}
                                        className={styles.chip}
                                        size="small"
                                        onDelete={() => props.handleKeywordsDelete(item, index, 1)}
                                        label={item}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={styles.formGroup + " form-group"}>
                            <input type="submit"
                                value="Continue"
                                className={styles.ConfirmBtn + " btn btn-block btn-success"}
                                onChange={() => { }}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseDetails;
