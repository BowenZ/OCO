const state = {
  selectedData: null,
  currentBaseJobId: null
}

const getters = {
  selectedData: state => state.selectedData,
  currentBaseJobId: state => state.currentBaseJobId
}

const mutations = {
  setCurrentBaseJobId(state, id) {
    state.currentSingleJobId = id
  },
  setSelectedData(state, data) {
    state.selectedData = data
  }
}

export default {
  state,
  getters,
  mutations
}
