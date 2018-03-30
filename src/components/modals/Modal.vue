<template>
  <b-modal id="modal" :size="size" :ok-only="okOnly" :hide-footer="!showFooter" @hidden="hideModal" :ok-title="$t(okTitle)" @hide="buttonClick" @cancel="$emit('cancel', $event)" :close-title="$t('gen.cancel')" :ok-disabled="okDisabled" no-auto-focus>
    <template slot="modal-title"><slot name="title">{{ title }}</slot></template>
    <div v-if="error">{{ $t(error) }}</div>
    <slot v-else></slot>
  </b-modal>
</template>
<script>
export default {
  props: {
    title: String,
    error: String,
    showFooter: Boolean,
    okDisabled: Boolean,
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
  mounted () {
    this.$root.$emit('bv::show::modal', 'modal')
  },
  methods: {
    buttonClick (e) {
      // If we pressed OK button, we want to check if we need to process a form
      if (e.isOK === true) {
        this.$emit('ok', e)
      }
    },
    hideModal (e) {
      this.$router.push('/timein')
    }
  }
}
</script>
<style lang="scss">
  .modal-open .modal-backdrop {
    z-index:1060;
    background-color: $really-black;
  }
  .modal-open .modal{
    display:block;
    z-index:1061;

  }
</style>
