const { request } = require('express');
const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:8000",
    "X-Title": "My Backend App"
  } 
});




module.exports = openai;