import axios from "axios";

const BASE_URL = "http://localhost:8080/api/";

export const endpoints = {
  activities: "studentactivities",
  kinds: "kinds",
  faculties: "faculties",
  periods: "periods",
  add_activities: "add-activity",
  add_participation: "participation",
  login: "login",
  user_email: "userInfoEmail",
  user_token: "userinfo",
};

export default axios.create({
  baseURL: BASE_URL,
});
