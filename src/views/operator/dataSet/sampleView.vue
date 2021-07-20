<template>
  <div class="sampleView">
    <div class="main_content">
      <div>
        <div class="span_name">
          <span>数据提供方：</span>
          <span>{{ row.dsId ? row.dsId : "-" }}</span>
        </div>
        <div class="span_name">
          <span>数据集地址：</span>
          <span>{{
              row.datasetUrl ? row.datasetUrl : "-"
            }}</span>
        </div>
        <div class="span_name">
          <span>样例数据集地址：</span>
          <span>{{
              row.datasetSampleUrl ? row.datasetSampleUrl : "-"
            }}</span>
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
export default {
  name: "sampleView",
  data() {
    return {
      row: JSON.parse(this.$route.query.row) ? JSON.parse(this.$route.query.row) : {},
      tableData: [],
      list: []
    };
  },
  mounted() {
    if (this.row.sampleData) {
      this.transformData(JSON.parse(this.row.sampleData));
    } else {
      let arr = []
      arr.push(this.row.respColumns.split(','))
      this.transformData(arr)
    }
  },
  methods: {
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
.sampleView{
  background: #fff;
}
</style>
