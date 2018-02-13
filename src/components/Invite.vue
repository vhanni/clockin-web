<template>
  <div class="default-wrapper bg-dark">
    <div class="default-wrapper-inner">
      <b-container>
        <div class="cover-container">
          <b-form class="form-dark" id="forminvite" @submit.prevent="inviteemail">
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
            <b-form-group>
              <b-form-input id="inputEmail" type="email" v-model="form.email" placeholder="Email *" required>
              </b-form-input>
            </b-form-group>
            <b-form-group class="mt-4" id="fieldset4">
              <b-button type="submit" v-if="loading ? false : true" block variant="primary">{{ btnName }}</b-button>
              <b-row>
                <b-col sm="3" class="mx-auto">
                  <icon v-show="loading" scale="3" name="spinner" pulse></icon>
                </b-col>
              </b-row>
            </b-form-group>
            <b-form-group class="mt-3" id="fieldlinkinv">
              <b-button variant="primary" size="sm" class="mt-3" to="/" exact> Login</b-button>
              <b-button variant="primary" size="sm" class="mt-3" to="/register" exact> Register</b-button>
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
  name: 'Invite',
  data() {
    return {
      btnName: 'Invite',
      loading: false,
      form: {
        email: ''
      }
    }
  },
  computed: {
    errstate() {
      return false
    }
  },
  methods: {
    checkemailsuccess(request) {
      if (!request.data.success) {
        this.checkemailfailed(err)
        return
      }
      this.$toasted.global.inviteemailSuccess()
    },
    inviteemail() {
      this.$http.post('api/invite', {email: this.form.email})
        .then((request) => this.checkemailsuccess(request))
        .catch((err) => this.checkemailfailed(err.response.data))
    },
    checkemailfailed(err) {
      this.$toasted.global.addError(err)
    }
  }
}
</script>
<style src="../assets/style/static.css" scoped>
</style>
