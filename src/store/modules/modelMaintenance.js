const state = {
  modelTreeData: null,
  currentLevel: null,
  currentState: 'create',
  currentModel: null,
  currentNode: null
}

const getters = {
  modelTreeData: state => state.modelTreeData,
  currentLevel: state => state.currentLevel,
  currentModel: state => state.currentModel,
  currentState: state => state.currentState,
  currentNode: state => state.currentNode,
  methodType: state => {
    if(!state.currentNode){
      return 'model'
    }
    // if (state.currentNode.data.methodCode !== undefined) {
    //   if (state.currentNode.parent.data.title == '基础数据') {
    //     return 'basic'
    //   } else {
    //     return 'model'
    //   }
    // } else if (state.currentNode.data.title == '基础数据') {
    //   return 'basic'
    // }
    let ret = 'model'
    try{
      if((state.currentNode.level == 2 && state.currentNode.parent.data.title == '基础数据') || (state.currentNode.parent.parent.data.title == '基础数据')){
        ret = 'basic'
      }
    }catch(err){
      console.log('error:' ,err)
    }
    return ret
  },
  currentId: state => {
    if(state.currentNode){
      return state.currentNode.data.id
    }
    return null
  },
  parentId: state => {
    if(state.currentNode){
      return state.currentNode.parent.data.id
    }
    return null
  }
}

const mutations = {
  setModelTreeData(state, val) {
    state.modelTreeData = val
  },
  setCurrentLevel(state, val) {
    state.currentLevel = val
  },
  setCurrentModel(state, val) {
    state.currentModel = val
  },
  setCurrentState(state, val) {
    state.currentState = val
  },
  setCurrentNode(state, val) {
    state.currentNode = val
  },
  insertCategory(state, category) {
    category.type = 'category'
    category.children = []
    state.modelTreeData.push(category)
    state.currentModel = {}
  },
  updateCategory(state, category) {
    state.currentNode.data.title = category.title
    state.currentNode.data.sort = category.sort
    state.currentNode.data.isEnable = category.isEnable
    state.currentNode.data.description = category.description
  },
  deleteTreeNode(state, id) {
    if (state.currentNode.level == 1) {
      state.currentNode.parent.data.every((item, index) => {
        if (item.id == id) {
          state.currentNode.parent.data.splice(index, 1)
          return false
        }
        return true
      })
    } else {
      state.currentNode.parent.data.children.every((item, index) => {
        if (item.id == id) {
          state.currentNode.parent.data.children.splice(index, 1)
          return false
        }
        return true
      })
    }
  },
  insertItem(state, item) {
    item.type = 'issues'
    item.children = []
    state.currentNode.data.children.push(item)
    state.currentModel = {}
  },
  updateItem(state, item) {
    state.currentNode.data.title = item.title
    state.currentNode.data.sort = item.sort
    state.currentNode.data.isEnable = item.isEnable
    state.currentNode.data.description = item.description
    state.currentNode.data.isDefault = item.isDefault
  },
  insertMethod(state, method) {
    method.type = 'method'
    method.params = JSON.parse(method.params)
    state.currentNode.data.children.push(method)
    state.currentModel = {}
  },
  updateMethod(state, method) {
    state.currentNode.data.title = method.title
    state.currentNode.data.description = method.description
    state.currentNode.data.isEnable = method.isEnable
    state.currentNode.data.selected = method.selected
    state.currentNode.data.sort = method.sort
    state.currentNode.data.accord = method.accord
    state.currentNode.data.autidType = method.autidType
    state.currentNode.data.innerDataSource = method.innerDataSource
    state.currentNode.data.externalDataSource = method.externalDataSource
    state.currentNode.data.methodCode = method.methodCode
    state.currentNode.data.params = JSON.parse(method.params)
  }
}

export default {
  state,
  getters,
  mutations
}
