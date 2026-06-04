import axios from "axios";

const API =
axios.create({

// baseURL:
// "http://localhost:5000"
baseURL: "https://ai-daily-expense-tracker.onrender.com"

});

export default API;