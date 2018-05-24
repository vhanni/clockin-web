import classie from 'classie';
import 'normalize.css';

const script = document.createElement('script');
script.src = '/static/js/zxcvbn.js';
script.type = 'text/javascript';
script.defer = true;
const scriptTags = document.getElementsByTagName('script')[0];
scriptTags.parentNode.insertBefore(script, scriptTags);

const InvUser = username => {
  if (typeof username !== 'string') return 'username_chars';
  if (username.length === 0) return 'username_empty';
  if (username.length < 3 || username.length > 15) return 'username_must_be_3_to_15_characters';
  if (!/^[a-z0-9_-]*$/i.test(username)) return 'username_chars';
  if (username === 'proto') return 'user_not_found';
  return false;
};

const InvInvite = invite => {
  if (typeof invite !== 'string') return 'invite_chars';
  if (invite.length === 0) return 'invite_empty';
  if (invite.length < 64 || invite.length > 64) return 'invite_length';
  if (!/^[a-z0-9_-]*$/i.test(invite)) return 'invite_chars';
  if (invite === 'proto') return 'Invalid_invitation_code';
  return false;
};

// Functions
function createCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value}${expires}; path=/`;
}

function getUrlParameter(name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function sendRequest(url, data, successFn, errorFn) {
  let params = null;
  const token = localStorage.getItem('token');
  const http = new XMLHttpRequest();
  url = process.env.API_URL + url;
  if (typeof data !== 'undefined') {
    params = JSON.stringify(data);
    http.open('POST', url, true);
  } else {
    http.open('GET', url, true);
  }
  http.setRequestHeader('Content-type', 'text/plain');
  if (token) {
    http.setRequestHeader('Authorization', `Bearer ${token}`);
  }
  http.onreadystatechange = () => {
    if (http.readyState === 4) {
      // Success
      const response = JSON.parse(http.responseText);
      if (http.status === 200) {
        if (typeof response.success !== 'undefined' && response.success === true) {
          successFn(response);
          return;
        }
      }
      // Error
      errorFn(response.error);
    }
  };
  http.send(params);
}
// Error vars/functions
const fieldErrors = [
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
];

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // We either need empty email or a valid one
  if (email === '' || re.test(email)) {
    return false;
  } else {
    return 'email_not_allowed';
  }
}

function validatePassword(password, field) {
  if (password.length < 7 || password.length > 200) {
    return 'password_must_be_3_to_200_characters_long';
  } else if (typeof window.zxcvbn !== 'undefined' && window.zxcvbn(password).score < 2) {
    return `${field.getAttribute('data-password_weak')}: ${
      window.zxcvbn(password).feedback.warning
    }`;
  } else return false;
}

function addError(element, error) {
  let feedback = element.nextElementSibling;
  error = element.getAttribute(`data-${error}`) || error;
  if (feedback === null || !classie.has(feedback, 'form-control-feedback')) {
    feedback = document.createElement('div');
    classie.addClass(feedback, 'form-control-feedback');
    if (element.nextSibling !== null) {
      element.parentNode.insertBefore(feedback, element.nextSibling);
    } else {
      element.parentNode.appendChild(feedback);
    }
  }
  feedback.innerHTML = error;
  classie.addClass(element, 'form-control-danger');
}

function subError(element) {
  const feedback = element.nextElementSibling;
  if (feedback !== null && classie.has(feedback, 'form-control-feedback')) {
    feedback.remove();
  }
  classie.removeClass(element, 'form-control-danger');
}
// On load

(() => {
  let login = false;
  let ctoken;
  // Either use from localStorage or make new settings obj with user obj
  const settings = localStorage.getItem('settings')
    ? JSON.parse(localStorage.getItem('settings'))
    : { auth: { user: {} } };
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const email = document.getElementById('email');
  const invite = document.getElementById('invite');
  const formfooter = document.getElementById('form_footer');
  const inviteModal = document.getElementById('invite_modal');
  const closes = document.querySelectorAll('.close');
  const modals = document.querySelectorAll('.modal');
  const inviteBody = document.getElementById('invite_body');
  const successMsg = document.getElementById('success_msg');
  const successData = document.getElementById('success_data');
  // Set lang
  localStorage.setItem('lang', document.documentElement.lang);

  // Set affiliate localstorage
  if (getUrlParameter('ref')) {
    localStorage.setItem('ref', getUrlParameter('ref'));
  }
  const ref = localStorage.getItem('ref') || '';

  // For switching between login , register ,invite
  function formLink(event) {
    if (
      (login === false && event.target.id === 'link_login') ||
      (login === true && event.target.id === 'link_register')
    ) {
      // Toggle login form
      login = !login;
      classie.toggle(document.getElementById('form'), 'login');

      // Replace password placeholder
      const placeholder = password.getAttribute('placeholder');
      password.setAttribute('placeholder', password.getAttribute('data-placeholder'));
      password.setAttribute('data-placeholder', placeholder);
    }
  }

  function submitForm(event) {
    // Login
    if (login === true) {
      sendRequest(
        'auth',
        {
          user: username.value,
          password: password.value
        },
        response => {
          // Set new token
          if (typeof response.token !== 'undefined') {
            localStorage.getItem('token', response.token);
            localStorage.getItem('settings', JSON.stringify(settings));
          }
          localStorage.setItem('token', response.token);
          localStorage.setItem('settings', JSON.stringify(settings));
          document.location.href = '/timein';
        },
        error => {
          if (fieldErrors.includes(error)) {
            let el = error.split('_')[0];
            if (el == 'user') {
              el = 'username';
            } else if (el == 'pw') {
              el = 'password';
            }
            addError(window[el], error);
          } else {
            addError(formfooter, error);
          }
        }
      );
    } else {
      if (typeof ctoken !== 'undefined') {
        register(ctoken);
      } else {
        register(ctoken);
      }
    }
  }

  function register(token) {
    ctoken = token;
    // Send request to /register
    sendRequest(
      'register',
      {
        username: username.value,
        password: password.value,
        email: email.value,
        invite: invite.value
      },
      response => {
        // Get success response
        successMsg.innerHTML = successData.getAttribute('data-register_success');
        login = !login;
        classie.toggle(document.getElementById('form'), 'login');
      },
      error => {
        if (fieldErrors.includes(error)) {
          let el = error.split('_')[0];
          if (el == 'user') {
            el = 'username';
          } else if (el == 'pw') {
            el = 'password';
          } else if (el == 'email') {
            el = 'email';
          } else if (el == 'Invalid') {
            el = 'invalid';
          } else if (el == 'invite') {
            el = 'invite';
          }
          addError(window[el], error);
        } else {
          addError(invite, error);
        }
      }
    );
  }

  function inviteForm(event) {
    // Send request to /invite code
    sendRequest(
      'invite',
      {
        email: document.getElementById('inviteEmail').value
      },
      response => {
        // Show success message
        inviteBody.innerHTML = inviteBody.getAttribute('data-success');
      },
      error => {
        addError(document.getElementById('invite-error'), error);
      }
    );
  }

  // Set form click handlers
  document.getElementById('link_register').onclick = formLink;
  document.getElementById('link_login').onclick = formLink;
  document.getElementById('timein_now').onclick = submitForm;
  document.getElementById('invitecode').onclick = inviteForm;
  document.querySelector('.lang_link').onclick = () => {
    createCookie('lang', '1', 999);
  };

  // Username validation
  username.onkeyup = () => {
    const error = InvUser(username.value);
    if (error === false) {
      // Remove feedback
      subError(username);
    } else {
      // Add feedback
      addError(username, error);
    }
  };
  // Password validation
  password.onkeyup = () => {
    const error = validatePassword(password.value, password);
    if (error === false) {
      // Remove feedback
      subError(password);
    } else {
      // Add feedback
      addError(password, error);
    }
  };
  // Email validation
  email.onblur = () => {
    const error = validateEmail(email.value);
    if (error === false) {
      // Remove feedback
      subError(email);
    } else {
      // Add feedback
      addError(email, error);
    }
  };
  invite.onkeyup = () => {
    const error = InvInvite(invite.value);
    if (error === false) {
      // Remove feedback
      subError(invite);
    } else {
      // Add feedback
      addError(invite, error);
    }
  };
  // Lang switch
  const menu = document.querySelector('.dropdown-menu');
  const dropdown = document.querySelector('.dropdown');

  document.querySelector('.dropdown-toggle').onclick = () => {
    classie.toggle(menu, 'show');
  };

  document.addEventListener('click', e => {
    if (e.target !== dropdown && !dropdown.contains(e.target)) {
      // Hide the menu
      classie.removeClass(menu, 'show');
    }
  });

  // modal invite
  document.getElementById('invitation').onclick = e => {
    classie.toggle(inviteModal, 'active');
    e.preventDefault();
  };

  // All closes
  for (const cl of closes) {
    cl.onclick = e => {
      closeModals(e);
    };
  }
  // On click outside modal
  for (const md of modals) {
    md.onclick = e => {
      if (classie.hasClass(e.target, 'modal')) {
        closeModals(e);
      }
    };
  }

  function closeModals(e) {
    for (const md of modals) {
      classie.removeClass(md, 'active');
    }
    e.preventDefault();
  }

  // Check if we are already logged in
  if (localStorage.getItem('token') && localStorage.getItem('settings') !== 'undefined') {
    document.location.href = '/timein';
  }
})();
