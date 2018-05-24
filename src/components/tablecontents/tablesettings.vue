<template>
  <div class="my-1">
    <router-link 
      id="settings-link" 
      to="/settings/interface">
      <icon name="sliders"/>
    </router-link>
  </div>
</template>
<script>
export default {
  name: 'Tablesettings',
};
</script>
<style lang="scss">
#settings-link {
	cursor: pointer;
	font-size: 20px;
	height: 40px;
	line-height: 40px;
	margin-left: auto;
	padding: 3px 5px;
	text-align: center;
	width: 40px;
}
</style>
