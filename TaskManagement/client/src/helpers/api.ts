import axios from "axios"


const BASE_URL = "http://localhost:8000/"

const a = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
})

