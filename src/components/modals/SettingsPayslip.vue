<template>
  <modal 
    :ok-only="false" 
    :title="$t('settings.payslip.title')"
    hide-footer
    ok-title="settings.payslip.button"
    size="lg"
    @ok="uploadpdf">
    <b-row>
      <b-container fluid>
        <b-alert 
          v-if="genError" 
          variant="danger" 
          show>{{ genError }}</b-alert>
        <b-form>
          <b-table 
            id="genpayslip" 
            v-model="pdftable" 
            :fields="fields" 
            :items="items" 
            :current-page="currentPage"
            :per-page="perPage"
            striped
            bordered
            dark 
            small 
            show-empty 
            stacked="md"/>
        </b-form>
        <div class="modal-footer w-100">
          <b-button
            variant="btn btn-secondary"
            @click="hideModal">{{ $t('gen.cancel') }}
          </b-button>   
          <b-button
            href="#" 
            target="_blank"
            variant="btn btn-primary"
            rel="noopener noreferrer">{{ $t('settings.payslip.button') }}
          </b-button>
        </div>
      </b-container>
    </b-row>
  </modal>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Modal from './Modal';
import Errors from '../../mixins/Errors';
export default {
  components: {
    Modal
  },
  mixins: [Errors],
  data() {
    return {
      pdftable: [],
      items: [],
      fields: [
        {
          key: 'paytitle',
          label: 'Pay',
          class: 'text-center'
        },
        {
          key: 'comphours',
          label: 'Hours',
          class: 'text-center'
        },
        {
          key: 'comprate',
          label: 'Rate',
          class: 'text-center'
        },
        {
          key: 'amountrow',
          label: 'Amount',
          class: 'text-center'
        }
      ],
      currentPage: 1,
      perPage: 10
    };
  },
  computed: {
    ...mapGetters({ currentPayslip: 'currentPayslip' })
  },
  //created() {
  //this.generatePayslip()
  //},
  methods: {
    ...mapActions('alert', ['addAlert']),
    uploadpdf(e) {
      e.preventDefault();
      var data = {
        pdftable: ''
      };
    },
    hideModal() {
      this.$root.$emit('bv::hide::modal', 'modal');
    },
    generatePayslip() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('newpayslip', this.currentPayslip)
          .then(response => {
            this.newpaysliplist(this.currentPayslip);
            resolve();
          })
          .catch(err => {
            reject();
          });
      });
    },
    newpaysliplist(data) {
      this.items = data.payslip;
    }
  }
};
</script>
