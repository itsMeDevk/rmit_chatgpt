import axios from "axios";


//const BASE_URL = "https://api.rmitchatgptai.com";
const BASE_URL = "http://127.0.0.1:5000";


const headers = {
    "Content-Type": "application/json",
    "Accept": "*/*",
};

export const getAllAds = async () => {
    try {
        const res = await axios.get(BASE_URL + "/api/ads", { headers: headers }, { mode: 'cors' });
    }
    catch (err) {
        console.log(err);
    }

};

export const getAds = async (data) => {
    console.log(data);
    try {
        const res = await axios.post(BASE_URL + "/api/comp_ads", data, { headers: headers }, { mode: 'cors' });
        const responseData = res.data.data;
        const no_of_pages = res.data.total_segments;
        return {
            data: responseData,
            no_of_pages: no_of_pages
        }
    }
    catch (err) {
        console.log(err);
        throw Error(err.response.data.message);
    }

};

export const openai_information = async (data) => {
    try {
        const res = await axios.post(BASE_URL + "/api/chat_gpt_ad", data, { headers: headers }, { mode: 'cors' });
        const responseData = res.data.data;
        console.log("responseData: ", responseData);
        return {
            data: responseData,
        }
    }
    catch (err) {
        console.log(err);
        throw Error(err.response.data.message);
    }
};

export const get_campaigns = async () => {
    try {
        const res = await axios.get(BASE_URL + "/api/get_campaigns", { headers: headers }, { mode: 'cors' });
        console.log("res: ", res.data.data);
        const responseData = res.data.data;
        return {
            data: responseData,
        }
    }
    catch (err) {
        console.log(err);
        throw Error(err.response.data.message);
    }
};

export const send_campaign = async (data) => {
    try {
        const res = await axios.post(BASE_URL + "/api/start_campaign", data, { headers: headers }, { mode: 'cors' });
        console.log("res: ", res.data.success);
        return {
            success: res.data.success,
        }
    }
    catch (err) {
        console.log(err);
        throw Error(err.response.data.message);
    }
};

