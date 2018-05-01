import Vue from 'vue';
import App from './App';
import router from './router';
import { store } from './store/store';
import VueAxios from 'vue-axios';
import axios from 'axios';
import AxiosInit from './backend/vue-axios';
import VueI18n from 'vue-i18n';
import messages from './../static/locales/en';
import BootstrapVue from 'bootstrap-vue';
import VueProgressBar from 'vue-progressbar';

// config
Vue.config.productionTip = false;
Vue.config.site_url = process.env.SITE_URL;

Vue.use(VueAxios, axios);
Vue.axios = AxiosInit(Vue.axios);

Vue.use(BootstrapVue);

// icon fontawesome
import 'vue-awesome/icons/github';
import 'vue-awesome/icons/sliders';
import Icon from 'vue-awesome/components/Icon';
Vue.component('icon', Icon);

// progressbar
window.firstLoad = true;
const options = {
  color: '#008abc',
  failedColor: 'red',
  thickness: '5px',
  autoRevert: true,
  location: 'top',
  transition: {
    termination: 2000,
    opacity: '1s',
    speed: '0.2s'
  },
  inverse: false
};

Vue.use(VueProgressBar, options);

Vue.axios.interceptors.response.use(
  response => {
    if (
      response.config.url.substr(-4) === '.css' ||
      typeof response.data.gen !== 'undefined' ||
      (typeof response.data.success !== 'undefined' &&
        response.data.success === true)
    ) {
      // If this isn't first load of app, finish progress bar
      if (!window.firstLoad) {
        Vue.prototype.$Progress.finish();
      }
      window.firstLoad = false;
      return response;
    } else {
      // Despite 200 header code, this seems like a fail
      Vue.prototype.$Progress.fail();
      return Promise.reject(response);
    }
  },
  err => {
    // Only after initial load
    Vue.prototype.$Progress.fail();
    // If invalid token, remove token from store and alert user
    if (
      typeof err.response !== 'undefined' &&
      typeof err.response.data !== 'undefined' &&
      typeof err.response.data.error !== 'undefined' &&
      (err.response.data.error === 'token_invalid' ||
        err.response.data.error === 'TOKEN_EXPIRED')
    ) {
      // Log user out
      store.dispatch('auth/guest', true);
      store.dispatch('clearhistory', true);
    }
    setTimeout(() => {
      window.location.replace('/');
    }, 3500);
  }
);
// Languages
Vue.use(VueI18n);
// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages: {
    en: messages
  } // set locale messages
});

router.beforeEach((to, from, next) => {
  let timeout = 0;

  function nextPath () {
    // If we don't need auth, just go already
    if (!to.meta.auth) {
      next();
    }
    // Check if we already loaded user state
    if (store.getters['auth/Isloading']) {
      timeout++;
      // Retry for 15 seconds
      if (timeout < 300) setTimeout(nextPath, 50);
      return;
    }
    // Check if we need to be logged in for this component
    if (to.meta.auth && !store.getters['auth/currentUser']) {
      // if route requires auth and user isn't authenticated
      next({ path: '/' });
    } else {
      next();
    }
  }
  nextPath();
});

// Little function for quick router inline event function
window.routerLink = e => {
  e = e || window.event;
  e.preventDefault();
  window.vm.$router.push(e.target.pathname);
};

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  router,
  axios,
  store,
  components: { App },
  template: '<App/>',
  i18n
});
