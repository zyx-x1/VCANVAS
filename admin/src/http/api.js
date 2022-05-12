import http from "./request.js";

export const GetViewInfo = async (params) =>
  await http.get("/admin/view/search", { params });

export const GetUserInfo = async (params) =>
  await http.get("/admin/user/search", { params });
