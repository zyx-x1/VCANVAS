<template>
  <div style="width: 100%; height: 100vh">
    <div class="top">
      <nav>
        <ul>
          <li @click="$router.push('/index')">首页</li>
          <li @click="$router.push('/notice')">系统公告</li>
        </ul>
      </nav>
    </div>
    <div class="doc">
      <h3>直线</h3>
      <p>
        直线默认为自由方向的直线，按shift键后可以将其切换为固定水平方向的直线，再次按Shift键切换会原先的状态。在按Shift后，按Ctrl键可切换为固定垂直方向的直线，再次按Ctrl键返回到固定水平方向的直线。在Ctrl状态下按Shift键会直接返回值默认模式。
      </p>
      <h3>返回上一步</h3>
      <p>使用Ctrl+Z组合键可时画布的状态返回到上一步，可一直返回到最初状态。</p>
      <p
        style="
          text-align: center;
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          font-weight: bold;
        "
      >
        更多功能开发中，敬请期待......
      </p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
.doc {
  width: 80vw;
  margin: 0 auto;
  min-height: 80vh;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: 110;
  margin-top: 50px;
  h3 {
    padding: 20px;
  }
  p {
    padding: 10px 10px 10px 30px;
    text-indent: 2em;
  }
}
.top {
  position: absolute;
  top: 0;
  height: 50px;
  width: 100vw;
  background-color: rgba(255, 255, 255, 0.8);
  ul {
    width: 87.5%;
    margin: 0 auto;
    height: 50px;
    list-style-type: none;
    display: flex;
    position: relative;
    li {
      // width: 100px;
      text-align: center;
      padding: 0 40px;
      height: 50px;
      line-height: 50px;
      cursor: default;
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
