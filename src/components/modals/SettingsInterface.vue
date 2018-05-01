<template>
  <modal 
    :title="$t('settings.interface.title')" 
    :show-footer="true">
    <b-container fluid>
      <b-row>
        <b-col cols="12">
          <fieldset class="form-group col-12">
            <legend>{{ $t('gen.universal') }}</legend>
            <b-form-group v-if="themes">
              <label for="themes">{{ $t('settings.interface.theme') }}:</label>
              <b-form-radio-group 
                id="theme" 
                :checked="getSetting('theme')" 
                :options="themes" 
                :value="getSetting('theme')" 
                @input="setSetting('Theme',$event)"/>
            </b-form-group>
          </fieldset>
        </b-col>
      </b-row>
    </b-container>
  </modal>
</template>
<script>
import Modal from './Modal';
export default {
  components: {
    Modal
  },
  computed: {
    themes() {
      if (typeof window.themes === 'undefined') {
        return undefined;
      }
      var themes = Object.keys(window.themes);
      var themeNames = [];
      for (var i = 0; i < themes.length; i++) {
        themeNames.push({
          value: themes[i],
          text:
            '<img src="/static/img/themes/' +
            themes[i] +
            '.png"><br>' +
            themes[i].charAt(0).toUpperCase() +
            themes[i].substring(1)
        });
      }
      return themeNames;
    }
  },
  methods: {
    getSetting(key) {
      return this.$store.state.interfaceSettings[key];
    },
    setSetting(setting, value) {
      // On production actually change theme
      if (typeof window.themes !== 'undefined' && setting === 'Theme') {
        this.$store.dispatch('interfaceSettings/updateTheme', value);
      } else {
        this.$store.commit('interfaceSettings/set' + setting, value);
      }
    }
  }
};
</script>
<style lang="scss">
#theme img {
  height: 80px;
  width: 100px;
  margin: 0 0 0 -24px;
  border: 2px solid $body-bg;
}

#theme .custom-control-indicator {
  margin-top: 80px;
}
</style>
