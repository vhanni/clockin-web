<template>
  <div 
    id="app" 
    :class="{ 'user' : currentUser }">
    <Navbar 
      :tablet="tablet" 
      :mobile="mobile"/>
    <router-view 
      id="main-wrapper" 
      :tablet="tablet" 
      :mobile="mobile"/>
    <Foot 
      id="footer" 
      :tablet="tablet" 
      :mobile="mobile"/>
    <vue-progress-bar/>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import Navbar from '@/components/layout/Navbar';
import Foot from '@/components/layout/Foot';
export default {
  name: 'App',
  components: {
    Navbar,
    Foot
  },
  data() {
    return {
      publicpath: ['/'],
      mobile: false,
      tablet: false
    };
  },
  computed: {
    ...mapState('interfaceSettings', ['theme']),
    ...mapGetters('auth', ['currentUser'])
  },
  created() {
    // window first load initiate progress
    this.$Progress.start();
    this.checkCurrentLogin();
    if (this.theme.toLowerCase() !== 'default' && typeof window.themes !== 'undefined') {
      this.$store.dispatch('interfaceSettings/updateTheme', this.theme);
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    checkCurrentLogin() {
      const self = this;
      if (localStorage.getItem('token') == null && localStorage.getItem('token') == undefined) {
        localStorage.clear();
        return (document.location.href = '/');
      } else {
        self.$store
          .dispatch('auth/getuser', self.$Progress)
          .then(() => {
            self.$router.push(self.$route.fullPath || 'timein');
          })
          .catch(() => {
            if (self.publicpath.includes(self.$route.path)) {
              self.$router.push('/');
            }
          });
      }
    },
    handleResize(event) {
      // If currently not mobile-mode and size is smaller, set it
      if (!this.mobile && window.innerWidth < 576) {
        this.mobile = true;
      } else if (this.mobile && window.innerWidth >= 576) {
        this.mobile = false;
      }
      // If currently not tablet-mode and size is smaller, set it
      if (!this.tablet && window.innerWidth < 768) {
        this.tablet = true;
      } else if (this.tablet && window.innerWidth >= 768) {
        this.tablet = false;
      }
    }
  }
};
</script>
