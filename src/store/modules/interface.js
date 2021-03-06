import Vue from 'vue';
import * as MutationTypes from '../mutation-types';

const state = {
  theme: 'Default',
  themeWatch: 0,
  showAvatars: true
};

const mutations = {
  setTheme: (state, data) => {
    state.theme = data;
    state.themeWatch++;
  }
};

const actions = {
  updateTheme: (context, data) => {
    Vue.axios.get(process.env.SITE_URL + window.themes[data.toLowerCase()]).then(
      response => {
        const oldlink =
          document.querySelector('link[rel="stylesheet"]') || document.querySelector('style');
        if (oldlink !== null) {
          const newlink = document.createElement('style');
          newlink.setAttribute('type', 'text/css');
          if (newlink.styleSheet) {
            newlink.styleSheet.cssText = response.data;
          } else {
            newlink.appendChild(document.createTextNode(response.data));
          }
          document.head.replaceChild(newlink, oldlink);
        }
        context.commit('setTheme', data);
      },
      response => {
        console.error('cannot_load_style');
      }
    );
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
