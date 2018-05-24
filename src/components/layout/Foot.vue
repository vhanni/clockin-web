<template>
  <b-navbar 
    :class="{'fixed-bottom': !mobile}" 
    class="footer" 
    type="light">
    <b-navbar-nav>
      <b-nav-text>Built with ❤ &copy; {{ (new Date()).getFullYear() }} ClockIn</b-nav-text>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
      <a 
        href="//github.com/vhanni/"
        target="_blank" 
        rel="noopener noreferrer">
        <icon 
          name="github" 
          class="footericon"/>
      </a>
    </b-navbar-nav>
  </b-navbar>
</template>
<script>
export default {
  name: 'Foot',
  props: {
    mobile: {
      type: Boolean,
      default: false
    },
    tablet: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss">
.footerlink {
  list-style-type: none;
}
</style>
