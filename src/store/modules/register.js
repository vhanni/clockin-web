import Vue from 'vue'
import axios from '../../backend/vue-axios/axios'
import * as MutationTypes from '../mutation-types'

const state = { register: 'success' }

const mutations = {
  [MutationTypes.REGISTER] (state) {
    state.success
  }
}

const actions = {
  register ({ commit }, form) {
    return new Promise((resolve, reject) => {
      axios.post('api/register', {
        'username': form.username,
        'password': form.password,
        'invite': form.invite,
        'email': form.email
      })
        .then(response => {
          commit(MutationTypes.REGISTER, response.data.success)
          resolve(response.data.success)
        }).catch(err => {
          reject(err.response.data)
        })
    })
  }
}

export default {
  state,
  actions,
  mutations
}
