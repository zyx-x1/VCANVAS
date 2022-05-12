<template>
  <div
    id="user"
    style="
      border-radius: 15px;
      position: relative;
      box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
    "
  >
    <div class="title">用户列表</div>
    <el-select
      style="width: 300px; float: left; margin: 20px"
      v-model="user_type"
      placeholder="请选择用户类别"
      @change="getTableData()"
    >
      <el-option label="全部" value=""></el-option>
      <el-option label="普通用户" value="common"></el-option>
      <el-option label="管理员" value="admin"></el-option>
    </el-select>
    <el-table :data="tableData" style="width: 100%; padding: 0 20px">
      <el-table-column
        prop="id"
        sortable
        label="注册ID"
        align="center"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        align="center"
        width="180"
      >
      </el-table-column>
      <el-table-column align="center" label="头像">
        <template slot-scope="scope">
          <img
            :src="scope.row.head"
            alt=""
            srcset=""
            style="
              width: 60px;
              height: 60px;
              background-size: cover;
              background-position: center;
            "
          />
        </template>
      </el-table-column>
      <el-table-column prop="mail" align="center" label="邮箱">
      </el-table-column>
      <el-table-column
        prop="registertime"
        sortable
        align="center"
        label="注册时间"
      >
      </el-table-column>
      <el-table-column
        prop="onlinetime"
        align="center"
        sortable
        label="累计在线时长（分钟）"
      >
      </el-table-column>
      <el-table-column align="center" label="权限">
        <template slot-scope="scope">
          <span v-show="scope.row.permission == 'admin'">管理员</span>
          <span v-show="scope.row.permission == 'common'">普通用户</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
      "
      @current-change="handleCurrentChange"
      :page-size="pager.page_size"
      layout="total, prev, pager, next,jumper"
      :total="pager.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { GetUserInfo } from "@/http/api";
export default {
  data() {
    return {
      user_type: "",
      tableData: [],
      pager: {
        curr_page: 1,
        page_size: 6,
        total: 0,
      },
    };
  },
  methods: {
    async getTableData() {
      const res = await GetUserInfo({
        user_type: this.user_type,
        currPage: this.pager.curr_page,
        pageSize: this.pager.page_size,
      });
      this.tableData = res.data.list;
      this.pager.total = res.data.total;
    },
    handleCurrentChange(val) {
      this.pager.curr_page = val;
    },
  },
  created() {
    this.getTableData();
  },
};
</script>

<style></style>
