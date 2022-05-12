<template>
  <div class="login-container">
    <div class="login">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="user">
          <el-input
            class="phone-input"
            :placeholder="placeholders[0]"
            v-model="ruleForm.user"
            prefix-icon="el-icon-user"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            type="password"
            :placeholder="placeholders[1]"
            v-model="ruleForm.pass"
            show-password
            clearable
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitLogin(ruleForm)"
            >登录</el-button
          >
          <section class="login-else">
            <span class="login-forget" @click="forgetPass()">忘记密码</span>
          </section>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import http from "@/http/request.js";
export default {
  data() {
    const validateUser = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("邮箱不能为空"));
      } else {
        const reg = /^[a-zA-Z0-9]{5,17}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的用户名"));
        }
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        const reg = /^[a-zA-Z0-9]{6,16}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的密码格式"));
        }
      }
    };
    return {
      placeholders: ["请输入用户名", "请输入密码"],
      ruleForm: {
        user: "",
        pass: "",
      },
      rules: {
        user: [
          {
            required: true,
            validator: validateUser,
            trigger: "blur",
          },
        ],
        pass: [
          {
            required: true,
            validator: validatePass,
            trigger: "blur",
          },
          {
            min: 6,
            message: "长度在不少于6个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async submitLogin(obj) {
      if (/^[a-zA-Z0-9]{4,15}$/.test(obj.user)) {
        if (/^[a-zA-Z0-9]{5,17}$/.test(obj.pass)) {
          let result = await http.get("/admin/login", {
            params: {
              user: obj.user,
              password: obj.pass,
            },
          });
          if (result.data.status == "fail") {
            this.$message.error(result.data.msg);
          } else {
            localStorage.setItem("token", result.data.token);
            this.$store.state.adminInfo = {
              name: result.data.username,
              email: result.data.email,
              head: result.data.head,
            };
            this.$message({
              message: "登录成功！",
              type: "success",
            });
            setTimeout(() => {
              this.$router.push("/admin");
              this.$store.state.isLogin = true;
            }, 1500);
          }
        } else {
          this.$message.error("请确保密码合法！");
        }
      } else {
        this.$message.error("请确保邮箱合法！");
      }
    },
    forgetPass() {
      this.$router.push("/login/reset");
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style lang="less">
.login-container {
  width: 100%;
  height: 100%;
  // background-color: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .login {
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
      .el-form-item {
        width: 100%;
      }
      .el-button {
        width: 100%;
      }
      .login-else {
        display: flex;
        justify-content: center;
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
