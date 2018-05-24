<template>
  <b-nav-item-dropdown right>
    <template slot="text">
      <avatar 
        :avatar="avatar" 
        :force-show="true" />
      <span 
        v-if="currentUser" 
        id="username">{{ currentUser.username }}</span>
    </template>
    <b-dropdown-item to="/settings/avatar">{{ $t('gen.settings') }}</b-dropdown-item>
    <b-dropdown-item @click="logout"> {{ $t('gen.logout') }} </b-dropdown-item>
  </b-nav-item-dropdown>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  props: {
    showName: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
  },
  methods: {
    logout: function() {
      this.$store.dispatch('auth/logout').then(() => {
        this.$store.dispatch('clearhistory').then(() => {
          window.location.replace('/');
        });
      });
    },
  }
};
</script>
