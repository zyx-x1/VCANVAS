<template>
  <div id="admin-banner">
    <el-card class="box-card" v-for="(v, i) in banners" :key="i" shadow="hover">
      <img :src="v.img" alt="" />
      <span @click="deleteBanner(v.id)">删除</span>
    </el-card>
    <input
      class="upload-banner"
      ref="upload_banner"
      type="file"
      name=""
      id=""
    />
    <el-dialog
      title="操作提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>确定要删除这张banner图片吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="操作提示"
      :visible.sync="dialogVisible2"
      width="30%"
      :before-close="handleClose"
    >
      <span>确定要添加这张图片为banner吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="confirmInsert()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetBannerAPI, DeleteBannerAPI, InsertBannerAPI } from "@/http/api.ts";
export default {
  data() {
    return {
      banners: [],
      dialogVisible: false,
      dialogVisible2: false,
      deleteId: -1,
      filereader: new FileReader()
    };
  },
  methods: {
    async getBanner() {
      let result = await GetBannerAPI();
      this.banners = result.data.data;
    },
    deleteBanner(id) {
      this.dialogVisible = true;
      this.deleteId = id;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    async confirmDelete() {
      this.dialogVisible = false;
      const params = {
        id: this.deleteId
      };
      let result = await DeleteBannerAPI(params);
      if (result.data.status == "success") {
        this.getBanner();
      }
    },
    async confirmInsert() {
      this.dialogVisible2 = false;
      const params = {
        img: this.filereader.result
      };
      let result =await InsertBannerAPI(params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      this.filereader = new FileReader();
      if (result.data.status == "success") {
        this.getBanner();
      } else {
        this.$message.error(result.data.msg);
      }
    },
    getBase64() {
      const up = this.$refs.upload_banner;
      up.addEventListener("change", async () => {
        this.filereader.readAsDataURL(up.files[0]);
        this.dialogVisible2 = true;
      });
    }
  },
  created() {
    this.getBanner();
  },
  mounted() {
    this.getBase64();
  }
};
</script>

<style lang="less">
#admin-banner {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 20px;
  .box-card {
    width: 300px;
    height: 180px;
    margin-right: 50px;
    .el-card__body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      img {
        width: 200px;
        height: 100px;
      }
      span {
        color: red;
        cursor: pointer;
        padding: 20px 0;
      }
    }
  }
  .upload-banner {
    background-color: #fff;
    position: relative;
    width: 180px;
    height: 180px;
    &::before {
      content: "+";
      position: absolute;
      top: 0;
      left: 0;
      background-color: #fff;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 90px;
    }
  }
}
</style>
