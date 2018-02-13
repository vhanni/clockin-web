<template></template>
<script>
export default {
  name: 'Logout',
  created() {
  	this.$store.dispatch('clearhistory').then(() => {
      this.$store.dispatch('logout').then(() => {
      	this.$router.push('/')
      })
    })
  }
}
</script>
