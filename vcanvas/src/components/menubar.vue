<template>
  <div id="top">
    <div class="top-container">
      <!-- 对文件进行存取操作 -->
      <div id="top-file" @click="$store.commit('isFile')">
        <vcTopFile />
      </div>
      <!-- 打开/关闭工具栏 -->
      <div id="top-tool" @click="$store.commit('isToolbar')"></div>
      <div id="top-notice" @click="$router.push('/notice')">系统公告</div>
      <div id="top-notice" @click="$router.push('/doc')">文档</div>
      <div id="top-times" @mouseover="onOnlineTime()" @mouseleave="onTime()">
        <transition name="fade">
          <div id="top-time" v-show="isTime">
            {{ vc_top_time | timeFilter }}
          </div>
        </transition>
        <transition name="fade">
          <div id="top-onlinetime" v-show="!isTime">
            您当前已在线{{ $store.state.onlinetime }}分钟<span v-show="!isLogin"
              >，请先登录！</span
            >
          </div>
        </transition>
      </div>
      <!-- 登录/注册 -->
      <a
        href="#"
        class="top-user"
        @click.prevent="pushRouter('login')"
        v-if="!$store.state.login_signal"
      >
        <a
          href="javascript:;"
          @click="clickToLogin()"
          v-if="!isTopUserHover"
          @mouseover="isToLogin()"
          >未登录</a
        >
        <a
          href="javascript:;"
          @click="clickToLogin()"
          v-else
          @mouseleave="isToLogin()"
          >点击登录/注册</a
        >
      </a>
      <div v-else @mouseover="usernameOver" @mouseleave="usernameLeave">
        <a class="top-user top-username">
          <img
            :src="$store.state.head"
            alt=""
            style="width: 20px; height: 20px; position: relative; top: 5px"
            srcset=""
          />
          {{ $store.state.username }}
          <i class="dropdown"></i>
        </a>
        <vcTopUser v-show="$store.state.isMenuUserSignal" />
      </div>
    </div>
  </div>
</template>
<script lang="js">
import vcTopFile from './menubar-subcomponents/menubar-file.vue'
import vcTopUser from './menubar-subcomponents/menubar-user.vue'
export default {
  data () {
    return {
      // 时间
      vc_top_time: new Date(),
      // 登录/注册按钮默认文本
      vc_top_user_default: '未登录',
      // 鼠标移入时登录/注册按钮文本
      login_hover_textview: '点击登录/注册',
      // 文件栏和工具栏默认为关闭状态
      isMenuFile: false,
      isMenuTool: false,
      // 登陆状态
      isLogin: this.$store.state.login_signal,
      // 在线时间显示的文本,未登录时显示--
      vc_top_onlinetime: '--',
      isTime: true,
      isTopUserHover: false
    }
  },
  components: { vcTopFile, vcTopUser },
  methods: {
    // 鼠标移入时变更文字内容，移出时重设为默认文本
    isToLogin () {
      this.isTopUserHover = !this.isTopUserHover
    },
    onOnlineTime () {
      this.isTime = false
    },
    onTime () {
      this.isTime = true
    },
    usernameOver () {
      this.$store.state.isMenuUserSignal = true
    },
    usernameLeave () {
      this.$store.state.isMenuUserSignal = false
    },
    clickToLogin () {
      this.$store.state.isToolbarSignal = false;
    },
    pushRouter(router){
      this.$router.push({
        path:router,
        name:'login',
        params:{
          reload: true
        }
      })
    }
  },
  filters: {
    // 调整时间的样式
    timeFilter (msg) {
      let h = msg.getHours().toString().padStart(2, '0'),
        m = msg.getMinutes().toString().padStart(2, '0'),
        s = msg.getSeconds().toString().padStart(2, '0')
      return `${h}:${m}:${s}`
    }
  },
  mounted(){
  },
  created () {
    // 动态时间
    let _this = this
    setInterval(() => {
      _this.vc_top_time = new Date()
    }, 1000)
  }
}
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#top {
  width: 100vw;
  height: 5vh;
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0;
  z-index: 101;
  .top-container {
    width: 80vw;
    margin: 0 auto;
    display: flex;
    position: relative;
    #top-file,
    #top-tool,
    #top-notice {
      height: 5vh;
      text-align: center;
      line-height: 5vh;
      color: #fff;
      letter-spacing: 3px;
      cursor: default;
      transition: all 0.5s;
      border: none;
      width: 10%;
      &:hover {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
    #top-file {
      &:before {
        content: "文件";
      }
    }
    #top-tool {
      &:before {
        content: "工具栏";
      }
    }

    #top-time,
    #top-onlinetime {
      line-height: 5vh;
      color: #fff;
      letter-spacing: 1px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      cursor: default;
    }
    .top-username {
      padding: 0 20px;
      cursor: default;
      transition: 0.5s;
      &:hover {
        background-color: rgba(0, 0, 0, 0.3);
      }
      &:hover .dropdown {
        transform: translate(40%, -10%) rotateX(180deg);
      }
    }
    .top-user {
      position: absolute;
      right: 0;
      height: 5vh;
      line-height: 5vh;
      padding: 0 20px;
      text-decoration: none;
      color: #fff;
      a {
        text-decoration: none;
        color: #fff;
      }
      &:hover a {
        color: #00ffd2;
      }
      .dropdown {
        background-image: url("../../static/icons/dropdown.png");
        background-size: cover;
        width: 10px;
        height: 10px;
        display: inline-block;
        line-height: 20px;
        transform: translate(70%, 30%);
        transition: 0.5s;
      }
    }
  }
}

/* .top-username::before{
  content: "";
  position: absolute;
  right: 0;
  top:50%;
  transform: translateY(-50%);
  width: 5px;
  height: 5px;
  border-top: 10px solid #00ffd2;
  border-left:2.5px solid transparent;
  border-right:2.5px solid transparent;
} */
</style>
