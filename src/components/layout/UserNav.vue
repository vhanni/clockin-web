<template>
  <b-nav-item-dropdown class="dd-right" right>
    <template slot="text">
      <span v-if="currentUser" id="username">{{ currentUser.username }}</span>
    </template>
    <b-dropdown-item @click="logout"> {{$t('gen.logout')}} </b-dropdown-item>
  </b-nav-item-dropdown>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    showName:{
    	type: Boolean
    }
  },
  computed: {
    ...mapGetters('auth', ['currentUser'])
  },
  methods:{
  	logout() {
      this.$store.dispatch('auth/logout').then(() => {
        this.$store.dispatch('clearhistory').then(() => {
          window.location.replace('/')
        })
      })
    }
  }
}
</script>
