// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store/store'
import axios from './backend/vue-axios'
import BootstrapVue from 'bootstrap-vue'
import VueProgressBar from 'vue-progressbar'
import './mixins/toasts'

Vue.use(BootstrapVue)

// config
Vue.config.productionTip = false
Vue.config.site_url = process.env.SITE_URL

// icon fontawesome
import 'vue-awesome/icons/spinner'
import Icon from 'vue-awesome/components/Icon'
Vue.component('icon', Icon)

// progressbar
window.firstLoad = true
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
}

Vue.use(VueProgressBar, options)

window.routerLink = e => {
  e = e || window.event
  e.preventDefault()
  window.vm.$router.push(e.target.pathname)
}

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  router,
  axios,
  store,
  template: '<App/>',
  components: { App }
})
