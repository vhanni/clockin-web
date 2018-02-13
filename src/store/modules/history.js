import Vue from 'vue'
import axios from '../../backend/vue-axios/axios'
import * as MutationTypes from '../mutation-types'

const state = {
  history: !!localStorage.getItem('token')
}

const mutations = {
  [MutationTypes.HISTORY] (state, history) {
    state.history = history
  }
}

const getters = {
  currentHistory (state) {
    return state.history
  }
}

const addcell = history => history.map(cv => {
  if (cv.late == true) {
    cv._cellVariants = {
      late: 'danger'
    }
  } else if (cv.late == false) {
    cv._cellVariants = {
      late: 'success'
    }
  }
  return cv
})
const actions = {
  gethistory ({ commit }, history) {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('token') && !history) {
        axios.get('api/history').then(({ data }) => {
          if (data.pending.timein) {
            data.pending.timeout = '---'
            data.history.push(data.pending)
          } else {
            data.history.push({
              'username': '---',
              'timein': '---',
              'timeout': '---',
              'late': '---'
            })
          }
          data.history = addcell(data.history).reverse()
          commit(MutationTypes.HISTORY, data)
          resolve()
        })
      } else {
        resolve()
      }
    })
  },
  timein ({ commit }, Progress) {
    return new Promise((resolve, reject) => {
      Progress.start()
      axios.post('api/timein').then(response => {
        commit(MutationTypes.HISTORY, false)
        Progress.finish()
        resolve()
      })
    })
  },
  timeout ({ commit }, Progress) {
    return new Promise((resolve, reject) => {
      Progress.start()
      axios.post('api/timeout').then(response => {
        commit(MutationTypes.HISTORY, false)
        Progress.finish()
        resolve()
      })
    })
  },
  clearhistory ({ commit }) {
    return new Promise((resolve, reject) => {
      commit(MutationTypes.HISTORY, false)
      resolve()
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
