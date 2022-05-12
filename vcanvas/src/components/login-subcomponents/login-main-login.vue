<template>
  <div id="login-container">
    <div class="login-l">
      <button class="login-signup" @click="toRegister()">注册</button>
      <button class="return-main" @click="returnMain()">返回</button>
    </div>
    <div class="login-main-top">
      <i></i>
      <span id="login-main-title" style="padding: 0 20px"> 欢迎登录 </span>
      <i></i>
    </div>
    <ul id="login-main-login">
      <li v-for="(item, index) in login_input" :key="index">
        <label class="login_ipt_name"
          >{{ item.prefix }}<span id="spanForJustify"></span
        ></label>
        <input
          :autocomplete="autocomplete"
          :type="item.type"
          @keypress="iptOnInput($event)"
          @input="iptOn($event)"
          :iptId="index"
          :pattern="item.pattern"
          required="required"
          :placeholder="item.placeholder"
          ref="ipt"
          v-model="item.content"
        />
        <transition name="fade">
          <p class="empty_msg" v-show="item.isEmpty || item.isError">
            {{ item.prefix }}
            <span v-show="item.isEmpty">不能为空</span>
            <span v-show="item.isError">格式错误</span>!
          </p>
        </transition>
      </li>
      <li>
        <div id="login-rememberme">
          <input
            type="checkbox"
            id="login-rememberme-option"
            :checked="isRemeber"
            @input="isRememberme($event)"
          />
          <label for="login-rememberme-option">记住我</label>
        </div>
        <p class="forget_pwd" @click="setForget()"></p>
      </li>
      <li>
        <button
          ref="loginbtn"
          class="loginbtn loginSubmitBtn"
          @click="submitLogin"
        >
          登录
        </button>
        <span>{{ login_tips }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login_input: [
        {
          content: "",
          prefix: "用户名",
          type: "text",
          isError: false,
          isEmpty: false,
          pattern: "^[a-zA-Z][a-zA-Z0-9_]{4,15}$",
          placeholder: "请输入用户名",
        },
        {
          content: "",
          prefix: "密码",
          type: "password",
          isError: false,
          isEmpty: false,
          pattern: "^[a-zA-Z][a-zA-Z0-9_]{5,17}$",
          placeholder: "请输入密码",
        },
      ],
      login_tips: "",
      isRemeber: false,
      autocomplete: "new-password",
    };
  },
  methods: {
    toRegister() {
      this.$router.push("/login/register");
    },
    returnMain() {
      this.$router.push("/");
    },
    iptOn(e) {
      let index = e.target.getAttribute("iptId");
      this.login_input[index].isError = false;
      this.login_input[index].isEmpty = false;
    },
    iptOnInput(e) {
      e.keyCode === 32 ? e.preventDefault() : null;
    },
    isRememberme(e) {
      this.isRemeber = e.target.checked;
    },
    submitLogin() {
      let _this = this;
      let isVaild = this.login_input.every((item) => {
        return item.isError == false && item.isEmpty == false;
      });
      if (isVaild) {
        this.axios
          .get(
            `http://${this.$store.state.URL}:${this.$store.state.PORT}/login`,
            {
              params: {
                username: this.login_input[0].content,
                password: this.login_input[1].content,
                logintime: new Date(),
              },
            }
          )
          .then((res) => {
            if (res.data.status === "fail") {
              this.$message.error(res.data.msg);
            } else if (res.data.status === "success") {
              _this.isRemeber
                ? localStorage.setItem("rememberMe", true)
                : localStorage.removeItem("rememberMe");
              //登陆成功跳转
              this.$message({
                type: "success",
                message: "登录成功",
              });
              _this.login_tips = "";
              //路由跳转到主界面
              this.$router.push("/");
              //修改store中的相关变量
              this.$store.state.login_signal = true;
              this.$store.state.login_time = new Date();
              this.$store.state.username = res.data.resData[0].username;
              this.$store.state.head = res.data.resData[0].head;
              localStorage.setItem("token", res.data.token);
              this.$store.commit("refreshOnlinetime");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    setForget() {
      this.$store.commit("toForgetpwd", true);
      this.$router.push("/login/forget");
      if (this.login_input[0].content) {
        window.eventBus.$emit("confirm_username", this.login_input[0].content);
      }
    },
    setIptTrue(item) {
      item.classList.add("ipt-item-true");
      item.classList.remove("ipt-item-false");
    },
    setIptFalse(item) {
      item.classList.add("ipt-item-false");
      item.classList.remove("ipt-item-true");
    },
    checkIpt(context, item, index) {
      if (item.value) {
        context.login_input[index].isEmpty = false;
        this.setIptFalse(item);
        if (item.checkValidity()) {
          context.login_input[index].isError = false;
          this.setIptTrue(item);
        } else {
          context.login_input[index].isError = true;
          this.setIptFalse(item);
        }
      } else {
        context.login_input[index].isError = false;
        context.login_input[index].isEmpty = true;
        this.setIptFalse(item);
      }
    },
  },
  beforeMount() {
    if (localStorage.getItem("rememberMe")) {
      this.autocomplete = "on";
      this.isRemeber = true;
    }
  },
  mounted() {
    let _this = this;
    this.$refs.ipt.forEach((item, index) => {
      item.oninput = () => {
        this.checkIpt(_this, item, index);
      };
    });
    document.onkeydown = (e) => {
      e.keyCode == 13 ? this.submitLogin() : null;
    };
    console.log(this.$route.params);
    if (this.$route.params.reload == true) {
      location.reload();
    }
  },
};
</script>

<style lang="less">
input::placeholder {
  font-size: 10px;
  color: #fff;
}
#login-container {
  width: 50%;
  height: 70%;
  float: right;
  position: absolute;
  top: 10%;
  left: 50%;
  z-index: 101;

  .login-l {
    width: 30%;
    height: 40vh;
    position: absolute;
    left: -50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    button {
      height: 50px;
      background-color: transparent;
      border: none;
      outline: none;
      font-size: 20px;
      color: #fff;
      letter-spacing: 5px;
      z-index: 102;
      border: 1px solid #fff;
      padding: 10px 30px;
      border-radius: 13px;
      &:hover {
        border: none;
        box-shadow: 0 0 10px 1px #fff;
      }
    }
  }
  // .login-signup{
  //   background-color: transparent;
  //   border: none;
  //   outline: none;
  //   position: absolute;
  //   left: -50%;
  //   top: 50%;
  //   transform: translate(-50%,-50%);
  //   font-size: 30px;
  //   color: #fff;
  //   letter-spacing: 5px;
  //   z-index: 102;
  //   border: 1px solid #fff;
  //   padding: 10px 30px;
  //   border-radius: 13px;
  //   &:hover{
  //     box-shadow: 0 0 10px 1px #fff;
  //   }
  // }

  .login-main-top {
    width: 80%;
    height: 30px;
    margin: 8% auto 0;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      width: 30%;
      height: 1px;
      background-color: var(--color1);
    }
  }

  #login-main-login {
    width: 60%;
    height: 60%;
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 200;
    list-style: none;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;

    li {
      width: 100%;
      height: 25%;
      line-height: 40px;
      text-align: center;
      position: relative;

      input {
        padding-left: 4em;
      }
      .login_ipt_name {
        position: absolute;
        top: 0;
        left: 1em;
        font-size: 13px;
      }

      &:nth-child(3) {
        height: 10%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
      }

      #login-rememberme {
        float: left;
        line-height: 40px;
        position: relative;
        background-color: transparent;

        #login-rememberme-option {
          width: 15px;
          height: 15px;
          box-shadow: none;
          margin: 0;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          border: 1px solid rgb(139, 203, 255);
          background-color: transparent;
          outline: none;
          padding: 0;
          &:checked + label {
            color: rgb(255, 255, 255);
          }
        }

        label {
          margin-left: 18px;
          padding: 0;
          color: rgba(255, 255, 255, 0.5);
        }
      }

      .forget_pwd {
        display: inline-block;
        font-size: 14px;

        &:before {
          content: "忘记密码？";
          color: rgba(255, 255, 255, 0.5);
        }
        &:hover:before {
          color: rgb(255, 255, 255);
        }
      }
      &:last-of-type {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: red;
        font-size: 14px;
      }
    }
  }
}

#spanForJustify {
  width: 100%;
  display: inline-block;
}
.error_msg,
.empty_msg {
  font-size: 10px;
  height: 30px;
  line-height: 30px !important;
  color: red;
}
</style>
