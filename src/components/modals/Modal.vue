<template>
  <b-modal 
    id="modal" 
    :size="size" 
    :ok-only="okOnly" 
    :hide-footer="!showFooter" 
    :ok-title="$t(okTitle)" 
    :close-title="$t('gen.cancel')" 
    :ok-disabled="okDisabled" 
    no-auto-focus 
    @hidden="hideModal" 
    @hide="buttonClick" 
    @cancel="$emit('cancel', $event)">
    <template slot="modal-title"><slot name="title">{{ title }}</slot></template>
    <div v-if="error">{{ $t(error) }}</div>
    <slot v-else/>
  </b-modal>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Modal'
    },
    error: {
      type: String,
      default: 'Error'
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    okDisabled: {
      type: Boolean,
      default: true
    },
    okOnly: {
      type: Boolean,
      default: true
    },
    okTitle: {
      type: String,
      default: 'gen.done'
    },
    size: {
      type: String,
      default: 'lg'
    }
  },
  mounted() {
    this.$root.$emit('bv::show::modal', 'modal');
  },
  methods: {
    buttonClick(e) {
      // If we pressed OK button, we want to check if we need to process a form
      if (e.isOK === true) {
        this.$emit('ok', e);
      }
    },
    hideModal(e) {
      this.$router.push('/timein');
    }
  }
};
</script>
<style lang="scss">
.modal-open .modal-backdrop {
  z-index: 1060;
  background-color: $really-black;
}
.modal-open .modal {
  display: block;
  z-index: 1061;
}
</style>
