import Vue from 'vue'
import Vuex from 'vuex'
import multipleMethod from './modules/multipleMethod'
import singleMethod from './modules/singleMethod'
import baseDataStore from './modules/baseDataStore'
import modelMaintenance from './modules/modelMaintenance'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auditing: false,
    continueAudit: null,
    drawerIsOpened: true,
    currentDrawerIndex: sessionStorage.getItem('currentDrawerIndex') || 0,
    user: null
  },
  getters: {
    auditing: state => state.auditing,
    drawerIsOpened: state => state.drawerIsOpened,
    continueAudit: state => state.continueAudit,
    currentDrawerIndex: state => state.currentDrawerIndex,
    user: state => state.user
  },
  mutations: {
    setContinueAudit(state, val) {
      state.continueAudit = val
    },
    changeAuditStatus(state) {
      state.auditing = !state.auditing
    },
    setAuditStatus(state, val) {
      state.auditing = val
    },
    openDrawer(state) {
      state.drawerIsOpened = true
    },
    closeDrawer(state) {
      state.drawerIsOpened = false
    },
    toggleDrawer(state) {
      state.drawerIsOpened = !state.drawerIsOpened
    },
    updateCurrentDrawerIndex(state, index) {
      state.currentDrawerIndex = index
      sessionStorage.setItem('currentDrawerIndex', index)
    },
    login(state, user) {
      sessionStorage && sessionStorage.setItem('user', JSON.stringify(user))
      state.user = user
    },
    logout(state, user) {
      sessionStorage && sessionStorage.removeItem('user')
      state.user = null
    }
  },
  modules: {
    multipleMethod,
    singleMethod,
    baseDataStore,
    modelMaintenance
  }
})
