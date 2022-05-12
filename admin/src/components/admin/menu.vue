<template>
  <div id="admin-menu">
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <span style="padding:10px 0">管理员：{{ name }}</span>
      <el-menu-item index="1" @click="$router.push('/admin/user')">
        <i class="el-icon-user"></i>
        <span slot="title">用户信息</span>
      </el-menu-item>
      <el-menu-item index="2" @click="$router.push('/admin/banner')">
        <i class="el-icon-picture-outline"></i>
        <span slot="title">首页BANNER</span>
      </el-menu-item>
      <el-menu-item index="3"  @click="$router.push('/admin/share')">
        <i class="el-icon-document"></i>
        <span slot="title">互动分享</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: localStorage.getItem("username")
    };
  }
};
</script>

<style lang="less">
#admin-menu {
  width: 240px;
  span {
    color: #fff;
  }
}
#admin-menu > .el-menu {
  height: 91.5vh;
}
</style>
