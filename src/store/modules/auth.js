import Vue from 'vue';
import * as MutationTypes from '../mutation-types';

const state = { user: !!localStorage.getItem('token') };

const mutations = {
  [MutationTypes.LOGOUT](state) {
    state.user = null;
    localStorage.clear();
  },
  [MutationTypes.USER](state, user) {
    state.user = user;
  }
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  Isloading(state) {
    return state.user === undefined;
  }
};

const actions = {
  getuser({ commit, dispatch }, Progress) {
    return new Promise((resolve, reject) => {
      Progress.start();
      if (localStorage.getItem('token')) {
        Vue.axios
          .get('me/user')
          .then(response => {
            commit(MutationTypes.USER, response.data.userinfo);
            Progress.finish();
            resolve(response);
          })
          .catch(err => {
            reject();
          });
      } else {
        reject();
      }
    });
  },
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      Vue.axios
        .post('me/logout')
        .then(response => {
          commit(MutationTypes.LOGOUT, response);
          resolve();
        })
        .catch(err => {
          reject();
        });
    });
  },
  guest({ commit, dispatch }, alert = false) {
    if (localStorage.getItem('token') !== false) {
      commit(MutationTypes.LOGOUT, null);
      if (alert) {
        // Add alert
        dispatch(
          'alert/addAlert',
          { type: 'token_invalid', variant: 'danger' },
          { root: true }
        );
      }
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
