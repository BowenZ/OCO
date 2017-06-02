<template>
  <div class="document-management">
    <div class="document-container">
      <el-card class="box-card">
        <div class="document-list">
          <el-checkbox-group v-if="documentsCopy && documentsCopy.length" v-model="checkedDocuments">
            <el-checkbox v-for="doc in documentsCopy" :key="doc.documentId" :label="doc.documentId">{{doc.documentName}}</el-checkbox>
          </el-checkbox-group>
          <p v-else>尚无文件</p>
        </div>
      </el-card>
    </div>
    <div class="document-buttons">
      <el-button :loading="disableButton" type="primary" icon="upload2" @click="showUpload">上传</el-button>
      <el-button :loading="disableButton" type="primary" icon="star-off" @click="downloadDocument">下载</el-button>
      <el-button :loading="disableButton" type="primary" icon="delete2" @click="deleteDocument">删除</el-button>
    </div>
    <div class="document-upload">
      <div class="upload-input" v-loading="uploading" element-loading-text="正在上传">
        <span class="el-icon-circle-check upload-icon"></span>
        <input type="file" @change="clearIcon($event)" :disabled="disableButton">
        <!-- <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        <div class="upload-buttons">
          <el-button type="primary" @click="uploadDocument">上传</el-button>
          <el-button @click="hideUpload">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import urlStore from '@/api/urlStore.js'
import {
  Message
} from 'element-ui'
import $ from 'webpack-zepto'

function uploadFile(file, cb) {
  let xhr
  if (window.ActiveXObject) {
    xhr = new window.ActiveXObject('Microsoft.XMLHTTP')
  } else if (window.XMLHttpRequest) {
    xhr = new window.XMLHttpRequest()
  }
  xhr.open('POST', urlStore.uploadDocument, true)
  xhr.onload = function(event) {
      let result = JSON.parse(xhr.response)
      if (result.status == 'success') {
        cb('finished', result)
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
  xhr.send(file)
}

export default {
  props: ['documents', 'methodId', 'dialogVisible'],
  data: function() {
    return {
      documentsCopy: [],
      checkedDocuments: [],
      uploadUrl: urlStore.uploadDocument,
      fileList: [],
      disableButton: false,
      uploading: false
    }
  },
  watch: {
    dialogVisible: function(newVal) {
      if (!newVal) {
        this.hideUpload()
      }
    }
  },
  mounted() {
    this.documentsCopy = this.documents
  },
  methods: {
    showUpload: function() {
      $(this.$el).find('.document-upload').addClass('active')
    },
    hideUpload: function() {
      $(this.$el).find('.document-upload').removeClass('active').find('input[type="file"]')[0].value = ''
      $(this.$el).find('.upload-icon').removeClass('active')
    },
    clearIcon: function(event) {
      $(this.$el).find('.upload-icon').removeClass('active')
    },
    uploadDocument: function() {
      let fileInput = $(this.$el).find('input[type="file"]')[0]
      if (fileInput.files.length == 0) {
        Message({
          message: '上传文件不能为空',
          type: 'warning',
          duration: 2000,
          showClose: true
        })
        return
      }

      let self = this
      this.uploading = true
      let fileData = new FormData()
      fileData.append('content', fileInput.files[0])
      fileData.append('methodId', this.methodId)
      let $uploadIcon = $(this.$el).find('.upload-icon')
      $uploadIcon.addClass('active')
      uploadFile(fileData, function(msg, result) {
        self.uploading = false
        if (msg == 'finished') {
          Message({
            message: '上传完成',
            type: 'success',
            duration: 2000,
            showClose: true
          })
          self.documentsCopy.push(result.document)
        }
      })
    },
    downloadDocument: function() {
      if (!this.checkedDocuments.length) {
        Message({
          message: '请选择文件',
          type: 'warning'
        })
        return
      }
      window.open(`${urlStore.downloadDocuments}?documentIds=${this.checkedDocuments.join(',')}`)
      // Message({
      //   message: '下载即将开始，请稍后...',
      //   type: 'info'
      // })
    },
    deleteDocument: function() {
      if (!this.checkedDocuments.length) {
        Message({
          message: '请选择文件',
          type: 'warning'
        })
        return
      }
      this.disableButton = true
      this.$http.get(urlStore.deleteDocuments, {
        params: {
          documentIds: this.checkedDocuments.join(',')
        }
      }).then(res => {
        this.disableButton = false
        if (res.ok && res.body.status == 'success') {
          Message({
            message: '删除成功',
            type: 'success'
          })
          this.checkedDocuments.forEach(item => {
            this.documentsCopy.every((doc, index) => {
              if (doc.documentId == item) {
                this.documentsCopy.splice(index, 1)
                return false
              }
              return true
            })
          })
          this.checkedDocuments = []
        } else {
          Message({
            message: '删除失败',
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.document-management {
  // min-height: 500px;
  position: relative;
  .document-container {
    width: 100%;
    padding: 10px 100px 10px 10px;
    .document-list {
      position: relative;
      width: 100%;
      min-height: 300px;
      max-height: 400px;
      overflow: auto;
      margin: 0;
      list-style: none;
      padding: 10px;
      box-sizing: border-box;
      .el-checkbox-group {
        .el-checkbox {
          display: block;
          margin: 0 0 10px;
        }
      }
    }
  }
  .document-buttons {
    position: absolute;
    right: 0;
    bottom: 0;
    button {
      display: block;
      margin: 10px 0 0;
    }
  }
  .document-upload {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 0 120px 0 50px;
    top: 0;
    left: 0;
    background-color: #fff;
    z-index: 2;
    visibility: hidden;
    opacity: 0;
    -webkit-transition: opacity .2s ease-out;
    -moz-transition: opacity .2s ease-out;
    -ms-transition: opacity .2s ease-out;
    -o-transition: opacity .2s ease-out;
    transition: opacity .2s ease-out;
    &.active {
      visibility: visible;
      opacity: 1;
    }
    .upload-buttons {
      margin-top: 20px;
    }
    .el-loading-mask {
      background-color: rgba(255, 255, 255, .8)!important;
    }
    .upload-icon {
      visibility: hidden;
      &.active {
        visibility: visible;
      }
    }
  }
}
</style>
