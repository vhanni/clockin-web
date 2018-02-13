<template>
  <div class="Timetable">
    <b-container fluid>
      <!-- Main table element -->
      <b-table striped bordered small responsive= hover dark show-empty stacked="md" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" @filtered="onFiltered">
        <template slot="late" slot-scope="row">{{ latecheck(row.item.late) }}</template>
        <template slot="actions" slot-scope="row">
          <b-button size="sm" variant="success" v-if="row.item.timein == '---'" v-on:click="apitimein" class="mr-1">TimeIn</b-button>
          <b-button size="sm" variant="danger" v-else-if="row.item.timeout == '---'" v-on:click="apitimeout" class="mr-1">TimeOut</b-button>
        </template>

      </b-table>
      <b-col class="my-1 mb-3">
        <b-pagination size="md" dark :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-container>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: 'Timetable',
  data() {
    return {
      items: [],
      fields: [{
        key: 'username',
        label: 'Username',
        'class': 'text-center'
      }, {
        key: 'timein',
        label: 'TimeIn',
        sortable: true,
        'class': 'text-center'
      }, {
        key: 'timeout',
        label: 'TimeOut',
        sortable: true,
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
      pageOptions: [15,20,30],
      sortBy: null,
      sortDesc: false,
      filter: null
    }
  },
  computed: {
    ...mapGetters({currentHistory: 'currentHistory'}),
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
      this.$store.dispatch('gethistory',this.currentHistory)
        .then(() => this.buildHistorylist(this.currentHistory))
        .catch(() => {
          alert('Something went wrong!')
        })
    },
    buildHistorylist(data) {
      this.items = data.history
      this.totalRows = this.items.length
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    apitimein() {
    	this.$store.dispatch('timein',this.$Progress)
    	.then(this.gethistory)
    },
    apitimeout() {
    	this.$store.dispatch('timeout',this.$Progress)
    	.then(this.gethistory)
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
<style lang="scss">
.table-dark {
  color: #ffffff;
  background-color: #212529;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
</style>
