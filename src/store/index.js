import Vue from 'vue'
import Vuex from 'vuex'
import multipleMethod from './modules/multipleMethod'
import singleMethod from './modules/singleMethod'
import baseDataStore from './modules/baseDataStore'
import modelMaintenance from './modules/modelMaintenance'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawerIsOpened: true,
    currentDrawerIndex: 0,
    user: null
  },
  getters: {
    currentDrawerIndex: state => state.currentDrawerIndex,
    user: state => state.user
  },
  mutations: {
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
