<template>
  <div class="resetpwd-container">
    <div class="resetpwd">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <div class="r-verification" v-show="!isVPass">
          <el-form-item prop="user1">
            <el-input
              type="text"
              :placeholder="placeholders[0]"
              required="required"
              v-model="ruleForm.user1"
              clearable
              prefix-icon="el-icon-user-solid"
            ></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              class="phone-input"
              :placeholder="placeholders[1]"
              v-model="ruleForm.email"
              prefix-icon="el-icon-reading"
              clearable
            ></el-input>
          </el-form-item>
          <transition name="fade">
            <el-form-item prop="code" class="phone" v-show="isCodeShow">
              <el-input
                v-model="ruleForm.code"
                :placeholder="placeholders[2]"
                :minlength="6"
                :maxlength="6"
                class="r-code"
                clearable
                style="width: 79%"
              ></el-input>
              <el-button
                type="primary"
                @click="getCode()"
                class="code-btn"
                :disabled="!show"
                style="width: 20%"
              >
                <span v-show="show">{{ sendcode_text }}</span>
                <span v-show="!show" class="count">{{ count }} s</span>
              </el-button>
            </el-form-item>
          </transition>
          <el-form-item class="btn-form">
            <el-button
              type="primary"
              @click="submitForm(ruleForm)"
              class="r-submit"
              >确认</el-button
            >
            <span @click="returnLogin()">返回登录</span>
          </el-form-item>
        </div>
        <div class="r-setpass" v-show="isVPass">
          <el-form-item prop="pass">
            <el-input
              type="password"
              :placeholder="placeholders[3]"
              v-model="ruleForm.pass"
              show-password
              clearable
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input
              type="password"
              :placeholder="placeholders[4]"
              v-model="ruleForm.checkPass"
              show-password
              clearable
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item class="btn-form">
            <el-button
              type="primary"
              @click="resetPass(ruleForm)"
              class="r-submit"
              >确认修改</el-button
            >
            <span @click="toLogin()">返回登录</span>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import http from "@/http/request";
import { formatTime } from "@/utils";
export default {
  data() {
    const validateUser1 = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        const reg = /^[a-zA-Z0-9]{4,16}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(
            new Error("请输入正确的用户名格式（4-16位大小写字母或数字）")
          );
        }
      }
    };
    const validateEmail = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("邮箱不能为空"));
      } else {
        const reg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        if (reg.test(value)) {
          this.isCodeShow = true;
          callback();
        } else {
          this.isCodeShow = false;
          callback(new Error("请输入正确的邮箱"));
        }
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        const reg = /^[a-zA-Z0-9]{5,17}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的密码格式（6-16位大小写字母或数字）"));
        }
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        if (this.ruleForm.code.length === 6) {
          callback();
        } else {
          callback(new Error("验证码不正确"));
        }
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      placeholders: [
        "请输入用户名",
        "请输入邮箱",
        "请输入验证码",
        "请输入密码",
        "请再次输入密码",
      ],
      activeIndex: "2",
      isVPass: false,
      show: true,
      count: "",
      email_return: "",
      sendcode_text: "发送验证码",
      timer: null,
      isCodeShow: false,
      ruleForm: {
        user1: "",
        email: "",
        code: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        code: [
          {
            required: true,
            validator: validateCode,
            trigger: "change",
          },
          {
            min: 6,
            max: 6,
            message: "长度为6",
            trigger: "change",
          },
        ],
        user1: [
          {
            required: true,
            validator: validateUser1,
            trigger: "change",
          },
        ],
        email: [
          {
            required: true,
            validator: validateEmail,
            trigger: "change",
          },
        ],
        pass: [
          {
            required: true,
            validator: validatePass,
            trigger: "change",
          },
          {
            min: 6,
            message: "长度在不少于6个字符",
            trigger: "change",
          },
        ],
        // 校验密码
        checkPass: [
          {
            required: true,
            validator: validatePass2,
            trigger: "change",
          },
          {
            min: 6,
            message: "长度在不少于6个字符",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    returnLogin() {
      this.$router.push("/login");
    },
    async getCode() {
      this.show = false;
      this.count = 60;
      let timer = setInterval(() => {
        if (this.count > 0) {
          this.count--;
        } else {
          this.sendcode_text = "重新发送";
          this.show = true;
        }
      }, 1000);
      let result = await http.get("/admin/reset/email", {
        params: { email: this.ruleForm.email },
      });
      if (result.data.status == "success") {
        this.email_return = result;
      }
    },
    async submitForm(obj) {
      if (/^[a-zA-Z0-9]{4,16}$/.test(obj.user1)) {
        if (/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(obj.email)) {
          if (this.email_return) {
            if (obj.code) {
              if (this.email_return.data.code == obj.code) {
                console.log(this.ruleForm);
                let data = await http.get("/admin/reset/check", {
                  params: {
                    email: this.ruleForm.email,
                    username: this.ruleForm.user1,
                  },
                });
                if (data.data.status == "success") {
                  this.isVPass = true;
                } else {
                  this.$message.error(data.data.msg);
                }
              } else {
                this.$message.error("未输入验证码！");
              }
            } else {
              this.$message.error("验证码错误！");
            }
          } else {
            this.$message.error("请先获取验证码！");
          }
        } else {
          this.$message.error("请输入有效的邮箱！");
        }
      } else {
        this.$message.error("请输入有效的用户名！");
      }
    },
    async resetPass(obj) {
      if (/^[a-zA-Z0-9]{5,17}$/.test(obj.pass)) {
        if (obj.pass == obj.checkPass) {
          let result = await http.get("/admin/reset/pwd", {
            params: {
              username: obj.user,
              email: obj.email,
              password: obj.pass,
              time: formatTime(new Date()),
            },
          });
          if (result.data.status == "success") {
            this.$message({
              message: "密码修改成功！即将返回登录页面",
              type: "success",
            });
            setTimeout(() => {
              this.$router.push("/login");
            }, 1500);
          }
        }
      }
    },
    toLogin() {
      this.$router.push("/login");
    },
  },
  mounted() {},
};
</script>

<style lang="less">
.resetpwd-container {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .resetpwd {
    width: 50%;
    height: 70%;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    .el-form {
      width: 70%;
      height: 70%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      .r-verification,
      .r-setpass {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
      }
      .el-form-item {
        width: 100%;
      }
      .el-button {
        width: 100%;
      }
      .el-button + span {
        color: #fff;
        cursor: default;
        &:hover {
          text-decoration: underline;
        }
      }
      .resetpwd-else {
        display: flex;
        justify-content: space-between;
        color: #fff;
        span {
          cursor: default;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
