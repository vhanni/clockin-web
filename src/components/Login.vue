<template>
  <div class="default-wrapper bg-dark">
    <div class="default-wrapper-inner">
      <b-container>
        <div class="cover-container">
          <b-form class="form-dark" id="form-signin" @submit.prevent="login">
            <div class="form-dark-heading clearfix">
              <b-row>
                <b-col md="4">
                  <b-img center height="100" alt="timeLogo" src="static/img/timelogo.png" />
                </b-col>
                <b-col md="4" class="ml-auto">
                  <b-img center width="100" height="100" src="static/img/biglogo.png" alt="Logo" />
                </b-col>
              </b-row>
            </div>
            <b-form-group id="fieldset1" :invalid-feedback="invalidUser" :valid-feedback="validUser" :state="state">
              <b-form-input id="inputUsername" type="text" v-model.trim="form.username" placeholder="Username *" required> </b-form-input>
              <template slot="description">
                <p>{{ desc }}</p>
              </template>
            </b-form-group>
            <b-form-group id="fieldset2" :invalid-feedback="invalidPass" :valid-feedback="validPass" :state="pwstate">
              <b-form-input id="inputPassword" type="password" v-model="form.password" placeholder="Password *" required>
              </b-form-input>
            </b-form-group>
            <b-button class="mt-4" type="submit" block variant="primary">Login</b-button>
            <b-form-group class="mt-3" id="linklogin">
              <b-button  variant="primary" size="sm" class="mt-3" to="/invite" exact>Invite 
              </b-button>
              <b-button variant="primary" size="sm" class="mt-3" to="/register" exact>Register
              </b-button>
            </b-form-group>
          </b-form>
        </div>
      </b-container>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: '',
        error: '',
      },
      initial: true,
      initialdesc: true,
      initpass: true,
      initpw:true
    }
  },
  computed: {
    errstate() {
      return false
    },
    state() {
      return this.form.username.length >= 6 ? true : false
    },
    desc() {
      if (this.form.username.length <= 0) {
        if (this.initialdesc == true) {
          this.updatedesc(false)
          return 'Tell us your awesome name'
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    pwstate () {
      return this.form.password.length >= 6 ? true : false
    },
    pwdesc() {
      if (this.form.password.length <= 0) {
        if (this.initpass == true) {
          this.updatepw(false)
          return 'Dont forget your password'
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    invalidPass() {
      if (this.form.password.length > 6) {
        return ''
      } else if (this.form.password.length > 0) {
        return 'Enter at least 6 characters'
      } else if (this.initpw == true) {
        this.updatepwstate(false)
        return ''
      } else {
        return 'Your password is empty !'
      }
    },
    validPass() {
      return this.pwstate === true  ? 'Always remember your password' : ''
    },
    invalidUser() {
      if (this.form.username.length > 6) {
        return ''
      } else if (this.form.username.length > 0) {
        return 'Oops! keep typing upto 6 characters'
      } else if (this.initial == true) {
        this.updatestate(false)
        return ''
      } else {
        return 'Let us know who you are!'
      }
    },
    validUser() {
      return this.state === true ? 'That\'s a great name' : ''
    },
    ...mapGetters({currentUser: 'currentUser'})
  },
  created() {
    this.checkCurrentLogin()
  },
  methods: {
    updatestate(initial) {
      this.initial = initial
    },
    updatedesc(initialdesc) {
      this.initialdesc = initialdesc
    },
    updatepwstate(initpw) {
      this.initpw = initpw
    },
    updatepw(initpass) {
      this.initpass = initpass
    },
    checkCurrentLogin() {
      if (this.currentUser) {
        this.$router.replace(this.$route.query.redirect || '/timein')
      }
    },
    login() {
      this.$store.dispatch('login', this.form)
        .then((token) => this.loginSuccessful(token))
        .catch((err) => this.loginFailed(err))
    },
    loginSuccessful(token) {
      if (!token) {
        this.loginFailed()
        return
      }
      this.$store.dispatch('getuser',this.$Progress).then(() => {
        this.$router.push(this.$route.query.redirect || '/timein')
      })
    },
    loginFailed(err) {
      this.$toasted.global.addError(err)
      this.$store.dispatch('logout')
    }
  }
}
</script>
<style src="../assets/style/static.css" scoped>
</style>
