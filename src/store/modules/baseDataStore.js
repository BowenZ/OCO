const state = {
  selectedData: null,
  currentBaseJobId: null,
  auditingBaseMethodId: null
}

const getters = {
  selectedData: state => state.selectedData,
  currentBaseJobId: state => state.currentBaseJobId,
  auditingBaseMethodId: state => state.auditingBaseMethodId
}

const mutations = {
  setCurrentBaseJobId(state, id) {
    state.currentSingleJobId = id
  },
  setSelectedData(state, data) {
    state.selectedData = data
  },
  setAuditingBaseMethodId(state, id) {
    state.auditingBaseMethodId = id
  }
}

export default {
  state,
  getters,
  mutations
}
