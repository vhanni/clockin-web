<template>
  <v-gravatar 
    v-if="currentUser"
    :class="['rounded','avatar-'+size]"
    :default-img="defimg"
    :email="currentUser.email"
    size="200" />
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Avatar',
  props: {
    avatar: {
      type: String,
      default: 'avatar'
    },
    defimg: {
      type: String,
      default: 'mm'
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  computed: {
    ...mapGetters('auth', ['currentUser'])
  }
};
</script>
<style>
.avatar-small {
  height: 30px;
  width: 31px;
  vertical-align: middle;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.avatar-med {
  height: 28px;
  float: left;
  margin: 0 10px 0 0;
}
.avatar-large {
  height: 160px;
  width: 160px;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin-right: auto !important;
  margin-left: auto !important;
  display: block !important;
}
</style>
