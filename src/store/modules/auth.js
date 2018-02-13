import Vue from 'vue'
import axios from '../../backend/vue-axios/axios'
import * as MutationTypes from '../mutation-types'

const state = { user: !!localStorage.getItem('token') }

const mutations = {
  [MutationTypes.LOGIN] (state, token) {
    localStorage.setItem('token', token)
  },
  [MutationTypes.LOGOUT] (state) {
    localStorage.clear()
    state.user = null
  },
  [MutationTypes.USER] (state, user) {
    state.user = user
  }
}

const getters = {
  currentUser (state) {
    return state.user
  }
}

const actions = {
  getuser ({ commit }, Progress) {
    return new Promise((resolve, reject) => {
      Progress.start()
      if (localStorage.getItem('token')) {
        axios.get('api/user').then(response => {
          commit(MutationTypes.USER, response.data.userinfo)
          Progress.finish()
          resolve()
        })
      } else {
        reject()
      }
    })
  },
  login ({ commit }, form) {
    return new Promise((resolve, reject) => {
      axios.post('api/auth', { 'user': form.username, 'password': form.password })
        .then(response => {
          commit(MutationTypes.LOGIN, response.data.token)
          resolve(response.data.token)
        }).catch(err => {
          reject(err.response.data)
        })
    })
  },
  logout ({ commit }) {
    commit(MutationTypes.LOGOUT)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
