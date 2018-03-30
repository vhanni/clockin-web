import Vue from 'vue'
import axios from '../../backend/vue-axios/axios'
import * as MutationTypes from '../mutation-types'

const state = {
  currentLanguage: 'en'
}

const getters = {
  currentLanguage: state => state.currentLanguage
}

const mutations = {
  switchLanguage: (state, language) => {
    state.currentLanguage = language
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
