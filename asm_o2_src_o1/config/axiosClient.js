const axios = require('axios');
const https = require('https');

const axiosClient = axios.create({
    baseURL: process.env.BACKEND_URL,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false 
    })
});


module.exports = axiosClient;