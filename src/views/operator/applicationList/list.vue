<template>
  <!-- <div class="applicationList tree-content flex"> -->
  <div class="applicationList">
    <!-- <div class="tree-content-left">
      <el-input
        placeholder="请输入目录名称"
        prefix-icon="el-icon-search"
        style="margin-bottom: 25px;"
        v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        :data="applicationScenariosList"
        :props="defaultProps"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
        ref="tree">
      </el-tree>
    </div> -->
    <!-- <div class="tree-content-right"> -->
    <div>
      <!-- <div class="search_box tree_search_box" v-show="showSearch"> -->
      <div class="search_box" v-show="showSearch">
        <el-form :model="search" :inline="true" >
          <el-form-item label="应用目录" prop="scenarioName" style="width: 250px">
            <treeselect
              :options="applicationScenariosList"
              v-model="search.scenarioId"
              :normalizer="normalizer"
              placeholder="应用目录"
            >
            </treeselect>
          </el-form-item>
          <el-form-item label="应用名称" prop="appName">
            <el-input
              v-model="search.appName"
              placeholder="请输入应用名称"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="应用提供方" prop="dsId">
            <el-select v-model="search.dsId" clearable placeholder="请选择">
              <el-option
                v-for="(item, index) in providerList"
                :key="index"
                :label="item.dsName"
                :value="item.dsId">
              </el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="应用目录" prop="scenarioId">-->
            <!--<el-select v-model="search.scenarioId" clearable placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="(item, index) in applicationScenariosList"-->
                <!--:key="index"-->
                <!--:label="item.categoryName"-->
                <!--:value="item.id">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
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
      <div style="height: 36px;margin-top:20px;margin-right: 20px;">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getAppList" :columns="columns"></right-toolbar>
      </div>
      <div class="main_content tree_main_content">
        <el-table
          id="table1"
          :data="tableData"
          @sort-change="sortChange"
          style="width: 100%" class="left-align-table"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table
                id="table2"
                :data="props.row.children ? props.row.children : []"
                style="width: 100%"
              >
                <el-table-column
                  label=""
                  width="50"
                  prop=""
                />
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <div class="dataset_kernel">
                      <ul>
                        <li>
                          <h5 style="margin:0;font-weight:500;color:#000000;font-size:14px;">数据集</h5>
                          <div style="margin:5px;" v-for="(item,index) in props.row.datasetApproveList" :key="index">
                            <el-tag size="medium">{{item.datasetName}}</el-tag>
                            <el-tag size="medium">{{item.providerName}}</el-tag>
                            <el-tag size="medium">{{item.status | formatStatus}}</el-tag>
                          </div>
                        </li>
                        <li>
                          <h5 style="margin:0;font-weight:500;color:#000000;font-size:14px;">算法</h5>
                          <div style="margin:5px;cursor: pointer">
                            <el-tag size="medium" @click="kernelView(props.row.contractId)">{{props.row.algorithmName}}</el-tag>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="合约名称"
                  width="500"
                  prop="name">
                  <template slot-scope="prop">
                    <span style="color: #3668D5; cursor: pointer" @click="handleGoContractDetail(prop.row)">{{prop.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="审批状态"
                  width="100"
                  prop="">
                  <template slot-scope="prop">
                    {{prop.row.status | formatContractStatus}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="执行次数"
                  prop="totalAmount"
                />
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            label="应用名称"
            prop="appName"
            min-width="160"
            v-if="columns[0].visible"
          />
          <el-table-column
            label="应用目录"
            min-width="160"
            prop="scenarioName"
            v-if="columns[1].visible"
          />
          <el-table-column
            label="应用提供方"
            min-width="160"
            prop="userCorp"
            v-if="columns[4].visible"
          />
          <el-table-column
            label="描述"
            min-width="160"
            prop="description"
            v-if="columns[2].visible"
          />
          <el-table-column
            label="创建时间"
            min-width="160"
            sortable="custom"
            prop="createTime"
            v-if="columns[3].visible"
          />
        </el-table>
      </div>
      <div class="pagination-wrap" v-if="total">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="pageNo"
          :limit.sync="pageSize"
          @pagination="getAppList"
        />
      </div>
    </div>
    <el-dialog
    class="kernelDialog dialog-middle"
      title="合约详情"
      :visible.sync="dialogVisible"
    >
    </el-dialog>
    <el-dialog
      class="kernelDialog dialog-middle"
      title="算法详情"
      :visible.sync="kernelDialogVisible"
    >
      <div style="height:100%">
        <div style="margin:10px 0">
          <span>描述:</span>
          <span>暂无</span>
        </div>
        <div style="height:90%">
          <span style="display:block;margin: 10px 0">代码:</span>
          <el-input
            style="height:100%"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="textarea">
          </el-input>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAppViewListForOperator, getOperatorContractListOfApp } from '@/api/myApp'
import { getScenarioSetting, updateScenarioSetting } from '@/api/ScenarioSetting'
import { getOperatorContractCode } from '@/api/contract'
import { getProviderList } from '@/api/participantsManagement'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: 'ApplicationList',
  components: { Treeselect },
  data() {
    return {
      search: {
        scenarioId: 0,
        appName: '',
        dsId: ''
      },
      tableData: [],
      contractStatusList: [],
      applicationScenariosList:[{
        id: 0,
        upperId: 0,
        categoryName: "全部",
        childrenScenario:[]
      }], //场景列表
      providerList:[],
      tableData1: [],
      dialogVisible: false,
      kernelDialogVisible:false,
      textarea:'',
      pageNo:1,
      pageSize:10,
      total:0,
      // 显示搜索条件
      showSearch: true,
      // 列信息
      columns: [
        { key: 0, label: `应用名称`, visible: true },
        { key: 1, label: `应用目录`, visible: true },
        { key: 2, label: `描述`, visible: true },
        { key: 3, label: `创建时间`, visible: true },
        { key: 4, label: `应用提供方`, visible: true }
      ],
      orderByColumn:'',
      isAsc: '',
      filterText:'',
      defaultProps: {
        label: 'categoryName',
        children: 'childrenScenario',
      },
      normalizer(node) {
        return {
          id: node.id,
          label: node.categoryName,
          children: node.childrenScenario,
        }
      },
    }
  },
  mounted(){
    this.getAppList()
    this.getScenarioSetting()
    this.getProviderListFunc()
  },
  filters:{
    formatStatus(status){
      let statusList = ["待审批", "审批通过", "已拒绝","已撤销","被作废","无需操作"];
      let index = Number(status) - 1
      return statusList[index]
    },
    formatContractStatus(status){
      let statusArr = ['未提审','审批中','已通过','已拒绝','失效','已撤销','已删除']
      let index = Number(status) - 1
      return statusArr[index]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.categoryName.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.search.scenarioId = data.id;
      this.getAppList()
    },
    sortChange(data){
      this.orderByColumn = data.prop
      this.isAsc = data.order === 'ascending' ? 'asc' : 'desc'
      this.getAppList()
    },
    // 获取场景列表
    getScenarioSetting() {
      getScenarioSetting().then((res) => {
        if (res.code === 200) {
          this.applicationScenariosList[0].childrenScenario = res.data
        }
      })
    },
    getProviderListFunc() {
      getProviderList().then((res) => {
        if (res.code === 200) {
          this.providerList = res.data
        }
      })
    },
    dataSetView(){
      this.dialogVisible = true
    },
    kernelView(id){
      getOperatorContractCode(id).then((res) => {
        if (res.code === 200) {
          this.textarea = res.data.code
          this.kernelDialogVisible = true
        }
      })
    },
    handelExpand(data, row){
      getOperatorContractListOfApp(row.id).then((res) => {
        if(res.code === 200){
          data.forEach(e => {
            if (e.id === row.id) {
              e.children = res.data
            }
          })
          this.tableData = data
        }
      })
    },
    getAppList(){
      let data = {
        pageNum:this.pageNo,
        pageSize:this.pageSize,
        appName: this.search.appName || undefined,
        dsId: this.search.dsId || undefined,
        scenarioId: this.search.scenarioId || undefined,
        orderByColumn: this.orderByColumn || undefined,
        isAsc: this.isAsc || undefined
      }
      getAppViewListForOperator(data).then((res)=>{
        if(res.code === 200 && res.total > 0){
          res.rows.forEach((e) => {
            this.handelExpand(res.rows, e)
          })
          this.total = res.total
        }else{
          this.tableData = []
        }
      })
    },
    handleSearch(){
      this.getAppList()
    },
    handleReset(){
      this.search.scenarioId = 0
      this.search.appName = ''
      this.search.dsId = ''
      this.getAppList()
    },
    handleGoContractDetail(row){
      this.$router.push({path:'/operator/contractDetail',query:{id: row.contractId}})
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
    .applicationList{
        .el-table__header-wrapper{
            tr{
              .cell{
                color: #000000;
                font-weight: 500;
              }
            }
        }
        #table1{
          .el-table__body{
            tr{
              td{
                /*background-color: #F7F9FD!important;*/
              }
            }
          }
          .el-table__expanded-cell[class*=cell]{
            padding: 0!important;
          }
          #table2{

              .dataset_kernel{
                padding: 10px 0;
                ul{
                  margin:0 30px;
                }
              }
          }
        }
        .kernelDialog{
          .el-dialog{
            height: 100%;
            margin: 0!important;
            left: auto;
            right: 0!important;
            position: absolute;
          }
          .el-dialog__body{
            height: calc( 100% - 55px );
            .el-textarea__inner{
              height: 100%;
            }
          }
        }
    }
</style>

