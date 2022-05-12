<template>
  <div id="forgetpwd-main">
    <div id="forget-username" v-show="is_username">
      <input
        type="text"
        class="confirm_username_ipt"
        @keypress="iptOnInput($event)"
        placeholder="请确认您的用户名"
        v-model="confirm_username"
      />
      <button class="confirm_username_btn" @click="toForgetpwdStep2()">
        确认
      </button>
      <p v-show="username_err">
        用户名
        <span v-show="usernameEmpty">不能为空</span>
        <span v-show="usernameError">不存在</span>
        !
      </p>
    </div>

    <div id="forget-mailcode" v-show="is_code">
      <input
        type="text"
        class="mail_code_ipt"
        @keypress="iptOnInput($event)"
        placeholder="验证码已发送到您的邮箱"
        v-model="mail_code"
      />
      <button class="mail_code_btn" @click="checkCode()">提交验证码</button>
      <p class="reseterr">{{ reset_error }}</p>
    </div>

    <div id="forget-resetpwd" v-show="is_reset">
      <input
        type="password"
        ref="resetIpt1"
        class="resetpwd_ipt"
        @keypress="iptOnInput($event)"
        @input="pwdCheck($event)"
        v-model="resetpwd"
        pattern="^[a-zA-Z][a-zA-Z0-9_]{5,17}$"
        placeholder="请输入新密码，字母开头，6~18位字母、数字和下划线"
      />
      <input
        type="password"
        ref="resetIpt2"
        class="resetpwd_ipt2"
        @keypress="iptOnInput($event)"
        @input="pwd2Check($event)"
        v-model="resetpwd2"
        placeholder="两次密码保持一致"
      />
      <button class="resetpwd_btn" @click="toResetPwd()">完成</button>
      <p class="reseterr" v-show="isResetError">{{ reset_error }}</p>
      <p class="resetsuccess" v-show="isResetSuccess">{{ reset_success }}</p>
    </div>
    <p id="cancelreset" @click="returnLoginmain()">返回登录</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      confirm_username: "",
      mail_code: "",
      code_true: "",
      is_username: true,
      is_code: false,
      is_reset: false,
      is_code_true: false,
      resetpwd: "",
      resetpwd2: "",
      reset_error: "",
      reset_success: "",
      username_err: false,
      usernameEmpty: false,
      usernameError: false,
      isResetError: false,
      isResetSuccess: false,
    };
  },
  methods: {
    toForgetpwdStep2() {
      if (!this.confirm_username) {
        this.username_err = true;
        this.usernameEmpty = true;
        this.usernameError = false;
      } else {
        this.axios
          .get(
            `http://${this.$store.state.URL}:${this.$store.state.PORT}/email`,
            {
              params: {
                username: this.confirm_username,
              },
            }
          )
          .then((res) => {
            if (res.data.status == -1) {
              this.username_err = true;
              this.usernameEmpty = false;
              this.usernameError = true;
            } else {
              this.username_err = false;
              this.is_username = false;
              this.is_reset = false;
              this.is_code = true;
              this.code_true = res.data;
            }
          });
      }
    },
    iptOnInput(e) {
      e.keyCode === 32 ? e.preventDefault() : null;
    },
    checkCode() {
      if (this.mail_code == this.code_true) {
        this.reset_error = "";
        this.is_username = false;
        this.is_code = false;
        this.is_reset = true;
      } else {
        this.$message.error("验证码错误!请检查！");
      }
    },
    pwdCheck(e) {
      if (this.resetpwd) {
        if (e.target.checkValidity()) {
          this.isResetError = false;
        } else {
          this.isResetError = true;
          this.reset_error = "密码格式错误，请检查密码格式！";
        }
      } else {
        this.$message.error("密码不能为空！");
      }
    },
    pwd2Check(e) {
      if (e.target.value) {
        if (e.target.value == this.resetpwd) {
          this.isResetError = false;
        } else {
          this.isResetError = true;
          this.reset_error = "确认密码与密码不一致！请重试！";
        }
      } else {
        this.reset_error = "确认密码不能为空！";
      }
    },
    toResetPwd() {
      if (!this.resetpwd) {
        this.$message.error("密码不能为空！");
      } else if (!this.resetpwd2) {
        this.$message.error("确认密码不能为空！");
      }
      if (this.resetpwd === this.resetpwd2) {
        this.reset_error = "";
        console.log(this.confirm_username);
        this.axios
          .get(
            `http://${this.$store.state.URL}:${this.$store.state.PORT}/resetpwd`,
            {
              params: {
                username: this.confirm_username,
                password: this.resetpwd,
              },
            }
          )
          .then((res) => {
            console.log(res);
            if (res.data == true) {
              this.isResetSuccess = true;
              this.$messgae({
                type: "success",
                message: "密码重置成功！即将返回登录界面！",
              });
              // this.reset_success = '密码重置成功！即将返回登录界面！'
              setTimeout(() => {
                this.$router.push("/login");
                this.$store.commit("toForgetpwd", false);
                this.is_username = true;
                this.is_code = false;
                this.is_reset = false;
              }, 2000);
            }
          });
      } else {
        this.reset_error = "确认密码需与密码保持一致！";
      }
    },
    returnLoginmain() {
      this.$store.commit("toForgetpwd", false);
      this.$router.push("/login");
      this.is_username = true;
      this.is_code = false;
      this.is_reset = false;
    },
    returnMain() {
      this.$router.push("/");
      this.$store.commit("toForgetpwd", false);
      this.is_username = true;
      this.is_code = false;
      this.is_reset = false;
    },
  },
  mounted() {
  },
};
</script>

<style lang="less">
#forgetpwd-main {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0%;
  top: 0%;
  background: linear-gradient(17deg, #00ffd2, #9c70d7);
  z-index: 104;
  overflow: hidden;
  div {
    display: flex;
    flex-direction: column;
  }
  #forget-username,
  #forget-mailcode,
  #forget-resetpwd {
    height: 50%;
    transform: translateY(30%);
    justify-content: space-evenly;
    position: relative;
    p {
      position: absolute;
      bottom: 10%;
      left: 50%;
      transform: translateX(-50%);
    }
    .reseterr {
      color: rgba(255, 0, 0, 0.8);
    }
    .resetsuccess {
      color: rgb(0, 128, 0);
    }
  }
  #forgetpwd-main-close {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 50px;
    right: 50px;
    background-image: url("/static/icons/close.png");
    background-size: cover;
    border-radius: 0%;
    &:hover {
      background-color: rgba(255, 0, 0, 0.5);
      background-image: url("/static/icons/close-hover.png");
      transform: scale(1.1) rotate(90deg);
      border-radius: 50%;
      transition: all 0.5s;
    }
  }
  .confirm_username_title {
    font-size: 18px;
    padding-left: 0px;
    text-align: center;
  }
  .mail_code_title {
    font-size: 18px;
    padding-left: 30px;
    margin-top: 10%;
    &:before {
      content: "验证码已发送到您的邮箱";
    }
  }
  .resetpwd_title {
    font-size: 18px;
    padding-left: 30px;
    margin-top: 10%;
    &:before {
      content: "请输入新密码";
    }
  }
  .confirm_username_ipt,
  .mail_code_ipt,
  .resetpwd_ipt,
  .resetpwd_ipt2 {
    margin-left: 50%;
    transform: translateX(-50%);
    width: 47%;
    height: 40px;
    outline: none;
    border: none;
    border: 1px solid #fff !important;
    color: #fff;
    background-color: transparent;
    border-radius: 15px;
    padding: 5px 20px;
    font-size: 17px;
    font-family: "等线";
    &:focus {
      border: none;
      box-shadow: 0px 0px 5px 2px rgba(255, 255, 255, 1);
    }
    &::placeholder {
      font-size: 14px;
      color: #fff;
    }
  }
  .confirm_username_btn,
  .mail_code_btn,
  .resetpwd_btn {
    background-color: transparent;
    color: #fff;
    border: none;
    outline: none;
    border: 1px solid #fff;
    width: 49%;
    height: 40px;
    font-size: 16px;
    letter-spacing: 3px;
    margin-left: 50%;
    transform: translateX(-50%);
    border-radius: 3px;
    padding-left: 1.5em;
    transition: 0.5s;
    &:after {
      content: ">>";
      opacity: 0;
    }
    &:hover {
      padding-left: 0;
      background-color: rgba(255, 255, 255, 0.8);
      color: rgb(0, 140, 255);
    }
    &:hover:after {
      opacity: 1;
    }
  }

  #cancelreset {
    position: absolute;
    top: 10%;
    right: 10%;
    color: rgba(255, 255, 255, 1);
    cursor: default;
    transition: color 0.5s;
    &:hover {
      color: rgb(0, 238, 255);
    }
  }
}
</style>
