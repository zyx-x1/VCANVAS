<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar" />
    <div ref="editor" :style="{ height: weHeight }" class="text" />
  </div>
</template>

<script>
import * as E from "wangeditor";
export default {
  name: "Editoritem",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    isClear: {
      type: Boolean,
      default: false,
    },
    weHeight: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      // uploadPath,
      editor: null,
      info_: null,
    };
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear();
        this.info_ = null;
      }
    },
  },
  mounted() {
    this.seteditor();
    this.editor.txt.html(this.value);
  },
  methods: {
    initData() {
      this.editor.txt.html(this.value);
    },
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);
      this.editor.uploadImgShowBase64 = false; // base 64 存储图片
      this.editor.uploadImgServer =
        "http://otp.cdinfotech.top/file/upload_images"; // 配置服务器端地址
      this.editor.uploadImgHeaders = {}; // 自定义 header
      this.editor.uploadFileName = "file"; // 后端接受上传文件的参数名
      this.editor.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
      this.editor.uploadImgMaxLength = 6; // 限制一次最多上传 3 张图片
      this.editor.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间

      // 配置菜单
      this.editor.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "emoticon", // 表情
        "code", // 插入代码
        "undo", // 撤销
        "redo", // 重复
      ];

      this.editor.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          // 图片上传成功，插入图片的回调
          // result为上传图片成功的时候返回的数据，这里我打印了一下发现后台返回的是data：[{url:"路径的形式"},...]
          // console.log(result.data[0].url)
          // insertImg()为插入图片的函数
          // 循环插入图片
          // for (let i = 0; i < 1; i++) {
          // console.log(result)
          const url = "http://otp.cdinfotech.top" + result.url;
          insertImg(url);
          // }
        },
      };
      this.editor.emotions = [
        {
          title: "emoji", // tab 的标题
          type: "emoji", // 'emoji' / 'image'
          // emoji 表情，content 是一个数组即可
          content:
            "😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😓 😪 😴 🙄 🤔 😬 🤐".split(
              /\s/
            ),
        },
      ];
      this.editor.onchange = (html) => {
        this.info_ = html; // 绑定当前逐渐地值
        this.$emit("change", this.info_); // 将内容同步到父组件中
      };
      // 创建富文本编辑器
      this.editor.create();
    },
  },
};
</script>

<style lang="css">
.editor {
  width: 100%;
  margin: 0 auto;
  border: 1px solid #ccc;
  position: relative;
}
.toolbar {
  z-index: 0;
  border-top: none;
}
.text {
  height: 200px;
  border-top: 1px solid #ccc;
  position: static !important;
}
.w-e-menu {
  z-index: 0 !important;
}
.w-e-text p,
.w-e-text h1,
.w-e-text h2,
.w-e-text h3,
.w-e-text h4,
.w-e-text h5,
.w-e-text table,
.w-e-text pre {
  margin: 2px 0;
  line-height: 1.2;
}
</style>
