<template>
  <div id="app">
      <Navbar v-if="currentUser" :mobile="mobile" :tablet="tablet"></Navbar>
        <router-view id="main-wrapper" :mobile="mobile" :tablet="tablet"></router-view>
      <Foot v-if="currentUser" :mobile="mobile" :tablet="tablet"></Foot>
    <vue-progress-bar v-if="currentUser" :mobile="mobile" :tablet="tablet"></vue-progress-bar>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import Navbar from '@/components/Navbar'
import Foot from '@/components/Foot'
export default {
  name: 'app',
  components: {
    Navbar,
    Foot
  },
  data() {
    return {
      publicpath: ['/', '/invite', '/register'],
      mobile: false,
      tablet: false
    }
  },
  computed: {
    ...mapGetters({currentUser: 'currentUser'})
  },
  created() {
    this.checkCurrentLogin()
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    checkCurrentLogin() {
      this.$store.dispatch('getuser',this.$Progress).then(() => {
        this.$router.push(this.$route.query.redirect || '/timein')
      }).catch(() => {
        if (!this.publicpath.includes(this.$route.path)) {
          this.$router.push('/?redirect=' + this.$route.path)
        }
      })
    },
    handleResize(event) {
      // If currently not mobile-mode and size is smaller, set it
      if (!this.mobile && window.innerWidth < 576) {
        this.mobile = true
      } else if (this.mobile && window.innerWidth >= 576) {
        this.mobile = false
      }
      // If currently not tablet-mode and size is smaller, set it
      if (!this.tablet && window.innerWidth < 768) {
        this.tablet = true
      } else if (this.tablet && window.innerWidth >= 768) {
        this.tablet = false
      }
    }
  }
}
</script>
<style lang="scss">
@import "assets/style/main.scss"
</style>
<style lang="css">
html,
body,
#app {
  height: 100%;
}

:focus,
button:focus {
  outline: 0!important;
}

#main-wrapper {
  min-height: calc(100% - 56px);
  padding-top: 2rem;
}
</style>
