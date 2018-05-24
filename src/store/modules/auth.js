import Vue from 'vue';
import { createHash } from 'crypto';
import * as MutationTypes from '../mutation-types';

const state = {
  user: !!localStorage.getItem('token'),
  userinfo: !!localStorage.getItem('token'),
  avatar: undefined
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  currentUserinfo(state) {
    return state.userinfo;
  },
  Isloading(state) {
    return state.user === undefined;
  },
  Isloadinginfo(state) {
    return state.userinfo === undefined;
  }
};

const mutations = {
  [MutationTypes.LOGOUT](state) {
    state.user = null;
    state.userinfo = null;
    localStorage.clear();
  },
  [MutationTypes.USER](state, user) {
    state.user = user;
  },
  [MutationTypes.USERINFO](state, userinfo) {
    state.userinfo = userinfo;
  },
  [MutationTypes.AVATAR](state, data) {
    state.avatar.data = data;
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
  getuserinfo({ commit, dispatch }) {
    const hash = createHash('md5')
      .update(this.state.auth.user.email)
      .digest('hex');
    const defaultUrl = `https://en.gravatar.com/${hash}.json`;
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('token')) {
        Vue.axios
          .get(defaultUrl)
          .then(response => {
            commit(MutationTypes.USERINFO, response.data.entry['0'].name);
            resolve(response);
          })
          .catch(error => {
            if (
              typeof error.response !== 'undefined' &&
              (typeof error.response.data === 'User not found' ||
                typeof error.response.data !== 'undefined')
            ) {
              return error.response.data;
            }
          });
      } else {
        reject(response);
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
        dispatch('alert/addAlert', { type: 'token_invalid', variant: 'danger' }, { root: true });
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
