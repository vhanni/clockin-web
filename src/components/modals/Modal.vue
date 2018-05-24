<template>
  <b-modal 
    :id="id"
    :size="size" 
    :ok-only="okOnly"
    :no-fade="nofade" 
    :hide-footer="!showFooter"
    :ok-disabled="okDisabled"
    :cancel-disabled="cancelDisabled"
    :cancel-title="$t('gen.cancel')"
    :ok-title="$t(okTitle)"
    :no-enforce-focus="nofocus"
    :return-focus="returnfocus"
    @hide="buttonClick"
    @hidden="onHidden"
    @cancel="$emit('cancel', $event)">
    <template slot="modal-title"><slot name="title">{{ title }}</slot></template>
    <div v-if="error">{{ $t(error) }}</div>
    <slot v-else/>
  </b-modal>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: 'modal'
    },
    title: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    showFooter: {
      type: Boolean,
      default: false
    },
    okDisabled: {
      type: Boolean,
      default: false
    },
    okOnly: {
      type: Boolean,
      default: false
    },
    okTitle: {
      type: String,
      default: 'gen.done'
    },
    size: {
      type: String,
      default: 'md'
    },
    nofade: {
      type: Boolean,
      default: true
    },
    nofocus: {
      type: Boolean,
      default: true
    },
    cancelDisabled: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$root.$emit('bv::show::modal', 'modal');
  },
  methods: {
    buttonClick(e) {
      if (e.isOK === true) {
        this.$root.$emit('ok', e);
      }
    },
    onHidden(e) {
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
  display: block !important;
  z-index: 1061;
}
</style>
