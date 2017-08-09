import Vue from 'vue'
import urlStore from '../../api/urlStore.js'

const state = {
  methodTree: [],
  selectedId: [],
  selectedMethods: [],
  selectedParams: [],
  multipleResult: [],
  multipleExecuteStatus: null,
  localAuditingMethods: [],
  auditParams: [],
  selectedJobId: null,
  currentJobId: null,
  locked: false,
  currentSelectedMethod: null
}

const getters = {
  methodTree: state => state.methodTree,
  selectedId: state => {
    let ids = []
    state.methodTree.forEach(item => {
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
    return ids
  },
  selectedMethods: state => state.selectedMethods,
  selectedParams: state => state.selectedParams,
  multipleResult: state => state.multipleResult,
  multipleExecuteStatus: state => state.multipleExecuteStatus,
  localAuditingMethods: state => state.localAuditingMethods,
  auditParams: state => state.auditParams,
  selectedJobId: state => state.selectedJobId,
  currentJobId: state => state.currentJobId,
  locked: state => state.locked,
  currentSelectedMethod: state => state.currentSelectedMethod
}

const actions = {
  getMethodTree({ commit, state }) {
    Vue.http.get(urlStore.getTree).then(res => {
      if (res.body.status == 'success') {
        commit('setMethodTree', res.body.tree)
      }
    }, res => {
      commit('setMethodTree', [])
    })
  }
}

const mutations = {
  setMethodTree(state, tree) {
    state.methodTree = tree
  },
  setSelectedId(state, data) {
    state.selectedId = data
  },
  refreshSelectedParams(state) {
    let params = {}
    state.selectedMethods.forEach(method => {
      if (method.params.length) {
        method.params.forEach(item => {
          if (params[item.name] == undefined) {
            item.releventMethods = []
            item.releventMethodsId = []
            params[item.name] = JSON.parse(JSON.stringify(item))
          }
          if(item.isNull == 0){
            params[item.name].isNull = 0
          }
          if (params[item.name].releventMethods === undefined) {
            params[item.name].releventMethods = []
            params[item.name].releventMethodsId = []
          }
          params[item.name].releventMethods.push(method.rName)
          params[item.name].releventMethodsId.push(method.id)
        })
      }
    })
    let arr = []
    Object.keys(params).forEach(item => {
      arr.push(params[item])
    })
    state.selectedParams = arr
  },
  setMultipleResult(state, result) {
    state.multipleResult = result
  },
  setMultipleExecuteStatus(state, staus) {
    state.multipleExecuteStatus = staus
  },
  finishIt(state) {
    state.multipleExecuteStatus.data[state.multipleExecuteStatus.data.length - 1].children[state.multipleExecuteStatus.data[state.multipleExecuteStatus.data.length - 1].children.length - 1].status = 'success'
  },
  setLocalAuditingMethods(state, methods) {
    state.localAuditingMethods = methods
  },
  setSelectedMethods(state, methods) {
    state.selectedMethods = methods
  },
  setAuditParams(state, autidParams) {
    state.auditParams = autidParams
  },
  setSelectedJobId(state, id) {
    state.selectedJobId = id
  },
  setCurrentJobId(state, id) {
    state.currentJobId = id
  },
  lockOperation(state){
    state.locked = true
  },
  unlockOperation(state){
    state.locked = false
  },
  setCurrentSelectedMethod(state, val){
    state.currentSelectedMethod = val
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
