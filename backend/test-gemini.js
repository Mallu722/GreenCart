import axios from 'axios'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

async function test() {
  const apiKey = process.env.GEMINI_API_KEY
  console.log("Testing with key prefix:", apiKey ? apiKey.substring(0, 10) : 'none')
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
  const body = {
    contents: [{ parts: [{ text: "Hello" }] }]
  }

  try {
    const res = await axios.post(url, body)
    console.log("Success:", res.data)
  } catch (err) {
    const errInfo = {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data
    }
    console.log("Failed!")
    fs.writeFileSync('gemini-error.json', JSON.stringify(errInfo, null, 2))
    console.log("Error details saved to gemini-error.json")
  }
}

test()
