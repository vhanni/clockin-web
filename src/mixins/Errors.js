export default {
  data() {
    return {
      genError: undefined
    };
  },
  methods: {
    addError(error) {
      this.$set(error);
    },
    addErrorFromServer(response, genError = undefined) {
      // We either have response already (if HTTP 200 but no success val)
      // Or not yet (if HTTP 400), either way get response here:
      if (typeof response.response !== 'undefined') {
        response = response.response;
      }
      this.genError = undefined;
      // Check if we got error from server
      if (
        typeof err.response.data === 'undefined' ||
        typeof err.response.data.error === 'undefined'
      ) {
        // Set general error
        this.genError = genError || this.$t('error.cannot_load');
      } else {
        // Check if error connected to a field
        var error = err.response.data.error;
        this.genError = this.$t('error.' + error);
      }
    }
  }
};
