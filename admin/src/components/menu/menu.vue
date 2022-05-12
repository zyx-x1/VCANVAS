<template>
  <div class="menu" style="width: 300px; height: 99vh">
    <el-menu
      style="height: 100vh"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="1" @click="$router.push('/admin/view')">
        <i class="el-icon-view"></i>
        <span slot="title">访客信息</span>
      </el-menu-item>
      <el-menu-item index="2" @click="$router.push('/admin/user')">
        <i class="el-icon-s-custom"></i>
        <span slot="title">用户信息</span>
      </el-menu-item>
      <el-menu-item index="3" @click="$router.push('/admin/record')">
        <i class="el-icon-time"></i>
        <span slot="title">保存记录</span>
      </el-menu-item>
      <el-menu-item index="4" @click="$router.push('/admin/notice')">
        <i class="el-icon-setting"></i>
        <span slot="title">公告管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  methods: {},
  mounted() {},
};
</script>

<style></style>
