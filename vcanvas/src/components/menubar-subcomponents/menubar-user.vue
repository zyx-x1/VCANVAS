<template>
  <ul class="top-user-options">
    <li>
      <router-link to="/wh">个人仓库</router-link>
    </li>
    <li @click="userExit()">退出账号</li>
  </ul>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    openUsercenter() {},
    userExit() {
      this.$store.state.login_signal = false;
      this.$store.state.login_time = false;
      this.$store.commit("refreshOnlinetime");
      this.$store.state.isMenuUserSignal = false;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("usermail");
      location.reload();
    },
  },
};
</script>

<style lang="less">
a {
  text-decoration: none;
  color: black;
  cursor: default;
}
.top-user-options {
  width: 150px;
  background-color: #b0c4de;
  position: absolute;
  right: 0;
  top: 99%;
  list-style: none;
  z-index: 9999;
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
  padding: 20px 0;
  li {
    text-align: center;
    line-height: 30px;
    cursor: default;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      font-weight: bold;
    }
    &:first-of-type {
      border-top: 1px solid #333;
    }

    &:last-of-type {
      border-top: 1px solid #333;
    }
  }
}
</style>
