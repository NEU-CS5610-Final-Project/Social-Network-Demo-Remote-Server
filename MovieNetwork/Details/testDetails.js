// testDetails.js
import axios from "axios";

// server address
const BASE_URL = "http://localhost:4000";

// TMDB id to test
const TEST_MOVIE_ID = "27205"; // Inception

// session cookie
const SESSION_COOKIE = "";

async function testDetails() {
  try {
    const res = await axios.get(`${BASE_URL}/api/details/${TEST_MOVIE_ID}`, {
      headers: {
        "Content-Type": "application/json",
        ...(SESSION_COOKIE && { Cookie: SESSION_COOKIE })
      }
    });

    console.log("Successfully returned:");
    console.dir(res.data, { depth: null });
  } catch (err) {
    console.error("Request failed:", err.message);
    if (err.response) {
      console.log("Status code:", err.response.status);
      console.log("Response content:", err.response.data);
    }
  }
}

testDetails();