<template>
  <div
    id="record"
    style="
      border-radius: 15px;
      position: relative;
      box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
    "
  >
    <div class="title">删除记录</div>
    <el-button
      style="float: left; position: relative; top: 15px; left: 15px"
      @click="toNotice()"
      >返回公告列表</el-button
    >
    <div class="notices" style="width: 100%; min-height: 300px; margin: 70px 0">
      <el-card
        shadow="hover"
        style="width: 90%; margin: 40px auto; min-height: 100px"
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
          v-html="v.del_con"
        ></div>
        <div style="font-size: 8px">
          <span style="margin-right: 50px">删除人：{{ v.del_admin }}</span>
          <span style="margin-right: 50px">删除时间：{{ v.del_time }}</span>
        </div>
      </el-card>
    </div>
    <el-pagination
      style="
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
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
    toNotice() {
      this.$router.push("/admin/notice");
    },
    async getData() {
      let res = await http.get("/admin/notice/del/record/search", {
        params: {
          pageSize: this.pager.pageSize,
          currPage: this.pager.currPage,
        },
      });
      this.list = res.data.list;
      this.pager.total = res.data.total;
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
<style></style>
