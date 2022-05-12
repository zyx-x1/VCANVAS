<template>
  <div class="register-main-container">
    <div class="register-r">
      <button class="login-signin" @click="toLogin()">登录</button>
      <button class="return-main" @click="returnMain()">返回</button>
    </div>
    <ul id="login-main-register">
      <li>
        <div class="register-main-top">
          <i></i>
          <span> 欢迎注册 </span>
          <i></i>
        </div>
      </li>
      <li v-for="(item, index) in register_input" :key="index">
        <label class="register_ipt_name"
          >{{ item.prefix }}<span class="spanForJustify"></span
        ></label>
        <input
          :type="item.type"
          :pattern="item.pattern"
          required="required"
          @keypress="iptOnInput($event)"
          :placeholder="item.placeholder"
          ref="ipt"
          :name="item.name"
          v-model="item.content"
        />
        <div class="ipt-end-icon-container">
          <i class="ipt-end-icon ipt-end-icon-correct" v-show="item.isTrue"></i>
          <i
            class="ipt-end-icon ipt-end-icon-error"
            v-show="item.isError || item.isEmpty"
            @click="item.content = ''"
          ></i>
        </div>

        <div class="msg-container">
          <transition name="fade">
            <p class="empty_msg" v-show="item.isEmpty || item.isError">
              <span>{{ item.prefix }}</span>
              <span v-show="item.isEmpty">不能为空</span>
              <span v-show="item.isError">格式错误</span>!
            </p>
          </transition>
        </div>
      </li>
      <transition name="fade">
        <li v-show="codeShow">
          <label class="register_ipt_name"
            >验证码<span class="spanForJustify"></span
          ></label>
          <input
            type="text"
            required="required"
            @keypress="iptOnInput($event)"
            placeholder="请输入验证码"
            ref="ipt_code"
            name="code"
            id="ipt-code"
            v-model="iptCodeVal"
          />
          <button @click="getMailCode()" :disabled="isSend && !isReSend">
            <span v-show="!isSend && !isReSend">发送验证码</span
            ><span v-show="isSend">{{ timeCountDown }}s</span>
            <span v-show="isReSend">重新发送</span>
          </button>
          <div class="ipt-end-icon-container">
            <i
              class="ipt-end-icon ipt-end-icon-correct"
              v-show="isCodeTrue"
            ></i>
            <i
              class="ipt-end-icon ipt-end-icon-error"
              v-show="codeErr.isCodeEmpty || codeErr.isCodeError"
              @click="iptCodeVal = ''"
            ></i>
          </div>

          <div class="msg-container">
            <transition name="fade">
              <p
                class="empty_msg"
                v-show="codeErr.isCodeEmpty || codeErr.isCodeError"
              >
                <span>验证码</span>
                <span v-show="codeErr.isCodeEmpty">不能为空</span>
                <span v-show="codeErr.isCodeError">格式错误</span>!
              </p>
            </transition>
          </div>
        </li>
      </transition>
      <li>
        <label class="">头像<span class="spanForJustify"></span></label>
        <input
          type="file"
          id="upload-head"
          required="required"
          accept=".jpg,.png,.jpeg"
          ref="upload_img"
          style="width: 88%; border: none; box-shadow: none; font-size: 12px"
        />
      </li>
      <li>
        <button
          ref="registerbtn"
          class="registerbtn loginSubmitBtn"
          @click="submitRegister"
        >
          注册
        </button>
        <transition name="fade">
          <span
            v-text="register_tips"
            :class="[
              isRegisterSuccess ? 'register_tips_success' : 'register_tips_err',
            ]"
          ></span>
        </transition>
      </li>
    </ul>
  </div>
</template>

<script>
import http from "@/http/request";
import { formatTime } from "@/utils";
export default {
  data() {
    return {
      filereader: new FileReader(),
      codeShow: false,
      timeCountDown: 59,
      isSend: false,
      isReSend: false,
      iptCodeVal: "",
      trueCode: "",
      isCodeTrue: false,
      codeErr: {
        isCodeEmpty: false,
        isCodeError: false,
      },
      register_input: [
        {
          content: "",
          prefix: "用户名",
          type: "text",
          name: "username",
          isTrue: false,
          isError: false,
          isEmpty: false,
          pattern: "^[a-zA-Z][a-zA-Z0-9_]{4,15}$",
          placeholder: "字母开头，5-16位字母数字下划线",
        },
        {
          content: "",
          prefix: "密码",
          type: "password",
          name: "pwd",
          isTrue: false,
          isError: false,
          isEmpty: false,
          pattern: "^[a-zA-Z][a-zA-Z0-9_]{5,17}$",
          placeholder: "字母开头，6~18位字母、数字和下划线",
        },
        {
          content: "",
          prefix: "确认密码",
          type: "password",
          name: "repwd",
          isTrue: false,
          isError: false,
          isEmpty: false,
          pattern: null,
          placeholder: "两次密码保持一致",
        },
        {
          content: "",
          prefix: "邮箱",
          type: "mail",
          ref: "mail",
          name: "mail",
          isTrue: false,
          isError: false,
          isEmpty: false,
          pattern:
            "^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$",
          placeholder: "请输入你的邮箱",
        },
      ],
      // 密码项的索引值
      pwdIndex: null,
      errormsg: "格式错误",
      register_tips: "",
      tomain_countdown: 0,
      isRegisterSuccess: false,
      isHeadUpload: false,
    };
  },
  methods: {
    getBase64() {
      const up = this.$refs.upload_img;
      up.addEventListener("change", () => {
        let acceptFileTypes = ["jpg", "jpeg", "png"];
        let uploadFileType =
          up.value.split(".")[up.value.split(".").length - 1];
        if (acceptFileTypes.indexOf(uploadFileType) == -1) {
          this.$message.error("仅支持jpg、jpeg、png格式的图片！");
          up.value = "";
          return;
        }
        this.filereader.readAsDataURL(up.files[0]);
        this.isHeadUpload = true;
      });
    },
    toLogin() {
      this.$router.push("/login");
    },
    returnMain() {
      this.$router.push("/");
    },
    iptOnInput(e) {
      e.keyCode === 32 ? e.preventDefault() : null;
    },
    async getMailCode() {
      if (this.isReSend == true) {
        this.isReSend = false;
        this.timeCountDown = 59;
      }
      const email = this.register_input[3].content;
      let res = await http.get(
        `http://${this.$store.state.URL}:${this.$store.state.PORT}/register/mail/getcode`,
        { params: { mail: email } }
      );
      if (res.data.status == "success") {
        this.trueCode = res.data.code;
        this.isSend = true;
        let timer = setInterval(() => {
          this.timeCountDown--;
          if (this.timeCountDown == 50) {
            clearInterval(timer);
            this.isSend = false;
            this.isReSend = true;
          }
        }, 1000);
      }
    },
    submitRegister() {
      let _this = this;
      // 检测各输入项是否合法
      let isVaild = this.register_input.every((item) => {
        return item.isTrue == true;
      });
      if (!isVaild) {
        this.$message.error("请确保确保各项输入值合法！");
      } else if (this.trueCode != this.iptCodeVal) {
        this.$message.error("验证码错误！");
      } else if (!this.isHeadUpload) {
        this.$message.error("未选择头像！");
      } else {
        this.axios
          .post(
            `http://${this.$store.state.URL}:${this.$store.state.PORT}/register`,
            {
              username: this.register_input[0].content,
              password: this.register_input[1].content,
              mail: this.register_input[3].content,
              registertime: formatTime(new Date()),
              head: this.filereader.result,
            },
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
          )
          .then((res) => {
            if (res.data.status == -3) {
              _this.isRegisterSuccess = false;
              _this.register_tips = "用户名已存在！请更换后重试！";
            } else {
              _this.tomain_countdown = 3;
              _this.isRegisterSuccess = true;
              _this.register_tips = `注册成功，将在${_this.tomain_countdown}秒后跳转到登录页`;
              setInterval(() => {
                _this.tomain_countdown = _this.tomain_countdown - 1;
                _this.register_tips = `注册成功，将在${_this.tomain_countdown}秒后跳转到登录页`;
                if (_this.tomain_countdown === -1) {
                  this.$router.push("/login");
                }
              }, 1000);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    getPwdIndex(context) {
      context.register_input.forEach((item, index) => {
        if (item.prefix === "密码") {
          context.pwdIndex = index;
        }
      });
    },
    setIptTrue(item) {
      item.classList.add("ipt-item-true");
      item.classList.remove("ipt-item-false");
    },
    setIptFalse(item) {
      item.classList.add("ipt-item-false");
      item.classList.remove("ipt-item-true");
    },
    checkRegisterIpt(context, item, index, rePwdIndex) {
      // 输入项内有值
      if (item.value) {
        context.register_input[index].isEmpty = false;
        // 当输入项为确认密码时
        if (index === rePwdIndex) {
          if (
            context.register_input[index].content ===
            context.register_input[index - 1].content
          ) {
            // 当确认密码与密码相同时执行以下代码
            context.register_input[index].isError = false;
            context.register_input[index].isTrue = true;
            context.setIptTrue(item);
          } else {
            // 当确认密码与密码不同时执行以下代码
            context.register_input[index].isError = true;
            context.register_input[index].isTrue = false;
            context.errormsg = "不一致";
            context.setIptFalse(item);
          }
        } else {
          // 当输入项不是确认密码时
          if (item.checkValidity()) {
            context.register_input[index].isError = false;
            context.register_input[index].isTrue = true;
            context.setIptTrue(item);
          } else {
            context.register_input[index].isError = true;
            context.register_input[index].isTrue = false;
            context.errormsg = "格式错误";
            context.setIptFalse(item);
          }
        }
      } else {
        context.register_input[index].isError = false;
        context.register_input[index].isEmpty = true;
        context.register_input[index].isTrue = false;
        context.setIptFalse(item);
      }
    },
  },
  mounted() {
    let _this = this;
    this.getPwdIndex(_this);
    // 失去焦点时验证
    this.$refs.ipt.forEach((item, index) => {
      item.onblur = () => {
        this.checkRegisterIpt(_this, item, index, _this.pwdIndex + 1);
        if (index == 3) {
          if (item.checkValidity()) {
            this.codeShow = true;
          }
        }
      };
    });
    this.$refs.ipt.forEach((item, index) => {
      item.oninput = () => {
        this.checkRegisterIpt(_this, item, index, _this.pwdIndex + 1);
        if (index == 3) {
          if (item.checkValidity()) {
            this.codeShow = true;
          }
        }
      };
    });
    let _self = this;
    this.$refs.ipt_code.onblur = function () {
      if (!this.value) {
        _self.codeErr.isCodeEmpty = true;
        _self.codeErr.isCodeError = false;
      }
    };
    this.$refs.ipt_code.onchange = function () {
      if (this.value.length !== 6 && !Number(this.value)) {
        _self.codeErr.isCodeEmpty = false;
        _self.codeErr.isCodeError = true;
      }
    };
    document.onkeydown = (e) => {
      e.keyCode == 13 ? this.submitRegister() : null;
    };
    this.getBase64();
  },
};
</script>

<style lang="less">
input::placeholder {
  font-size: 8px;
}
.register-main-container {
  width: 50%;
  height: 90%;
  float: left;
  position: absolute;
  top: -5%;
  z-index: 101;

  .register-r {
    width: 30%;
    height: 40vh;
    position: absolute;
    left: 150%;
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
  #login-main-register {
    width: 80%;
    height: 100%;
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 200;
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .register-main-top {
      width: 100%;
      height: 30px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        width: 60%;
        height: 1px;
        background-color: var(--color1);
      }

      span {
        width: 25%;
        display: inline-block;
        text-align: center;
      }
    }

    li {
      width: 90%;
      height: 12% !important;
      line-height: 40px;
      text-align: center;
      height: 60px;
      position: relative;
      #ipt-code {
        width: 61%;
        float: left;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      #ipt-code + button {
        background-color: #fff;
        background-color: rgb(52, 154, 236);
        color: #fff;
        font-family: "等线";
        letter-spacing: 5px;
        font-size: 16px;
        outline: none;
        border: none;
        width: 27.3%;
        height: 49%;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        position: relative;
        top: -5px;
      }
      input {
        padding-left: 4em;
      }
      label {
        position: absolute;
        top: 0;
        left: 1em;
        font-size: 12px;
      }
    }
  }
}

.spanForJustify {
  width: 100%;
  display: inline-block;
}
.error_msg,
.empty_msg {
  font-size: 10px;
  height: 20px;
  line-height: 0px;
  color: red;
}
.ipt-end-icon {
  width: 20px;
  height: 20px;
  background-size: cover;
  display: inline-block;
  position: relative;
  top: 0%;
  right: 0%;
  transform: translate(200%, -10%);
}
// .ipt-end-icon-correct {
//   // background-image: url("/static/icons/iptcorrect.png");
// }
// .ipt-end-icon-error {
//   // background-image: url("/static/icons/ipterror.png");
// }
.ipt-end-icon-container {
  position: absolute;
  top: 6px;
  right: 8px;
}
.msg-container {
  margin-top: 5px;
}
#login-main-register li:last-of-type {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  color: red;
  font-size: 14px;
}
#login-main-register li:last-of-type span {
  margin-top: 0px;
}
.register_tips_err {
  color: red;
}
.register_tips_success {
  color: rgb(0, 180, 90);
}
#upload-head::before {
  content: "上传头像";
  width: 64px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  position: absolute;
  background-color: var(--color1);
}
</style>
