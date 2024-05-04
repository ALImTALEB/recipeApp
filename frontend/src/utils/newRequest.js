import axios from "axios";

const newRequest = axios.create({
    baseURL: "https://recipe-app-psi-one.vercel.app/api/", withCredentials: true
})

export default newRequest