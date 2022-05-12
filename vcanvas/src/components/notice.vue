<template>
  <div id="notice" style="width: 100%">
    <el-button
      style="
        background-color: rgba(255, 255, 255, 0.3);
        float: right;
        margin-right: 5%;
        margin-top: 10px;
      "
      @click="$router.push('/index')"
      >返回首页</el-button
    >
    <div class="notices" style="width: 100%; min-height: 300px; margin: 70px 0">
      <el-card
        shadow="hover"
        style="
          width: 90%;
          margin: 60px auto;
          min-height: 100px;
          text-align: center;
          border-radius: 15px;
          background-color: rgba(255, 255, 255, 0.3);
        "
        v-for="(v, i) in list"
        :key="i"
      >
        <div
          style="
            width: 80%;
            margin: 0 auto;
            min-height: 100px;
            word-break: break-all;
          "
          v-html="v.content"
        ></div>
        <div style="font-size: 8px; text-align: center">
          <span style="margin-right: 50px">发布人：{{ v.issue_admin }}</span>
          <span style="margin-right: 50px">发布时间：{{ v.time }}</span>
        </div>
      </el-card>
    </div>
    <el-pagination
      style="
        position: absolute;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        background-color: transparent;
        color: #000;
      "
      @current-change="handleCurrentChange"
      :current-page.sync="pager.currPage"
      :page-size="pager.pageSize"
      :pager-count="pager.page_count"
      layout="total, prev, pager, next, jumper"
      :total="pager.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import http from "@/http/request";
import { formatTime } from "@/utils";
export default {
  data() {
    return {
      pager: {
        total: 10,
        pageSize: 3,
        currPage: 1,
        page_count: 7,
      },
      list: [],
    };
  },
  methods: {
    addNotice() {
      this.$router.push("/admin/addnotice");
    },
    async getData() {
      let res = await http.get("/admin/notice/search", {
        params: {
          pageSize: this.pager.pageSize,
          currPage: this.pager.currPage,
        },
      });
      this.list = res.data.list;
      this.pager.total = res.data.total;
      console.log(this.pager);
    },
    handleCurrentChange(val) {
      this.pager.currPage = val;
      this.getData();
    },
    confirmDel(id, con) {
      this.$confirm("此操作将永久删除此条公告, 是否继续?", "提示", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          http
            .get("/admin/notice/delete", {
              params: { id, con, time: formatTime(new Date()) },
            })
            .then((res) => {
              if (res.data.status == "success") {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.getData();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    this.getData();
  },
};
</script>
<style lang="less">
#notice {
  .btn-prev,
  .el-pager li,
  .btn-next,
  .el-input__inner {
    color: #000;
    background-color: transparent;
  }
}
</style>
