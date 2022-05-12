<template>
  <div
    id="record"
    style="
      border-radius: 15px;
      position: relative;
      box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
    "
  >
    <div class="title">记录列表</div>
    <el-input
      style="width: 300px; float: left; margin: 20px 50px"
      placeholder="请输入用户名检索"
      v-model="search_txt"
      @input="getData()"
    ></el-input>
    <el-table :data="tableData" style="width: 100%; padding: 20px">
      <el-table-column sortable prop="id" align="center" label="提交次序">
      </el-table-column>
      <el-table-column prop="user" align="center" label="用户">
      </el-table-column>
      <el-table-column prop="picture_id" align="center" label="图片ID">
      </el-table-column>
      <el-table-column align="center" label="图片">
        <template slot-scope="scope">
          <img
            :src="scope.row.picture"
            alt=""
            srcset=""
            style="
              width: 100px;
              height: 60px;
              background-size: cover;
              background-position: center;
              border: 1px solid #000;
            "
          />
        </template>
      </el-table-column>
      <el-table-column sortable prop="time" align="center" label="时间">
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
      :current-page.sync="pager.currPage"
      layout="total, prev, pager, next,jumper"
      :total="pager.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import http from "@/http/request";
export default {
  data() {
    return {
      tableData: [],
      search_txt: "",
      pager: {
        total: 0,
        page_size: 5,
        curr_page: 1,
      },
    };
  },
  methods: {
    async getData() {
      let res = await http.get("/admin/warehouse/search", {
        params: {
          user: this.search_txt,
          pageSize: this.pager.page_size,
          currPage: this.pager.curr_page,
        },
      });
      this.pager.total = res.data.total;
      this.tableData = res.data.list.reverse();
    },
    handleCurrentChange(val) {
      this.pager.curr_page = val;
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style></style>
