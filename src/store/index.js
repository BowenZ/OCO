import Vue from 'vue'
import Vuex from 'vuex'
import multipleMethod from './modules/multipleMethod'
import singleMethod from './modules/singleMethod'
import baseDataStore from './modules/baseDataStore'
import modelMaintenance from './modules/modelMaintenance'
import urlStore from '@/api/urlStore.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auditing: false,
    continueAudit: null,
    drawerIsOpened: true,
    currentDrawerIndex: sessionStorage.getItem('currentDrawerIndex') || 0,
    user: null,
    currentDrawerPage: sessionStorage.getItem('currentDrawerPage') || 0,
    showBaseExport: false
  },
  getters: {
    auditing: state => state.auditing,
    drawerIsOpened: state => state.drawerIsOpened,
    continueAudit: state => state.continueAudit,
    currentDrawerIndex: state => state.currentDrawerIndex,
    user: state => state.user,
    currentDrawerPage: state => state.currentDrawerPage,
    showBaseExport: state => state.showBaseExport
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
    },
    setCurrentDrawerPage(state, index){
      state.currentDrawerPage = index
      sessionStorage.setItem('currentDrawerPage', index)
    },
    addLog(state, type){
      Vue.http.post(urlStore.addLog, {
        uID: state.user.userId,
        uName: state.user.username,
        type: type
      }, {
        emulateJSON: true
      })
    },
    toggleBaseExport(state, val){
      state.showBaseExport = val
    }
  },
  modules: {
    multipleMethod,
    singleMethod,
    baseDataStore,
    modelMaintenance
  }
})
