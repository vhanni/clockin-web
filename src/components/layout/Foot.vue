<template>
  <b-navbar class="footer" :class="{'fixed-bottom': !mobile}" type="light">
    <b-navbar-nav>
      <b-nav-text>Built with ❤ &copy; {{ (new Date()).getFullYear() }} Timezone</b-nav-text>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
      <a href="https://github.com/vhanni/" target="_blank" rel="noopener noreferrer">
        <icon name="github" class="footericon"></icon>
      </a>
    </b-navbar-nav>
  </b-navbar>
</template>
<script>
export default {
  name: 'Foot',
  props: ['mobile', 'tablet']
}
</script>
<style lang="scss">
.footerlink {
  list-style-type: none;
}
</style>
