<template>
  <div id="admin">
    <Menu></Menu>
    <div class="admin-main">
      <router-view
        style="width: 100%; height: 94%; background-color: #fff"
      ></router-view>
    </div>
  </div>
</template>

<script>
import Menu from "@/components/menu/menu.vue";
export default {
  components: { Menu },
  methods: {
    async checkPermission() {
      let result = await CheckPermissionAPI({
        email: localStorage.getItem("usermail"),
      });
      if (result.data.permission != "管理员") {
        this.$message.error("当前用户无权限");
        this.$router.push("/index");
      }
    },
  },
  created() {
    // this.checkPermission();
  },
};
</script>

<style lang="less">
#admin {
  height: 100vh;
  display: flex;
  .admin-main {
    width: 100%;
    display: flex;
    overflow: hidden;
    padding: 20px;
    .title {
      border-bottom: 1px solid rgb(128, 128, 128);
      text-indent: 2em;
      text-align: left;
      margin-top: 20px;
      font-weight: bold;
      padding-bottom: 5px;
    }
  }
}
</style>
