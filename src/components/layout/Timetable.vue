<template>
  <div>
    <b-container fluid>
    <alerts></alerts>
    <router-view></router-view>
      <tablesettings id="tablesettings"></tablesettings>
      <b-card>
        <b-row>
          <b-col cols="auto" class="mr-auto mb-2">
            <b-button size="sm" :disabled="disabled" v-on:click="refreshhist" class="mr-1">Refresh</b-button>
          </b-col>
          <b-col cols="auto" class="mb-2">
             <b-button size="sm" to="/settings/payslip" class="mr-1">{{ $t('gen.generatepayslip') }}</b-button>
          </b-col>
          <b-col cols="auto" class="mb-2">
            <b-input-group>
              <b-form-input size="sm" v-model="filter" placeholder="Type to Search" />
              <b-input-group-button>
                <b-button size="sm" :disabled="!filter" @click="filter = ''">{{ $t('gen.clear') }}</b-button>
              </b-input-group-button>
            </b-input-group>
          </b-col>
        </b-row>
        
        <b-row>
          <b-col>
            <b-table striped bordered id="histtable" dark small show-empty stacked="md" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" @filtered="onFiltered">
              
              <template slot="timein" slot-scope="row">
                 <span v-if="row.item.timein == '---'">{{ $moment(row.item.timein, '---')._i }}</span>
                <span v-else="row.item.timein == row.item.timein">{{ $moment( row.item.timein , 'ddd MMM DD YYYY HH:mm:ssZ').format('ddd MMM DD YYYY hh:mm:ss A') }}</span>
              </template>

              <template slot="timeout" slot-scope="row">
               <span v-if="row.item.timeout == '---'">{{ $moment(row.item.timeout, '---')._i }}</span>
               <span v-else="row.item.timeout == row.item.timeout">{{ $moment( row.item.timeout , 'ddd MMM DD YYYY HH:mm:ssZ').format('ddd MMM DD YYYY hh:mm:ss A') }}</span>
              </template>

              <template slot="late" slot-scope="row">{{ latecheck(row.item.late) }}</template>

              <template slot="actions" slot-scope="row">
                <b-button size="sm" variant="success" v-if="row.item.timein == '---'" v-on:click="apitimein" class="mr-1">TimeIn</b-button>
                <b-button size="sm" variant="danger" v-else-if="row.item.timeout == '---'" v-on:click="apitimeout" class="mr-1">TimeOut</b-button>
              </template>
            </b-table>
          </b-col>
        </b-row>
      </b-card>

      <b-col class="my-1 px-0 mb-3">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-container>
  </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import Alerts from './Alerts'
import tablesettings from '../settings/tablesettings'
import Modal from '../modals/Modal'
export default {
  name: 'Timetable',
  components: {
    tablesettings,
    Alerts
  },
  data() {
    return {
      props: {
        mobile: {
          type: Boolean,
          default: false
        },
        tablet: {
          type: Boolean,
          default: false
        }
      },
      disabled: false,
      items: [],
      fields: [{
        key: 'username',
        label: 'Username',
        'class': 'text-center'
      }, {
        key: 'timein',
        label: 'TimeIn',
        'class': 'text-center'
      }, {
        key: 'timeout',
        label: 'TimeOut',
        'class': 'text-center'
      }, {
        key: 'late',
        label: 'Lates',
        'class': 'text-center'
      }, {
        key: 'actions',
        label: 'Actions',
        'class': 'text-center'
      }],
      currentPage: 1,
      perPage: 15,
      totalRows: 0,
      pageOptions: [15, 20, 30],
      sortBy: null,
      sortDesc: false,
      filter: null
    }
  },
  computed: {
    ...mapGetters({currentHistory: 'currentHistory'}),
    ...mapGetters('auth', ['currentUser']),
    sortOptions() {
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return {
            text: f.label,
            value: f.key
          }
        })
    }
  },
  created() {
    this.gethistory()
  },
  methods: {
    gethistory() {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('gethistory', this.currentHistory)
          .then(response => {
            this.buildHistorylist(this.currentHistory)
            resolve()
          }).catch(err => {
            reject()
          })
      })
    },
    buildHistorylist(data) {
      this.items = data.history
      this.totalRows = this.items.length
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    apitimein() {
      this.$store.dispatch('timein', this.$Progress)
        .then(this.gethistory)
    },
    apitimeout() {
      this.$store.dispatch('timeout', this.$Progress)
        .then(this.gethistory)
    },
    refreshhist() {
      this.disabled = true
      this.$store.dispatch('refresh', this.$Progress)
        .then(this.gethistory)
      setTimeout(() => {
        this.disabled = false
      }, 2000)
    },
    latecheck(rowlate) {
      if (rowlate == true) {
        return 'Your Late!'
      } else if (rowlate == false) {
        return 'On Time'
      } else {
        return '---'
      }
    }
  }
}
</script>
