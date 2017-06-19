<template>
  <div class="drawer-inner drawer6">
    <header>
      <h4>{{title}}</h4>
    </header>
    <section class="drawer-content">
      <div class="drawer-box">
        <p class="new-audit-category" v-if="isAdmin">
          <a href="#" @click.prevent="createAudit(1)">
            <i class="el-icon-plus"></i>
            <span>添加审计类别</span>
          </a>
        </p>
        <div class="tree-container" v-loading="!treeData" element-loading-text="正在加载模型数据...">
          <el-tree v-if="treeData" :data="treeData" :props="defaultProps" node-key="id" highlight-current @current-change="currentChange" :expand-on-click-node="true" :render-content="renderContent">
          </el-tree>
        </div>
      </div>
    </section>
    <ul class="el-dropdown-menu right-menu category-menu" x-placement="bottom-end">
      <li class="el-dropdown-menu__item" @click="createAudit(2)" :class="{'is-disabled': !isAdmin || (currentData && currentData.title == '基础数据')}">新增审计事项</li>
      <li class="el-dropdown-menu__item" @click="editAudit(1)" :class="{'is-disabled': !isAdmin || (currentData && currentData.title == '基础数据')}">编辑审计类别</li>
      <li class="el-dropdown-menu__item" @click="deleteAudit(1)" :class="{'is-disabled': !isAdmin || (currentData && currentData.title == '基础数据')}">删除审计类别</li>
    </ul>
    <ul class="el-dropdown-menu right-menu issue-menu" x-placement="bottom-end">
      <li class="el-dropdown-menu__item" @click="createAudit(3)" :class="{'is-disabled': !isAdmin}">新增审计方法</li>
      <li class="el-dropdown-menu__item" @click="editAudit(2)" :class="{'is-disabled': !isAdmin || (currentData && currentData.title == '基础数据')}">编辑审计事项</li>
      <li class="el-dropdown-menu__item" @click="deleteAudit(2)" :class="{'is-disabled': !isAdmin || (currentData && currentData.title == '基础数据')}">删除审计事项</li>
    </ul>
    <ul class="el-dropdown-menu right-menu method-menu" x-placement="bottom-end">
      <li class="el-dropdown-menu__item" @click="copyAudit(3)">复制审计方法</li>
      <li class="el-dropdown-menu__item" @click="editAudit(3)" :class="{'is-disabled': !isAdmin && isPassed}">编辑审计方法</li>
      <li class="el-dropdown-menu__item" @click="deleteAudit(3)" :class="{'is-disabled': !isAdmin && isPassed}">删除审计方法</li>
    </ul>
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
      title: '模型维护',
      treeLoaded: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      rightClick: false,
      $categoryMenu: null,
      $issueMenu: null,
      $methodMenu: null,
      $menus: null,
      $drawerPane: null,

      currentData: null,
      currentNode: null
    }
  },

  mounted() {
    this.$drawerPane = $(this.$el).parents('.drawer-pane')[0]
  },

  computed: {
    currentDrawerIndex: function() {
      return this.$store.state.currentDrawerIndex
    },
    treeData: function() {
      return this.$store.getters.modelTreeData
    },
    currentUser: function(){
      return this.$store.getters.user
    },
    isAdmin: function() {
      return this.$store.getters.user.username == 'admin'
    },
    isPassed: function() {
      return this.currentData && this.currentData.type == 'method' && this.currentData.isPass == 1
    }
  },

  watch: {
    currentDrawerIndex: function(newVal) {
      if (newVal == 5 && !this.treeLoaded) {
        console.log('=====go====')
        this.treeLoaded = true
        this.$http.get(urlStore.getAllTree, {
          params: {
            userId: this.currentUser.userId
          }
        }).then(res => {
          if (res.ok && res.body.status == 'success') {
            this.$store.commit('setModelTreeData', res.body.tree)
            let self = this
            $('.tree-container').on('contextmenu', function(event) {
              event.preventDefault()
              self.rightClick = true
              $(event.target).parents('.el-tree-node').eq(0).trigger('click')
              self.$menus.css({
                left: `${event.clientX - 80 > 182 ? 182 : event.clientX - 80}px`,
                top: `${event.clientY + self.$drawerPane.scrollTop - self.$drawerPane.getClientRects()[0].top}px`
              })
              return false
            })
            $(document).click(function(event) {
              self.$menus.hide()
            })
            this.$categoryMenu = $('.category-menu')
            this.$issueMenu = $('.issue-menu')
            this.$methodMenu = $('.method-menu')
            this.$menus = $('.right-menu')
          } else {
            Message({
              message: res.body.msg || '请求模型树数据失败',
              type: 'info'
            })
          }
        })
      }
    }
  },

  methods: {
    currentChange: function(data, node) {
      this.currentData = data
      this.currentNode = node
      if (this.rightClick) {

        if (data.type == 'category') {
          this.$menus.hide()
          this.$categoryMenu.show()
        } else if (data.type == 'issues') {
          this.$menus.hide()
          this.$issueMenu.show()
        } else if (data.type == 'method') {
          this.$menus.hide()
          this.$methodMenu.show()
        }
      } else {
        this.$menus.hide()
      }
      this.rightClick = false
    },
    createAudit: function(level) {
      if (this.currentNode) {
        this.$store.commit('setCurrentNode', this.currentNode)
      }
      this.$store.commit('setCurrentLevel', level)
      this.$store.commit('setCurrentState', 'create')
      this.$store.commit('setCurrentModel', null)
    },
    copyAudit: function(level) {
      if (this.currentData) {
        this.$http.post(urlStore.copyMethod, {
          userId: this.$store.getters.user.userId,
          methodModelID: this.currentData.id
        }, {
          emulateJSON: true
        }).then(res => {
          let parent = this.currentNode.parent.data
          let currentNodeIndex = parent.children.indexOf(this.currentNode.data)
          parent.children.splice(currentNodeIndex, 0, res.body.method)

          setTimeout(() => {
            this.currentNode = this.currentNode.parent.childNodes[currentNodeIndex]
            this.currentData = this.currentNode.data
            this.$store.commit('setCurrentNode', this.currentNode)
            this.$store.commit('setCurrentLevel', level)
            this.$store.commit('setCurrentState', 'update')
            this.$store.commit('setCurrentModel', this.currentData)
          }, 10);
        })
      }
    },
    editAudit: function(level) {
      if (this.currentData) {
        this.$store.commit('setCurrentNode', this.currentNode)
        this.$store.commit('setCurrentLevel', level)
        this.$store.commit('setCurrentState', 'update')
        this.$store.commit('setCurrentModel', this.currentData)
      }
    },
    deleteAudit: function(level) {
      if (this.currentData) {
        if (this.currentData.children && this.currentData.children.length) {
          Message({
            message: '禁止删除有子节点的项目',
            type: 'warning'
          })
          return
        }
        this.$store.commit('setCurrentNode', this.currentNode)
        this.$confirm('此操作将删除该项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.commit('setCurrentLevel', level)
          this.$store.commit('setCurrentState', 'delete')
          this.$store.commit('setCurrentModel', null)
          let url
          switch (level) {
            case 1:
              url = urlStore.deleteAuditCategory
              break
            case 2:
              url = urlStore.deleteAuditItem
              break
            case 3:
              url = urlStore.deleteAuditMethodModel
              break
          }
          this.$http.post(url, {
            id: this.currentData.id
          }, {
            emulateJSON: true
          }).then(res => {
            if (res.ok && res.body.status == 'success') {
              Message({
                message: '删除成功',
                type: 'success'
              })
              this.$store.commit('deleteTreeNode', this.currentData.id)
            } else if (res.ok) {
              Message({
                message: res.body.msg || '删除失败',
                type: 'info'
              })
            }
          })
        }).catch(() => {})
      }
    },
    renderContent: function(h, { node, data, store }){
      if(data.isPass == 0){
        return (<span class="no-pass">{node.label}</span>)
      }else{
        return (<span>{node.label}</span>)
      }
    }
  }
}
</script>
<style lang="scss">
.drawer6 {
  .el-loading-mask {
    background-color: none;
  }
  .new-audit-category {
    margin-left: 16px;
    a {
      color: #e2e6ef;
      text-decoration: none;
      cursor: pointer;
      &:hover {
        color: #fff;
      }
      i {
        font-size: 12px;
        line-height: 21px;
        vertical-align: bottom;
      }
    }
  }
  .tree-container {
    min-height: 200px;
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
      .el-checkbox__inner {
        width: 16px;
        height: 16px;
        &:after {
          width: 3px;
          height: 6px;
          top: 2px;
        }
      }
    }
    .el-tree-node__content {
      display: flex;
      .el-tree-node__expand-icon {
        margin-top: 7px;
      }
    }
    &.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
      background-color: #077dad;
    }
    .no-pass:before{
      content: '';
      background-color: #ff4949;
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
  .right-menu {
    position: absolute;
    z-index: 9;
    display: none;
  }
}
</style>
