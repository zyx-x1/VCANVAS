<template>
  <div
    style="
      border-radius: 15px;
      position: relative;
      box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
    "
  >
    <div class="title">添加公告</div>
    <div
      ref="editor"
      style="text-align: left; padding: 20px; margin-top: 10px"
    ></div>
    <el-button
      @click="issueNotice"
      style="width: 200px; float: right; margin-right: 20px"
      >发布</el-button
    ><el-button
      @click="returnNoticeList()"
      style="width: 200px; float: right; margin-right: 20px"
      >取消</el-button
    >
  </div>
</template>

<script>
import E from "wangeditor";
import http from "@/http/request";
import { formatTime } from "@/utils";
export default {
  data() {
    return {
      editorContent: "",
      editor: null,
    };
  },
  methods: {
    async issueNotice() {
      if (this.editor.txt.html()) {
        let res = await http.post(
          "/admin/notice/add",
          {
            user: "ZYX",
            time: formatTime(new Date()),
            con: this.editor.txt.html(),
          },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        if (res.data.status == "success") {
          this.$message({
            type: "success",
            message: "发布成功",
          });
          setTimeout(() => {
            this.returnNoticeList();
          }, 1000);
        }
      } else {
        this.$message({
          type: "warning",
          message: "未输入内容",
        });
      }
    },
    returnNoticeList() {
      this.$router.push("/admin/notice");
    },
  },
  mounted() {
    this.editor = new E(this.$refs.editor);
    this.editor.showLinkImg = true;
    this.editor.create();
  },
};
</script>

<style></style>
