<template>
  <div class="default-wrapper bg-dark">
    <div class="default-wrapper-inner">
      <b-container>
        <div class="cover-container">
          <b-form class="form-dark" id="form-signin" @submit.prevent="register">
            <div class="form-dark-heading clearfix">
              <b-row>
                <b-col md="4">
                  <b-img center height="100" alt="timeLogo" src="static/img/timelogo.png" />
                </b-col>
                <b-col md="4" class="ml-auto">
                  <b-img center width="100" height="100" src="static/img/logo.png" alt="Logo" />
                </b-col>
              </b-row>
            </div>
            <b-form-group id="fieldset0">
              <b-form-input class="mt-4" id="inputUsernamereg" type="email" v-model="form.email" placeholder="Email *" required> </b-form-input>
            </b-form-group>
            <b-form-group id="fieldset1">
              <b-form-input class="mt-4" id="inputUsername" type="text" v-model="form.username" placeholder="Username *" required> </b-form-input>
            </b-form-group>
            <b-form-group id="fieldset2">
              <b-form-input class="mt-4" id="inputPassword" type="password" v-model="form.password" placeholder="Password *" required> </b-form-input>
            </b-form-group>
            <b-form-group id="fieldset3">
              <b-form-input class="mt-4" id="inputInvite" type="text" v-model="form.invite" placeholder="Invited code *" required> </b-form-input>
            </b-form-group>
            <b-form-group class="mt-4" id="fieldset4">
              <b-button type="submit" block variant="primary">Register</b-button>
            </b-form-group>
            <b-form-group class="mt-3" id="linkreg">
              <b-button variant="primary" size="sm" class="mt-3" to="/invite" exact>Invite</b-button>
              </b-button>
              <b-button variant="primary" size="sm" class="mt-3" to="/" exact>Login</b-button>
            </b-form-group>
          </b-form>
        </div>
      </b-container>
    </div>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        password: '',
        invite: '',
        email: '',
        error: ''
      }
    }
  },
  methods: {
    register() {
      this.$store.dispatch('register', this.form)
        .then((response) => this.checkregsuccess(response))
        .catch((err) => this.checkregfailed(err))
    },
    checkregsuccess(response) {
      if (response.data.success) {
        this.$toasted.global.addSuccess(response)
        this.$router.push(this.$route.query.redirect || '/')
      }
    },
    checkregfailed(err) {
      this.$toasted.global.addError(err)
    }
  }
}
</script>
<style src="../assets/style/static.css" scoped>
</style>
