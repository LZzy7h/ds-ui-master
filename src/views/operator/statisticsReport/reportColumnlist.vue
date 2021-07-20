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
      let xAxisData = [];
      let yAxisData = [];
      for (const key in this.data) {
        xAxisData.push(this.data[key].fieldName);
        yAxisData.push(this.data[key].counts);
      }
      this.chart = echarts.init(this.$el, "macarons");
      if (xAxisData.length == 0 || yAxisData.length == 0) {
        this.chart.setOption({
          title: {
            text: "热门应用执行次数",
            subtext: "暂无数据",
            textStyle: {
              color: "#333333",
              fontWeight:'bold',
              fontSize: 18,
            },
             x:'center',

          }
        });
      } else {
        this.chart.setOption({
          title: {
            text: "热门应用执行次数",
             x:'center',
            subtext: "",
            textStyle: {
              color: "#333333",
              fontWeight:'bold',
              fontSize: 18
            }
          },
          xAxis: {
            type: "category",
             axisLine: {  //这是x轴文字颜色
                lineStyle: {
                    color: "#333333",
              fontWeight:'bold'

                }}
,
            data: xAxisData,
            axisLabel: {
              interval: 0, // 0 强制显示所有，1为隔一个标签显示一个标签，2为隔两个
              textStyle: {
                fontSize: 12 //字体大小
              },
              formatter: function(value) {
                var res = value;

                if (res.length > 4) {
                  res = res.substring(0, 4) + "...";
                } else {
                  res = value;
                }
                return res;
              }
            }
          },
          yAxis: {
            type: "value",
                    axisLine: {//这是y轴文字颜色
                lineStyle: {
                    color: '#333333',
              fontWeight:'bold'

                }
            },
            minInterval:1

          },
          grid: {
            height: "65%"
          },
          tooltip: {
            trigger: "item"
          },
color:this.color,
          series: [
            {
              data: yAxisData,
              type: "bar",
              barWidth: 50,
              itemStyle: {
                normal: {
                    label: {
                         show: true,
                         position: 'top',
                      
                     }
,
                  //这里是重点
                  color: (params)=> {
                    //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                    var colorList = this.color;
                    return colorList[params.dataIndex];
                  }
                }
              }
            }
          ]
        });
      }
    }
  }
};
</script>
