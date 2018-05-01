<template>
  <transition-group 
    name="updown" 
    tag="div">
    <b-alert 
      v-for="(alert, index) in alerts" 
      :key="alert.id" 
      :variant="(typeof alert.variant !== 'undefined' ? alert.variant : 'success')" 
      :show="true" 
      :style="{top:(10+100*index)+'px'}" 
      class="global-alert"
      dismissible 
      @dismissed="removeAlert(alert.id)">
      <span v-if="alert.type === 'token_invalid'"> {{ $t('error.token_invalid') }} </span>
      <span v-else-if="alert.type === 'TOKEN_EXPIRED'">{{ $t('error.TOKEN_EXPIRED') }}</span>
      <span v-else>{{ alert.msg }}</span>
    </b-alert>
  </transition-group>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
  computed: {
    ...mapState('alert', ['alerts'])
  },
  methods: {
    ...mapMutations('alert', ['removeAlert'])
  }
};
</script>
<style lang="scss">
.global-alert {
  -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.75);
  left: 0;
  margin: 0 auto;
  max-width: 500px;
  position: absolute;
  right: 0;
  top: 0;
  width: 90%;
  z-index: 1080;
}
.global-alert strong {
  display: inline-block;
}
.updown-enter-active,
.updown-leave-active,
.updown-move {
  transition: all 1s ease;
}
.updown-enter,
.updown-leave-active {
  opacity: 0;
  transform: translateY(-100px);
}
</style>
