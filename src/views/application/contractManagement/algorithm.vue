<template>
  <div>
    <div class="search_box" v-show="showSearch">
      <el-form :model="search" :inline="true" >
        <el-form-item label="应用目录" prop="name">
          <el-select v-model="search.scenarioId" clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in applicationScenariosList"
              :key="index"
              :label="item.categoryName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="算法名称" prop="name">
          <el-input v-model="search.algorithmName"></el-input>
        </el-form-item>
        <el-form-item class="searchButton">
          <el-button
            type="primary"
            @click="handleSearch">
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operation_btn" style="margin-top:20px;line-height: 36px">
      <el-button type="primary" @click="addAlgorithm">新增</el-button>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getAlgorithmListFunc" :columns="columns"></right-toolbar>
    </div>
    <div class="main_content">
      <el-table
        :data="tableData"
        class="left-align-table"
        style="width: 100%"
      >
        <el-table-column
          prop="algorithmName"
          v-if="columns[0].visible"
          label="算法名称"
        />
        <el-table-column
          prop="scenarioName"
          v-if="columns[1].visible"
          label="应用目录"
        />
             <el-table-column
          prop="comment"
          min-width="200"
          v-if="columns[1].visible" 
          label="算法描述"
        />
        <el-table-column
          label="操作"
          class-name="fixed-width"
          min-width="60"
        >
          <template slot-scope="scope">
            <el-button size="mini"
                       type="primary"
                       plain @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini"
                       type="danger"
                       plain @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <p style="margin-left: 20px;margin-top: 150px;" v-if="false">案例</p>
    <div class="main_content" v-if="false">
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="datasetCatalog"
          label="算法案例"
        />
        <el-table-column
          prop="datasetName"
          label="描述"
        />
        <el-table-column
          label="操作"
          class-name="fixed-width"
          width="180"
        >
            <el-button type="text" size="small">展示</el-button>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrap" v-if="total">

           <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageNo"
      :limit.sync="pageSize"
      @pagination="getAlgorithmListFunc"
    />
    </div>
  </div>
</template>
<script>
  import { getScenarioSettingForConsole } from '@/api/ScenarioSetting'
  import { getAlgorithmList, deleteAlgorithm } from '@/api/algorithm'
  export default {
    name: 'ContractManagement',
    data() {
      return {
        search:{
          scenarioId: '',
          algorithmName:''
        },
        pageNo:1,
        pageSize:10,
        total:0,
        tableData: [],
        applicationScenariosList: [],
        // 显示搜索条件
        showSearch: true,
        // 列信息
        columns: [
          { key: 0, label: `算法名称`, visible: true },
          { key: 1, label: `应用目录`, visible: true }
        ],
      }
    },
    mounted() {
      this.getScenarioSetting()
      this.getAlgorithmListFunc()
    },
    methods: {
      // 获取场景列表
      getScenarioSetting() {
        getScenarioSettingForConsole().then((res) => {
          if (res.code === 200) {
            this.applicationScenariosList = res.data
          }
        })
      },
      // 获取算法列表
      getAlgorithmListFunc() {
        let data = {
          scenarioId: this.search.scenarioId ? Number(this.search.scenarioId) : undefined,
          algorithmName: this.search.algorithmName ? this.search.algorithmName : undefined,
          pageNum:this.pageNo,
          pageSize:this.pageSize
        }
        getAlgorithmList(data).then((res) => {
          if (res.code === 200) {
            this.tableData = res.rows
            this.total = res.total
          }
        })
      },
      handleSearch(){
        this.getAlgorithmListFunc()
      },
      handleReset(){
        this.search.scenarioId = ''
        this.search.algorithmName = ''
        this.getAlgorithmListFunc()
      },
      // 删除算法
      handleDelete(data){
        deleteAlgorithm(data.id).then((res) => {
          if (res.code === 200) {
            this.$message.success('删除成功！')
            this.getAlgorithmListFunc()
          }
        })
      },
      // 添加算法
      addAlgorithm(){
        this.$router.push({path:'/application/addAlgorithm'})
      },
      // 修改算法
      handleEdit(row){
        window.localStorage.setItem('checkedAlgorithm', JSON.stringify(row))
        setTimeout(() => {
          this.$router.push({path:'/application/editAlgorithm'})
        }, 200)
      },
    }
  }
</script>
