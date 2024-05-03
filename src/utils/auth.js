import axiosInstance from "/axios.config.js";
import { jwtDecode } from "jwt-decode";

export async function isTokenValid() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const response = await axiosInstance.get("isTokenValid", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.status === 200;
    } catch (error) {
        console.error("Error validating token:", error);
        return false;
    }
}

export async function getUserDetails() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const decoded = jwtDecode(token);

    const userId = decoded.userId;

    try {
        const response = await axiosInstance.get(
            "getUserDetails?userId=" + userId
        );

        return response.data;
    } catch (error) {
        console.error("Error getting user details:", error);
        return false;
    }
}
