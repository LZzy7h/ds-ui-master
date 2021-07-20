<template>
  <div class="mySql">
    <div class="createDataSet">
      <div style="padding-top: 30px;">
        <el-form ref="form"  :model="form" label-width="100px">
          <el-form-item label="数据集名称">
            <el-input v-model="form.datasetName" style="width: 100%;"></el-input>
          </el-form-item>
          <el-form-item label="数据集标识">
            <el-input v-model="form.infoKey" style="width: 100%;"></el-input>
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
            <el-button type="primary" @click="onSubmit">生成空数据集</el-button>
            <el-button type="primary" @click="handelGoBack">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    saveEmptyDataSet
  } from "@/api/dataSet";
  export default {
    name: "dataSet",
    data() {
      return {
        form:{
          datasetName:'',
          infoKey:'',
          datasetDescription:''
        }
      };
    },
    methods: {
      onSubmit(){
        let data = this.form
        if (data.datasetName === '') {
          this.$message.error('请输入数据集名称！')
          return false
        } else if (data.infoKey === '') {
          this.$message.error('请输入数据集标识！')
          return false
        } else if (data.datasetDescription === '') {
          this.$message.error('请输入数据集简介！')
          return false
        }
        saveEmptyDataSet(data).then((res)=>{
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
      handelGoBack(){
        this.$router.go(-1)
      }
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
