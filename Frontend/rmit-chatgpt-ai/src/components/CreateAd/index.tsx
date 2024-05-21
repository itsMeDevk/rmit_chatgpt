import { useState } from "react";

import styles from "./CreateAd.module.scss";

import CourseDetails from "./CourseDetails";
import CourseDetailsConfirm from "./CourseDetailsConfirm";
import GenerateChatGPT from "./GenerateChatGPT";
import StartCampaign from "./StartCampaign";
import FinishCampaign from "./FinishCampaign";

export interface messagePair {
    key: string;
    value: string;
};

const CreateAd = () => {
    const [messages, setMessages] = useState<messagePair[]>([]);
    const [step, setStep] = useState(1);
    const [course, setCourse] = useState({
        courseName: "",
        courseCode: "",
        courseUrl: "",
    });
    const [courseSearchKeywords, setCourseSearchKeywords] = useState<string[]>([]);
    const [courseKeyFeatures, setCourseKeyFeatures] = useState<string[]>([]);
    const [inputCourseSearch, setInputCourseSearch] = useState("");
    const [inputCourseKeyFeatures, setInputCourseKeyFeatures] = useState("");
    const [titles, setTitles] = useState<number[]>([]);
    const [descriptions, setDescriptions] = useState<number[]>([]);
    const [openai_Data, setOpenai_Data] = useState({});
    const [campaign, setCampaign] = useState("");

    const handleStringInput = (value: string, key: string) => {
        setCourse({ ...course, [key]: value });
    }

    const handleKeywords = (e: any, inputCategory: number) => {
        setMessages([]);
        if (e.keyCode == 13) {
            if (e.target.value.length > 0)
                if (inputCategory == 0) {
                    setCourseSearchKeywords((oldState) => [...oldState, e.target.value]);
                }
                else {
                    setCourseKeyFeatures((oldState) => [...oldState, e.target.value]);
                }
            if (inputCategory == 0) { setInputCourseSearch("") } else setInputCourseKeyFeatures("")
        }
    };

    const handleKeywordsDelete = (item: string, index: number, inputCategory: number) => {
        if (inputCategory == 0) {
            let arr = [...courseSearchKeywords];
            arr.splice(index, 1);
            setCourseSearchKeywords(arr);
        } else {
            let arr = [...courseKeyFeatures];
            arr.splice(index, 1);
            setCourseKeyFeatures(arr);
        }
    };

    // Proceed to next step
    const nextStep = () => {
        setStep(step + 1);
    };

    // Go back to prev step
    const prevStep = () => {
        setStep(step - 1);
    };

    switch (step) {
        case 1:
            return (<CourseDetails
                heading="Course Details"
                nextStep={nextStep}
                course={course}
                handleChange={setCourse}
                courseSearchKeywords={courseSearchKeywords}
                courseKeyFeatures={courseKeyFeatures}
                inputCourseSearch={inputCourseSearch}
                inputCourseKeyFeatures={inputCourseKeyFeatures}
                handleKeywords={handleKeywords}
                handleKeywordsDelete={handleKeywordsDelete}
                setInputCourseSearch={setInputCourseSearch}
                setInputCourseKeyFeatures={setInputCourseKeyFeatures}
                handleStringInput={handleStringInput}
                campaign={campaign}
                setCampaign={setCampaign}
            />
            );
        case 2:
            return (<CourseDetailsConfirm
                heading="Confirm Course Details"
                nextStep={nextStep}
                prevStep={prevStep}
                course={course}
                courseSearchKeywords={courseSearchKeywords}
                courseKeyFeatures={courseKeyFeatures}
                setOpenai_Data={setOpenai_Data}
                setTitles={setTitles}
                setDescriptions={setDescriptions}
                campaign={campaign}
            />
            );
        case 3:
            return (<GenerateChatGPT
                heading="Select Titles and Descriptions"
                nextStep={nextStep}
                prevStep={prevStep}
                course={course}
                courseSearchKeywords={courseSearchKeywords}
                courseKeyFeatures={courseKeyFeatures}
                titles={titles}
                descriptions={descriptions}
                setTitles={setTitles}
                setDescriptions={setDescriptions}
                openai_Data={openai_Data}
                setOpenai_Data={setOpenai_Data}
                campaign={campaign}
            />);
        case 4:
            return (<StartCampaign
                heading="Start Campaign"
                nextStep={nextStep}
                prevStep={prevStep}
                course={course}
                courseSearchKeywords={courseSearchKeywords}
                courseKeyFeatures={courseKeyFeatures}
                titles={titles}
                descriptions={descriptions}
                setTitles={setTitles}
                setDescriptions={setDescriptions}
                openai_Data={openai_Data}
                setOpenai_Data={setOpenai_Data}
                campaign={campaign}
            />);
        case 5:
            return (<FinishCampaign
                heading="Congratulations!"
                course={course}
                courseSearchKeywords={courseSearchKeywords}
                courseKeyFeatures={courseKeyFeatures}
                titles={titles}
                descriptions={descriptions}
                openai_Data={openai_Data}
                campaign={campaign}
            />);
        default:
            return (
                <div className={styles.createAd}>
                    <div className={styles.container + " "}>
                        <div className={styles.heading}>Oops Something Went Wrong!</div>
                    </div>
                </div>
            );
    };



};

export default CreateAd;
