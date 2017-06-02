import Vue from 'vue'
import urlStore from '../../api/urlStore.js'

const state = {
  singleMethods: [],
  singleParams: [],
  selectedMethod: null,
  singleExecuteStatus: null,
  currentSingleJobId: null,
  auditingMethodId: null
}

const getters = {
  singleMethods: state => state.singleMethods,
  singleParams: state => state.singleParams,
  selectedMethod: state => state.selectedMethod,
  singleExecuteStatus: state => state.singleExecuteStatus,
  currentSingleJobId: state => state.currentSingleJobId,
  auditingMethodId: state => state.auditingMethodId
}

const actions = {
  getSingleMethods({ commit, state }) {
    Vue.http.get(urlStore.findMethods, {
      params: {
        userId: state.user.userId
      }
    }).then(res => {
      if (res.body.status == 'success') {
        commit('setSingleMethods', res.body.data)
        if (res.body.isCanExecute && res.body.isCanExecute == 0) {
          state.auditing = true
          state.continueAudit = true
            // state.currentSingleJobId = res.body.jobId
        }
      }
    }, res => {
      commit('setSingleMethods', [])
    })
  }
}

const mutations = {
  setSingleMethods(state, methods) {
    state.singleMethods = methods
  },
  setSingleParams(state, params) {
    state.singleParams = params
  },
  setSelectedMethod(state, method) {
    state.selectedMethod = method
    state.singleParams = method.params
  },
  setSingleExecuteStatus(state, status) {
    state.singleExecuteStatus = status
  },
  setCurrentSingleJobId(state, id) {
    state.currentSingleJobId = id
  },
  setAuditingMethodId(state, id) {
    state.auditingMethodId = id
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
