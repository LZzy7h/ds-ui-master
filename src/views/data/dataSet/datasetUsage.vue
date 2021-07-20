<template>
  <div class="DataSetList">
    <div class="main_content" style="border-top-right-radius: 0;border-top-left-radius: 0;">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="datasetName"
          label="数据集名称"
        />
        <el-table-column
          prop="datasetCatalog"
          label="数据目录"
        />
        <el-table-column
          prop="datasetDescription"
          label="数据集描述"
        />
        <el-table-column
          prop="userCorp"
          label="使用者信息"
          width="180"
        />
        <el-table-column
          prop="scenarioName"
          label="应用名称"
        />
        <el-table-column
          prop="contractName"
          label="合约名称">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleGoContract(scope.row)">{{scope.row.contractName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="counts"
          label="使用量统计"
          align="right"
          width="100">
          <template slot-scope="scope">
            {{scope.row.counts}}次
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import { getDataSetUse  } from '@/api/dataSet'
  export default {
    name: 'DataSetList',
    data() {
      return {
        tableData:[],
        dataSetCode: this.$route.query.dataSetCode
      }
    },
    mounted(){
      this.getDataSetUseFunc()
    },
    methods:{
      getDataSetUseFunc(){
        getDataSetUse({dataSetCode:this.dataSetCode}).then((res)=>{
          if(res.code === 200){
            res.data.forEach(e => {
              e.datasetName = this.$route.query.datasetName
              e.datasetCatalog = this.$route.query.datasetCatalog
              e.datasetDescription = this.$route.query.datasetDescription
            })
            this.tableData = res.data
          }
        })
      },
      handleGoContract(row){
        this.$router.push({
          path:'/data/contractDetail',
          query: {id: row.contractId}
        })
      }
    }
  }
</script>
