<template>
<b-navbar toggleable="md" type="light" class="navtop fixed-top">
    <b-link class="navbar-brand" to="/timein">
      <span>Timezone</span>
    </b-link>
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  <b-collapse is-nav id="nav_collapse">
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
     <language-switch></language-switch>
     <user-nav showName></user-nav>
    </b-navbar-nav>
  </b-collapse>
</b-navbar>
</template>
<script>
import {mapGetters} from 'vuex'
import LanguageSwitch from './LanguageSwitch'
import UserNav from './UserNav'
export default {
  components: {
    LanguageSwitch,
    UserNav
  },
  props: ['mobile', 'tablet']
}
</script>
<style lang="scss">
.navtop .navbar-brand {
  background-image: $logo-url;
  background-repeat: no-repeat;
  background-position: left;
  background-size: 50px auto;
  padding:0 0 0 50px;
  font-size: 32px;
  line-height: 40px;
  height: 40px;
  font-family: 'esphimere-bold-italic', Arial, Helvetica, sans-serif;
  font-weight: 400;
  width:200px;
  color: $logo-color;
  margin:0;
}

.nav-item.dropdown.show::after {
  right: 4px;
}
.navbar-collapse.show .nav-item.dropdown.show::after, .navbar-collapse .dropdown-menu::after  {
  display: none;
}

#username {
   font-weight: bold;
}

@include media-breakpoint-down(sm) {
  .navbar-collapse.show {
    background:$box-bg;
    margin:0 -2*$grid-gutter-width-base;
    padding: $grid-gutter-width-base $grid-gutter-width-base 0;
    border-bottom:4px solid $body-bg;
  }
  
  .navbar-collapse.show .navbar-nav > li {
    border-left:0;
    border-top:2px solid $body-bg;
  }

  .navbar-collapse.show .nav-item.dropdown .dropdown-menu {
    border:0;
    box-shadow:none;
    padding: 0;
  }

  .navbar-collapse.show .nav-item.dropdown .dropdown-item {
    border-top:2px solid $body-bg;
    padding: .5rem 1rem;
  }
}

@include media-breakpoint-down(xs) {
  .navbar-collapse.show {
    margin:0 -2*$grid-gutter-width-base;
  }
}
</style>
