<template>
  <div class="drawer-inner drawer1" v-loading="!projectList" element-loading-text="正在加载数据">
    <header>
      <h4>{{title}}</h4>
    </header>
    <section class="drawer-content">
      <div class="drawer-box">
        <div class="new-project">
          <el-popover v-model="popVisiable" @show="showNewProject" ref="newProject" placement="bottom" width="300" trigger="click">
            <el-input v-model="newProjectName" placeholder="请输入项目名" class="new-input"></el-input>
            <el-button class="new-button" type="primary" size="small" @click="newProject">确定</el-button>
          </el-popover>
          <p v-popover:newProject>
            <span class="el-icon-plus"></span>
            <span>新建审计项目</span>
          </p>
        </div>
        <div class="project-list" v-loading="findListLoading || locked" :class="{locked: locked}">
          <div class="project-item" v-if="projectList" v-for="(project, index) in projectList">
            <h5 class="tree-title">
              <span class="open-tree el-icon-plus" @click.stop="toggleTree($event, index)"></span>
              <span @click="checkChange(index)" :class="{'title-copy': 1, 'active': index == currentProjectIndex}">{{project.jobName}}</span>
              <div class="el-input rename-input">
                <input v-model="renameInput" placeholder="请输入新项目名" class="el-input__inner" @keyup.enter="renameProject($event)">
              </div>
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link" @click="handleDropdown(index)">
                  <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="deletProject" :disabled="auditing"><span class="el-icon-delete"></span>删除审计项目</el-dropdown-item>
                  <el-dropdown-item command="renameProject" :disabled="auditing"><span class="el-icon-edit"></span>更改项目名称</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </h5>
            <div class="tree-content" v-loading="!project.methodTree">
              <el-tree v-if="project.methodTree && project.methodTree.length" :data="project.methodTree" :render-content="renderContent" :ref="'tree'+index" @check-change="checkChange(index)" show-checkbox node-key="id" :default-expand-all="false" :default-checked-keys="project.selectedId" :props="defaultProps">
              </el-tree>
              <p class="no-tree" v-else-if="project.methodTree && !project.methodTree.length">无内容</p>
            </div>
          </div>
        </div>
      </div>
    </section>
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
      title: '审计项目',
      selectedNodes: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      projectList: [],
      currentProjectIndex: null,
      dropdownIndex: null,
      renameInput: '',
      oldName: null,
      newProjectName: null,
      popVisiable: false,
      findListLoading: true
    }
  },
  mounted() {
    // this.$store.dispatch('getMethodTree')
    this.$http.get(urlStore.isCanExecute).then(res => {
      if(res.ok && res.body.status == 'success'){
        let data = res.body.data
        if(!data.isCanExecute){
          if(data.type == 'multi'){
            this.$store.commit('setCurrentJobId', data.jobId)
          }
          if(data.type == 'single'){
            this.$store.commit('setAuditingMethodId', data.methodModelId)
          }
          if(data.type == 'basic'){
            this.$store.commit('setAuditingBaseMethodId', data.methodModelId)
          }
          this.$store.commit('setContinueAudit', data.type)
          this.$store.commit('setAuditStatus', true)
        }
      }
    })
    this.$http.get(urlStore.findList, {
      params: {
        userId: this.$store.getters.user.userId
      }
    }).then(res => {
      if (!res.ok || res.body.status != 'success') {
        Message({
          message: '无法获取项目列表，请稍后再试',
          type: 'warning',
          duration: 1500
        })
        return
      }
      let data = res.body
      if (data.isCanExecute == 0) {
        this.$store.commit('setAuditStatus', true)
        this.$store.commit('setContinueAudit', true)
      }
      this.projectList = res.body.jobs
      this.findListLoading = false
    }).catch(err => {
      this.findListLoading = false
    })
  },
  computed: {
    methodTree: function() {
      return this.$store.getters.methodTree
    },
    selectedId: function() {
      return this.$store.getters.selectedId
    },
    auditing: function() {
      return this.$store.getters.auditing
    },
    continueAudit: function() {
      return this.$store.getters.continueAudit
    },
    locked: function(){
      return this.$store.getters.locked
    }
  },
  watch: {
    auditing: function(newVal) {
      if (newVal) {
        $(this.$el).find('.el-tree .el-checkbox__input').addClass('is-disabled').find('input').attr('disabled', 'disabled')
      } else {
        $(this.$el).find('.el-tree .el-checkbox__input').removeClass('is-disabled').find('input').removeAttr('disabled')
      }
    },
    methodTree: function(tree) {
      let self = this
      setTimeout(function() {
        self.checkChange()
      }, 500)
    },
    continueAudit: function(newVal) {
      if (newVal) {
        let self = this
        setTimeout(function() {
          $(self.$el).find('.el-tree .el-checkbox__input').addClass('is-disabled').find('input').attr('disabled', 'disabled')
        }, 10)
      }
    }
  },
  methods: {
    loadMethodTree: function(index, cb) {
      if (this.projectList[index]) {
        this.$http.get(urlStore.getDetail, {
          params: {
            jobId: this.projectList[index].jobId,
            userId: this.$store.getters.user.userId
          }
        }).then(res => {
          if (!res.ok || res.body.status != 'success') {
            Message({
              message: '获取详细信息出错：' + res.body.msg,
              type: 'warning',
              duration: 1500
            })
            return
          }

          let ids = []
          res.body.tree.forEach(item => {
            if (item.children) {
              item.children.forEach(item => {
                if (item.children) {
                  item.children.forEach(item => {
                    if (item.selected == 1) {
                      ids.push(item.id - 0)
                    }
                  })
                }
              })
            }
          })
          this.projectList[index].selectedId = ids
          this.projectList[index].methodTree = res.body.tree
          this.$forceUpdate()
          cb && cb()
        })
      }
    },
    checkChange: function(index, obj, isSelected, hasSChildren) {
      if(this.locked){
        return
      }
      this.currentProjectIndex = index
      let jobId = this.projectList[index].jobId
      this.$store.commit('setSelectedJobId', jobId)
      if (!this.$refs['tree' + index]) {
        let self = this
        self.loadMethodTree(index, function() {
          setTimeout(function() {
            let ref = self.$refs['tree' + index]?self.$refs['tree' + index][0]:null
              // return
            self.selectedNodes = []
            if (ref) {
              self.selectedNodes = []
              let currentCategory = ref.children[0].sort
              let currentIssue = null
              ref.getCheckedNodes().forEach((item) => {
                if(item.type == 'category'){
                  currentCategory = item.sort
                }
                // if(item.type == 'issues'){
                //   currentIssue = item.sort
                // }
                if (item.type == 'method') {
                  currentIssue = ref.children[0].children.find(issue => issue.children.some(method => method.id == item.id)).sort
                  item.rName = `${currentCategory}_${currentIssue}_${item.title}`
                  self.selectedNodes.push(item)
                }
              })
            }
            self.$store.commit('setSelectedMethods', self.selectedNodes)
            self.$store.commit('refreshSelectedParams')
          }, 100)
        })
        return
      }
      let ref = this.$refs['tree' + index][0]
        // return
      this.selectedNodes = []
      if (ref) {
        this.selectedNodes = []
        let currentCategory = ref.children[0].sort
        let currentIssue = null
        ref.getCheckedNodes().forEach((item) => {
          if(item.type == 'category'){
            currentCategory = item.sort
          }
          // if(item.type == 'issues'){
          //   currentIssue = item.sort
          // }
          if (item.type == 'method') {
            currentIssue = ref.children[0].children.find(issue => issue.children.some(method => method.id == item.id)).sort
            item.rName = `${currentCategory}_${currentIssue}_${item.title}`
            this.selectedNodes.push(item)
          }
        })
      }
      this.$store.commit('setSelectedMethods', this.selectedNodes)
      this.$store.commit('refreshSelectedParams')
        // if (!!this.selectedNodes.length) {
        //   Message({
        //     message: '参数已变更',
        //     type: 'info',
        //     duration: 1500
        //   })
        // }
    },
    toggleTree: function(event, index) {
      if(this.locked){
        return
      }
      let $target = $(event.target)
      let self = this
      if (!$target.hasClass('active')) {
        $target.parents('.project-item').find('.tree-content').show()
        if (!self.projectList[index].methodTree) {
          self.loadMethodTree(index)
        }
      } else {
        $target.parents('.project-item').find('.tree-content').hide()
      }
      $target.toggleClass('active')
      setTimeout(() => {
        self.checkChange(index)
      }, 100)
    },
    handleCommand: function(commond) {
      if (commond == 'deletProject') {
        this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $(this.$el).find('.tree-content').hide()
          $(this.$el).find('.open-tree').removeClass('active')
          let targetJobId = this.projectList[this.dropdownIndex].jobId
          this.$http.get(`${urlStore.deleteById}?jobId=${targetJobId}`).then(res => {
            if (res.body.status == 'success') {
              this.projectList.splice(this.dropdownIndex, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              if(targetJobId == this.$store.getters.multipleExecuteStatus.jobId){
                this.$store.commit('setMultipleExecuteStatus', null)
              }
            } else {
              this.$message({
                type: 'warning',
                message: '删除失败' + res.body.msg
              })
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.renameInput = this.projectList[this.dropdownIndex].jobName
        let $input = $(this.$el).find('.rename-input').hide().eq(this.dropdownIndex).show()
        this.oldName = $input.find('input')[0].value
        $input.find('input').get(0).focus()
        let self = this
        $input.find('input').on('blur', function(event) {
          event.preventDefault()
          self.renameProject(event)
        })
      }
    },
    handleDropdown: function(index) {
      this.dropdownIndex = index
    },
    renameProject: function(event) {
      let newName = event.target.value
      if (newName == this.oldName) {} else {
        this.projectList[this.dropdownIndex].jobName = newName
        this.$http.get(urlStore.renameJob, {
          params: {
            jobId: this.projectList[this.dropdownIndex].jobId,
            jobName: newName
          }
        }).then(res => {
          if (res.body.status == 'success') {
            Message({
              type: 'success',
              message: '修改成功'
            })
          } else {
            Message({
              type: 'success',
              message: '修改失败'
            })
          }
        })
      }
      $(event.target).parent('.rename-input').hide().find('input').off()
    },
    newProject: function() {
      $(this.$el).find('.tree-content').hide()
      $(this.$el).find('.open-tree').removeClass('active')
      this.popVisiable = false
      let name = $.trim(this.newProjectName)
      if (name.length != 0) {
        this.$http.post(urlStore.addJob, {
          jobName: name,
          userId: this.$store.getters.user.userId
        }, {
          emulateJSON: true
        }).then(res => {
          if (res.body.status == 'success') {
            this.projectList.unshift({
              jobId: res.body.jobId,
              jobName: name
            })
            Message({
              type: 'success',
              message: '添加成功'
            })
          }
        }, err => {
          console.log(err)
        })
      }
    },
    showNewProject: function() {
    },
    refresh: function(){
      this.projectList.forEach(item => {
        item.selectedId = null
        item.methodTree = null
        $(this.$el).find('.project-item .active').removeClass('active')
      })
      $(this.$el).find('.project-item .tree-content').hide()
      this.$forceUpdate()
    },
    renderContent(h, {
      node,
      data,
      store
    }) {
      if ($.trim(data.description)) {
        return (
          <el-popover
            placement="right"
            // title="标题"
            width="600"
            trigger="hover">
            <span slot="reference">{node.label}</span>
            <p domPropsInnerHTML={data.description} style="font-size:14px"></p>
          </el-popover>)
      } else {
        return (<span>{node.label}</span>)
      }
    }
  }
}
</script>
<style lang="scss">
.drawer1 {
  .new-project {
    // color: #d8e3ff;
    color: #fff;
    margin-left: 16px;
    p {
      cursor: pointer;
      &:hover {
        // color: #e2e6ef;
        color: #fff;
      }
    }
  }
  .project-list {
    min-height: 80px;
    &.locked{
      cursor: not-allowed;
      .project-item .tree-title{
        cursor: not-allowed;
        .open-tree{
          cursor: not-allowed;
        }
      }
    }
    .project-item {
      .tree-title {
        cursor: pointer;
        &:hover {
          color: #e6ebf9;
        }
        .open-tree {
          padding: 10px;
          cursor: pointer;
          // color: #b9b9b9;
          color: #fff;
          transition: all .2s ease-out;
          &.active {
            transform: rotate(45deg);
          }
          &:hover {
            // color: #e4e4e4;
            color: #fff;
          }
        }
        .title-copy {
          font-size: 16px;
          font-weight: normal;
          line-height: 40px;
          display: inline-block;
          color: #fff;
          &.active {
            // color: #1abc9c;
            color: #8fffe9;
          }
          &:hover {
            // color: #1abc9c;
            color: #8fffe9;
          }
        }
        .rename-input {
          position: absolute;
          display: block;
          top: 6px;
          left: 27px;
          width: 200px;
          display: none;
          input {
            height: 30px;
          }
        }
        .el-dropdown {
          float: right;
          >span {
            color: #b9b9b9;
            &:hover {
              color: #e4e4e4;
            }
          }
        }
      }
      .tree-content {
        display: none;
        min-height: 50px;
        padding-left: 20px;
        .no-tree {
          color: #fff;
        }
        .el-tree {
          color: #fff;
          font-size: 14px;
          .el-tree-node__content {
            line-height: 28px;
            height: auto;
            span {
              white-space: normal;
            }
            .el-checkbox__inner{
              width: 16px;
              height: 16px;
              &:after{
                width: 3px;
                height: 6px;
                top: 2px;
              }
            }
          }
          .el-tree-node__content{
            display: flex;
            .el-tree-node__expand-icon{
              margin-top: 7px;
            }
          }
        }
      }
    }
  }
}

.el-popover .new-button {
  float: right;
  margin-top: 10px;
  padding: 7px 20px;
}

.el-popover>p {
  max-height: 600px;
  overflow: auto;
}
</style>
