<template>
  <div>
    <b-card>
      <b-row>
        <b-col 
          cols="auto" 
          class="mr-auto mb-2">
          <b-button 
            :disabled="disabled" 
            size="sm" 
            class="mr-1" 
            @click="refreshhist">Refresh</b-button>
        </b-col>
        <b-col 
          cols="auto" 
          class="mb-2">
          <b-button 
            size="sm" 
            to="/settings/payslip" 
            class="mr-1">{{ $t('gen.generatepayslip') }}</b-button>
        </b-col>
        <b-col 
          cols="auto" 
          class="mb-2">
          <b-input-group>
            <b-form-input 
              v-model="filter" 
              size="sm" 
              placeholder="Type to Search" />
            <b-input-group-button>
              <b-button 
                :disabled="!filter" 
                size="sm" 
                @click="filter = ''">{{ $t('gen.clear') }}</b-button>
            </b-input-group-button>
          </b-input-group>
        </b-col>
      </b-row>
        
      <b-row>
        <b-col>
          <b-table 
            id="histtable" 
            :items="items" 
            :fields="fields" 
            :current-page="currentPage" 
            :per-page="perPage" 
            :filter="filter" 
            :sort-by.sync="sortBy" 
            :sort-desc.sync="sortDesc" 
            striped 
            bordered 
            dark 
            small 
            show-empty 
            stacked="md" 
            @filtered="onFiltered">  
            <template 
              slot="late" 
              slot-scope="row">{{ latecheck(row.item.late) }}</template>
            <template 
              slot="actions" 
              slot-scope="row">
              <b-button 
                v-if="row.item.timein == '---'" 
                size="sm" 
                variant="success" 
                class="mr-1" 
                @click="apitimein">TimeIn</b-button>
              <b-button 
                v-else-if="row.item.timeout == '---'" 
                size="sm" 
                variant="danger" 
                class="mr-1" 
                @click="apitimeout">TimeOut</b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-card>
    <b-col class="my-1 px-0 mb-3">
      <b-pagination 
        :total-rows="totalRows" 
        :per-page="perPage" 
        v-model="currentPage" 
        class="my-0" />
    </b-col>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import dateFormat from 'dateformat';
export default {
  data() {
    return {
      props: {
        mobile: {
          type: Boolean,
          default: false,
        },
        tablet: {
          type: Boolean,
          default: false,
        },
      },
      disabled: false,
      items: [],
      fields: [
        {
          key: 'username',
          label: 'Username',
          class: 'text-center',
        },
        {
          key: 'timein',
          label: 'TimeIn',
          class: 'text-center',
        },
        {
          key: 'timeout',
          label: 'TimeOut',
          class: 'text-center',
        },
        {
          key: 'late',
          label: 'Lates',
          class: 'text-center',
        },
        {
          key: 'actions',
          label: 'Actions',
          class: 'text-center',
        },
      ],
      currentPage: 1,
      perPage: 15,
      totalRows: 0,
      pageOptions: [15, 20, 30],
      sortBy: null,
      sortDesc: false,
      filter: null,
    };
  },
  computed: {
    ...mapGetters({ currentHistory: 'currentHistory' }),
    ...mapGetters('auth', ['currentUser']),
    sortOptions() {
      return this.fields.filter(f => f.sortable).map(f => {
        return {
          text: f.label,
          value: f.key,
        };
      });
    },
  },
  created() {
    this.gethistory();
  },
  methods: {
    gethistory() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('gethistory', this.currentHistory)
          .then(response => {
            this.buildHistorylist(this.currentHistory);
            resolve();
          })
          .catch(err => {
            reject();
          });
      });
    },
    formatDate(ts) {
      return dateFormat(ts, 'ddd mmm dd yyyy, hh:MM:ss TT');
    },
    buildHistorylist(data) {
      this.items = data.history;
      for (var item of this.items) {
        item.timein = item.timein == '---' ? item.timein : this.formatDate(item.timein);
        item.timeout = item.timeout == '---' ? item.timeout : this.formatDate(item.timeout);
      }
      this.totalRows = this.items.length;
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    apitimein() {
      this.$store.dispatch('timein', this.$Progress).then(this.gethistory);
    },
    apitimeout() {
      this.$store.dispatch('timeout', this.$Progress).then(this.gethistory);
    },
    refreshhist() {
      this.disabled = true;
      this.$store.dispatch('refresh', this.$Progress).then(this.gethistory);
      setTimeout(() => {
        this.disabled = false;
      }, 2000);
    },
    latecheck(rowlate) {
      if (rowlate == true) {
        return 'Your Late!';
      } else if (rowlate == false) {
        return 'On Time';
      } else {
        return '---';
      }
    },
  },
};
</script>
