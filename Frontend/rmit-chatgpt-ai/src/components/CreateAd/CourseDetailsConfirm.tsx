import { useEffect } from "react";
import React from "react";
import { HashLink as Link } from "react-router-hash-link";

import styles from "./CreateAd.module.scss";

import { Input, Chip } from "@material-ui/core";
import LinkIcon from '@mui/icons-material/Link';

interface FuncProps {
    heading: string;
    nextStep(arg: void): void;
    prevStep(arg: void): void;
    course: any;
    courseSearchKeywords: string[];
    courseKeyFeatures: string[];
    setOpenai_Data(arg: Object): void;
    setTitles(arg: number[]): void;
    setDescriptions(arg: number[]): void;
    campaign: string;
}

const CourseDetailsConfirm: React.FC<FuncProps> = (props) => {
    const handleSubmit = (goHead: boolean) => {
        goHead ? props.nextStep() : props.prevStep();
    }
    useEffect(() => {
        props.setOpenai_Data({});
        props.setTitles([]);
        props.setDescriptions([]);
    }, []);

    return (
        <div className={styles.createAd}>
            <div className={styles.container + " "}>
                <div className={styles.heading}>{props.heading}</div>
                <form
                    onKeyDown={(e) => { if (e.keyCode == 13) { e.preventDefault() } }}
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); }}
                    className={styles.form} >
                    <div className={styles.input_group + " input-group"}>
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
                        <div className={styles.formGroup + " form-group"}>
                            <label htmlFor="courseUrl" className={styles.inputLabel}>Course URL</label>
                            <Input
                                id="courseUrl"
                                type="string"
                                className={styles.Input + " form-control form-control-sm"}
                                style={{
                                    display: "inline-block",
                                    width: "90%",
                                    borderRadius: "3px 0px 0px 3px"
                                }}
                                placeholder="Enter Course URL"
                                name="Course URL"
                                value={props.course.courseUrl}
                                onKeyUp={() => { }}
                                disabled
                            />
                            <Link to={props.course.courseUrl} target="_blank" className={styles.courseLink + " btn btn-secondary"}><LinkIcon /></Link>
                        </div>
                        <div className={styles.formGroup + " form-group"}>
                            <label htmlFor="CourseSearchKeywords" className={styles.inputLabel}>Course Search Keywords</label>
                            <div className={styles.keywords}>
                                {props.courseSearchKeywords.map((item, index) => (
                                    <Chip
                                        key={index}
                                        className={styles.chip}
                                        size="small"
                                        // onDelete={() => props.handleKeywordsDelete(item, index, 0)}
                                        label={item}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={styles.formGroup + " form-group"}>
                            <label htmlFor="CourseKeyFeatures" className={styles.inputLabel}>Key Course Features</label>
                            <div className={styles.keywords}>
                                {props.courseKeyFeatures.map((item, index) => (
                                    <Chip
                                        key={index}
                                        className={styles.chip}
                                        size="small"
                                        // onDelete={() => props.handleKeywordsDelete(item, index, 1)}
                                        label={item}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={styles.formGroup + " form-group"}>
                            <input type="submit"
                                value="Continue"
                                className={styles.ConfirmBtn + " btn btn-block btn-success"}
                                onClick={() => { handleSubmit(true) }}
                            />
                        </div>
                        <div className={styles.formGroup + " form-group"}>
                            <input type="submit"
                                value="Back"
                                className={styles.BackBtn + " btn btn-block btn-success"}
                                onClick={() => { handleSubmit(false) }}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseDetailsConfirm;
