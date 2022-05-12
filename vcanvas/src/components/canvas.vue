<!-- 画布组件 -->
<template>
  <canvas
    id="canvas"
    ref="canvas"
    width="1229"
    height="620"
    :style="{ top: $store.state.isToolbarSignal ? '67.8%' : '50%' }"
    >您当前浏览器的版本过低，请升级浏览器后再试！</canvas
  >
</template>

<script>
import Draw from "../Draw.ts";
export default {
  data() {
    return {};
  },
  mounted() {
    const cvs = this.$refs.canvas;
    let ctx = cvs.getContext("2d");
    this.$store.commit("getCanvas", cvs);
    this.$store.state._CANVAS_STATES.push(
      ctx.getImageData(0, 0, cvs.offsetWidth, cvs.offsetHeight)
    );
    const draw = new Draw(this, cvs, cvs.offsetWidth, cvs.offsetHeight);
    let isShiftDown = false;
    let isCtrlDown = false;
    document.onkeyup = (e) => {
      if (e.keyCode == 16) {
        isShiftDown = !isShiftDown;
        isCtrlDown = false;
      }
      if (e.keyCode == 17 && isShiftDown) {
        isCtrlDown = !isCtrlDown;
      }
    };
    cvs.onmousedown = (e) => {
      let eX = e.offsetX,
        eY = e.offsetY;
      let tool = this.$store.state.attrsubmit_option;
      const isPoint = draw.isPosInPath(eX, eY);
      if (!isPoint) {
        switch (tool) {
          case "line":
            draw.drawLine(eX, eY, isShiftDown, isCtrlDown);
            break;
          case "circle":
            draw.drawCircle(eX, eY);
            break;
          case "rect":
            draw.drawRect(eX, eY);
            break;
          case "arc":
            draw.drawArc(eX, eY);
            break;
          case "brush":
            draw.drawBrush(eX, eY);
            break;
          case "text":
            draw.drawText(cvs, eX, e);
            break;
          case "polygon":
            draw.drawPolygon(eX, eY);
            break;
          case "eraser":
            draw.drawEraser(eX, eY);
            break;
        }
      }
      draw.revert();
    };
  },
};
</script>

<style scoped>
#canvas {
  background: #fff;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: 0.5s;
  z-index: 1;
}
.textIpt {
  border: none;
  border-bottom: 1px solid #000;
  z-index: 9999;
  outline: none;
}
</style>
