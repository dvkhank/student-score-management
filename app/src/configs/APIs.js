import axios from "axios";

const BASE_URL = "http://localhost:8080/";

export const endpoints = {
  activities: "api/activities",
  kinds: "api/kinds",
  faculties: "api/faculties",
  periods: "api/periods",
  add_activities: "api/add-activity",
};

export default axios.create({
  baseURL: BASE_URL,
});
