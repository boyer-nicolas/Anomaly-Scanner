import axios from "axios";
import Cookies from "js-cookie";

export default function Api() {

    let token = Cookies.get("jwt");

    if (
        import.meta.env.VITE_API_URL === undefined) {
        throw new Error("VITE_API_URL is not defined in .env");
    }

    let appHeaders;
    if (token) {
        appHeaders = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    } else {
        appHeaders = {
            "Content-Type": "application/json",
        };
    }

    return axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: appHeaders
    });
}