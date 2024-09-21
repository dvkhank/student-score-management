import axios from "axios";

const BASE_URL = "http://localhost:8080/api/";

export const endpoints = {
  activities: "studentactivities",
  admin_activities: "activities",
  kinds: "kinds",
  faculties: "faculties",
  periods: "periods",
  add_activities: "add-activity",
  add_participation: "participation",
  login: "login",
  user_email: "userInfoEmail",
  user_token: "userinfo",
  missing_activities: "missing-activities",
  update_participation: "update-participation",
  admin_missing: "admin/all-participation",
  accept_participation: "/admin/accept-participation",
  decline_participation: "/admin/decline-participation",
  score_by_kind: "/student/get-score-by-kind",
  activities_by_kind: "/student/get-activities-by-kind",
  stats_by_faculty: "/admin/stats-by-faculty",
  stats_by_class: "/admin/stats-by-class",
};

export default axios.create({
  baseURL: BASE_URL,
});
