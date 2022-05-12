<template>
  <transition name="fade">
    <div class="bottom" v-show="!$store.state.isToolbarSignal">
      <ul>
        <li>
          <a
            href="http://wpa.qq.com/msgrd?v=3&uin=2127672475&site=qq&menu=yes"
            target="_blank"
            >联系作者</a
          >
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="less">
.bottom {
  position: absolute;
  bottom: 30px;
  text-align: center;

  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    li {
      padding: 0 20px;
      border-left: 1px solid #000;
      a {
        text-decoration: none;
        color: rgba(0, 0, 0, 0.5);
        transition: color 0.5s;
        &:hover {
          color: #fff;
        }
      }
      &:nth-child(1) {
        border: none;
      }
    }
  }
}
</style>
