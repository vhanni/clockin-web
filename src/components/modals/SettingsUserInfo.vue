<template>
  <div>
    <b-col cols="12">
      <b-card>
        <h4 class="text-center">{{ $t('settings.info.current') }}</h4>
        <div class="mb-2">
          <span class="infolabel">Username:</span> 
          <span 
            v-if="currentUser" 
            class="infoname">{{ currentUser.username | capitalize }}
          </span>
        </div>
        <div class="mb-2">
          <span class="infolabel">Email:</span> 
          <span 
            v-if="currentUser" 
            class="infoname">{{ currentUser.email }}
          </span>
        </div>

        <div class="mb-2">
          <span class="infolabel">{{ $t('settings.info.firstname') }}:</span>
          <span 
            v-if="currentUserinfo"
            class="infoname capitalize">{{ currentUserinfo.givenName }}
          </span>
        </div>

        <div class="mb-2">
          <span class="infolabel">{{ $t('settings.info.lastname') }}:</span>
          <span 
            v-if="currentUserinfo"
            class="infoname capitalize">{{ currentUserinfo.familyName }}
          </span>
        </div>  
        
      </b-card>
    </b-col>
    <div class="modal-footer w-100">
      <b-button
        variant="btn btn-secondary"
        @click="hideModal">{{ $t('gen.done') }}
      </b-button>
      <b-button
        href="https://en.gravatar.com/profiles/edit"
        target="_blank"
        variant="btn btn-primary"
        rel="noopener noreferrer">{{ $t('settings.info.button') }}
      </b-button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  data() {
    return {
      errored: false
    };
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    ...mapGetters('auth', ['currentUserinfo'])
  },
  methods: {
    hideModal() {
      this.$root.$emit('bv::hide::modal', 'modal');
    }
  }
};
</script>
