<template>
  <div class="import-container">
    <el-card class="box-card">
      <div slot="header" class="">
        <h2 class="card-title">外部数据导入</h2>
      </div>
      <div v-for="(item, index) in selectedMethod.externalDataSource">
        <h4>导入数据表{{index+1}}</h4>
        <el-row :gutter="10">
          <el-col :span="2" class="upload-loading">
            <span class="el-icon-time"></span>
          </el-col>
          <el-col :span="8">
            <a href="#" class="download-template" @click.prevent="downloadTemplate(index)">下载模板</a>
          </el-col>
          <el-col :span="14">
            <div class="import-form">
              <!-- <el-upload action="http://localhost:3000/" :on-change="handleChange" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList">
                <el-button size="small" type="primary" :disabled="auditing||disableInput">选择数据文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传xls文件，且不超过5M</div>
              </el-upload> -->
              <input type="file" @change="clearIcon($event)" :disabled="auditing||disableInput">
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="clearfix">
        <el-button type="primary" class="import-button" :disabled="auditing||disableInput" @click="importFile">导入</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import {
  Message
} from 'element-ui'
import $ from 'webpack-zepto'
import urlStore from '../../../api/urlStore.js'

function uploadFile(files, cb) {
  let xhr
  if (window.ActiveXObject) {
    xhr = new window.ActiveXObject('Microsoft.XMLHTTP')
  } else if (window.XMLHttpRequest) {
    xhr = new window.XMLHttpRequest()
  }
  xhr.open('POST', urlStore.uploadExternaldatasource, true)
  xhr.onload = function(event) {
      let result = JSON.parse(xhr.response)
      if (result.status == 'success') {
        if (files.length) {
          cb('success', result)
          uploadFile(files, cb)
        } else {
          cb('finished', result)
        }
      } else {
        Message({
          message: '文件上传出错',
          type: 'warning',
          duration: 2000,
          showClose: true
        })
        cb('error', result)
      }

    }
    // xhr.upload.addEventListener("progress", progressFunction, false)
  xhr.send(files.shift())
}

export default {
  data: function() {
    return {
      fileList: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }]
    }
  },
  props: ['disableInput'],
  methods: {
    handleRemove: function(file, fileList) {
      // console.log(file, fileList)
    },
    handlePreview: function(file) {
      // console.log(file)
    },
    handleChange: function(file) {
      this.$emit('fileChange')
    },
    clearIcon: function(event) {
      $(event.target).parents('.el-row').find('.upload-loading>span').attr('class', 'el-icon-time')
    },
    importFile: function() {
      // this.$emit('importFile')
      let self = this
      let blank = false
      $(this.$el).find('input[type="file"]').each(function(index, el) {
        if (el.files.length == 0) {
          blank = true
        }
      })
      if (blank) {
        Message({
          message: '上传文件不能为空',
          type: 'warning',
          duration: 2000,
          showClose: true
        })
        return
      }

      let fileArray = []
      $(this.$el).find('input[type="file"]').each(function(index, el) {
        let fileData = new FormData()
        fileData.append('datasourceFile', el.files[0])
        fileArray.push(fileData)
      })
      let uploadIndex = 0
      let externalFiles = []
      let $uploadIcons = $(this.$el).find('.upload-loading span')
      $uploadIcons.eq(0).attr('class', 'el-icon-loading')
      uploadFile(fileArray, function(msg, result) {
        externalFiles.push({
          tableName: self.selectedMethod.externalDataSource[uploadIndex],
          filePath: result.filePath
        })
        $uploadIcons.eq(uploadIndex).attr('class', 'el-icon-check')
        $uploadIcons.eq(++uploadIndex).attr('class', 'el-icon-loading')

        if (msg == 'finished') {
          Message({
            message: '上传完成',
            type: 'success',
            duration: 2000,
            showClose: true
          })
          self.$emit('uploadFinished', externalFiles)
        }
      })
    },
    downloadTemplate: function(index) {
      if (!this.selectedMethod) {
        Message({
          message: '尚未选中任何方法',
          type: 'warning',
          duration: 2000,
          showClose: true
        })
      } else {
        let params = {
          methodId: this.selectedMethod.id,
          externalDataSource: this.selectedMethod.externalDataSource[index]
        }
        window.open(urlStore.downLoadTemplate + `?methodId=${params.methodId}&externalDataSource=${params.externalDataSource}`)
          // this.$http.get(`/api/auditMethodModel/downLoadTemplate.do?methodId=${params.methodId}&externalDataSource=${params.externalDataSource}`).then(res => {
          //   console.log(res)
          // })
      }
    }
  },
  computed: {
    auditing: function() {
      return this.$store.getters.auditing
    },
    selectedMethod: function() {
      return this.$store.getters.selectedMethod
    }
  }
}
</script>
<style lang="scss">
@import '../../../assets/scss/variables.scss';
.import-container {
  margin-bottom: 22px;
  h4{
    font-weight: normal;
  }
  .download-template {
    font-size: 16px;
    font-weight: normal;
    margin-left: 20px;
    display: inline-block;
    color: #1abc9c;
  }
  .import-form {
    padding-left: 5%;
  }
  .import-button {
    min-width: 80px;
    float: right;
    margin: 20px 0 0;
  }
  .upload-loading {
    text-align: right;
  }
  .el-icon-check {
    color: #13CE66;
  }
}
</style>
