<template>
  <div id="app" class="bg-color-animation" @contextmenu="rightClick($event)">
    <vcMenubar />
    <vcToolbar />
    <vcCanvas></vcCanvas>
    <transition name="slidein">
      <router-view></router-view>
    </transition>
    <vcBottom />
  </div>
</template>
<script>
import vcCanvas from "./canvas.vue";
import vcToolbar from "./toolbar.vue";
import vcMenubar from "./menubar.vue";
import vcBottom from "./bottom.vue";
import { formatTime } from "@/utils/index";
import http from '@/http/request'
export default {
  name: "App",
  data() {
    return {};
  },
  components: { vcToolbar, vcCanvas, vcMenubar, vcBottom },
  methods: {
    rightClick(e) {
      e.target.tagName !== "CANVAS" ? e.preventDefault() : null;
    },
    
  },
  mounted() {
    
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
:root {
  font-size: 15px;
  --color1: rgb(139, 203, 255);
  --color2: rgb(253, 129, 129);
}

.bg-color-animation {
  background-image: radial-gradient(
      closest-side,
      rgba(0, 255, 210, 0.3),
      rgba(156, 112, 215, 0.3)
    ),
    radial-gradient(closest-side, rgba(0, 255, 210, 0.5), rgba(0, 255, 210, 0)),
    radial-gradient(
      closest-side,
      rgba(181, 137, 238, 0.3),
      rgba(0, 255, 210, 0)
    ),
    radial-gradient(
      closest-side,
      rgba(122, 255, 231, 0.3),
      rgba(0, 255, 210, 0)
    ),
    radial-gradient(
      closest-side,
      rgba(183, 141, 238, 1),
      rgba(147, 248, 230, 0)
    ),
    radial-gradient(
      closest-side,
      rgba(49, 252, 215, 0.3),
      rgba(115, 146, 140, 0)
    );
  background-size: 100vw 100vw, 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax,
    110vmax 110vmax, 90vmax 90vmax;
  background-position: center, -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax,
    -30vmax 10vmax, 50vmax 50vmax;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100vmax;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  animation: bgColorAnime 10s ease-in-out infinite;
}
#app {
  font-family: "等线", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // background: linear-gradient( 17deg, #00ffd2, #9c70d7);
}
@keyframes bgColorAnime {
  0%,
  100% {
    background-size: 100vw 100vw, 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax,
      110vmax 110vmax, 90vmax 90vmax;
    background-position: center, -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax,
      -30vmax 10vmax, 50vmax 50vmax;
  }
  25% {
    background-size: 100vw 100vw, 110vmax 110vmax, 100vmax 100vmax,
      120vmax 120vmax, 90vmax 90vmax, 100vmax 100vmax;
    background-position: center, -60vmax -60vmax, 70vmax -20vmax, 0vmax 0vmax,
      -40vmax 30vmax, 20vmax 70vmax;
  }
  50% {
    background-size: 100vw 100vw, 100vmax 130vmax, 70vmax 70vmax,
      130vmax 130vmax, 110vmax 110vmax, 90vmax 90vmax;
    background-position: center, 10vmax 10vmax, 50vmax -50vmax, 20vmax 10vmax,
      -10vmax 40vmax, 30vmax 40vmax;
  }
  75% {
    background-size: 100vw 100vw, 70vmax 130vmax, 90vmax 70vmax, 110vmax 110vmax,
      130vmax 70vmax, 110vmax 120vmax;
    background-position: center, -50vmax -50vmax, 50vmax -20vmax, 20vmax 20vmax,
      20vmax 0vmax, 40vmax 40vmax;
  }
}
p,
span,
a,
h1,
h2,
h3,
h4,
h5,
h6,
button,
label,
input::placeholder {
  user-select: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slidein-enter-active,
.slidein-leave-active {
  animation: slidein 1s;
}
.slidein-enter,
.slidein-leave-to {
  animation: slidein 1s reverse;
}

@keyframes slidein {
  from {
    top: 100%;
  }
  to {
    top: 0%;
  }
}
</style>
