<template>
  <div id="app" :class="{ 'user' : currentUser }">
      <Navbar :tablet="tablet" :mobile="mobile"></Navbar>
        <router-view id="main-wrapper" :tablet="tablet" :mobile="mobile"></router-view>
      <Foot id="footer" :tablet="tablet" :mobile="mobile"></Foot>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import Navbar from '@/components/layout/Navbar'
import Foot from '@/components/layout/Foot'
export default {
  name: 'app',
  components: {
    Navbar,
    Foot
  },
  data() {
    return {
      publicpath: ['/'],
      mobile: false,
      tablet: false
    }
  },
  computed: {
    ...mapState('interfaceSettings', ['theme']),
  },
  created() {
    // window first load initiate progress
    this.$Progress.start()
    this.checkCurrentLogin()
    if (this.theme.toLowerCase() !== 'default' && typeof window.themes !== 'undefined') {
      this.$store.dispatch('interfaceSettings/updateTheme', this.theme)
    }
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
      if (localStorage.getItem('token') == null ) {
        localStorage.clear()
        return document.location.href = '/'
      } else {
        this.$store.dispatch('auth/getuser',this.$Progress).then(() => {
          this.$router.push(this.$route.fullPath || 'timein')
        }).catch(() => {
          if (this.publicpath.includes(this.$route.path)) {
            this.$router.push('/')
          }
        })}
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
@import "assets/style/common.scss";
</style>