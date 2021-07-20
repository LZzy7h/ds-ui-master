<template>
  <div :class="className" :style="{height:height,width:'80%'}" />
</template>
<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './resize'

const animationDuration = 6000

export default {
  name:'percentContract',
  mixins: [resize],
  props: {
    data:{
        type:Array,
        default:[]
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '90%'
    },
    height: {
      type: String,
      default: '100%'
    },
    maxVal:{
        type: Number,
        default: 1
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch:{
    data:function () {
      this.initChart()
    }
  },
  methods: {
    initChart() {
      let data = []
      for (const key in this.data) {
          let obj = {}
          obj.name = this.data[key].fieldName
          obj.value =  parseFloat(this.data[key].count)
          data.push(obj)
      }
      this.chart = echarts.init(this.$el, 'macarons')

     if(data.length==0){
             this.chart.setOption({
        title: {
            text: '合约状态分类',
            subtext: '暂无数据',
            left: 'center'
        },

      })
     }else{

      this.chart.setOption({
        title: {
            text: '合约状态分类',
            subtext: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        // legend: {
        //     orient: 'vertical',
        //     left: 'left',
        // },
        series: [
            {
                name: '合约状态分类',
                type: 'pie',
                radius: '60%',
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
      })
     }

    }
  }
}
</script>
