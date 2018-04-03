import classie from 'classie'
import 'normalize.css'
import { InvUser, InvInvite } from '../src/utils/clib'

// Load zxcvbn async
(function () {
  var a
  a = function () {
    var a, b
    b = document.createElement('script')
    b.src = '/static/js/zxcvbn.js'
    b.type = 'text/javascript'
    b.async = 0
    a = document.getElementsByTagName('script')[0]
    return a.parentNode.insertBefore(b, a)
  }
  if (window.attachEvent) window.attachEvent('onload', a)
  else window.addEventListener('load', a, !1)
}).call(this)
// Functions
function createCookie (name, value, days) {
  var expires = ''
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + value + expires + '; path=/'
}
function getUrlParameter (name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  var results = regex.exec(location.search)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}
function sendRequest (url, data, successFn, errorFn) {
  var params = null
  var token = localStorage.getItem('token')
  var http = new XMLHttpRequest()
  url = process.env.API_URL + url
  if (typeof data !== 'undefined') {
    params = JSON.stringify(data)
    http.open('POST', url, true)
  } else {
    http.open('GET', url, true)
  }
  http.setRequestHeader('Content-type', 'text/plain')
  if (token) {
    http.setRequestHeader('Authorization', 'Bearer ' + token)
  }
  http.onreadystatechange = function () {
    if (http.readyState === 4) {
      // Success
      var response = JSON.parse(http.responseText)
      if (http.status === 200) {
        if (typeof response.success !== 'undefined' && response.success === true) {
          successFn(response)
          return
        }
      }
      // Error
      errorFn(response.error)
    }
  }
  http.send(params)
}
// Error vars/functions
var fieldErrors = [
  'email_already_registered',
  'Invalid_invitation_code',
  'invite_length',
  'invite_chars',
  'invite_empty',
  'email_not_allowed',
  'password_empty',
  'password_invalid',
  'pw_incorrect',
  'password_must_be_3_to_200_characters_long',
  'password_weak',
  'password_wrong',
  'username_chars',
  'username_empty',
  'user_not_found',
  'username_invalid',
  'username_already_registered',
  'username_must_be_3_to_15_characters'
]
function validateEmail (email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  // We either need empty email or a valid one
  if (email === '' || re.test(email)) {
    return false
  } else {
    return 'email_not_allowed'
  }
}
function validatePassword (password, field) {
  if (password.length < 7 || password.length > 200) {
    return 'password_must_be_3_to_200_characters_long'
  } else if (typeof window.zxcvbn !== 'undefined' && window.zxcvbn(password).score < 2) {
    return field.getAttribute('data-password_weak') + ': ' + window.zxcvbn(password).feedback.warning
  } else return false
}
function addError (element, error) {
  var feedback = element.nextElementSibling
  error = element.getAttribute('data-' + error) || error
  if (feedback === null || !classie.has(feedback, 'form-control-feedback')) {
    feedback = document.createElement('div')
    classie.addClass(feedback, 'form-control-feedback')
    if (element.nextSibling !== null) {
      element.parentNode.insertBefore(feedback, element.nextSibling)
    } else {
      element.parentNode.appendChild(feedback)
    }
  }
  feedback.innerHTML = error
  classie.addClass(element, 'form-control-danger')
}
function subError (element) {
  var feedback = element.nextElementSibling
  if (feedback !== null && classie.has(feedback, 'form-control-feedback')) {
    feedback.remove()
  }
  classie.removeClass(element, 'form-control-danger')
}
// On load
(function () {
  var i = 0
  var i2
  var login = false
  var ctoken
  // Either use from localStorage or make new settings obj with user obj
  var settings = (localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : {auth: {user: {}}})
  var username = document.getElementById('username')
  var password = document.getElementById('password')
  var email = document.getElementById('email')
  var invite = document.getElementById('invite')
  var formfooter = document.getElementById('form_footer')
  var inviteModal = document.getElementById('invite_modal')
  var closes = document.querySelectorAll('.close')
  var modals = document.querySelectorAll('.modal')
  var inviteBody = document.getElementById('invite_body')
  var successMsg = document.getElementById('success_msg')
  var successData = document.getElementById('success_data')

  // Set lang
  localStorage.setItem('lang', document.documentElement.lang)

  // Set affiliate localstorage
  if (getUrlParameter('ref')) {
    localStorage.setItem('ref', getUrlParameter('ref'))
  }
  var ref = localStorage.getItem('ref') || ''

  // For switching between login , register ,invite
  function formLink (event) {
    if ((login === false && event.target.id === 'link_login') || (login === true && event.target.id === 'link_register')){
      // Toggle login form
      login = !login
      classie.toggle(document.getElementById('form'), 'login')

      // Replace password placeholder
      var placeholder = password.getAttribute('placeholder')
      password.setAttribute('placeholder', password.getAttribute('data-placeholder'))
      password.setAttribute('data-placeholder', placeholder)
    }
  }

  function submitForm (event) {
    // Login
    if (login === true) {
      sendRequest('auth', {
        user: username.value,
        password: password.value,
      }, response => {
        // Set new token
        if (typeof response.token !== 'undefined') {
          localStorage.getItem('token', response.token)
          localStorage.getItem('settings', JSON.stringify(settings))
        }
        localStorage.setItem('token', response.token)
        localStorage.setItem('settings', JSON.stringify(settings))
        document.location.href = '/timein'
      }, error => {
        if (fieldErrors.includes(error)) {
          let el = error.split('_')[0]
          if (el == 'user') {
            el = 'username'
          } else if (el == 'pw') {
            el = 'password'
          }
          addError(window[el], error)
        } else {
          addError(formfooter, error)
        }
      })
    } else {
      if (typeof ctoken !== 'undefined') {
        register(ctoken)
      } else {
        register(ctoken)
      }
    }
  }

  function register (token) {
    ctoken = token
    // Send request to /register
    sendRequest('register', {
      username: username.value,
      password: password.value,
      email: email.value,
      invite: invite.value
    }, response => {
      // Get success response
      successMsg.innerHTML = successData.getAttribute('data-register_success')
    }, error => {
      if (fieldErrors.includes(error)) {
        let el = error.split('_')[0]
        if (el == 'user') {
          el = 'username'
        } else if (el == 'pw') {
          el = 'password'
        } else if (el == 'email') {
          el = 'email'
        } else if (el == 'Invalid') {
          el = 'invalid'
        } else if (el == 'invite') {
          el = 'invite'
        }
        addError(window[el], error)
      } else {
        addError(formfooter, error)
      }
    })
  }

  function inviteForm (event) {
    // Send request to /invite code
    sendRequest('invite', {
      email: document.getElementById('inviteEmail').value
    }, response => {
      // Show success message
      inviteBody.innerHTML = inviteBody.getAttribute('data-success')
    }, error => {
      addError(document.getElementById('invite-error'), error)
    })
  }

  // Set form click handlers
  document.getElementById('link_register').onclick = formLink
  document.getElementById('link_login').onclick = formLink
  document.getElementById('timein_now').onclick = submitForm
  document.getElementById('invitecode').onclick = inviteForm
  document.querySelector('.lang_link').onclick = function () {
    createCookie('lang', '1', 999)
  }

  // Username validation
  username.onkeyup = () => {
    const error = InvUser(username.value)
    if (error === false) {
      // Remove feedback
      subError(username)
    } else {
      // Add feedback
      addError(username, error)
    }
  }
  // Password validation
  password.onkeyup = () => {
    const error = validatePassword(password.value, password)
    if (error === false) {
      // Remove feedback
      subError(password)
    } else {
      // Add feedback
      addError(password, error)
    }
  }
  // Email validation
  email.onblur = () => {
    const error = validateEmail(email.value)
    if (error === false) {
      // Remove feedback
      subError(email)
    } else {
      // Add feedback
      addError(email, error)
    }
  }
  invite.onkeyup = () => {
    const error = InvInvite(invite.value)
    if (error === false) {
      // Remove feedback
      subError(invite)
    } else {
      // Add feedback
      addError(invite, error)
    }
  }
  // Lang switch
  const menu = document.querySelector('.dropdown-menu')
  const dropdown = document.querySelector('.dropdown')

  document.querySelector('.dropdown-toggle').onclick = () => {
    classie.toggle(menu, 'show')
  }

  document.addEventListener('click', e => {
    if (e.target !== dropdown && !dropdown.contains(e.target)) {
      // Hide the menu
      classie.removeClass(menu, 'show')
    }
  })

  //modal invite
  document.getElementById('invitation').onclick = e => {
    classie.toggle(inviteModal, 'active')
    e.preventDefault()
  }

  // All closes
  for (i = 0; i < closes.length; ++i) {
    closes[i].onclick = e => {
      closeModals(e)
    }
  }
  // On click outside modal
  for (i = 0; i < modals.length; ++i) {
    modals[i].onclick = e => {
      if (classie.hasClass(e.target, 'modal')) {
        closeModals(e)
      }
    }
  }

  function closeModals (e) {
    for (i2 = 0; i2 < modals.length; ++i2) {
      classie.removeClass(modals[i2], 'active')
    }
    e.preventDefault()
  }

  // Check if we are already logged in
  if (localStorage.getItem('token') && localStorage.getItem('settings') !== 'undefined') {
    document.location.href = '/timein'
  }
})()
