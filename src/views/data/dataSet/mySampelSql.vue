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
        <div class="transfer-wrap flex">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            border
            style="width: 30%"
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
          <!--<div class="transfer-btn">-->
            <!--<div>></div>-->
            <!--<div><</div>-->
          <!--</div>-->
          <!--<el-table-->
            <!--ref="multipleTable"-->
            <!--:data="tableData"-->
            <!--tooltip-effect="dark"-->
            <!--border-->
            <!--style="width: 30%">-->
            <!--<el-table-column-->
              <!--prop="columnName"-->
              <!--label="变量名称"-->
              <!--width="120">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="columnTypeName"-->
              <!--label="变量类型"-->
              <!--show-overflow-tooltip>-->
            <!--</el-table-column>-->
          <!--</el-table>-->
          <!--<el-table-->
            <!--ref="multipleTable"-->
            <!--:data="tableData"-->
            <!--tooltip-effect="dark"-->
            <!--border-->
            <!--style="width: 30%"-->
            <!--@selection-change="handleSelectionChange">-->
            <!--<el-table-column-->
              <!--type="selection"-->
              <!--width="55">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="columnName"-->
              <!--label="变量名称"-->
              <!--width="120">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="columnTypeName"-->
              <!--label="变量类型"-->
              <!--show-overflow-tooltip>-->
            <!--</el-table-column>-->
          <!--</el-table>-->
        </div>
        <div style="text-align: center; margin-top: 50px;margin-bottom: 100px">
          <el-button type="primary" @click="onSubmit">生成样例数据集</el-button>
          <el-button @click="doBack">取消</el-button>
        </div>
      </div>
    </div>
</template>
<script>
import {addDB, getDBTbale, getAllDBForAddDataset, queryColumns, saveSampelDataSet } from '@/api/dataSet'
export default {
    name:'mySql',
    props:['datasetId'],
    data(){
        return {
            mySql:'mySql',
            mySqlNum:'5.0+',
            formMySql:'',
            dbList:[],
            dbVal:'',
            tableList:[],
            tableVal:'',
            tableData: [],
            form:{
              datasetName:'',
              datasetType:'',
              datasetDescription:''
            },
            respColumns:'',
            respColumnsType: ''
        }
    },
    mounted(){
      this.getAllDB()
    },
    methods:{
      changeDb(val) {
        this.getDBTbale(val);
      },
      //获取数据库表名
      getDBTbale(data){
        getDBTbale({id:data}).then(res => {
          if (res.code === 200) {
            this.tableList = res.data;
          }
        });
      },
      getAllDB(){
        getAllDBForAddDataset().then((res)=>{
                if(res.code === 200){
                    this.dbList = res.data
                }
            })
        },
      queryColumns(){
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
      handleSelectionChange(selection){
        this.respColumns = ''
        let respColumnsList = []
        let type = []
        for (const key in selection) {
          respColumnsList.push(selection[key].columnName)
          type.push(selection[key].columnTypeName)
        }
        let checkType = type.filter((x, index, self)=>self.indexOf(x)===index)
        this.respColumns = respColumnsList.join(',')
        this.respColumnsType = checkType.join(',')
      },
      doBack(){
        this.$router.go(-1);
      },
      onSubmit(){
        let data = this.form
        data['id'] = this.datasetId
        data['tableName'] = this.tableVal
        data['respColumns'] = this.respColumns
        data['respColumnsType'] = this.respColumnsType
        data['sourceId'] = this.dbVal
        if (this.respColumns === '') {
          this.$message.info('请选择字段！')
          return false
        }
        saveSampelDataSet(data).then((res)=>{
          if(res.code === 200 ){
            window.localStorage.removeItem('columns')
            this.$message({
              message: '生成成功！',
              type: 'success'
            });
            this.$router.push({path:'/data/dataSet'})
          }
        })
      }
    }
}
</script>
<style lang="scss">
    .mySql{
        .mySql_header{
            padding: 20px;
            .el-button{
                margin-left: 20px;
            }
        }
        .mySql_body{
            .el-form{
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                margin-top: 20px;
                .el-form-item{
                    width: 40%;
                }
            }

        }
        .dialog_box{
            .el-form{
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                margin-top: 20px;
                .el-form-item{
                    width: 40%;
                    margin: 0 3%;
                }
            }
        }
        /*.transfer-btn{*/
          /*margin-left: 10px;*/
          /*margin-right: 10px;*/
          /*padding-top: 130px;*/
        /*}*/
        /*.transfer-btn div{*/
          /*width: 35px;*/
          /*height: 35px;*/
          /*line-height: 28px;*/
          /*text-align: center;*/
          /*font-size: 20px;*/
          /*color: #fff;*/
          /*background: #3312AF;*/
          /*border: 1px solid #ccc;*/
          /*cursor: pointer;*/
        /*}*/
      /*.transfer-btn div+div{*/
        /*margin-top: 10px;*/
      /*}*/
      /*.transfer-wrap{*/
        /*.el-table{*/
          /*height: 350px;*/
          /*overflow: auto;*/
        /*}*/
      /*}*/
    }

</style>
