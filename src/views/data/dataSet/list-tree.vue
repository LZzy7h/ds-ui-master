<template>
  <div>
        <div class="search_box" v-show="showSearch">
       <el-form :model="search"  :inline="true">
         <el-form-item label="数据目录" prop="catalogId">
            <el-select v-model="search.catalogId" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in datasetCatalogList"
            :key="index"
            :label="item.categoryName"
            :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
         <el-form-item label="数据集名称" prop="datasetName">
          <el-input
            v-model="search.datasetName"
            placeholder="请输入数据集名称"
          />
        </el-form-item>
         <el-form-item label="上架" prop="isUpdown">
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
      <el-button type="primary" @click="addDataSet">添加数据集</el-button>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getDataSetList" :columns="columns"></right-toolbar>
    </div>
    <div class="main_content">
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
        <el-table-column
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
        />
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
            <el-button size="mini" type="primary" plain v-if="scope.row.isUpdown ==1" @click="handleUpdown(scope.row)">下架</el-button>
            <el-button size="mini" type="primary" plain v-if="scope.row.isUpdown ==0" @click="handleUpdown(scope.row)">上架</el-button>
            <el-button size="mini" type="primary" plain @click="sampleUpload(scope.row)">样例上传</el-button>
            <el-button size="mini" type="primary" plain @click="sampleView(scope.row)">查看详情</el-button>
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
      @pagination="getDataSetList"
    />
    </div>
  </div>
</template>
<script>
import {getDataSetList, upDown , deleteDataSet } from '@/api/dataSet'
import {getDatasetCatalog} from '@/api/ScenarioSetting'
export default {
  name: 'Data',
  data() {
    return {
      search:{
        catalogId:'',
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
      datasetCatalogList: [],
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
      isAsc: ''
    }
  },
  methods:{
    sortChange(data){
      this.orderByColumn = data.prop
      this.isAsc = data.order === 'ascending' ? 'asc' : 'desc'
      this.getDataSetList()
    },
    getDatasetCatalogFuc(){
      getDatasetCatalog().then((res) => {
        if(res.code === 200){
          this.datasetCatalogList = res.data
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
      this.search.catalogId = ''
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
    handleUpdown(row){
      let status = row.isUpdown === 0 ? '上架' :  row.isUpdown === 1 ? '下架' : ''
      this.$confirm('是否' +status + '数据集？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: "btn-custom-cancel",
        type: 'warning'
      }).then(() => {
        let params = {
          id:row.id,
          updown: row.isUpdown === 1 ? 0 : 1
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
