import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import auth from './modules/auth'
import history from './modules/history'
import register from './modules/register'

Vue.use(Vuex)

export const store = new Vuex.Store({
  // strict: true, // only for debugging because REALLY slow
  modules: {
    auth,
    history,
    register
  },
  // Save some states in localStorage as settings
  plugins: [createPersistedState({
    key: 'settings',
    paths: [
      'auth.user',
      'history.history'
    ]
  })]
})
