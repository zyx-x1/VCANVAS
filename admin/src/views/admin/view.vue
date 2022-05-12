<template>
  <div
    id="view"
    style="border-radius: 15px; box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3)"
  >
    <!-- 访客信息 -->
    <div class="title" style="margin-top: 20px">访问信息</div>
    <div class="head">
      <div class="baseinfo">
        <h4>总访问量</h4>
        <span>{{ list.length }}</span>
      </div>
      <div class="baseinfo">
        <h4>游客访问量</h4>
        <span>{{ noUserCount }}</span>
      </div>
      <div class="baseinfo">
        <h4>今日访问量</h4>
        <span>{{ todayCount }}</span>
      </div>
      <div class="baseinfo">
        <h4>用户保存量</h4>
        <span>{{ saveCount }}</span>
      </div>
    </div>
    <div class="title">近14日访问信息</div>
    <div id="echart" ref="echart"></div>
  </div>
</template>

<script>
import { GetViewInfo } from "@/http/api.js";
import http from "@/http/request";
import echarts from "echarts";
export default {
  data() {
    return {
      list: [],
      nearlyList: [],
      todayCount: 0,
      saveCount: 0,
      noUserCount: 0,
      option: {
        legend: {
          data: ["访问量"],
        },
        xAxis: {
          type: "category",
          data: [], // x轴数据
          name: "日期", // x轴名称
          // x轴名称样式
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#000", // 字体颜色
              fontSize: 14, // 刻度字体大小
            },
          },
          axisTick: {
            //刻度相关设置
            show: false, //让刻度隐藏
          },
        },
        yAxis: {
          type: "value",
          name: "访问量",
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#000", // 字体颜色
              fontSize: 14, // 刻度字体大小
            },
          },
          axisTick: {
            //刻度相关设置
            show: false, //让刻度隐藏
          },
        },
        label: {},
        tooltip: { trigger: "axis" },
        series: [
          {
            name: "访问量",
            data: [],
            type: "line",
          },
        ],
      },
    };
  },
  methods: {
    async getViewData() {
      this.list = (await GetViewInfo()).data.list;
      this.saveCount = (
        await http.get("/admin/warehouse/search", {
          params: {
            user: "",
            pageSize: 9999999999,
            currPage: 1,
          },
        })
      ).data.total;
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth();
      let date = time.getDate();
      for (const v of this.list) {
        if (v.year == year && v.month == month + 1 && v.date == date) {
          this.todayCount++;
        } else if (v.user == "游客") {
          this.noUserCount++;
        }
      }

      if (date > 14) {
        let k = 13;
        for (let i = date; i > date - 14; i--) {
          this.option.xAxis.data.unshift(`${month + 1}-${i}`);
          this.nearlyList[k] = [];
          this.list.forEach((el) => {
            if (el.year == year && el.month == month + 1 && el.date == i) {
              this.nearlyList[k].push(el);
            }
          });
          k--;
        }
      } else {
        let k = 13;
        for (let i = date; i > date - 14; i--) {
          this.nearlyList[k] = [];
          if (i <= 0) {
            let lastMonthDay = new Date(year, month, 0).getDate();
            this.option.xAxis.data.unshift(`${month}-${lastMonthDay + i}`);
            this.list.forEach((el) => {
              if (
                el.year == year &&
                el.month == month &&
                el.date == lastMonthDay + i
              ) {
                this.nearlyList[k].push(el);
              }
            });
          } else {
            this.option.xAxis.data.unshift(`${month + 1}-${i}`);
            this.list.forEach((el) => {
              if (el.year == year && el.month == month + 1 && el.date == i) {
                this.nearlyList[k].push(el);
              }
            });
          }
          k--;
        }
      }
      this.option.xAxis.data = Array.from(new Set(this.option.xAxis.data));
      this.nearlyList.forEach((el, i) => {
        this.option.series[0].data[i] = el.length;
      });
      echarts.init(this.$refs.echart).setOption(this.option);
    },
  },
  created() {
    this.getViewData();
  },
  mounted() {},
};
</script>

<style lang="less">
.head {
  width: 95%;
  margin: 20px auto 50px;
  display: flex;
  justify-content: space-evenly;
  .baseinfo {
    width: 251px;
    height: 100px;
    padding: 10px;
    border-radius: 15px;
    color: #000;
    h4 {
      text-align: left;
      text-indent: 1em;
    }
    span {
      font-size: 20px;
      line-height: 60px;
    }
    &:nth-child(1) {
      background-color: rgba(127, 255, 212, 0.5);
    }
    &:nth-child(2) {
      background-color: rgba(101, 169, 224, 0.5);
    }
    &:nth-child(3) {
      background-color: rgba(101, 224, 117, 0.5);
    }
    &:nth-child(4) {
      background-color: rgba(224, 101, 197, 0.5);
    }
    &:hover {
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3);
    }
  }
}
#echart {
  width: 1300px;
  height: 350px;
  margin: 20px auto;
}
</style>
