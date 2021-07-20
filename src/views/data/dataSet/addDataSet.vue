<template>
    <div class="addDataSet">
        <!--<div class="search_box">-->
          <!--<el-form :model="search" :inline="true">-->
            <!--<el-form-item label="选择数据目录" prop="catalogId">-->
              <!--<el-select v-model="search.catalogId" clearable placeholder="请选择数据目录">-->
                <!--<el-option-->
                  <!--v-for="(item, index) in datasetCatalogList"-->
                  <!--:key="index"-->
                  <!--:label="item.categoryName"-->
                  <!--:value="item.id">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          <!--</el-form>-->
        <!--</div>-->
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">数据库</el-menu-item>
          <el-menu-item index="2">文件导入</el-menu-item>
          <el-menu-item index="3">空数据集</el-menu-item>
          <!-- <el-menu-item index="4">通用API</el-menu-item> -->
        </el-menu>
        <div class="main_content">
            <mySql v-if="activeIndex === '1'" />
            <fileUpload v-if="activeIndex === '2'" />
            <dataSet v-if="activeIndex === '3'" />
            <generalApi v-if="activeIndex === '4'" />
        </div>
    </div>
</template>
<script>
import mySql from './mySql'
import fileUpload from './fileUpload'
import generalApi from './generalApi'

import dataSet from './dataSet'
import {getDatasetCatalog} from '@/api/ScenarioSetting'
export default {
    name:'addDataSet',
    data(){
        return{
            search:{
              catalogId: ""
            },
            datasetCatalogList:[],
            activeIndex:'1'
        }
    },
    components:{
      mySql,
      fileUpload,
      dataSet,
      generalApi
    },
    methods:{
      handleSelect(key){
        this.activeIndex = key
      },
        getDatasetCatalogFuc(){
          getDatasetCatalog().then((res) => {
            if(res.code === 200){
              this.datasetCatalogList = res.data
            }
          })
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
    }

</style>
