import axios from "axios";

const BASE_URL = "http://localhost:8080/";

export const endpoints = {
  activities: "api/activities",
  kinds: "api/kinds",
};

export default axios.create({
  baseURL: BASE_URL,
});
