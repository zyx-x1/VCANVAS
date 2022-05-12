<template>
  <ul id="top-file-con" v-show="$store.state.isMenuFileSignal">
    <li>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        id="top-file-open"
        @change="getImg($event)"
      />
    </li>
    <li>
      <div @click="saveToLocal()">保存(本地)</div>
    </li>
    <li>
      <div @click="saveToWarehouse()">保存(个人仓库)</div>
    </li>
  </ul>
</template>
<script>
import http from "@/http/request";
import { formatTime } from "@/utils";
export default {
  data() {
    return {};
  },
  methods: {
    getImg(e) {
      let acceptFileTypes = ["jpg", "jpeg", "png"];
      let uploadFileType =
        e.target.value.split(".")[e.target.value.split(".").length - 1];
      if (acceptFileTypes.indexOf(uploadFileType) == -1) {
        this.$message.error("仅支持jpg、jpeg、png格式的图片！");
        e.target.value = "";
        return;
      }
      let url;
      if (navigator.userAgent.indexOf("MSIE") >= 1) {
        // IE
        url = e.target.value;
      } else if (navigator.userAgent.indexOf("Firefox") > 0) {
        // 火狐
        url = window.URL.createObjectURL(e.target.files.item(0));
      } else if (navigator.userAgent.indexOf("Chrome") > 0) {
        // 谷歌
        url = window.URL.createObjectURL(e.target.files[0]);
      }
      let img = new Image();
      img.src = url;

      img.onload = () => {
        let imgWidth = img.naturalWidth || img.width;
        let imgHeight = img.naturalHeight || img.height;

        if (imgWidth > this.$store.state.canvas.width) {
          imgWidth = this.$store.state.canvas.width;
        } else {
          imgWidth = img.naturalWidth || img.width;
        }
        if (imgHeight > this.$store.state.canvas.height) {
          imgHeight = this.$store.state.canvas.height;
        } else {
          imgHeight = img.naturalHeight || img.height;
        }
        this.$store.state.canvas
          .getContext("2d")
          .drawImage(img, 0, 0, imgWidth, imgHeight);
      };
    },
    saveToLocal() {
      let cvs = this.$store.state.canvas;
      let url = cvs.toDataURL("image/png");
      let a = document.createElement("a");
      a.download = this.$store.state.username;
      a.href = url;
      const event = new MouseEvent("click");
      a.dispatchEvent(event);
      this.$message({
        type: "success",
        message: "成功保存到本地",
      });
    },
    async saveToWarehouse() {
      if (this.$store.state.login_signal) {
        let cvs = this.$store.state.canvas;
        let url = cvs.toDataURL("image/png");
        let res = await http.post(
          "/canvas/save/warehouse",
          {
            user: this.$store.state.username,
            picture: url,
            time: formatTime(new Date()),
          },
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );
        if (res.data.status == "success") {
          this.$message({
            type: "success",
            message: "成功保存到个人仓库中",
          });
        }
      } else {
        this.$message.error("请先登录！");
        setTimeout(() => {
          this.$router.push("/login");
        }, 1000);
      }
    },
  },
};
</script>
<style lang="less">
#top-file-con {
  width: 10vw;
  z-index: 999;
  list-style: none;
  margin-top: -5px;
  div {
    text-align: left;
    width: 100%;
    padding-left: 17px;
    background: linear-gradient(17deg, #00ffd2, #9c70d7);
    height: 30px;
    line-height: 30px;
    letter-spacing: 0;
  }
  li {
    height: 30px;
  }
  #top-file-open {
    width: 10vw;
    height: 25px;
    line-height: 25px;
    position: relative;
    cursor: pointer;
    color: rgba(0, 0, 0, 0);
    overflow: hidden;
    display: inline-block;
    display: inline;
    zoom: 1;
    &:before {
      content: "打开";
      width: inherit;
      height: inherit;
      position: absolute;
      top: 0;
      left: 0;
      background: linear-gradient(17deg, #00ffd2, #9c70d7);
      color: #fff;
      padding-left: 17px;
    }
  }
  #top-file-save {
    width: 10vw;
    height: 25px;
    text-align: left;
    line-height: 25px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    font-size: 14px;
    border: none;
    background: linear-gradient(17deg, #00ffd2, #9c70d7);
    color: #fff;
    padding-left: 17px;
  }
}
</style>
