import axios from 'axios'

const inBrowser = typeof window !== 'undefined';
const isDev = process.env.NODE_ENV === 'development';
const BASE_URL = inBrowser ? (isDev ? process.env.baseUrlServer : process.env.baseUrl) : process.env.baseUrlServer;

console.log(BASE_URL);

export default axios.create({
    baseURL: BASE_URL
})
