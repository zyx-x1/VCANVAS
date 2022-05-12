<template>
  <div id="admin-user">
    <el-table :data="tableData" style="width: 100%" height="650">
      <el-table-column fixed prop="register_date" label="注册时间" width="300">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="200">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="300"> </el-table-column>
      <el-table-column prop="permission" label="权限" width="200">
      </el-table-column>
      <el-table-column prop="id" label="注册ID" width="200"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { AdminGetUserAPI } from "@/http/api.ts";
export default {
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    async getData() {
      let result = await AdminGetUserAPI({
        email: localStorage.getItem("usermail")
      });
      if (result.data.status == "fail") {
        this.$message.error(result.data.msg);
      } else {
        console.log(result.data.data);
        this.tableData = result.data.data;
      }
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="less">
#admin-user {
  padding-left: 40px;
}
</style>
