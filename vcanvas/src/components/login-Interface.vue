<template>
  <div id='lr-container'>
    <div class="login-decoration bg-color-animation" ref="vc_login_decoration"></div>
    <router-view></router-view>
    <!-- <div id='login-main' ref="vc_login_main" :style="{zIndex:$store.state.loginZindex}" v-show="!$store.state.isForgetpwd">
      <transition name="fade">
        <vcUserLogin v-show="$store.state.isUserLogin"></vcUserLogin>
      </transition>
    </div>
    <div id="register-main" ref="vc_register_main" :style="{zIndex:$store.state.registerZindex}">
      <transition name="fade">
        <vcUserRegister v-show="$store.state.isUserRegister"></vcUserRegister>
      </transition>
    </div>
    <transition name="slidein">
      <changepwd v-show="$store.state.isForgetpwd"/>
    </transition> -->
  </div>
</template>

<script>
import vcUserLogin from './login-subcomponents/login-main-login.vue'
import vcUserRegister from './login-subcomponents/login-main-register.vue'
import changepwd from './login-subcomponents/login-main-forgetpwd.vue'
export default {
  data () {
    return {
      isDecorationAnimation: false,
      vc_login_main_title: '登录',
      isUserLogin: this.$store.state.isUserLogin,
      toggleBtnText: '点击注册',
      isForgetpwd: false,
      isUserRegister: this.$store.state.isUserRegister
    }
  },
  methods: {
    goBackToMain () {
      location.href = ''
    }
  },
  mounted () {
  },
  components: { vcUserLogin, vcUserRegister, changepwd }
}
</script>

<style lang="less">
  #lr-container{
    width:100vw;
    height:100vh;
    position:absolute;
    top:0;
    left:0;
    position: relative;
    background: linear-gradient( 17deg, #00ffd2, #9c70d7);
    color: #fff!important;
    z-index:102;
    overflow: hidden;

    .login-decoration{
      width: 100vw;
      height: 100vw;
      background-color: rgba(0, 0, 0,.5);
      z-index: 100;

    }
    .login-decoration-login{
      animation: decorationFlipLogin 1s ease-in-out forwards;
    }
    @keyframes decorationFlipLogin {
      from{
        transform:rotateY(0deg);
      }
      to{
        transform:  rotateY(180deg);
      }
    }
    .login-decoration-register{
      animation: decorationFlipRegister 1s ease-in-out forwards;
    }
    @keyframes decorationFlipRegister {
      from{
        transform:  rotateY(180deg);
      }
      to{
        transform:rotateY(0deg);
      }
    }
    #login-main-close{
      background-image: url('/static/icons/close.png');
      background-size: cover;
      width: 1.2vw;
      height: 1.2vw;
      position:absolute;
      top:2.3vh;
      right:2vh;
      display: inline-block;
      &:hover{
        background-color: rgba(255,0,0,.5);
        background-image: url('/static/icons/close-hover.png');
        transform: scale(1.2) rotate(90deg);
        transition: all .5s;
      }
    }

    input{
      outline: none;
      border: none;
      background-color: transparent;
      padding-left:20px;
      width:100%;
      font-size:17px;
      height: 40px;
      border: 1px solid var(--color1);
      border-radius: 5px;
      margin-top:-5px;
      box-shadow: 1px 0px 5px rgba(0,0,0,.1);
      color: #fff;
      &:focus,&:valid{
        border: none;
        box-shadow: 0px 0px 5px 1px var(--color1);
      }
    }
    .login_ipt_name + input{
      width:86%;
    }
    .register_ipt_name + input{
      width:88%;
    }
    // 登录/注册提交按钮的公共样式
    .loginSubmitBtn{
      font-family: "等线";
      background-color: transparent;
      width:100%;
      height:40px;
      font-size:18px;
      line-height:40px;
      display:inline-block;
      letter-spacing:1px;
      text-align: center;
      margin-top:10px;
      position: relative;
      border-radius: 13px;
      border:none;
      border: 1px solid var(--color1);
      background-color: transparent;
      color: #fff;
      display: block;
      padding-left: 1em;
      transition: .5s;
      &:hover{
         padding-left: 0;
      }
      &:after{
        content: ">>";
        opacity: 0;
        transition: .5s;
      }
      &:hover:after{
        opacity: 1;
      }
    }
    #login-main{
      width:100vw;
      height:100vh;
      position:absolute;
      right: 0;
      top:50%;
      transform:translateY(-50%);
      background-color: transparent;
      border-radius:10px;

      #login-main-title{
        width:20%;
        display: inline-block;
        text-align: center;
      }
    }
    #register-main{
      width:100vw;
      height:100vh;
      position:absolute;
      left: 0;
      top:50%;
      transform:translateY(-50%);
      background-color: transparent;
      border-radius:10px;
      overflow: hidden;
    }
  }

  #login-toregister{
    position: absolute;
    right:15%;
    cursor: pointer;
    font-size: 12px;
    color:rgba(0,0,0,.5);
    text-decoration: underline;
    z-index: 1000;
    &:hover{
      color:rgba(0,0,0,1);
    }
  }

  .ipt-item-true{
    border: 1px solid rgb(0, 140, 255)!important;
    box-shadow: none!important;
  }
  .ipt-item-false{
    border: none!important;
    box-shadow: 0px 0px 3px 1px rgb(253, 129, 129)!important;
  }
</style>
