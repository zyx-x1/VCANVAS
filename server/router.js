const express = require("express");
const router = express.Router();
const api = require("./apis/index");

router.get("/load", (req, res, next) => {
  api.loader(req, res, next);
});

router.get("/leave", (req, res, next) => {
  api.unloader(req, res, next);
});

router.get("/login", (req, res, next) => {
  api.login(req, res, next);
});

router.post("/register", (req, res, next) => {
  api.register(req, res, next);
});

router.get("/resetpwd", (req, res, next) => {
  api.resetpwd(req, res, next);
});

router.get("/register/mail/getcode", (req, res, next) => {
  api.rEmailCode(req, res, next);
});

router.get("/email", (req, res, next) => {
  api.email(req, res, next);
});

router.post("/canvas/save/warehouse", (req, res, next) => {
  api.saveToWh(req, res, next);
});

router.get("/warehouse/user/search", (req, res, next) => {
  api.searchWHForUser(req, res, next);
});

router.get("/warehouse/user/delete", (req, res, next) => {
  api.deletePictureForUser(req, res, next);
});

router.get("/user/info/search", (req, res, next) => {
  api.getUserInfoForName(req, res, next);
});

router.get("/admin/login", (req, res, next) => {
  api.adminLogin(req, res, next);
});
router.get("/admin/token/check", (req, res, next) => {
  api.adminCheckToken(req, res, next);
});
router.get("/admin/reset/email", (req, res, next) => {
  api.adminGetResetEmailCode(req, res, next);
});

router.get("/admin/reset/pwd", (req, res, next) => {
  api.adminResetPassword(req, res, next);
});

router.get("/admin/reset/check", (req, res, next) => {
  api.adminCheckReset(req, res, next);
});

router.get("/admin/view/search", (req, res, next) => {
  api.adminGetView(req, res, next);
});

router.get("/admin/user/search", (req, res, next) => {
  api.adminGetUser(req, res, next);
});

router.get("/admin/warehouse/search", (req, res, next) => {
  api.adminGetWh(req, res, next);
});

router.get("/admin/notice/search", (req, res, next) => {
  api.adminGetNotice(req, res, next);
});

router.post("/admin/notice/add", (req, res, next) => {
  api.adminInsertNotice(req, res, next);
});

router.get("/admin/notice/delete", (req, res, next) => {
  api.adminDelNotice(req, res, next);
});

router.get("/admin/notice/del/record/search", (req, res, next) => {
  api.adminDelNoticeRecord(req, res, next);
});

module.exports = router;
