<template>
  <!-- <div class="DataSetList tree-content flex"> -->
  <div class="DataSetList">
    <!-- <div class="tree-content-left">
      <el-input
        placeholder="请输入目录名称"
        prefix-icon="el-icon-search"
        style="margin-bottom: 25px;"
        v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        :data="datasetCatalogList"
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
          <el-form-item label="数据目录" prop="datasetCatalog" style="width: 250px">
            <treeselect
              :options="datasetCatalogList"
              v-model="search.catalogId"
              :normalizer="normalizer"
              placeholder="数据目录"
            >
            </treeselect>
          </el-form-item>
          <el-form-item label="数据提供方" prop="dsId">
            <el-select v-model="search.dsId" clearable placeholder="请选择">
              <el-option
                v-for="(item, index) in userCorpList"
                :key="index"
                :label="item.dsName"
                :value="item.dsId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据集名称" prop="datasetName">
            <el-input
              v-model="search.datasetName"
              placeholder="请输入数据集名称"
            />
          </el-form-item>
          <el-form-item label="上架时间" prop="timeValue">
            <el-date-picker
              v-model="search.timeValue"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
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
      <div style="height: 36px;margin-top:20px;margin-right: 20px;">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getAppDataSetList" :columns="columns"></right-toolbar>
      </div>
      <div class="main_content tree_main_content">
        <el-table
          class="left-align-table"
          :data="tableData"
          @sort-change="sortChange"
          style="width: 100%"
        >
          <el-table-column
            prop="datasetCatalog"
            min-width="160"
            label="数据目录"
            v-if="columns[0].visible"
          />
          <el-table-column
            prop="datasetName"
            min-width="160"
            label="数据集名称"
            v-if="columns[1].visible"
          />
          <el-table-column
            prop="dsName"
            label="数据提供方"
            min-width="160"
            v-if="columns[2].visible"
          />
          <el-table-column
            prop="datasetType"
            min-width="90"
            label="类型"
            v-if="columns[3].visible"
          />
          <el-table-column
            prop="datasetDescription"
            min-width="160"
            label="数据集简介"
            v-if="columns[4].visible"
          />
          <el-table-column
            prop="updownTime"
            min-width="160"
            sortable="custom"
            label="上架时间"
            v-if="columns[5].visible"
          >
            <template slot-scope="scope">
              {{formatTime(scope.row.updownTime)}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            class-name="fixed-width"
            min-width="160"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="sampleView(scope.row)">查看详情</el-button>
              <!-- <el-button size="mini" type="primary" plain @click="handelMove(scope.row)">移动</el-button> -->
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
          @pagination="getAppDataSetList"
        />
      </div>
    </div>
    <!-- <el-dialog
      class="dialog-middle"
      title=""
      :visible.sync="moveDialogVisible"
    >
      <div>
        <el-input
          placeholder="请输入目录名称"
          prefix-icon="el-icon-search"
          style="margin-bottom: 25px;"
          v-model="filterText">
        </el-input>
        <el-tree
          class="filter-tree"
          :current-node-key="currentNodeKey"
          :data="datasetCatalogList"
          highlight-current
          node-key="id"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          @node-click="handleCheckNode"
          draggable
          ref="myTree">
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handelSubmitMove">确 定</el-button>
        <el-button @click="moveDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import { appDataSetList , consumerGetUserCorp, updataCatalogForDataSet } from '@/api/dataSet'
import { getDatasetCatalog, updateDataDirectory } from '@/api/ScenarioSetting'
import { getParticipantsManagementByApply } from '@/api/participantsManagement'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: 'DataSetList',
  components: { Treeselect },
  data() {
    return {
      search:{
        catalogId:0,
        dsId:'',
        datasetName:'',
        timeValue:''
      },
      tableData:[],
      pageNo:1,
      pageSize:10,
      total:0,
      userCorpList:[],
      datasetCatalogList: [{
        id: 0,
        upperId: 0,
        categoryName: "全部",
        childrenDatasetCatalogs:[]
      }],
      // 显示搜索条件
      showSearch: true,
      // 列信息
      columns: [
        { key: 0, label: `数据目录`, visible: true },
        { key: 1, label: `数据集名称`, visible: true },
        { key: 2, label: `数据提供方`, visible: true },
        { key: 3, label: `类型`, visible: true },
        { key: 4, label: `数据集简介`, visible: true },
        { key: 5, label: `上架时间`, visible: true }

      ],
      orderByColumn:'',
      isAsc: '',
      filterText:'',
      defaultProps: {
        label: 'categoryName',
        children: 'childrenDatasetCatalogs',
      },
      moveDialogVisible: false,
      currentNodeKey:'',
      form:{},
      normalizer(node) {
        return {
          id: node.id,
          label: node.categoryName,
          children: node.childrenDatasetCatalogs,
        }
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted(){
    this.getAppDataSetList()
    this.consumerGetUserCorp()
    this.getDatasetCatalogFuc()
  },
  methods:{
    filterNode(value, data) {
      if (!value) return true;
      return data.categoryName.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.search.catalogId = data.id;
      this.getAppDataSetList()
    },
    // handelMove(row){
    //   this.form.dataSetId = row.id;
    //   this.currentNodeKey = row.catalogId;
    //   this.$nextTick(()=>{
    //     this.$refs.myTree.setCurrentKey(this.currentNodeKey);
    //   })
    //   this.moveDialogVisible = true;
    // },
    // handleCheckNode(data){
    //   this.form.catalogId = data.id
    // },
    // handelSubmitMove(){
    //   if (this.form.catalogId) {
    //     updataCatalogForDataSet(this.form).then((res) => {
    //       if (res.code === 200) {
    //         this.$message.success('操作成功！');
    //         this.moveDialogVisible = false;
    //         this.getAppDataSetList();
    //       }
    //     })
    //   } else {
    //     this.moveDialogVisible = false;
    //     return false;
    //   }
    // },
    sortChange(data){
      this.orderByColumn = data.prop
      this.isAsc = data.order === 'ascending' ? 'asc' : 'desc'
      this.getAppDataSetList()
    },
    consumerGetUserCorp(){
      getParticipantsManagementByApply().then((res)=>{
        if(res.code === 200){
          this.userCorpList = res.data
        }
      })
    },
    getDatasetCatalogFuc(){
      getDatasetCatalog().then((res) => {
        if(res.code === 200){
          this.datasetCatalogList[0].childrenDatasetCatalogs = res.data;
        }
      })
    },
    getAppDataSetList(){
      let data = {
        pageNum:this.pageNo,
        pageSize:this.pageSize,
        catalogId: this.search.catalogId || undefined,
        datasetName: this.search.datasetName || undefined,
        dsId: this.search.dsId || undefined,
        startUpdownTime: this.search.timeValue ? Date.parse(this.search.timeValue[0]) : undefined,
        endUpdownTime: this.search.timeValue ? Date.parse(this.search.timeValue[1]) : undefined,
        orderByColumn: this.orderByColumn || undefined,
        isAsc: this.isAsc || undefined
      }
      appDataSetList(data).then((res)=>{
        if(res.code === 200){
          this.tableData = res.rows
          this.total = res.total
        }
      })
    },
    handleSearch(){
      this.getAppDataSetList()
    },
    handleReset(){
      this.search.catalogId = 0
      this.search.datasetName = ''
      this.search.dsId = ''
      this.search.timeValue = ''
      this.getAppDataSetList()
    },
    formatTime(time) {
        var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
        return date.toJSON().substr(0, 19).replace('T', ' ');
    },
    sampleView(row){
      this.$router.push({
        name:'SampleView',
        query: {row:JSON.stringify(row)}

      })
    }
  }
}
</script>
<style lang="scss">

</style>
