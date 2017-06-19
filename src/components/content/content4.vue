<template>
  <div class="content content4">
    <div class="category-form" v-if="currentLevel == 1 && currentState != 'delete'">
      <el-card>
        <div slot="header" class="clearfix">
          <h2 class="card-title">
            <span v-if="currentState == 'create'">新建</span>
            <span v-if="currentState == 'update'">编辑</span>
            审计类别
          </h2>
        </div>
        <p v-if="currentState == 'update'">编辑 <span class="current-title">{{currentNode.data.title}}</span></p>
        <el-form ref="categoryForm" :model="categoryForm" :rules="categoryFormRules" label-position="right" label-width="110px">
          <el-form-item label="类别名称" prop="title">
            <el-input v-model="categoryForm.title"></el-input>
          </el-form-item>
          <el-form-item label="类别描述" prop="description">
            <el-input type="textarea" v-model="categoryForm.description"></el-input>
          </el-form-item>
          <el-form-item label="排序码" prop="sort">
            <el-input type="number" v-model.number="categoryForm.sort"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" prop="isEnable">
            <el-switch on-text="" off-text="" v-model="categoryForm.isEnable"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="createCategory">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="item-form" v-if="currentLevel == 2 && currentState != 'delete'">
      <el-card>
        <div slot="header" class="clearfix">
          <h2 class="card-title">
            <span v-if="currentState == 'create'">新建</span>
            <span v-if="currentState == 'update'">编辑</span>
            审计事项
          </h2>
        </div>
        <p v-if="currentState == 'create'">在 <span class="current-title">{{currentNode.data.title}}</span> 下新建审计事项</p>
        <p v-if="currentState == 'update'">编辑 <span class="current-title">{{currentNode.data.title}}</span></p>
        <el-form ref="itemForm" :model="itemForm" :rules="itemFormRules" label-position="right" label-width="110px">
          <el-form-item label="事项名称" prop="title">
            <el-input v-model="itemForm.title"></el-input>
          </el-form-item>
          <el-form-item label="事项描述" prop="description">
            <el-input type="textarea" v-model="itemForm.description"></el-input>
          </el-form-item>
          <el-form-item label="排序码" prop="sort">
            <el-input type="number" v-model.number="itemForm.sort"></el-input>
          </el-form-item>
          <el-form-item label="是否默认" prop="isEnable">
            <el-switch on-text="" off-text="" v-model="itemForm.isDefault"></el-switch>
          </el-form-item>
          <el-form-item label="是否启用" prop="isEnable">
            <el-switch on-text="" off-text="" v-model="itemForm.isEnable"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="createItem">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="method-form" v-if="currentLevel == 3 && currentState != 'delete'">
      <el-card>
        <div slot="header" class="clearfix">
          <h2 class="card-title">
            <span v-if="currentState == 'create'">新建</span>
            <span v-if="currentState == 'update'">编辑</span>
            审计方法
          </h2>
        </div>
        <p v-if="currentState == 'create'">在 <span class="current-title">{{currentNode.data.title}}</span> 下新建审计方法</p>
        <p v-if="currentState == 'update'">编辑 <span class="current-title">{{currentNode.data.title}}</span></p>
        <el-form ref="methodForm" :model="methodForm" :rules="methodFormRules" label-position="right" label-width="110px">
          <el-form-item label="方法名称" prop="title">
            <el-input v-model="methodForm.title"></el-input>
          </el-form-item>
          <el-form-item label="方法描述" prop="description">
            <el-input type="textarea" v-model="methodForm.description"></el-input>
          </el-form-item>
          <el-form-item label="定性依据" prop="accord">
            <el-input type="textarea" v-model="methodForm.accord"></el-input>
          </el-form-item>
          <el-form-item label="审计方法" prop="autidType">
            <el-radio-group v-model="methodForm.autidType">
              <el-radio label="自动"></el-radio>
              <el-radio label="人工审阅"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="内部数据源" prop="innerDataSource">
            <el-input v-model="methodForm.innerDataSource" placeholder="各表名间用逗号分隔"></el-input>
          </el-form-item>
          <el-form-item label="外部数据源" prop="externalDataSource">
            <el-input v-model="methodForm.externalDataSource" placeholder="各表名间用逗号分隔"></el-input>
          </el-form-item>
          <el-form-item label="排序码" prop="sort">
            <el-input type="number" v-model.number="methodForm.sort"></el-input>
          </el-form-item>
          <el-form-item label="是否默认" prop="isEnable">
            <el-switch on-text="" off-text="" v-model="methodForm.selected"></el-switch>
          </el-form-item>
          <el-form-item label="是否启用" prop="selected">
            <el-switch on-text="" off-text="" v-model="methodForm.isEnable"></el-switch>
          </el-form-item>
          <el-form-item label="方法主体" prop="methodCode">
            <el-input type="textarea" v-model="methodForm.methodCode" placeholder="SQL代码"></el-input>
          </el-form-item>
          <el-form-item label="上传审计底稿模板">
            <input type="file" accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document">
            <small>只能上传word 2007及以上版本</small>
          </el-form-item>
          <el-form-item label="参数配置" prop="methodCode">
          </el-form-item>
          <div class="params-setting">
            <div class="param-container" v-for="(param, index) in methodForm.params">
              <el-row :gutter="20">
                <el-col :span="1">
                  <el-form-item>
                    <a href="#" @click.prevent="removeParam(index)"><i class="el-icon-close"></i></a>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="参数名" prop="name">
                    <el-input v-model="methodForm.params[index].name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="填写形式" prop="style">
                    <el-radio-group v-model="methodForm.params[index].style">
                      <el-radio label="text">填写</el-radio>
                      <el-radio label="pop">选择</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8" :offset="1">
                  <el-form-item label="类型">&nbsp;&nbsp;
                    <el-select v-model="methodForm.params[index].type" placeholder="请选择活动区域">
                      <el-option label="整数" value="int"></el-option>
                      <el-option label="小数" value="float"></el-option>
                      <el-option label="字符串" value="string"></el-option>
                      <el-option label="布尔值" value="boolean"></el-option>
                      <el-option label="日期" value="date"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="默认值" prop="value">
                    <el-date-picker v-if="methodForm.params[index].type == 'date'" format="yyyy-MM-dd" type="date" placeholder="选择日期" v-model="methodForm.params[index].value"></el-date-picker>
                    <el-input v-if="methodForm.params[index].type == 'string'" v-model="methodForm.params[index].value"></el-input>
                    <el-input v-if="methodForm.params[index].type == 'int' || methodForm.params[index].type == 'float'" type="number" v-model.number="methodForm.params[index].value"></el-input>
                    <el-switch v-if="methodForm.params[index].type == 'boolean'" on-text="是" off-text="否" v-model="methodForm.params[index].value"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="允许为空">
                    <el-switch on-text="是" off-text="否" v-model="methodForm.params[index].isNull"></el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="param-container">
              <el-form-item>
                <a href="#" @click.prevent="addParam"><i class="el-icon-plus"></i></a>
              </el-form-item>
            </div>
          </div>
          <el-form-item>
            <el-button type="primary" @click="createMethod">保存</el-button>
            <el-button type="success" @click="approveMethod" v-if="showPassBtn">审核通过</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
import {
  Message
} from 'element-ui'
import $ from 'webpack-zepto'
import urlStore from '@/api/urlStore.js'
export default {
  data: function() {
    return {
      categoryForm: {
        title: '',
        description: '',
        sort: '',
        isEnable: true
      },
      categoryFormRules: {
        title: [{
          required: true,
          message: '请输入类别名称',
          trigger: 'blur'
        }]
      },

      itemForm: {
        title: '',
        description: '',
        sort: '',
        isEnable: true,
        isDefault: false
      },
      itemFormRules: {
        title: [{
          required: true,
          message: '请输入事项名称',
          trigger: 'blur'
        }]
      },

      methodForm: {
        title: '',
        description: '',
        accord: '',
        autidType: '',
        innerDataSource: '',
        externalDataSource: '',
        sort: '',
        isEnable: true,
        selected: false,
        methodCode: '',
        params: []
      },
      methodFormRules: {
        title: [{
          required: true,
          message: '请输入方法名称',
          trigger: 'blur'
        }],
        methodCode: [{
          required: true,
          message: '请输入方法主体',
          trigger: 'blur'
        }]
      },
      isIE: /(msie|trident|edge)/i.test(navigator.userAgent)
    }
  },
  computed: {
    currentLevel: function() {
      return this.$store.getters.currentLevel
    },
    currentState: function() {
      return this.$store.getters.currentState
    },
    currentModel: function() {
      return this.$store.getters.currentModel
    },
    currentNode: function() {
      return this.$store.getters.currentNode
    },
    showPassBtn: function() {
      return this.$store.getters.user.username == 'admin' && this.$store.getters.currentModel && this.$store.getters.currentModel.isPass == 0
    }
  },
  watch: {
    currentModel: function() {
      console.log('=====change model====')
      if (this.currentLevel == 1) {
        if (this.currentState == 'create') {
          this.categoryForm = {
            title: '',
            description: '',
            sort: '',
            isEnable: true
          }
        } else if (this.currentState == 'update') {
          this.categoryForm = {
            id: this.currentModel.id,
            title: this.currentModel.title || null,
            description: this.currentModel.description || null,
            sort: this.currentModel.sort || null,
            isEnable: this.currentModel.isEnable == 1
          }
        }
      } else if (this.currentLevel == 2) {
        if (this.currentState == 'create') {
          this.itemForm = {
            title: '',
            description: '',
            sort: '',
            isEnable: true,
            isDefault: false
          }
        } else if (this.currentState == 'update') {
          this.itemForm = {
            id: this.currentModel.id,
            title: this.currentModel.title || null,
            description: this.currentModel.description || null,
            sort: this.currentModel.sort || null,
            isEnable: this.currentModel.isEnable == 1,
            isDefault: this.currentModel.isDefault == 1
          }
        }
      } else if (this.currentLevel == 3) {
        if (this.currentState == 'create') {
          this.methodForm = {
            title: '',
            description: '',
            accord: '',
            autidType: '',
            innerDataSource: '',
            externalDataSource: '',
            sort: '',
            isEnable: true,
            selected: false,
            methodCode: '',
            params: []
          }
        } else if (this.currentState == 'update') {
          if (this.currentModel.params && this.currentModel.params.length) {
            this.currentModel.params.forEach(param => {
              param.isNull = param.isNull == 1
            })
          }

          this.methodForm = {
            id: this.currentModel.id,
            title: this.currentModel.title || null,
            description: this.currentModel.description || null,
            isEnable: this.currentModel.isEnable == 1,
            selected: this.currentModel.selected == 1,
            sort: this.currentModel.sort || null,
            accord: this.currentModel.accord || null,
            autidType: this.currentModel.autidType || null,
            innerDataSource: this.currentModel.innerDataSource || null,
            externalDataSource: this.currentModel.externalDataSource || null,
            methodCode: this.currentModel.methodCode || null,
            params: this.currentModel.params || null
          }
        }
      }

      // IE的textarea不能拖拽拉长
      // 如果是IE，将textarea设置为根据内容量自动扩展高度
      setTimeout(() => {
        $(this.$el).find('textarea').css('height', 'auto').off().each(function(index, el) {
          $(el).css('height', `${el.scrollHeight + 20}px`)
        })
        if (this.isIE) {
          $(this.$el).find('textarea').on('keydown', function(event) {
            var el = this
            setTimeout(() => {
              $(el).css('height', `${el.scrollHeight}px`)
            }, 10)
          })
        }
      }, 300)

    }
  },
  methods: {
    createCategory: function() {
      this.$refs.categoryForm.validate(valid => {
        if (valid) {
          let newCategory = {
            title: this.categoryForm.title,
            description: this.categoryForm.description,
            isEnable: this.categoryForm.isEnable ? 1 : 0,
            sort: this.categoryForm.sort
          }
          if (this.categoryForm.id === undefined) {
            this.$http.post(urlStore.addAuditCategory, newCategory, {
              emulateJSON: true
            }).then(res => {
              if (res.ok && res.body.status == 'success') {
                newCategory.id = res.body.id
                this.$store.commit('insertCategory', newCategory)
                Message({
                  message: '添加成功',
                  type: 'success'
                })
              }
            })
          } else {
            newCategory.id = this.categoryForm.id
            this.$http.post(urlStore.updateAuditCategory, newCategory, {
              emulateJSON: true
            }).then(res => {
              if (res.ok && res.body.status == 'success') {
                newCategory.id = res.body.id
                this.$store.commit('updateCategory', newCategory)
                Message({
                  message: '修改成功',
                  type: 'success'
                })
              }
            })
          }
        }
      })
    },
    createItem: function() {
      this.$refs.itemForm.validate(valid => {
        if (valid) {
          let newItem = {
            title: this.itemForm.title,
            description: this.itemForm.description,
            isEnable: this.itemForm.isEnable ? 1 : 0,
            isDefault: this.itemForm.isDefault ? 1 : 0,
            sort: this.itemForm.sort
          }
          if (this.itemForm.id === undefined) {
            newItem.categoryId = this.$store.getters.currentId
            this.$http.post(urlStore.addAuditItem, newItem, {
              emulateJSON: true
            }).then(res => {
              if (res.ok && res.body.status == 'success') {
                newItem.id = res.body.id
                this.$store.commit('insertItem', newItem)
                Message({
                  message: '添加成功',
                  type: 'success'
                })
              }
            })
          } else {
            newItem.categoryId = this.$store.getters.parentId
            newItem.id = this.itemForm.id
            this.$http.post(urlStore.updateAuditItem, newItem, {
              emulateJSON: true
            }).then(res => {
              if (res.ok && res.body.status == 'success') {
                newItem.id = res.body.id
                this.$store.commit('updateItem', newItem)
                Message({
                  message: '修改成功',
                  type: 'success'
                })
              }
            })
          }
        }
      })
    },
    createMethod: function() {
      this.$refs.methodForm.validate(valid => {
        if (valid) {
          let newMethod = {
            title: this.methodForm.title,
            description: this.methodForm.description,
            isEnable: this.methodForm.isEnable ? 1 : 0,
            selected: this.methodForm.selected ? 1 : 0,
            sort: this.methodForm.sort,
            accord: this.methodForm.accord,
            autidType: this.methodForm.autidType,
            innerDataSource: this.methodForm.innerDataSource,
            externalDataSource: this.methodForm.externalDataSource,
            methodCode: this.methodForm.methodCode,
            params: JSON.parse(JSON.stringify(this.methodForm.params)),
            methodType: this.$store.getters.methodType
          }
          newMethod.params.forEach((param, index) => {
            newMethod.params[index].isNull = newMethod.params[index].isNull ? 1 : 0
            if (param.type == 'date') {
              newMethod.params[index].value = new Date(newMethod.params[index].value).toLocaleDateString()
            }
          })
          newMethod.params = JSON.stringify(newMethod.params)
          if (this.methodForm.id === undefined) {
            newMethod.itemId = this.$store.getters.currentId
              /* 增加文件上传，将发送的数据改为FormData */
            let formData = new FormData()
            Object.keys(newMethod).forEach((item) => {
              formData.append(item, newMethod[item])
            })
            let fileInput = this.$el.querySelector('input[type="file"]')
            if (fileInput.files.length) {
              formData.append('manuscript', fileInput.files[0])
            }
            /* end */
            this.$http.post(urlStore.addAuditMethodModel, formData).then(res => {
              if (res.ok && res.body.status == 'success') {
                newMethod.id = res.body.id
                this.$store.commit('insertMethod', newMethod)
                Message({
                  message: '添加成功',
                  type: 'success'
                })
              }
            })
          } else {
            newMethod.itemId = this.$store.getters.parentId
            newMethod.id = this.methodForm.id
              /* 增加文件上传，将发送的数据改为FormData */
            let formData = new FormData()
            Object.keys(newMethod).forEach((item) => {
              if (newMethod[item]) {
                formData.append(item, newMethod[item])
              }
            })
            let fileInput = this.$el.querySelector('input[type="file"]')
            if (fileInput.files.length) {
              formData.append('manuscript', fileInput.files[0])
            }
            /* end */
            this.$http.post(urlStore.updateAuditMethodModel, formData).then(res => {
              if (res.ok && res.body.status == 'success') {
                newMethod.id = res.body.id
                this.$store.commit('updateMethod', newMethod)
                Message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$store.commit('setSelectedMethods', [])
                this.$store.commit('refreshSelectedParams')
                $('.drawer1').find('.title-copy.active').removeClass('active')
                let drawers = this.$parent.$parent.$children[1].$children[0].$children
                drawers.forEach(drawer => {
                  drawer.refresh && drawer.refresh()
                })
              }
            })
          }
        }
      })
    },
    addParam: function() {
      this.methodForm.params.push({
        name: '',
        style: 'text',
        type: 'int',
        isNull: true,
        value: null
      })
    },
    removeParam: function(index) {
      this.methodForm.params.splice(index, 1)
    },
    approveMethod: function() {
      this.$http.post(urlStore.approveMethod, {
        methodModelID: this.currentModel.id
      }, {
        emulateJSON: true
      }).then(res => {
        if (res.ok && res.body.status == 'success') {
          Message({
            message: '审核通过',
            type: 'success'
          })
          this.currentModel && (this.currentModel.isPass = 1)
        } else {
          Message({
            message: '审核失败',
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.content4 {
  .el-form {
    padding: 20px 0;
    max-width: 800px;
    margin: auto;
  }
  .current-title {
    color: #1abc9c;
  }
  small {
    display: block;
    line-height: 1;
    color: #888;
  }
  .params-setting {
    .param-container {
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 5px;
      margin-bottom: 10px;
      &:hover{
        border: 1px solid #ccc;
      }
    }
    padding-left: 50px;
    * {
      vertical-align: middle;
    }
    .el-form-item {
      display: inline-block;
    }
    .el-form-item__label {
      float: none;
      display: inline-block;
      width: auto!important;
      margin-left: 20px;
    }
    .el-form-item__content {
      display: inline-block;
      margin: 0!important;
    }
    .el-input {
      width: 130px;
    }
    a {
      font-size: 12px;
      color: #666;
      display: inline-block;
      &:hover {
        color: #999;
      }
    }
  }
}
</style>
