<template>
  <div
    id="notice"
    style="
      border-radius: 15px;
      position: relative;
      box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
    "
  >
    <div class="title">公告列表</div>
    <el-button
      style="float: left; position: relative; top: 15px; left: 15px"
      @click="addNotice()"
      >新增公告</el-button
    ><el-button
      style="float: left; position: relative; top: 15px; left: 15px"
      @click="toDelRecord()"
      >删除记录</el-button
    >
    <div class="notices" style="width: 100%; min-height: 300px; margin: 70px 0">
      <el-card
        shadow="hover"
        style="width: 90%; margin: 40px auto; min-height: 200px"
        v-for="(v, i) in list"
        :key="i"
      >
        <div
          style="
            width: 80%;
            margin: 0 auto;
            min-height: 150px;
            word-break: break-all;
          "
          v-html="v.content"
        ></div>
        <div style="font-size: 8px">
          <span style="margin-right: 50px">发布人：{{ v.issue_admin }}</span>
          <span style="margin-right: 50px">发布时间：{{ v.time }}</span>
          <span
            style="color: #409eff; cursor: pointer"
            @click="confirmDel(v.id, v.content)"
            >删除</span
          >
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
        pageSize: 2,
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
    toDelRecord() {
      this.$router.push("/admin/delrecord");
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
              params: {
                id,
                user: this.$store.state.userInfo.user,
                con,
                time: formatTime(new Date()),
              },
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
