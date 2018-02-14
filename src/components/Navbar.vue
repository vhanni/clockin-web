<template>
  <b-navbar toggleable="md" type="dark" variant="dark">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand href="#">
      <img height="40" src="static/img/timelogo.png" class="d-inline-block align-top" alt="TZ">
    </b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using button-content slot -->
          <template slot="button-content">
            <em>{{ currentUser.username }}</em>
          </template>
          <b-dropdown-item to="/logout">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters({
      currentUser: 'currentUser'
    })
  }
}
</script>
