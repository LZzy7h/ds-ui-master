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
        <div style="text-align: center; margin-top: 50px;margin-bottom: 100px">
          <el-button type="primary" @click="onSubmit">生成样例数据集</el-button>
          <el-button @click="doBack">取消</el-button>
        </div>
    </div>
</template>
<script>
import { saveSampelDataSet} from '@/api/dataSet'
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
            tableName:this.$route.query.tableName,
            sourceId:this.$route.query.sourceId,
            respColumns:'',
            respColumnsType: ''
        }
    },
    mounted(){
        let data = JSON.parse(window.localStorage.getItem('columns'))
        this.tableData  = data.data
    },
    methods:{
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
        onSubmit(){
            let data = this.form
            data['id'] = this.$route.query.datasetId
            data['tableName'] = this.tableName
            data['respColumns'] = this.respColumns
            data['respColumnsType'] = this.respColumnsType
            data['sourceId'] = this.sourceId
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
