<template>
  <div :class="className" :style="{ height: height, width: '100%' }" />
</template>
<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./resize";
import colorMixin from "./changeColor";
const animationDuration = 6000;
export default {
  name: "percentContract",
  mixins: [resize,colorMixin],
  props: {
    data: {
      type: Array,
      default: []
    },
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    },
    maxVal: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      chart: null,
      color: [],
    };
  },
  watch: {
    data: function() {
      this.initChart();
    },
    themeNew(newVal) {
      this.themeChange(newVal);
      this.initChart();
    }
  },
  computed: {
    themeNew: {
      get() {
        return this.$store.state.settings.theme;
      },
      set(val) {
        this.themeChange(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
    this.themeChange(localStorage.getItem("theme"));
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      let data = [];
      for (const key in this.data) {
        let obj = {};
        obj.name = this.data[key].fieldName;
        obj.value = parseFloat(this.data[key].count);
        data.push(obj);
      }
      this.chart = echarts.init(this.$el, "macarons");
      if (data.length == 0) {
        this.chart.setOption({
          title: {
            text: "数据集分类",
            x: "center",
            subtext: "暂无数据",
            textStyle: {
              color: "#333333",
              fontSize: 18,
              fontWeight: "bold"
            }
          }
        },true);
      } else {
        this.chart.setOption({
          title: {
            text: "数据集分类",
            x: "center",
            textStyle: {
              color: "#333333",
              fontWeight: "bold",
              fontSize: 18
            },
            subtext: ""
          },
          tooltip: {
            trigger: "item"
          },
          color: this.color,
          series: [
            {
              name: "数据集分类",
              type: "pie",
              radius: ["30%", "50%"],
              labelLine: {
                normal: {
                  length: 35,
                  length2: 45
                }
              },
              label: {
                normal: {
                  formatter: "{b|{b}}\n{a|{d}%}", //引导线下面文字
                  borderWidth: 20,
                  borderRadius: 4,
                  padding: [30, -70],
                  rich: {
                    a: {
                      color: "#333333",
                      fontSize: 22,
                      lineHeight: 22,
                      fontWeight: "bold"
                    },
                    b: {
                      fontSize: 12,
                      lineHeight: 20,
                      color: "#333"
                    }
                  }
                }
              },
              data: data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        },true);
      }

    }
  }
};
</script>
