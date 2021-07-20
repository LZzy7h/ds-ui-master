<template>
  <div class="mySql">
    <div class="mySql_header flex">
      <div>
        <span>请选择数据库名：</span>
        <el-select
          v-model="dbVal"
          @change="changeDb"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in dbList"
            :key="item.id"
            :label="item.dbName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div style="margin-left: 20px;">
        <span class="param_box_label">表名：</span>
        <el-select
          v-model="tableVal"
          clearable
          placeholder="请选择"
          @change="queryColumns"
        >
          <el-option
            v-for="item in tableList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="createDataSet">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="columnName"
          label="变量名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="columnTypeName"
          label="变量类型"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div style="margin-top: 30px;">
        <el-form ref="form"  :model="form" label-width="100px">
          <el-form-item label="数据集名称">
            <el-input v-model="form.datasetName" style="width: 100%;"></el-input>
          </el-form-item>
          <el-form-item label="数据集类型">
            <el-select v-model="form.datasetType" style="width: 100%;" clearable placeholder="请选择">
              <el-option
                v-for="item in datasetTypeList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据集简介">
            <el-input
              style="width: 100%;"
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="form.datasetDescription">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doBack">取消</el-button>
            <el-button type="primary" @click="handelGoSample">生成数据集</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  addDB,
  getDBTbale,
  getAllDBForAddDataset,
  queryColumns,
  getDataSetType,
  saveDataSet
} from "@/api/dataSet";
export default {
  name: "mySql",
  props: ['catalogId'],
  data() {
    return {
      dialogVisible: false,
      formMySql:{},
      dbList: [],
      dbVal: "",
      tableList: [],
      tableVal: "",
      tableData: [],
      form:{
        datasetName:'',
        datasetType:'',
        datasetDescription:''
      },
      datasetTypeList:[],
      respColumns:'',
      respColumnsType: ''
    };
  },
  mounted() {
    this.getAllDB();
  },
  methods: {
    changeDb(val) {
      this.getDBTbale(val);
    },
    //获取数据库表名
    getDBTbale(data) {
      getDBTbale({id:data}).then(res => {
        if (res.code === 200) {
          this.tableList = res.data;
        }
      });
    },
    getAllDB() {
      getAllDBForAddDataset().then(res => {
        if (res.code === 200) {
          this.dbList = res.data;
        }
      });
    },
    queryColumns() {
      let data = {
        id:this.dbVal,
        tableName:this.tableVal
      }
      queryColumns(data).then(res => {
        if (res.code === 200) {
          this.tableData  = res.data
        }
      });
    },
    getDataSetType(data){
      getDataSetType().then((res)=>{
        this.datasetTypeList = res.data.split(',')
        this.filterDatasetType(data)
      })
    },
    filterDatasetType(data){
      console.log(data)
      let int32 = ['FLOAT','INT','MEDIUMINT','SMALLINT','TINYINT','INTEGER','DECFLOAT']
      let int64OrDouble = ['DOUBLE','DECIMAL','BIGINT','FLOAT','INT','MEDIUMINT','SMALLINT','TINYINT','NUMERIC','REAL','INTEGER','DECFLOAT']
      if (!this.isContained(int32,data) && data) {
        this.form.datasetType = ''
        this.datasetTypeList.splice(this.datasetTypeList.indexOf('int32'), 1)
        if (!this.isContained(int64OrDouble,data)) {
          this.datasetTypeList.splice(this.datasetTypeList.indexOf('int64'), 1)
          this.datasetTypeList.splice(this.datasetTypeList.indexOf('double'), 1)
        }
      }
    },
    isContained(aa,bb){
      if(!(aa instanceof Array)||!(bb instanceof Array)||((aa.length < bb.length))){
        return false;
      }
      var aaStr = aa.toString();
      for (var i = 0 ;i < bb.length;i++) {
        if(aaStr.indexOf(bb[i]) < 0) return false;
      }
      return true;
    },
    handleSelectionChange(selection){
      this.respColumns = ''
      let respColumnsList = []
      let type = []
      for (const key in selection) {
        respColumnsList.push(selection[key].columnName)
        type.push(selection[key].columnTypeName)
      }
      let checkType = type.filter((x, index, self)=>self.indexOf(x)===index)
      this.getDataSetType(checkType)
      this.respColumns = respColumnsList.join(',')
      this.respColumnsType = checkType.join(',')
    },
    onSubmit(){
      let data = this.form
      data['tableName'] = this.tableVal
      data['respColumns'] = this.respColumns
      data['respColumnsType'] = this.respColumnsType
      data['sourceId'] = this.dbVal
      if (this.respColumns === '') {
        this.$message.error('请选择字段！')
        return false
      }else if (data.datasetName === '') {
        this.$message.error('请输入数据集名称！')
        return false
      } else if (data.datasetType === '') {
        this.$message.error('请选择数据集类型！')
        return false
      } else if (data.datasetDescription === '') {
        this.$message.error('请输入数据集简介！')
        return false
      }
      saveDataSet(data).then((res)=>{
        if(res.code === 200 ){
          window.localStorage.removeItem('columns')
          this.$message({
            message: '生成成功！',
            type: 'success'
          });
          this.$router.push({path:'/data/dataSet'})
        }
      })
    },
    doBack(){
      this.$router.go(-1);
    },
    handelGoSample(){
      let data = this.form
      data['tableName'] = this.tableVal
      data['respColumns'] = this.respColumns
      data['respColumnsType'] = this.respColumnsType
      data['sourceId'] = this.dbVal
      if (this.respColumns === '') {
        this.$message.error('请选择字段！')
        return false
      }else if (data.datasetName === '') {
        this.$message.error('请输入数据集名称！')
        return false
      } else if (data.datasetType === '') {
        this.$message.error('请选择数据集类型！')
        return false
      } else if (data.datasetDescription === '') {
        this.$message.error('请输入数据集简介！')
        return false
      }
      saveDataSet(data).then((res)=>{
        if(res.code === 200 ){
          window.localStorage.removeItem('columns')
          this.$message({
            message: '生成成功！',
            type: 'success'
          });
          this.$router.push({path:'/data/dataSet'})
        }
      })
    },
  }
};
</script>
<style lang="scss">
.mySql {
  .mySql_header {
    padding: 20px;
    .el-button {
      margin-left: 20px;
    }
  }
  .mySql_body {
    margin-left: 20px;
    border: 1px solid #f4f4f4;
    .el-form {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-top: 20px;
      .el-form-item {
        width: 40%;
      }
    }
  }
  .dialog_box {
    .el-form {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-top: 20px;
      .el-form-item {
        width: 40%;
        margin: 0 3%;
      }
    }
  }
}
</style>
