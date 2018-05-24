<template>
  <b-nav-item-dropdown right>
    <template slot="text">
      <img 
        :src="'/static/img/flags/'+currentLanguage+'.png'" 
        height="30">
    </template>
    <b-dropdown-item 
      v-for="(language, code) in languages" 
      v-if="code != currentLanguage" 
      :key="code" 
      @click="switchLanguage(code)"><img 
        :src="'/static/img/flags/'+code+'.png'" 
        height="30"> {{ language }}</b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import Vue from 'vue';
import { mapMutations, mapGetters } from 'vuex';

export default {
  data() {
    return {
      languages: window.languages
    };
  },
  computed: {
    ...mapGetters('language', ['currentLanguage'])
  },
  created() {
    // Upon site load
    // First check if we got a lang from landing page
    var lang = localStorage.getItem('lang') || '';
    if (lang !== '') {
      // Set current lang
      this['language/switchLanguage'](lang);
      localStorage.removeItem('lang');
    }
    // Check if saved language is different than default
    if (this.currentLanguage !== this.$i18n.locale) {
      this.switchLanguage(this.currentLanguage);
    }
  },
  methods: {
    switchLanguage(language) {
      // Are translations cached already?
      if (!this.$i18n.messages[language]) {
        // If not, load them and save it
        this.axios.get(Vue.config.site_url + 'static/locales/' + language + '.json').then(res => {
          this.$i18n.setLocaleMessage(language, res.data);
          this.setLanguage(language);
        });
      } else {
        this.setLanguage(language);
      }
    },
    setLanguage(language) {
      // Actually set new language
      this.$i18n.locale = language;
      this['language/switchLanguage'](language);
    },
    ...mapMutations(['language/switchLanguage'])
  }
};
</script>
