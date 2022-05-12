exports.sqlMap = {
  getUser: "select * from user",
  updatePassword: "update user set password = ? where username = ?",
  insertUser:
    "insert into user (username,password,mail,registertime,head) values (?,?,?,?,?)",
  searchUseraccess: "select * from user_access where ip=?",
  insertUseraccess:
    "insert into user_access (year,month,date,ip,user) values (?,?,?,?,?)",
  insertIntoWh:
    "insert into warehouse (picture_id,picture,time,user) values (?,?,?,?)",
  adminSearchAllView: "select * from user_access",
  adminSearchAllUser:
    "select id,username,mail,registertime,head,permission from user",
  adminSearchUser:
    "select id,username,mail,registertime,head,permission from user where permission=?",
  adminSearchAllWarehouse: "select * from warehouse",
  adminSearchUserWarehouse: "select * from warehouse where user=?",
  adminSearchAllNotice: "select * from notice",
  adminInsertNotice:
    "insert into notice (issue_admin,content,time) values (?,?,?)",
  adminNoticeDelRecord:
    "insert into notice_del_record (del_admin,del_con,del_time) values (?,?,?)",
  adminDelNoticeForId: "delete from notice where id=?",
  adminSearchDelNoticeRecord: "select * from notice_del_record",
};
