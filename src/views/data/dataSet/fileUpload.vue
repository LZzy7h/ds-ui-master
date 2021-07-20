<template>
    <div class="fileUpload">
        <div class="fileUpload_top">
            <!-- <h6>当你上传的数据集文件小于100M时，请您选择:</h6> -->
            <div class="fileUpload_upload">
                <div>
                  <el-upload
                    v-if="isSample"
                    class="upload-demo"
                    ref="upload"
                    :action="isSample?uploadSampleUrl:uploadUrl"
                    :file-list="fileList"
                    :on-error="onError"
                    :on-success="onSuccess"
                    :on-change="onChange"
                    :on-remove="onRemove"
                    :http-request="httpRequest"
                    :beforeUpload="beforeAvatarUpload"
                    :limit="1"
                    accept=".csv"
                    :auto-upload="false">
                        <div>
                            <el-button class="upload_file" slot="trigger" >点击此处选择需要上传的CSV文件，文件大小不超过100M</el-button>
                        </div>
                  </el-upload>
                  <BigFileUpload v-if="!isSample" @getButtonState="getButtonState"/>

                  <div v-if="isSample" style="text-align: center; margin-top: 50px;">
                    <el-button style="right:0;" type="primary" @click="submitUpload">创建样例数据集</el-button>
                  </div>
                </div>
                <div style="margin-left:50px;" v-if="!isSample">
                    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
                           <!--<el-form-item label="文件行数" prop="line">-->
                            <!--<el-input v-model="form.line" style="width:300px"></el-input>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="文件列数" prop="row">-->
                            <!--<el-input v-model="form.column" style="width:300px"></el-input>-->
                        <!--</el-form-item>-->
                        <el-form-item label="设置数据集名称:" prop="datasetName">
                            <el-input v-model="form.datasetName" style="width:300px"></el-input>
                        </el-form-item>
                        <el-form-item label="设置数据集标识:" prop="infoKey">
                            <el-input v-model="form.infoKey" style="width:300px"></el-input>
                        </el-form-item>
                        <el-form-item label="设置数据集类型:" prop="datasetType">
                            <el-select v-model="form.datasetType" style="width:300px" clearable placeholder="请选择数据集类型">
                                <el-option
                                v-for="item in options"
                                :key="item"
                                :label="item"
                                :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="设置数据集简介:" prop="datasetDescription">
                            <el-input v-model="form.datasetDescription" style="width:300px"></el-input>
                        </el-form-item>
                    </el-form>
                      <div style="text-align:center; display:flex;justify-content:space-between;">
                          <span></span>
                        <el-button style="right:0;" type="primary" :disabled="isDisabled" @click="submitUpload">创建数据集</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
let BASE_URL = document.querySelector("html").getAttribute("data-promise-base-url");
import {uploadCsv  , getDataSetType ,uploadSampleCsv} from '@/api/dataSet'
import BigFileUpload from './BigFileUpload'
export default {
    name:'fileUpload',
    components:{BigFileUpload},
    data(){
        return {
            fullscreenLoading: false,
            form:{
                infoKey:'',
                datasetName:'',
                datasetType:'',
                datasetDescription:'',
                // line:'',
                // column:''
            },
            fileList:[],
            options:[],
            uploadUrl:process.env.VUE_APP_BASE_API + '/dataset/save/csv',
            uploadSampleUrl:'',
            rules:{
                datasetName:[
                    { required: true, message: '请输入数据集名称', trigger: 'blur' },
                ],
                infoKey:[
                    { required: true, message: '请输入数据集标识', trigger: 'blur' },
                ],
                datasetType:[
                    { required: true, message: '请输入数据集类型', trigger: 'change' },
                ],
                // line:[
                //     { required: true, message: '请输入文件行数', trigger: 'blur' },
                // ],
                // column:[
                //     { required: true, message: '请输入文件列数', trigger: 'blur' },
                // ]
            },
           isDisabled: true,
           md5:''
        }
    },
    props:['isSample','datasetId'],
    mounted(){
        getDataSetType().then((res)=>{
            this.options = res.data.split(',')
        })
        this.uploadSampleUrl = process.env.VUE_APP_BASE_API + '/dataset/save/csv/sample?id='+ this.datasetId
    },
    methods: {
        getButtonState(data){
          this.md5 = data
          this.isDisabled = false
        },
        httpRequest(file){
          let formData = new FormData()
          formData.append('csvFile',file.file)
          this.fullscreenLoading = true
          uploadSampleCsv(formData,this.datasetId).then((res)=>{
            this.fullscreenLoading = false
            if(res.code === 200){
              this.$message({
                message: '上传成功！',
                type: 'success'
              });
              this.$router.push({path:'/data/dataSet'})
            }else{
              this.$message.error('上传失败！');
            }
          }).catch(()=>{
            this.fullscreenLoading = false
          })
        },
        onChange(file){
            this.fileList.push(file)
        },
        onRemove(file){
            this.fileList = []
        },
        beforeAvatarUpload(file){
          const isLt1M = file.size / 1024 / 1024 < 1000000
          if (!isLt1M) {
            this.$message.error('上传文件大小不能超过 100MB')
            return false
          }
        },
        submitUpload(){
            if(this.isSample){
                if(this.fileList.length == 0){
                    this.$message.error('请选择上传文件');
                    return
                }
                this.$refs.upload.submit();
            }else{
              let params = {
                infoKey:this.form.infoKey,
                datasetName:this.form.datasetName,
                datasetDescription:this.form.datasetDescription,
                datasetType:this.form.datasetType,
                md5: this.md5,
                // line: this.form.line,
                // column: this.form.column
              }
              this.fullscreenLoading = true
              uploadCsv(params).then((res)=>{
                this.fullscreenLoading = false
                if(res.code === 200){
                  this.$message({
                    message: '上传成功！',
                    type: 'success'
                  });
                  this.$router.push({path:'/data/dataSet'})
                }else{
                  this.$message.error('上传失败！');
                }
              }).catch(() => {
                this.fullscreenLoading = false
              })
            }


        },
        onError(err,file,filelist){
            this.$refs.upload.clearFiles()
        },
        onSuccess(){
            this.$refs.upload.clearFiles()
        },
        onSubmit(){}
    }
}
</script>
<style lang="scss">
    .fileUpload{
        margin-left: 20px;
        h6{
            font-size: 14px;
        }
        .fileUpload_top{
            border-bottom: 2px solid #f4f4f4;
            .fileUpload_upload{
                padding: 30px 0;
                display: flex;
                justify-content: flex-start;
                .upload_file{
                    width: 400px;
                    height: 100px;
                }
            }
        }
        .fileUpload_bottom{
            .form_box{
                display: flex;
                justify-content: flex-start;
                .form_box_item{
                    width: 400px;
                }
            }
        }
    }
</style>
