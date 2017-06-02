import Vue from 'vue'
import urlStore from '../../api/urlStore.js'

const state = {
  methodTree: [],
  selectedId: [],
  selectedMethods: [],
  selectedParams: [],
  multipleResult: [],
  auditing: false,
  multipleExecuteStatus: null,
  localAuditingMethods: [],
  auditParams: [],
  continueAudit: false,
  selectedJobId: null,
  currentJobId: null
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
  auditing: state => state.auditing,
  multipleExecuteStatus: state => state.multipleExecuteStatus,
  localAuditingMethods: state => state.localAuditingMethods,
  auditParams: state => state.auditParams,
  continueAudit: state => state.continueAudit,
  selectedJobId: state => state.selectedJobId,
  currentJobId: state => state.currentJobId
}

const actions = {
  getMethodTree({ commit, state }) {
    Vue.http.get(urlStore.getTree).then(res => {
      if (res.body.status == 'success') {
        commit('setMethodTree', res.body.tree)
        if (res.body.isCanExecute && res.body.isCanExecute == 0) {
          state.auditing = true
          state.continueAudit = true
            // state.currentJobId = res.body.jobId
        }
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
            params[item.name] = item
          }
          if (params[item.name].releventMethods === undefined) {
            params[item.name].releventMethods = []
            params[item.name].releventMethodsId = []
          }
          params[item.name].releventMethods.push(method.title)
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
  changeAuditStatus(state) {
    state.auditing = !state.auditing
  },
  setAuditStatus(state, val) {
    state.auditing = val
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
  setContinueAudit(state, val) {
    state.continueAudit = val
  },
  setSelectedJobId(state, id) {
    state.selectedJobId = id
  },
  setCurrentJobId(state, id) {
    state.currentJobId = id
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
