import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import auth from './modules/auth'
import history from './modules/history'
import alert from './modules/alert'
import interfaceSettings from './modules/interface'
import payslipSettings from './modules/payslip'
import language from './modules/language'

Vue.use(Vuex)

export const store = new Vuex.Store({
  // strict: true, // only for debugging
  modules: {
    auth,
    history,
    alert,
    interfaceSettings,
    payslipSettings,
    language,
    
  },
  // Save some states in localStorage as settings
  plugins: [createPersistedState({
    key: 'settings',
    paths: [
      'auth.user',
      'history.history',
      'interfaceSettings.theme',
      'language.currentLanguage'
    ]
  })]
})
