<template>
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
        <div>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="数据集名称">
                    <el-input v-model="form.datasetName"></el-input>
                </el-form-item>
                <el-form-item label="数据集类型">
                    <el-select v-model="form.datasetType" clearable placeholder="请选择">
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
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="form.datasetDescription">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">生成数据集</el-button>
                    <el-button @click="doBack">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import {getDataSetType , saveDataSet} from '@/api/dataSet'
export default {
    name:'createDataSet',
    data(){
        return {
            tableData: [],
            form:{
                datasetName:'',
                datasetType:'',
                datasetDescription:''
            },
            datasetTypeList:[],
            tableName:this.$route.query.tableName,
            sourceId:this.$route.query.sourceId,
            respColumns:'',
            respColumnsType: ''
        }
    },
    mounted(){
        let data = JSON.parse(window.localStorage.getItem('columns'))
        this.tableData  = data.data
        this.getDataSetType()
    },
    methods:{
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
            data['catalogId'] = this.$route.query.catalogId
            data['tableName'] = this.tableName
            data['respColumns'] = this.respColumns
            data['respColumnsType'] = this.respColumnsType
            data['sourceId'] = this.sourceId
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
        }
    }
}
</script>
<style lang="scss">
    .transfer{
        width: 100%;
    }
    .createDataSet{
        .el-form{
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            margin-top:20px;
            .el-form-item{
                width: 40%;
            }
        }
    }
</style>
