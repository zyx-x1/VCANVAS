const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const router = require("./router");

app.use("/static", express.static(__dirname + "/static"));

app.engine(".html", require("ejs").__express);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

// 允许请求头中所有字段的传输
app.all("*", function (req, res, next) {
  req.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/", router);

// db("select * from user").then(val => {
//   console.log(val)
// })

const dealTime = () => {
  let result, hour, minute, second;
  hour = new Date().getHours().toString().padStart(2, '0');
  minute = new Date().getMinutes().toString().padStart(2, '0');
  second = new Date().getSeconds().toString().padStart(2, '0');
  result = `${hour}:${minute}:${second}`;
  return result;
}
app.listen(port, () => {
  console.log(`Server is running at ${dealTime()}`);
  // console.log("running");
});
