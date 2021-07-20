<template>
  <div class="sampleView">
    <div class="main_content" style="border-top-right-radius: 0;border-top-left-radius: 0;">
      <div>
        <div class="span_name">
          <span>数据提供方：</span>
          <span>{{ dataSetInfo.dsId ? dataSetInfo.dsId : "-" }}</span>
        </div>
        <div class="span_name">
          <span>数据集地址：</span>
          <span>{{dataSetInfo.datasetUrl ? dataSetInfo.datasetUrl : "-"}}</span>
        </div>
        <div class="span_name">
        <span>数据来源：</span>
        <span>{{dataSetInfo.sourceCsv ?
          'CSV文件：'+dataSetInfo.sourceCsv.csvFileName :
          dataSetInfo.sourceDb ?
          '数据库：'+ dataSetInfo.sourceDb.dbName + '，库表：' + dataSetInfo.datasetId : '-'}}</span>
        </div>
        <div class="span_name">
          <span>样例数据集地址：</span>
          <span>{{dataSetInfo.datasetSampleUrl ? dataSetInfo.datasetSampleUrl : "-"}}</span>
        </div>
        <div class="span_name">
        <span>样例来源：</span>
        <span>{{dataSetSampleInfo.sourceCsv ?
          'CSV文件：'+dataSetSampleInfo.sourceCsv.csvFileName :
          dataSetSampleInfo.sourceDb ?
          '数据库：'+ dataSetSampleInfo.sourceDb.dbName + '，库表：' + dataSetSampleInfo.datasetId : '-'}}</span>
        </div>
      </div>
      <h4>样例数据</h4>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          v-for="(item, index) in list"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { sampleViewList, getDataSetInfo} from '@/api/dataSet'

export default {
  name: "sampleView",
  data() {
    return {
      id: this.$route.query.id,
      tableData: [],
      list: [],
      dataSetInfo: '',
      dataSetSampleInfo: ''
    };
  },
  mounted() {
    this.getDataSetInfoFunc()
  },
  methods: {
    getDataSetInfoFunc(){
      getDataSetInfo({datasetId:this.id}).then((res) => {
        if (res.code === 200) {
          this.dataSetInfo = res.data
          if (res.data.datasetSampleId){
            this.getSampleViewList(res.data.datasetSampleId)
          } else {
            let arr = []
            arr.push(res.data.respColumns.split(','))
            this.transformData(arr)
          }
        }
      })
    },
    getSampleViewList(id){
      sampleViewList(id).then((res) => {
        if(res.code === 200){
          this.dataSetSampleInfo = res.data
          this.transformData(JSON.parse(res.data.sampleData))
        }
      })
    },
    transformData(data) {
      for (const key in data) {
        let obj1 = {};
        if (key == 0) {
          for (const j in data[key]) {
            let obj = {};
            obj["label"] = data[key][j];
            obj["prop"] = "a" + j;
            this.list.push(obj);
          }
        } else {
          for (const i in data[key]) {
            obj1[this.list[i].prop] = data[key][i];
          }
          this.tableData.push(obj1);
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
.span_name {
  padding: 20px 0;
  span:nth-child(1) {
    font-weight: 500;
  }
}
</style>
