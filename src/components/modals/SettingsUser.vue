<template>
  <div>
    <modal 
      :title="$t('user.settings')"
      :error="error"
      :ok-only="false"
      :ok-title="'settings.' + currentViewShow + '.button'"
      hide-footer
      size="lg">
      <div class="row">
        <div class="col">
          <ul class="tabs noselect mb-3">
            <router-link 
              v-for="view in views" 
              :to="'/settings/'+view" 
              :key="view" 
              :class="['col-6 col-sm-6',{active: currentView === view }]"
              tag="li"
              @click="currentView=view">{{ $t('settings.'+view+'.title') }}
            </router-link>
          </ul>
          <component 
            id="user-settings" 
            ref="settingsView" 
            :is="currentViewShow"/>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Modal from './Modal';
import Avatar from './SettingsUserAvatar';
import Info from './SettingsUserInfo';
export default {
  components: {
    Modal,
    Avatar,
    Info
  },
  props: {
    currentView: {
      type: String,
      default: 'avatar'
    }
  },
  data() {
    return {
      views: ['avatar', 'info'],
      error: undefined
    };
  },
  computed: {
    currentViewShow() {
      return this.currentView;
    }
  },
  created() {
    this.checkCurrentInfo();
  },
  methods: {
    checkCurrentInfo() {
      const self = this;
      self.$store.dispatch('auth/getuserinfo');
    }
  }
};
</script>
