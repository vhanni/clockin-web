<template>
  <modal :title="$t('settings.payslip.title')" :show-footer="true">
    <b-container fluid>
      <b-row>
          <b-col cols="12">
            test
          </b-col>
      </b-row>
    </b-container>
  </modal>
</template>
<script>
import Modal from './Modal'
export default {
  components: {
    Modal
  }
}
</script>
