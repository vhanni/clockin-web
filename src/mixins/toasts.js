import Vue from 'vue'
import Toasted from 'vue-toasted'
Vue.use(Toasted)

// for error
const errors = {
  pw_incorrect: 'Password Incorrect',
  user_not_found: 'User Not Found',
  email_not_allowed: 'Email Not Allowed',
  email_already_registered: 'Email Is Already Register'
}
const options = {
  type: 'error',
  class: 'danger',
  singleton: true,
  position: 'top-center',
  duration: 4000
}
Vue.toasted.register('addError', p => errors[p.error] || 'Error Occured', options)

const sucs = {
  Success: 'Success    '
}

const soptions = {
  type: 'success',
  singleton: true,
  position: 'top-center',
  duration: 4000
}
// for success
Vue.toasted.register('addSuccess', s => sucs[s.success] || 'Success', soptions)
