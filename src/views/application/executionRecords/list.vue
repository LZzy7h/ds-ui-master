<template>
  <div class="datasetlist">
    <div class="search_box" v-show="showSearch">
      <el-form :model="search" :inline="true"  >
        <el-form-item label="执行流水号" prop="id">
          <el-input
            v-model="search.id"
            placeholder="请输入执行流水号"
          />
        </el-form-item>
        <el-form-item label="应用名称" prop="senarioName">
          <el-input
            v-model="search.senarioName"
            placeholder="请输入应用名称"
          />
        </el-form-item>
        <el-form-item label="合约名称" prop="contractName">
          <el-input
              v-model="search.contractName"
              placeholder="请输入合约名称"/>
        </el-form-item>
        <el-form-item label="任务状态" prop="taskStatus">
          <el-select v-model="search.taskStatus" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in taskStatusList"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item class="searchButton">
          <el-button
            type="primary"
            @click="handleSearch"
            >搜索</el-button
          >
          <el-button @click="handleReset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
      <div style="height: 36px;margin-top:20px;">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getExecutionRecordListFunc" :columns="columns"></right-toolbar>
      </div>
    <div class="main_content">
      <el-table
        :data="tableData"
        class="left-align-table"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="执行流水号"
          min-width="160"
          v-if="columns[0].visible"
        />
        <el-table-column
          prop="senarioName"
          label="应用名称"
          min-width="160"
          v-if="columns[1].visible"
        />
        <el-table-column
          prop="contractName"
          label="合约名称"
          min-width="160"
          v-if="columns[2].visible"
        />
        <el-table-column
          prop="createTime"
          label="开始时间"
          min-width="160"
          v-if="columns[3].visible"
        >
          <template slot-scope="scope">
            {{formatTime(scope.row.startTime)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="结束时间"
          min-width="160"
          v-if="columns[4].visible"
        >
          <template slot-scope="scope">
            {{formatTime(scope.row.endTime)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="taskStatus"
          width="110"
          label="任务状态"
          v-if="columns[5].visible"
         >
          <template slot-scope="scope">
            {{formatStatus(scope.row.taskStatus)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          class-name="fixed-width"
          min-width="110"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain v-if="scope.row.taskStatus === 2" @click="handleSeeResult(scope.row)">查看结果</el-button>
            <el-button size="mini" v-if="scope.row.taskStatus === 1">-</el-button>
            <el-button size="mini" type="primary" plain v-if="scope.row.taskStatus === 3" @click="handleSeeReason(scope.row)">查看原因</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrap" v-if="total">
     <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageNo"
      :limit.sync="pageSize"
      @pagination="getExecutionRecordListFunc"
    />
    </div>
    <el-dialog
      title=""
      :visible.sync="centerDialogVisible"
      class="dialog-middle"
      center>
      <el-table
        :data="resultData"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="结果变量名"
        />
        <el-table-column
          prop=""
          width="180"
          class-name="fixed-width"
          label="操作">
          <template slot-scope="scope">
            <a @click="download(downloadUrl + scope.row.id + '/' + (scope.row.url? scope.row.url : 'empty'), {}, scope.row.name + '.csv', 'get')">
              <el-button type="text" size="small">下载结果</el-button>
            </a>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="failReasonDialogVisible"
      width="800px"
      center>
      <div>
        {{failReason}}
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getExecutionRecordListForConsole, getExecutionResult, queryFailReason } from '@/api/executionRecord'
  export default {
    name: 'ExecutionRecords',
    data() {
      return {
        search:{
          id:'',
          taskStatus:'',
          senarioName:'',
          contractName:''
        },
        taskStatusList:[{id:1,name:'运行中'}, {id:2,name:'成功'}, {id:3,name:'失败'}],
        tableData: [],
        pageNo:1,
        pageSize:10,
        total:0,
        resultData:[],
        downloadUrl: '/console/dataConsumerContractExecutionResult/download/',
        centerDialogVisible: false,
        failReasonDialogVisible: false,
        failReason:'',
            // 显示搜索条件
      showSearch: true,
      // 列信息
      columns: [
        { key: 0, label: `执行流水号`, visible: true },
        { key: 1, label: `应用名称`, visible: true },
        { key: 2, label: `合约名称`, visible: true },
        { key: 3, label: `开始时间`, visible: true },
        { key: 4, label: `结束时间`, visible: true },
        { key: 5, label: `任务状态`, visible: true },
      ],
      }
    },
    mounted(){
      this.getExecutionRecordListFunc()
    },
    methods:{
      getExecutionRecordListFunc(){
        let data = {
          pageNum:this.pageNo,
          pageSize:this.pageSize,
          id: this.search.id ? this.search.id : undefined,
          taskStatus: this.search.taskStatus ? this.search.taskStatus : undefined,
          senarioName: this.search.senarioName ? this.search.senarioName : undefined,
          contractName: this.search.contractName ? this.search.contractName : undefined
        }
        getExecutionRecordListForConsole(data).then((res)=>{
          if(res.code === 200){
            this.tableData = res.rows
            this.total = res.total
          }
        })
      },

      handleSearch(){
        this.getExecutionRecordListFunc()
      },
      handleReset(){
        this.search.id = ''
        this.search.taskStatus = ''
        this.search.senarioName = ''
        this.search.contractName = ''
        this.getExecutionRecordListFunc()
      },
      handleSeeResult(row){
        this.resultData = []
        if (row.executionResults) {
          this.resultData = row.executionResults
          this.centerDialogVisible = true
        } else {
          this.$message.info('暂无结果！')
          return false
        }
      },
      handleSeeReason(data){
        queryFailReason({contractExecutionId: data.contractExecutionId}).then((res) => {
          if(res.code === 200){
            this.failReason = res.data
            this.failReasonDialogVisible = true
          }
        })
      },
      formatTime(time) {
        if (!time) return '-'
        var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
        return date.toJSON().substr(0, 19).replace('T', ' ');
      },
      formatStatus(status){
        let statusArr = ['运行中','成功','失败']
        let index = Number(status) - 1
        return statusArr[index]
      }
    }
  }
</script>
