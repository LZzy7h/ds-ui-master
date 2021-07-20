<template>
  <div>
    <uploader
      browse_button="browse_button"
      :url="uploadUrl + '/console/dataset/save/csv/file'"
      :headers="headers"
      chunk_size="2MB"
      :filters="{
        prevent_duplicates: true,
        mime_types: [{ title: 'Csv files', extensions: 'csv' }]
      }"
      :FilesAdded="filesAdded"
      :BeforeUpload="beforeUpload"
      :UploadComplete="uploadComplete"
      @inputUploader="inputUploader"
    />
    <br />
    <el-table :data="tableData" style="width: 800px; margin: 10px 10px;">
      <el-table-column label="文件名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大小">
        <template slot-scope="scope">
          <span>{{ scope.row.size }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === -1">正在计算MD5</span>
          <span v-if="scope.row.status === 1">MD5计算完成，准备上传</span>
          <span v-if="scope.row.status === 4" style="color: brown"
            >上传失败</span
          >
          <span v-if="scope.row.status === 5" style="color: chartreuse"
            >已上传</span
          >
          <el-progress
            v-if="scope.row.status === 2"
            :text-inside="true"
            :stroke-width="20"
            :percentage="scope.row.percent"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="deleteFile(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-button type="primary" id="browse_button">选择文件</el-button>

    <el-button type="danger" :disabled="isDisabled" @click="up.start()">开始上传</el-button>
  </div>
</template>

<script>
import FileMd5 from "../models/file-md5.js";
import Uploader from "./Uploader";
import { getToken } from "@/utils/auth";
import {intFileUpload} from '@/api/dataSet'
export default {
  name: "BigFileUpload",
  data() {
    return {
      server_config: this.global.server_config,
      up: {},
      files: [],
      tableData: [],
      // : 'http://localhost:8080',
      uploadUrl: process.env.VUE_APP_BASE_API,
      headers: { Authorization: 'Bearer ' + getToken() },
      isDisabled: true
    };
  },

  components: {
    uploader: Uploader
  },
  watch: {
    files: {
      handler() {
        this.tableData = [];
        // this.isDisabled = this.files.length === 0
        this.files.forEach(e => {
          this.tableData.push({
            name: e.name,
            size: e.size,
            status: e.status,
            id: e.id,
            percent: e.percent
          });
        });
      },
      deep: true
    }
  },
  methods: {
    inputUploader(up) {
      this.up = up;
      this.files = up.files;
    },
    filesAdded(up, files) {
      let max_files = 1;
      // plupload.each(files, function(file) {
      //   if (up.files.length > max_files) {
      //     alert("You are allowed to add only " + max_files + " files.");
      //     up.removeFile(file);
      //   }
      // });
      // if (up.files.length >= max_files) {
      //   $("#pickfiles").hide("slow");
      // }
      if (up.files.length > max_files) {
        let file = this.up.getFile(files[0].id);
        up.removeFile(file);
        return false
      }
      files.forEach(f => {
        f.status = -1;
        FileMd5(f.getNative(), (e, md5) => {
          f["md5"] = md5;
          f.status = 1;
          this.intFileUpload(md5)
        });
      });
    },
    intFileUpload(md5){
      intFileUpload({md5:md5}).then((res) => {
        if (res.data) {
          this.isDisabled = true
          this.$emit('getButtonState', md5)
          this.$message.warning('文件已经上传到服务器上')
        }else{
          this.isDisabled = false
        }
      })
    },
    deleteFile(id) {
      let file = this.up.getFile(id);
      this.up.removeFile(file);
      this.isDisabled = true
    },
    beforeUpload(up, file) {
      up.setOption("multipart_params", { size: file.size, md5: file.md5 });
    },
    uploadComplete(up, files){
      this.isDisabled = true
      this.$emit('getButtonState', files[0].md5)
    }
  }
};
</script>

<style scoped></style>
