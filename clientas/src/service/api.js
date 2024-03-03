const API_URL =
  process.env.REACT_APP_API_URL === undefined
    ? "http://localhost:3001"
    : "https://your-heroku-app.herokuapp.com";

export default API_URL;
