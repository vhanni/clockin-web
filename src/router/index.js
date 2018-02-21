import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Invite from '@/components/Invite'
import Logout from '@/components/Logout'
import Timetable from '@/components/Timetable'

Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/invite',
    name: 'Invite',
    component: Invite
  },
  {
    path: '/timein',
    name: 'Timetable',
    component: Timetable
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  }
  ]
})