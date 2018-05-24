<template>
  <div>
    <b-col cols="12">
      <h4 class="text-center">{{ $t('settings.avatar.current') }}</h4>
      <avatar 
        :avatar="avatar" 
        :force-show="true"
        size="large" />
      <p class="text-center my-2"><em>{{ $t('settings.avatar.reminder') }}</em></p>
    </b-col>
    <div class="modal-footer w-100">
      <b-button
        variant="btn btn-secondary"
        @click="hideModal">{{ $t('gen.cancel') }}
      </b-button>
      <b-button
        href="//en.gravatar.com/emails/" 
        target="_blank"
        variant="btn btn-primary"
        rel="noopener noreferrer">{{ $t('settings.avatar.button') }}
      </b-button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    hideModal() {
      this.$root.$emit('bv::hide::modal', 'modal');
    }
  }
};
</script>
