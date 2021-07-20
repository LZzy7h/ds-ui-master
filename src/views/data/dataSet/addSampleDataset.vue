<template>
  <div class="addDataSet">
    <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">数据库</el-menu-item>
      <el-menu-item index="2">文件导入</el-menu-item>
    </el-menu>
    <div class="main_content">
      <mySql :datasetId="datasetId" v-if="activeIndex === '1'" />
      <fileUpload :datasetId="datasetId" :isSample="isSample"  v-if="activeIndex === '2'" />
    </div>
  </div>
</template>
<script>
  import mySql from './mySampelSql'
  import fileUpload from './fileUpload'
  import {getDatasetCatalog} from '@/api/ScenarioSetting'
  export default {
    name:'addDataSet',
    data(){
      return{
        datasetCatalogList:[],
        activeIndex:'1',
        datasetId: this.$route.query.id,
        datasetName: this.$route.query.name,
        datasetUrl: this.$route.query.url,
        catalog: this.$route.query.catalog,
        isSample:true
      }
    },
    components:{
      mySql,
      fileUpload
    },
    methods:{
      getDatasetCatalogFuc(){
        getDatasetCatalog().then((res) => {
          if(res.code === 200){
            this.datasetCatalogList = res.data
          }
        })
      },
      handleSelect(key){
        this.activeIndex = key
      },
      getDatasetCatalog(){
        getDatasetCatalog().then((res)=>{
          if(res.code === 200){
            this.datasetCatalogList = res.data
          }
        })
      },
      changeCatalogId(val){
        this.$store.commit('SET_CATALOGID',val)
      }
    },
    mounted(){
      this.getDatasetCatalogFuc()
    },
  }
</script>
<style lang="scss">
  .addDataSet{
    .ds-tab-list{
      display: flex;
      justify-content: flex-start;
      border-bottom: 1px solid #cdcdcd;
      padding-left: 20px;;
      .ds-tab-item{
        line-height: 30px;
        width: 120px;
        height: 30px;
        color: #3F74DA;
        margin: 0 10px;
        font-size: 14px;
        border-top-left-radius:8px ;
        border-top-right-radius:8px ;
        border: 1px solid #3F74DA;
        border-bottom:none ;
        text-align: center;
      }
      .ds-tab-item.active{
        color: #ffffff;
        background: #3F74DA;
      }
    }
    .box_items{
      margin: 30px 10px 30px 20px;
    }
    .box_items span:nth-of-type(1){
      font-weight: 600;
    }
  }

</style>
