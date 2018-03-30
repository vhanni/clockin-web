import Vue from 'vue'
import axios from '../../backend/vue-axios/axios'
import * as MutationTypes from '../mutation-types'

const state = {
  theme: 'Default',
  themeWatch: 0
}

const actions = {
  updateTheme: (context, data) => {
    axios.get(process.env.SITE_URL + window.themes[data.toLowerCase()])
      .then((response) => {
        const oldlink = document.querySelector('link[rel="stylesheet"]') || document.querySelector('style')
        if (oldlink !== null) {
          const newlink = document.createElement('style')
          newlink.setAttribute('type', 'text/css')
          if (newlink.styleSheet) {
            newlink.styleSheet.cssText = response.data
          } else {
            newlink.appendChild(document.createTextNode(response.data))
          }
          document.head.replaceChild(newlink, oldlink)
        }
        context.commit('setTheme', data)
      }, (response) => {
        console.error('cannot_load_style')
      })
  }
}

const mutations = {
  setTheme: (state, data) => {
    state.theme = data
    state.themeWatch++
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
