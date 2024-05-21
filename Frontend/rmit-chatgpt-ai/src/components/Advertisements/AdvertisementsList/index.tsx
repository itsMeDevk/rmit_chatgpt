import { useState, useEffect } from "react";

import styles from "./AdvertisementsList.module.scss";

import { Input, Chip } from "@material-ui/core";
import MenuItem from '@mui/material/MenuItem';
import { Select } from '@mui/material';

import { getAds } from "../../../actions/adsActions";

const headers = { "": 5, "Title": 15, "Description": 35, "Keyword": 20, "Source": 15, "Date": 10 };
const sortColumns = ["Title-Asc", "Title-Desc", "Description-Asc",
    "Description-Desc", "Keyword-Asc", "Keyword-Desc", "Date-Asc", "Date-Desc"];
const data = [] as Object[];

export interface messagePair {
    key: string;
    value: string;
};

const AdvertisementsList = () => {
    let _ = require('lodash');
    const [currentCol, setCurrentCol] = useState("");
    const [keywords, setkeywords] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<messagePair[]>([]);
    const [descIndex, setDesc] = useState(-1);
    const [loadNbr, setLoadNbr] = useState(1);
    const [tableData, setTableData] = useState(data);
    const [noPages, setNoPages] = useState(0);
    const [sortCol, setSortCol] = useState("Date-Asc");

    const showContent = (index: number) => {
        setDesc(index)
    }

    const handleKeyUp = (e: any) => {
        setMessages([]);
        if (e.keyCode == 13 && keywords.length <= 10) {
            if (e.target.value.length > 0)
                setkeywords((oldState) => [...oldState, e.target.value]);
            setInputValue("");
        } else if (e.keyCode == 13 && keywords.length > 10) {
            setMessages(previousState => [{ key: 'error', value: "Sorry! Maximum of 10 keywords allowed." }]);
        }
    };

    // Add Filter functionality
    // const handleFilter = (event: SelectChangeEvent) => {};

    useEffect(() => {
        const data = {
            "filter_dict": {
                "column": "",
                "values": ""
            },
            "sort_dict": {
                "column": sortCol.split("-")[0],
                "order": sortCol.split("-")[1].toUpperCase()
            }
        }
        fetchData(data);
    }, []);

    const handleDelete = (item: string, index: number) => {
        let arr = [...keywords];
        arr.splice(index, 1);
        setkeywords(arr);
    };

    const fetchData = (data: Object) => {
        console.log(data)
        getAds(data)
            .then((response) => {
                setTableData(response.data)
                setNoPages(response.no_of_pages)
                setLoadNbr(1);
                if (response.data.length === 0) {
                    setMessages(previousState => [{ key: 'error', value: "No results found" }]);
                }
            },
                (error) => {
                    console.log(error)
                });

    }

    const handleSearchSubmit = (event: any) => {
        event.preventDefault();
        setMessages([]);
        let data = {} as Object;
        if (keywords.length > 0 && currentCol.length === 0) {
            setMessages(previousState => [{ key: 'error', value: "Please select an attribute from dropdown" }]);
            return;
        }

        data = {
            "filter_dict": {
                "column": currentCol,
                "values": keywords
            },
            "sort_dict": {
                "column": sortCol.split("-")[0],
                "order": sortCol.split("-")[1].toUpperCase()
            }

        }
        // else if (keywords.length === 0 && currentCol.length > 0) {
        //     setMessages(previousState => [{ key: 'error', value: "Please enter keyword" }]);
        // };
        fetchData(data);
    };

    const getArray = () => {
        let len = 0;
        for (let index in tableData) {
            if (loadNbr < Object.values(tableData[index]).at(Object.keys(tableData[index]).findIndex(objectRow => objectRow === "Bin"))) break
            else len += 1;
        }
        let result = _.range(0, len);
        return result;
    };


    // Complete Load More once Data is being fetched from backend
    const buildTableData = () => {
        setLoadNbr(loadNbr + 1);
    }

    return (
        <div className={styles.ads}>
            <div className={styles.container + " "}>
                <div className={styles.heading}>Competitors Advertisements</div>
                <form
                    onKeyDown={(e) => { if (e.keyCode == 13) { e.preventDefault() } }}
                    onSubmit={handleSearchSubmit} className={styles.form}>
                    <div className={styles.input_group + " input-group"}>
                        <Input
                            className={styles.Input + " form-control form-control-sm"}
                            value={inputValue}
                            onChange={(e) => { setInputValue(e.target.value) }}
                            onKeyDown={handleKeyUp}
                        />
                        <Select
                            className={styles.selectBox}
                            value={currentCol}
                            onChange={(event) => setCurrentCol(event.target.value)}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}>
                            <MenuItem className={styles.options} value="">
                                <em>None</em>
                            </MenuItem>
                            {Object.values(headers).map((item, index) => {
                                const currHeader = Object.keys(headers).at(index);
                                return (
                                    <MenuItem className={styles.options} key={index} value={currHeader}>{currHeader}</MenuItem>

                                )
                            })}
                        </Select>
                        <input type="submit"
                            value="Search"
                            className={"btn btn-block btn-success " + styles.SearchButton}
                            onChange={() => { }}
                        />
                    </div>
                </form>
                <div className={styles.sortDiv}>
                    <Select
                        className={styles.selectBox + " bg-primary"}
                        value={sortCol}
                        onChange={(event) => setSortCol(event.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}>
                        {Object.values(sortColumns).map((item, index) => {
                            // const currHeader = Object.keys(sortColumns).at(index);
                            return (
                                <MenuItem className={styles.options} key={index} value={item}>{item}</MenuItem>
                            )
                        })}
                    </Select>
                </div>
                <div className={styles.keywords}>
                    {keywords.map((item, index) => (
                        <Chip
                            key={index}
                            className={styles.chip}
                            size="small"
                            onDelete={() => handleDelete(item, index)}
                            label={item}
                        />
                    ))}
                </div>
                {Object.values(messages).map((item, index) => {
                    if (item.key === "message") {
                        return (
                            <div key={index} className="alert alert-success text-center" role="alert">
                                {item.value}
                            </div>
                        )
                    }
                    else if (item.key == "error") {
                        return (
                            <div key={index} className="alert alert-danger text-center" role="alert">
                                {item.value}
                            </div>
                        )
                    }

                })}
                <table className={styles.table + " table table-hover"}>
                    <thead>
                        <tr className={styles.tableHeads + ""}>
                            {Object.keys(headers).map((item, index) => {
                                return (
                                    <th className={styles.header} style={{ width: Object.values(headers).at(index) + "%" }} key={index} scope="col">{item}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {getArray().map((row: number, rowIndex: number) => {
                            const objectRow = Object.values(tableData).at(rowIndex) as Object;
                            // if (loadNbr < Object.values(objectRow).at(Object.keys(objectRow).findIndex(objectRow => objectRow === "Bin"))) {
                            //     break
                            // }
                            const title = Object.values(objectRow).at(Object.keys(objectRow).findIndex(objectRow => objectRow === "Title"));
                            const desc = Object.values(objectRow).at(Object.keys(objectRow).findIndex(objectRow => objectRow === "Description"));
                            const source = Object.values(objectRow).at(Object.keys(objectRow).findIndex(objectRow => objectRow === "Source"));
                            const date = Object.values(objectRow).at(Object.keys(objectRow).findIndex(objectRow => objectRow === "Date"));
                            const keyword = Object.values(objectRow).at(Object.keys(objectRow).findIndex(objectRow => objectRow === "Keyword"));
                            return (
                                <tr key={row} className={styles.dataRow}>
                                    <td >{row + 1}</td>
                                    <td >{title}</td>
                                    {descIndex !== row && <td className={styles.column}> <button className={styles.seeMoreBtn} value={row} onClick={() => showContent(row)} >{_.truncate(desc, { 'length': 50, 'omission': '  ...' })}</button></td>}
                                    {descIndex === row && <td className={styles.column}>{desc}</td>}

                                    <td >{keyword}</td>
                                    <td className={styles.title}><a className={styles.links} href="#" onClick={() => openInNewTab(source)}>{source}</a></td>
                                    <td >{(new Date(date)).toDateString()}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className={styles.loadBtn}>
                    <button
                        onClick={() => { buildTableData() }}
                        className={"btn btn-secondary btn-block " + styles.submitButton}>Load More</button>
                </div>
            </div>
        </div >
    );
};

export default AdvertisementsList;

export const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
};



