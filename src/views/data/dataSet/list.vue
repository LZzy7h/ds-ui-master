<template>
  <!-- <div class="datasetlist tree-content flex"> -->
  <div class="datasetlist">
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
       <el-form :model="search"  :inline="true">
         <el-form-item label="数据目录" prop="datasetCatalog" style="width: 250px">
            <treeselect
              :options="datasetCatalogList"
              v-model="search.catalogId"
              :normalizer="normalizer"
              placeholder="数据目录"
            >
            </treeselect>
          </el-form-item>
         <el-form-item label="数据集名称" prop="datasetName">
          <el-input
            v-model="search.datasetName"
            placeholder="请输入数据集名称"
          />
        </el-form-item>
         <el-form-item label="是否已上架" prop="isUpdown">
     <el-select v-model="search.isUpdown" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in isUpdownList"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>
         <el-form-item label="修改时间" prop="timeValue">
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
            @click="handleSearch"
            >搜索</el-button
          >
          <el-button @click="handleReset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
      <div class="operation_btn" style="margin-top:20px;line-height: 36px">
      <el-button type="primary" style="margin-left:30px;" @click="addDataSet">添加数据集</el-button>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getDataSetList" :columns="columns"></right-toolbar>
    </div>
      <div class="main_content tree_main_content">
      <el-table
        :data="tableData"
        class="left-align-table"
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="datasetCatalog"
          label="数据目录"
          width="100"
          v-if="columns[0].visible"
        />
        <el-table-column
          prop="datasetName"
          label="数据集名称"
          width="100"
          v-if="columns[1].visible"
        />
        <!-- <el-table-column
          prop="datasetUrl"
          label="数据集地址"
          min-width="150"
          v-if="columns[2].visible"
        />
        <el-table-column
          prop="datasetSampleUrl"
          min-width="150"
          label="样例数据集地址"
          v-if="columns[3].visible"
        /> -->
        <el-table-column
          prop="isUpdown"
          label="是否已上架"
          align="right"
          min-width="100"
          v-if="columns[4].visible"
        >
          <template slot-scope="scope">
              {{formatIsUpdown(scope.row.isUpdown)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="datasetType"
          align="center"
          label="类型"
          min-width="100"
          v-if="columns[5].visible"
        />
        <el-table-column
          prop="datasetDescription"
          label="数据集简介"
          min-width="150"
          v-if="columns[6].visible"
        />
        <el-table-column
          prop="modifyTime"
          sortable="custom"
          label="修改时间"
          min-width="160"
          v-if="columns[7].visible"
        >
          <template slot-scope="scope">
              {{formatTime(scope.row.modifyTime)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          class-name="fixed-width"
          min-width="410"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="handleSeeDatasetUse(scope.row)">数据集使用情况</el-button>
            <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)" v-if="!scope.row.isUpdown">删除</el-button>
            <el-button size="mini" type="primary" plain v-if="scope.row.isUpdown ==1" @click="handleDown(scope.row)">下架</el-button>
            <el-button size="mini" type="primary" plain v-if="scope.row.isUpdown ==0" @click="handleUp(scope.row)">上架</el-button>
            <el-button size="mini" type="primary" plain @click="sampleUpload(scope.row)">样例上传</el-button>
            <el-button size="mini" type="primary" plain @click="sampleView(scope.row)">查看详情</el-button>
              <el-button size="mini" type="primary" plain @click="handelMove(scope.row)">移动</el-button>

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
      @pagination="getDataSetList"/>
    </div>
    </div>
    <el-dialog
      class="dialog-middle"
      title=""
      :visible.sync="moveDialogVisible"
    >
      <div>
        <el-input
          placeholder="请输入目录名称"
          prefix-icon="el-icon-search"
          style="margin-bottom: 25px;"
          v-model="filterText1">
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
    </el-dialog>
    <el-dialog
      class="dialog-middle"
      title="选择数据目录"
      :visible.sync="UpDialogVisible"
    >
      <div>
        <el-input
          placeholder="请输入目录名称"
          prefix-icon="el-icon-search"
          style="margin-bottom: 25px;"
          v-model="filterText2">
        </el-input>
        <el-tree
          class="filter-tree"
          :data="datasetCatalogList"
          highlight-current
          node-key="id"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          @node-click="handleCheckUpNode"
          draggable
          ref="upTree">
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handelSubmitUpDown">上架</el-button>
        <el-button @click="UpDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {getDataSetList, upDown , deleteDataSet,updataCatalogForDataSet } from '@/api/dataSet'
import {getDatasetCatalog} from '@/api/ScenarioSetting';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: 'Data',
  components: { Treeselect },
  data() {
    return {
      search:{
        catalogId:0,
        datasetName:'',
        isUpdown:'',
        timeValue:'',
      },
      tableData:[],
      pageNo:1,
      pageSize:10,
      total:0,
      sampleList:[],
      list:[],
      datasetCatalogList: [{
        id: 0,
        upperId: 0,
        categoryName: "全部",
        childrenDatasetCatalogs:[]
      }],
      isUpdownList: [{label:'全部', value:''},{label:'是', value:'1'},{label:'否', value:'0'}],
      // 显示搜索条件
      showSearch: true,
      // 列信息
      columns: [
        { key: 0, label: `数据目录`, visible: true },
        { key: 1, label: `数据集名称`, visible: true },
        { key: 2, label: `数据集地址`, visible: true },
        { key: 3, label: `样例数据集地址`, visible: true },
        { key: 4, label: `是否已上架`, visible: true },
        { key: 5, label: `类型`, visible: true },
        { key: 6, label: `数据集简介`, visible: true },
        { key: 7, label: `修改时间`, visible: true },
      ],
      orderByColumn:'',
      isAsc: '',
      filterText:'',
      filterText1:'',
      filterText2:'',
      defaultProps: {
        label: 'categoryName',
        children: 'childrenDatasetCatalogs',
      },
      moveDialogVisible: false,
      UpDialogVisible:false,
      currentNodeKey:'',
      form:{},
      upDown:{
        catalogId:'',
        isUpdown:'',
        id:''
      },
      normalizer(node) {
        return {
          id: node.id,
          label: node.categoryName,
          children: node.childrenDatasetCatalogs,
        }
      },
    }
  },
   watch: {
     filterText(val) {
       this.$refs.tree.filter(val);
     },
     filterText1(val) {
       this.$refs.myTree.filter(val);
     },
     filterText2(val) {
       this.$refs.upTree.filter(val);
     },
  },
  methods:{
    filterNode(value, data) {
      if (!value) return true;
      return data.categoryName.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.search.catalogId = data.id;
      this.getDataSetList()
    },

    handelMove(row){
      this.form.dataSetId = row.id;
      this.currentNodeKey = row.catalogId;
      this.$nextTick(()=>{
        this.$refs.myTree.setCurrentKey(this.currentNodeKey);
      })
      this.moveDialogVisible = true;
    },
    handleCheckNode(data){
      this.form.catalogId = data.id
    },
    handleCheckUpNode(data){
      this.upDown.catalogId = data.id
    },
    handelSubmitUpDown(){
      if (this.upDown.catalogId) {
        let params = {
          id: this.upDown.id,
          updown: this.upDown.isUpdown,
          catalogId: this.upDown.catalogId
        }
        upDown(params).then((res)=>{
          if(res.code === 200){
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.UpDialogVisible = false
            this.getDataSetList()
          }
        })
      } else {
        this.$message.error('请选择数据目录！')
      }
   },
    handelSubmitMove(){
      if (this.form.catalogId) {
        updataCatalogForDataSet(this.form).then((res) => {
          if (res.code === 200) {
            this.$message.success('操作成功！');
            this.moveDialogVisible = false;
            this.getDataSetList();
          }
        })
      } else {
        this.moveDialogVisible = false;
        return false;
      }
    },
    sortChange(data){
      this.orderByColumn = data.prop
      this.isAsc = data.order === 'ascending' ? 'asc' : 'desc'
      this.getDataSetList()
    },
    getDatasetCatalogFuc(){
      getDatasetCatalog().then((res) => {
        if(res.code === 200){
          this.datasetCatalogList[0].childrenDatasetCatalogs = res.data;
        }
      })
    },
    getDataSetList(){
      let data = {
        pageNum:this.pageNo,
        pageSize:this.pageSize,
        catalogId: this.search.catalogId || undefined,
        datasetName: this.search.datasetName || undefined,
        isUpdown: this.search.isUpdown || undefined,
        startModifyTime: this.search.timeValue ? Date.parse(this.search.timeValue[0]) : undefined,
        endModifyTime: this.search.timeValue ? Date.parse(this.search.timeValue[1]) : undefined,
        orderByColumn: this.orderByColumn || undefined,
        isAsc: this.isAsc || undefined
      }
      getDataSetList(data).then((res)=>{
        if(res.code === 200){
          this.tableData = res.rows
          this.total = res.total
        }
      })
    },
    handleSearch(){
      this.getDataSetList()
    },
    handleReset(){
      this.search.catalogId = 0
      this.search.datasetName = ''
      this.search.isUpdown = ''
      this.search.timeValue = ''
      this.getDataSetList()
    },
    addDataSet(){
      this.$router.push({
        path:'/data/addDataSet'
      })
    },
    handleClick(){},
    formatIsUpdown(isUpdown){
      return isUpdown == 0 ? '未上架' :  isUpdown == 1 ? '已上架' : ''
    },
    formatTime(time) {
        if (time) {
          var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
          return date.toJSON().substr(0, 19).replace('T', ' ');
        } else {
          return '-'
        }
    },
    handleDown(row){
      let status = row.isUpdown === 0 ? '上架' :  row.isUpdown === 1 ? '下架' : ''
      this.$confirm('是否' +status + '数据集？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: "btn-custom-cancel",
        type: 'warning'
      }).then(() => {
        let params = {
          id:row.id,
          updown: row.isUpdown === 1 ? 0 : 1,
          catalogId: 0
        }
        upDown(params).then((res)=>{
          if(res.code === 200){
              this.$message({
                type: 'success',
                message: status + '成功!'
              })
            this.getDataSetList()
          }
        })
      }).catch(() => {

      });
    },
    handleUp(row){
      this.UpDialogVisible = true
      this.upDown.isUpdown = row.isUpdown === 1 ? 0 : 1
      this.upDown.id = row.id
      this.upDown.catalogId = row.catalogId
    },
    handleDelete(row){
      this.$confirm('此操作将永久删除该数据集, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: "btn-custom-cancel",
        type: 'warning'
      }).then(() => {
        deleteDataSet(row.id).then((res)=>{
          if(res.code === 200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getDataSetList()
          }
        })
      }).catch(() => {

      });
    },
    sampleView(row){
      this.$router.push({
        name:'SampleView',
        query: {id:row.id}
      })

    },
    transformData(data){

        this.sampleList = []
        this.list = []
        for (const key in data) {
            let obj1 = {}
            if(key == 0){
                for (const j in data[key]) {
                    let obj = {}
                    obj['label'] = data[key][j]
                    obj['prop'] = 'a'+j
                    this.list.push(obj)
                }
            }else{
                for (const i in data[key]) {
                    obj1[this.list[i].prop] = data[key][i]
                }
                 this.sampleList.push(obj1)
            }
        }
    },
    sampleUpload(row){
      this.$router.push({
        path:'/data/addSampleDataset',
        query:{id:row.id,catalog:row.datasetCatalog,name:row.datasetName,url:row.datasetUrl}
      })
    },
    handleSeeDatasetUse(row){
      this.$router.push({
        path:'/data/datasetUsage',
        query:{dataSetCode:row.dataSetCode,datasetName:row.datasetName,datasetCatalog:row.datasetCatalog,datasetDescription:row.datasetDescription}
      })
    }
  },
  mounted(){
    this.getDatasetCatalogFuc()
    this.getDataSetList()
  }
}
</script>
