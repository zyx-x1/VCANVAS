<template>
  <div id="app" class="bg-color-animation" @contextmenu="rightClick($event)">
    <router-view></router-view>
  </div>
</template>
<script>
import http from "@/http/request";
export default {
  name: "App",
  data() {
    return {};
  },
  methods: {
    rightClick(e) {
      e.target.tagName !== "CANVAS" ? e.preventDefault() : null;
    },
    getUserIP(onNewIP) {
      let MyPeerConnection =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;
      let pc = new MyPeerConnection({
        iceServers: [],
      });
      let noop = () => {};
      let localIPs = {};
      let ipRegex =
        /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
      let iterateIP = (ip) => {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
      };
      pc.createDataChannel("");
      pc.createOffer()
        .then((sdp) => {
          sdp.sdp.split("\n").forEach(function (line) {
            if (line.indexOf("candidate") < 0) return;
            line.match(ipRegex).forEach(iterateIP);
          });
          pc.setLocalDescription(sdp, noop, noop);
        })
        .catch((reason) => {});
      pc.onicecandidate = (ice) => {
        if (
          !ice ||
          !ice.candidate ||
          !ice.candidate.candidate ||
          !ice.candidate.candidate.match(ipRegex)
        )
          return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
    },
    loader(ip) {
      http
        .get(`/load?ip=${ip}&token=${localStorage.getItem("token")}`)
        .then((res) => {
          if (res.data.status == "success" && res.data.user.length != 0) {
            console.log(res.data.user[0].username);
            this.$store.state.login_signal = true;
            this.$store.state.username = res.data.user[0].username;
            this.$store.state.head = res.data.user[0].head;
            this.$store.state.login_time = new Date();
            this.$store.commit("refreshOnlinetime");
          } else if (res.data.status == "timeout") {
            this.$store.state.login_signal = false;
            this.$store.state.username = "";
            this.$store.state.head = "";
            localStorage.removeItem("token");
          }
        });
    },
  },
  mounted() {
    window.onbeforeunload = () => {
      let data = this.$store.state.canvas.toDataURL("image/png");
      localStorage.setItem("canvas", data);
      if (localStorage.getItem("token")) {
        http.get(`/leave`, {
          params: {
            onlinetime: this.$store.state.onlinetime,
            user: this.$store.state.username,
          },
        });
      }
    };
    window.onload = () => {
      let canvasData = localStorage.getItem("canvas");
      let canvas = this.$store.state.canvas;
      if (canvasData) {
        const image = new Image();
        image.src = canvasData;
        image.width = canvas.width;
        image.height = canvas.height;
        image.onload = () => {
          this.$store.state.canvas
            .getContext("2d")
            .drawImage(image, 0, 0, canvas.width, canvas.height);
        };
      }
      let ip;

      try {
        this.getUserIP((ip) => {
          ip = ip;
        });
      } catch (e) {
        console.log(e.message);
      }
      this.loader(ip);
    };
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
