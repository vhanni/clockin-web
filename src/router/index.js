import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Invite from '@/components/Invite'
import Logout from '@/components/Logout'
import Timetable from '@/components/Timetable'
import Todos from '@/components/Todos'

Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Login',
    component: Login,
    meta: { auth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { auth: false }
  },
  {
    path: '/invite',
    name: 'Invite',
    component: Invite,
    meta: { auth: false }
  },
  {
    path: '/timein',
    name: 'Timetable',
    component: Timetable,
    meta: { auth: true }
  },
  {
    path: '/todos',
    name: 'Todos',
    component: Todos,
    meta: { auth: false }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
    meta: { auth: false }
  }
  ]
})
