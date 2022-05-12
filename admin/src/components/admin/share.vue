<template>
  <div id="admin-share">
    <el-empty v-show="isEmpty" description="空空如也"></el-empty>
    <div class="card" v-for="(v, i) in shares" :key="i">
      <div class="c-top">
        <div class="c-name">
          {{ v.username }}
        </div>
        <div class="c-date">
          {{ v.date }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span class="c-delete" @click="deleteShare(v.id)">删除</span>
        </div>
      </div>
      <div class="c-con">
        {{ v.content }}
      </div>
      <div v-show="v.has_img == 'true'" class="c-img">
        <img :src="v.img" alt="" srcset="" />
      </div>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="total,prev, pager, next,jumper"
      :total="total"
      :page-size="pageSize"
    >
    </el-pagination>
    <el-dialog
      title="操作提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>确定要删除此条 互动分享 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { DeleteShareAPI, GetShareAPI } from "@/http/api.ts";
export default {
  data() {
    return {
      isEmpty: true,
      shares: [],
      pageSize: 2,
      currPage: 1,
      total: 0,
      dialogVisible: false,
      deleteId: -1
    };
  },
  methods: {
    async getShares() {
      const params = {
        curr_page: this.currPage,
        page_size: this.pageSize
      };
      let result = await GetShareAPI(params);
      this.total = parseInt(result.data.total);
      console.log(this.total);
      this.shares = result.data.data;
      this.isEmpty = this.shares.length == 0 ? true : false;
    },
    handleCurrentChange(val) {
      this.currPage = val;
      this.getShares();
    },
    deleteShare(id) {
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
      let result = await DeleteShareAPI(params);
      if (result.data.status == "success") {
        this.getShares();
      } else {
        this.$message.error(result.data.msg);
      }
    }
  },
  mounted() {
    this.getShares();
  }
};
</script>

<style lang="less">
#admin-share {
  width: 100%;
  .card {
    width: 90%;
    margin: 20px auto 30px;
    background-color: rgba(250, 250, 250, 0.418);
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.418);
    padding-bottom: 10px;
    border-radius: 15px;
    .c-top {
      width: 100%;
      height: 60px;
      border-bottom: 1px solid #333;
      position: relative;
      .c-name {
        position: absolute;
        left: 10px;
        top: 10px;
        font-size: 25px;
      }
      .c-date {
        position: absolute;
        right: 10px;
        top: 35px;
        color: #333;
        .c-delete {
          color: red;
          cursor: pointer;
        }
      }
    }
    .c-con {
      text-align: left;
      width: 100%;
      padding: 20px 20px;
    }
    .c-img {
      overflow: hidden;
      padding: 10px 20px;
      img {
        width: 100px;
        height: 100px;
        float: left;
      }
    }
  }
}
</style>
