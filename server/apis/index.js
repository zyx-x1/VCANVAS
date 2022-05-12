const { sqlMap } = require("../db/sqlMap");
const { db } = require("../db/db.js");
const { transport } = require("../mail");
const jwt = require("jsonwebtoken");
const secret = "zyxzyx"; //token密钥
const tokenExpiresTime = 1000 * 60 * 60 * 24 * 7; //token过期时间,毫秒为单位， 7天
module.exports = {
  loader(req, res, next) {
    const { ip, token } = req.query;
    let decodeToken = jwt.decode(token, secret);
    let user = decodeToken ? decodeToken.user : "游客";
    let time = new Date();
    const sql = sqlMap.searchUseraccess;
    const insertSql = sqlMap.insertUseraccess;
    db(sql, [ip]).then((result) => {
      let year = time.getFullYear();
      let month = time.getMonth();
      let date = time.getDate();
      if (result) {
        if (result instanceof Array) {
          let isNew = result.every((el) => {
            if (year == el.year) {
              if (month == el.month) {
                if (date == el.date) {
                  return false;
                }
                return true;
              }
              return true;
            }
            return true;
          });
          if (isNew) {
            db(insertSql, [year, month, date, ip, user]);
          }
        } else {
          if (
            year != result.year &&
            month != result.month &&
            date != result.date
          ) {
            db(insertSql, [year, month + 1, date, ip]);
          }
        }
      } else {
        db(insertSql, [year, month, date, ip]);
      }
      if (decodeToken) {
        if (new Date().getTime() - decodeToken.time > tokenExpiresTime) {
          return res.json({ status: "timeout" });
        } else {
          db(
            `select username,head from user where username="${decodeToken.user}"`
          ).then((user) => {
            return res.json({
              status: "success",
              user,
            });
          });
        }
      }
    });
  },
  unloader(req, res, next) {
    let { onlinetime, user } = req.query;
    db(`select onlinetime from user where username='${user}'`).then((resp) => {
      if (resp[0]) {
        let userOnlineTime = resp[0].onlinetime;
        let newOnlineTime = parseInt(onlinetime) + parseInt(userOnlineTime);
        db(
          `update user set onlinetime='${newOnlineTime}' where username='${user}'`
        ).then(() => {
          return res.json({ status: "success" });
        });
      }
    });
  },
  login(req, res, next) {
    db(`select password from user where username="${req.query.username}"`).then(
      (user) => {
        if (!user[0]) {
          return res.json({ status: "fail", msg: "用户不存在" });
        } else {
          if (user[0].password === req.query.password) {
            let payload = {
              user: req.query.username,
              time: new Date().getTime(),
              exp: Date.now() + tokenExpiresTime,
            };
            let token = jwt.sign(payload, secret);
            db(
              `select username,head from user where username="${req.query.username}"`
            ).then((resData) => {
              return res.json({
                status: "success",
                resData,
                token,
              });
            });
          } else {
            return res.json({ status: "fail", msg: "密码错误！" });
          }
        }
      }
    );
  },

  register(req, res, next) {
    let insertData;

    req.on("data", (chunk) => {
      insertData += chunk;
    });

    req.on("end", () => {
      insertData = JSON.parse(insertData.toString().replace("undefined", ""));
      let sql = sqlMap.getUser;
      let { username, password, mail, registertime, head } = insertData;
      db(sql).then((users) => {
        let isExistUser = users.every((item) => {
          return item.username !== username;
        });
        if (!isExistUser) {
          return res.json({ status: "fail", msg: "用户名已存在" });
        } else {
          //向数据库插入数据
          let insertUserSql = sqlMap.insertUser;
          let insertParams = [username, password, mail, registertime, head];
          db(insertUserSql, insertParams).then(() => {
            return res.json({ status: "success" });
          });
        }
      });
    });
  },

  resetpwd(req, res, next) {
    let userIndex = -1;
    let selectUserSql = sqlMap.getUser;
    db(selectUserSql).then((val) => {
      val.forEach((item, index) => {
        if (item.username === req.query.username) {
          userIndex = index;
        }
      });
      let updatePwdSql = sqlMap.updatePassword;
      let updateParams = [req.query.password, req.query.username];
      db(updatePwdSql, updateParams).then(() => {
        return res.send({ status: 1 });
      });
    });
  },

  rEmailCode(req, res, next) {
    let code;
    let sql = sqlMap.getUser;
    let reqMail = req.query.mail;
    db(sql).then((val) => {
      let noExist = val.every((el) => el.mail != reqMail);
      if (!noExist) {
        return res.json({ status: "fail", msg: "该邮箱已注册！" });
      } else {
        code = Math.floor(Math.random() * 900000) + 100000;
        let mailOptions = {
          from: `x75046@qq.com`,
          to: reqMail,
          subject: "VCANVAS注册验证码",
          text: `${code}`,
          html: `<p style=""align:center;>您此次的验证码为</p>
          <h2 style=""align:center;>${code}</h2>`,
        };
        transport.sendMail(mailOptions, (err, info) => {
          if (err) console.log(err);
          return res.json({ status: "success", code });
        });
      }
    });
  },
  email(req, res, next) {
    let code;
    let sql = sqlMap.getUser;
    db(sql).then((val) => {
      let userIndex = -1;
      val.forEach((item, index) => {
        if (item.username === req.query.username) {
          userIndex = index;
        }
      });
      if (userIndex === -1) {
        return res.send({ status: -1 });
      } else {
        code = Math.floor(Math.random() * 9000) + 1000;
        let mailOptions = {
          from: `x75046@qq.com`,
          to: val[userIndex].mail,
          subject: "VCANVAS验证码",
          text: `${code}`,
          html: `<p style=""align:center;>您的验证码为</p>
          <h2 style=""align:center;>${code}</h2>`,
        };
        transport.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            //console.log(info)
          }
        });
      }
      res.end(code);
    });
  },
  getUserInfoForName(req, res, next) {
    let token = req.query.token;
    let decodeToken = jwt.decode(token, secret);
    let user = decodeToken.user;
    db(
      `select id,username,mail,registertime,head,permission,onlinetime from user where username='${user}'`
    ).then((userinfo) => {
      return res.json({ status: "success", userinfo });
    });
  },
  searchWHForUser(req, res, next) {
    let user = req.query.user;
    db(`select * from warehouse where user='${user}'`).then((result) => {
      result = result.reverse();
      let currPage = parseInt(req.query.currPage);
      let pageSize = parseInt(req.query.pageSize);
      let list = [];
      let endIndex =
        currPage * pageSize > result.length
          ? result.length
          : currPage * pageSize;
      result.forEach((el, i) => {
        if (i >= (currPage - 1) * pageSize && i <= endIndex - 1) {
          list.push(el);
        }
      });
      return res.json({ status: "success", list, total: result.length });
    });
  },
  deletePictureForUser(req, res, next) {
    let { picture_id, password } = req.query;
    db(`select user from warehouse where picture_id='${picture_id}'`).then(
      (resp) => {
        let user = resp[0].user;
        if (user) {
          db(`select password from user where username='${user}'`).then(
            (respp) => {
              let userPwd = respp[0].password;
              if (userPwd == password) {
                db(
                  `delete from warehouse where picture_id='${picture_id}'`,
                  (err, info) => {
                    if (err) throw err;
                    return res.json({ status: "success" });
                  }
                );
              } else {
                return res.json({ status: "fail", msg: "密码错误！" });
              }
            }
          );
        }
      }
    );
  },
  saveToWh(req, res, next) {
    let insertData;

    req.on("data", (chunk) => {
      insertData += chunk;
    });

    req.on("end", () => {
      insertData = JSON.parse(insertData.toString().replace("undefined", ""));
      let sql = sqlMap.insertIntoWh;
      let { user, picture, time } = insertData;
      db("select mail from user where username=?", [user]).then((userMail) => {
        let picture_id =
          parseInt(userMail[0].mail.split("@")[0]).toString(16) +
          "-" +
          parseInt(new Date().getTime()).toString(16).substr(0, 8);
        db(sql, [picture_id, picture, time, user]);
        return res.json({ status: "success" });
      });
    });
  },
  adminLogin(req, res, next) {
    let { user, password } = req.query;
    db(`select * from user where permission='admin'`).then((admins) => {
      let isUserExist = false;
      let isPwdTrue = false;
      admins.forEach((el) => {
        if (el.username == user) {
          isUserExist = true;
          if (el.password == password) {
            isPwdTrue = true;
          }
        }
      });
      if (isUserExist) {
        if (isPwdTrue) {
          db(
            `select username,mail,registertime,head from user where username='${user}'`
          ).then((resInfo) => {
            let payload = {
              user,
              time: new Date().getTime(),
              exp: Date.now() + tokenExpiresTime,
            };
            let token = jwt.sign(payload, secret);
            return res.json({ status: "success", resInfo, token });
          });
        } else {
          return res.json({ status: "fail", msg: "密码错误！" });
        }
      } else {
        return res.json({ status: "fail", msg: "管理员不存在！" });
      }
    });
  },
  adminCheckToken(req, res, next) {
    let token = req.query.token;
    let decodeToken = jwt.decode(token, secret);
    if (decodeToken.user) {
      if (new Date().getTime() - decodeToken.time > tokenExpiresTime) {
        return res.json({
          status: "tokenFail",
          msg: "token已过期，请重新登录！",
        });
      } else {
        db(
          `select username,head from user where username="${decodeToken.user}"`
        ).then((user) => {
          return res.json({
            status: "success",
            user,
          });
        });
      }
    } else {
      return res.json({ status: "tokenFail", msg: "token无效" });
    }
  },
  adminGetResetEmailCode(req, res, next) {
    let email = req.query.email;
    db(`select * from user where permission='admin'`).then((admins) => {
      admins.forEach((el) => {
        if (el.mail == email) {
          let code = Math.floor(Math.random() * 900000) + 100000;
          let mailOptions = {
            from: `x75046@qq.com`,
            to: email,
            subject: "VCANVAS管理员重置密码——验证码",
            text: `${code}`,
            html: `<p style=""align:center;>您的验证码为</p>
          <h2 style=""align:center;>${code}</h2>`,
          };
          transport.sendMail(mailOptions, (err, info) => {
            if (err) throw err;
            return res.json({ status: "success", code });
          });
        }
      });
    });
  },
  adminCheckReset(req, res, next) {
    console.log(req.query);
    let { email, username } = req.query;
    db(`select * from user where permission='admin'`).then((admins) => {
      let isUserExist = false;
      let isEmailTrue = false;
      admins.forEach((el) => {
        if (el.username == username) {
          isUserExist = true;
          if (el.mail == email) {
            isEmailTrue = true;
          }
        }
      });
      if (isUserExist) {
        if (isEmailTrue) {
          return res.json({ status: "success" });
        } else {
          return res.json({ status: "fail", msg: "邮箱错误" });
        }
      } else {
        return res.json({ status: "fail", msg: "管理员不存在" });
      }
    });
  },
  adminResetPassword(req, res, next) {
    let { username, email, password, time } = req.query;
    db(`select password from user where mail='${email}'`).then((resp) => {
      let adminOldPassword = resp[0].password;
      if (adminOldPassword == password) {
        return res.json({ status: "fail", msg: "新密码不得与原密码一致" });
      }
      db(`update user set password='${password}' where mail='${email}'`);
      return res.json({ status: "success" });
    });
  },
  adminGetView(req, res, next) {
    const sql = sqlMap.adminSearchAllView;
    db(sql).then((result) => {
      return res.json({ status: "success", list: result });
    });
  },
  adminGetUser(req, res, next) {
    let request = req.query;
    let sql, result;
    if (request.user_type) {
      sql = sqlMap.adminSearchUser;
      db(
        `select id,username,mail,registertime,head,permission,onlinetime from user where permission='${request.user_type}'`
      ).then((resp) => {
        result = resp;
        let currPage = parseInt(request.currPage);
        let pageSize = parseInt(request.pageSize);
        let list = [];
        let endIndex =
          currPage * pageSize > result.length
            ? result.length
            : currPage * pageSize;
        result.forEach((el, i) => {
          if (i >= (currPage - 1) * pageSize && i <= endIndex - 1) {
            list.push(el);
          }
        });
        return res.json({ status: "success", list, total: result.length });
      });
    } else {
      sql = sqlMap.adminSearchAllUser;
      db(
        `select id,username,mail,registertime,head,permission,onlinetime from user`
      ).then((resp) => {
        result = resp;
        let currPage = parseInt(request.currPage);
        let pageSize = parseInt(request.pageSize);
        let list = [];
        let endIndex =
          currPage * pageSize > result.length
            ? result.length
            : currPage * pageSize;
        result.forEach((el, i) => {
          if (i >= (currPage - 1) * pageSize && i <= endIndex - 1) {
            list.push(el);
          }
        });
        return res.json({ status: "success", list, total: result.length });
      });
    }
  },
  adminGetWh(req, res, next) {
    let sql = sqlMap.searchWarehouse;
    let result;
    if (req.query.user) {
      sql = sqlMap.adminSearchUserWarehouse;
      db(sql, [req.query.user]).then((result) => {
        let currPage = parseInt(req.query.currPage);
        let pageSize = parseInt(req.query.pageSize);
        let list = [];
        let endIndex =
          currPage * pageSize > result.length
            ? result.length
            : currPage * pageSize;
        result.forEach((el, i) => {
          if (i >= (currPage - 1) * pageSize && i <= endIndex - 1) {
            list.push(el);
          }
        });
        return res.json({ status: "success", list, total: result.length });
      });
    } else {
      sql = sqlMap.adminSearchAllWarehouse;
      db(sql).then((result) => {
        let currPage = parseInt(req.query.currPage);
        let pageSize = parseInt(req.query.pageSize);
        let list = [];
        let endIndex =
          currPage * pageSize > result.length
            ? result.length
            : currPage * pageSize;
        result.forEach((el, i) => {
          if (i >= (currPage - 1) * pageSize && i <= endIndex - 1) {
            list.push(el);
          }
        });
        return res.json({ status: "success", list, total: result.length });
      });
    }
  },
  adminGetNotice(req, res, next) {
    let sql = sqlMap.adminSearchAllNotice;
    db(sql).then((result) => {
      result = result.reverse();
      let currPage = parseInt(req.query.currPage);
      let pageSize = parseInt(req.query.pageSize);
      let list = [];
      let endIndex =
        currPage * pageSize > result.length
          ? result.length
          : currPage * pageSize;
      result.forEach((el, i) => {
        if (i >= (currPage - 1) * pageSize && i <= endIndex - 1) {
          list.push(el);
        }
      });
      return res.json({ status: "success", list, total: result.length });
    });
  },
  adminInsertNotice(req, res, next) {
    req.on("data", (chunk) => {
      let insertData = JSON.parse(chunk.toString());
      let sql = sqlMap.adminInsertNotice;
      db(
        sql,
        [insertData.user, insertData.con, insertData.time],
        (err, info) => {
          if (err) throw err;
        }
      );
      return res.json({ status: "success" });
    });
  },
  adminDelNotice(req, res, next) {
    let { id, user, con, time } = req.query;
    db(sqlMap.adminDelNoticeForId, [id]);
    db(sqlMap.adminNoticeDelRecord, [user, con, time]);
    return res.json({ status: "success" });
  },
  adminDelNoticeRecord(req, res, next) {
    let sql = sqlMap.adminSearchDelNoticeRecord;
    db(sql).then((result) => {
      result = result.reverse();
      let currPage = parseInt(req.query.currPage);
      let pageSize = parseInt(req.query.pageSize);
      let list = [];
      let endIndex =
        currPage * pageSize > result.length
          ? result.length
          : currPage * pageSize;
      result.forEach((el, i) => {
        if (i >= (currPage - 1) * pageSize && i <= endIndex - 1) {
          list.push(el);
        }
      });
      return res.json({ status: "success", list, total: result.length });
    });
  },
};
